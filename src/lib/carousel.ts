// Looping, centred carousel engine (GSAP + Draggable): slides are placed around the active one, moved by
// buttons, bullets, keys, drag and autoplay, and every listener, tween and observer ends with the signal.
import { Draggable } from 'gsap/Draggable';
import { gsap, ease, disposeOn, reducedMotion } from './motion';

gsap.registerPlugin(Draggable);

/** Width in px a bullet's progress bar fills to (the active bullet is 32px wide). */
const BAR_WIDTH = 32;
const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]';

export interface CarouselBullets {
  /** One element per slide; clicking one goes to that slide. */
  items: HTMLElement[];
  /** The element inside a bullet that fills 0 -> 32px over the autoplay delay while that slide shows. */
  bar?: (bullet: HTMLElement) => Element | null;
}

export interface CarouselOptions {
  /** Seconds for one move. */
  speed?: number;
  /** Seconds between autoplay advances; 0 or unset is off. */
  autoplay?: number;
  /** Stop autoplay for good after the first button, key, bullet or drag. Otherwise a fresh countdown starts. */
  stopOnInteraction?: boolean;
  /** Pixels between neighbouring slides, read at start and on every resize. Defaults to the first slide's width. */
  slot?: () => number;
  /** Pixels that slides beyond the neighbours are pulled towards the centre. */
  pull?: () => number;
  /** Hide (visibility) slides that are further than half the viewport plus one slot from the centre. */
  hideOffscreen?: boolean;
  /** Let a drag start on links and buttons inside the viewport. */
  dragClickables?: boolean;
  /** Clicking the active slide goes to its link, and clicks on "#" links are swallowed. */
  followActiveLink?: boolean;
  /** Paints one slide when it becomes active or inactive; `instant` on the first paint and under reduced motion. */
  paintSlide?: (slide: HTMLElement, active: boolean, instant: boolean) => void;
  bullets?: CarouselBullets;
  /** Called when the active index changes (at the start of the move), and once at the start. */
  onChange?: (index: number, count: number) => void;
}

export interface Carousel {
  /** Go to a slide index by the shortest way round. */
  goTo: (index: number) => void;
  step: (direction: number) => void;
  readonly active: number;
  readonly count: number;
}

/**
 * A `paintSlide` for slides that change by one 0..1 value (0 inactive, 1 active) tweened with the CSS ease:
 * `apply` paints the slide for the current value.
 */
export function tweenSlideState(
  apply: (slide: HTMLElement, value: number) => void,
  duration: number,
) {
  const values = new WeakMap<HTMLElement, { value: number }>();
  return (slide: HTMLElement, active: boolean, instant: boolean) => {
    const state = values.get(slide) ?? { value: 0 };
    values.set(slide, state);
    gsap.killTweensOf(state);
    if (instant) {
      state.value = active ? 1 : 0;
      apply(slide, state.value);
      return;
    }
    gsap.to(state, {
      value: active ? 1 : 0,
      duration,
      ease: ease.css,
      onUpdate: () => apply(slide, state.value),
    });
  };
}

export function createCarousel(
  root: HTMLElement,
  opts: CarouselOptions,
  signal: AbortSignal,
): Carousel {
  const viewport = root.querySelector<HTMLElement>('[data-carousel-viewport]')!;
  const slides = gsap.utils.toArray<HTMLElement>('[data-slide]', root);
  const probe = root.querySelector<HTMLElement>('[data-carousel-probe]');
  const prev = root.querySelector<HTMLElement>('[data-carousel-prev]');
  const next = root.querySelector<HTMLElement>('[data-carousel-next]');
  const N = slides.length;
  const reduced = reducedMotion();
  const speed = reduced ? 0 : (opts.speed ?? 0.6);
  const delay = opts.autoplay ?? 0;
  const position = { pos: 0 };
  let active = 0;
  let slot = 0;
  let half = 0;
  let autoplayOn = delay > 0 && !reduced;
  let timer: gsap.core.Tween | null = null;
  let bar: gsap.core.Tween | null = null;
  // Autoplay runs only while none of these hold it.
  const holds = { hover: false, drag: false, focus: false, inView: false };

  const mod = (v: number) => ((v % N) + N) % N;
  const dist = (i: number) => {
    let d = (i - position.pos) % N;
    if (d < -N / 2) d += N;
    if (d >= N / 2) d -= N;
    return d;
  };

  // Inactive slides are hidden from assistive tech and their focusable content leaves the tab order;
  // the original tabindex (or none) comes back when the slide is active.
  const tabindexes = new Map<HTMLElement, string | null>();
  slides.forEach((s) =>
    s
      .querySelectorAll<HTMLElement>(FOCUSABLE)
      .forEach((el) => tabindexes.set(el, el.getAttribute('tabindex'))),
  );
  const setReachable = (slide: HTMLElement, on: boolean) => {
    slide.setAttribute('aria-hidden', String(!on));
    slide.querySelectorAll<HTMLElement>(FOCUSABLE).forEach((el) => {
      const original = tabindexes.get(el) ?? null;
      if (!on) el.setAttribute('tabindex', '-1');
      else if (original === null) el.removeAttribute('tabindex');
      else el.setAttribute('tabindex', original);
    });
  };

  function render() {
    const pull = opts.pull ? opts.pull() : 0;
    for (let i = 0; i < N; i++) {
      const d = dist(i);
      const x = d * slot - Math.sign(d) * pull * gsap.utils.clamp(0, 1, Math.abs(d) - 1);
      if (opts.hideOffscreen) {
        const hidden = Math.abs(x) > half + slot;
        slides[i].style.visibility = hidden ? 'hidden' : 'visible';
        if (hidden) continue;
      }
      gsap.set(slides[i], { x });
    }
    if (probe) gsap.set(probe, { x: -position.pos * slot });
  }

  function markActive(i: number, on: boolean, instant: boolean) {
    slides[i].classList.toggle('is-active', on);
    setReachable(slides[i], on);
    opts.paintSlide?.(slides[i], on, instant);
  }

  function setActive(index: number) {
    index = mod(index);
    if (index === active) return;
    markActive(active, false, reduced);
    active = index;
    markActive(active, true, reduced);
    opts.onChange?.(active, N);
  }

  const sync = () => {
    const held = holds.hover || holds.drag || holds.focus || !holds.inView;
    [timer, bar].forEach((t) => (held ? t?.pause() : t?.resume()));
  };
  const clearBars = () =>
    opts.bullets?.items.forEach((b) => {
      const el = opts.bullets?.bar?.(b);
      if (el) gsap.set(el, { width: 0 });
    });
  function stopTimer() {
    timer?.kill();
    bar?.kill();
    timer = bar = null;
    clearBars();
  }
  function startTimer() {
    stopTimer();
    if (!autoplayOn) return;
    timer = gsap.delayedCall(delay, () => step(1));
    const el = opts.bullets?.bar?.(opts.bullets.items[active]);
    if (el)
      bar = gsap.fromTo(el, { width: 0 }, { width: BAR_WIDTH, duration: delay, ease: 'none' });
    sync();
  }

  function goTo(target: number, user = false) {
    setActive(target);
    gsap.to(position, {
      pos: target,
      duration: speed,
      ease: ease.css,
      overwrite: true,
      onUpdate: render,
    });
    if (user && opts.stopOnInteraction && autoplayOn) {
      autoplayOn = false;
      stopTimer();
    } else startTimer();
  }
  const step = (dir: number, user = false) => goTo(Math.round(position.pos) + dir, user);
  const goToIndex = (i: number) => goTo(Math.round(position.pos) + Math.round(dist(mod(i))), true);

  // drag: a quick flick advances one slide, anything else settles on the nearest
  const proxy = document.createElement('div');
  let pressPos = 0;
  let origin = 0;
  let pressTime = 0;
  disposeOn(
    signal,
    ...Draggable.create(proxy, {
      type: 'x',
      trigger: viewport,
      cursor: 'grab',
      activeCursor: 'grabbing',
      minimumMovement: 4,
      dragClickables: opts.dragClickables,
      onPress() {
        gsap.set(proxy, { x: 0 });
        this.update();
        pressPos = position.pos;
        pressTime = performance.now();
      },
      onDragStart() {
        gsap.killTweensOf(position);
        origin = position.pos + this.x / slot;
        holds.drag = true;
        sync();
      },
      onDrag() {
        position.pos = origin - this.x / slot;
        render();
      },
      onDragEnd() {
        holds.drag = false;
        const moved = position.pos - pressPos;
        const quick = performance.now() - pressTime < 300;
        let target = Math.round(position.pos);
        if (quick && Math.abs(moved) > 0.02 && target === Math.round(pressPos))
          target = Math.round(pressPos) + Math.sign(moved);
        goTo(target, true);
      },
      onClick(e: PointerEvent) {
        const slide = (e.target as HTMLElement).closest<HTMLElement>('[data-slide]');
        if (!slide) return;
        const i = slides.indexOf(slide);
        if (i < 0) return;
        if (i !== active) goToIndex(i);
        else if (opts.followActiveLink) {
          const href = slide.querySelector('a')?.getAttribute('href');
          if (href && href !== '#') window.location.href = href;
        }
      },
    }),
  );
  if (opts.followActiveLink)
    root.querySelectorAll('a').forEach((a) =>
      a.addEventListener(
        'click',
        (e) => {
          if (a.getAttribute('href') === '#') e.preventDefault();
        },
        { signal },
      ),
    );

  prev?.addEventListener(
    'click',
    (e) => {
      e.preventDefault();
      step(-1, true);
    },
    { signal },
  );
  next?.addEventListener(
    'click',
    (e) => {
      e.preventDefault();
      step(1, true);
    },
    { signal },
  );
  opts.bullets?.items.forEach((b, i) =>
    b.addEventListener('click', () => goToIndex(i), { signal }),
  );

  // Arrow keys work while the carousel is on screen, and autoplay runs only then.
  const io = new IntersectionObserver((entries) => {
    holds.inView = entries[entries.length - 1].isIntersecting;
    sync();
  });
  io.observe(root);
  disposeOn(signal, io);
  window.addEventListener(
    'keydown',
    (e) => {
      if (!holds.inView || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === 'ArrowRight') step(1, true);
      else if (e.key === 'ArrowLeft') step(-1, true);
    },
    { signal },
  );

  root.addEventListener(
    'pointerenter',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      holds.hover = true;
      sync();
    },
    { signal },
  );
  root.addEventListener(
    'pointerleave',
    () => {
      holds.hover = false;
      sync();
    },
    { signal },
  );
  // keyboard focus only: a clicked button keeps focus but must not hold autoplay
  root.addEventListener(
    'focusin',
    (e) => {
      if (!(e.target as HTMLElement).matches(':focus-visible')) return;
      holds.focus = true;
      sync();
    },
    { signal },
  );
  root.addEventListener(
    'focusout',
    (e) => {
      if (root.contains(e.relatedTarget as Node | null)) return;
      holds.focus = false;
      sync();
    },
    { signal },
  );

  function measure() {
    slot = opts.slot ? opts.slot() : slides[0].offsetWidth;
    half = viewport.offsetWidth / 2;
    render();
  }
  window.addEventListener('resize', measure, { signal });

  slides.forEach((_, i) => markActive(i, i === 0, true));
  measure();
  root.setAttribute('data-carousel-ready', '');
  opts.onChange?.(0, N);
  startTimer();

  signal.addEventListener(
    'abort',
    () => {
      stopTimer();
      gsap.killTweensOf(position);
    },
    { once: true },
  );

  return {
    goTo: goToIndex,
    step,
    get active() {
      return active;
    },
    count: N,
  };
}
