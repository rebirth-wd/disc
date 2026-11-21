// Looping, centred carousel engine (GSAP + Draggable).
// Swiper-style behaviour: slidesPerView 'auto', centeredSlides, loop,
// speed 600ms with the CSS `ease` curve, slideToClickedSlide, keyboard, grab cursor,
// prev/next buttons, autoplay with pauseOnMouseEnter, optional dynamic bullets.
import { Draggable } from 'gsap/Draggable';
import { gsap, ease, disposeOn, reducedMotion } from './motion';

gsap.registerPlugin(Draggable);

export interface CarouselOptions {
  /** seconds for the track move (Swiper `speed`) */
  speed?: number;
  /** seconds between autoplay advances; 0 = off */
  autoplay?: number;
  /** stop autoplay for good after the first user interaction (Swiper default for the gallery) */
  disableOnInteraction?: boolean;
  /** px that slides beyond prev/next are pulled towards the centre (-3rem margins) */
  pull?: () => number;
  /** seconds for the active/inactive state tween */
  stateDuration?: number;
  /** paint one slide for an "activeness" value 0..1 */
  applyState: (slide: HTMLElement, a: number) => void;
  /** called when the active index changes (at transition start, like Swiper) */
  onChange?: (index: number, count: number) => void;
  /** called whenever the autoplay countdown (re)starts / pauses / resumes / stops */
  onAutoplay?: (state: 'start' | 'pause' | 'resume' | 'stop', delay: number) => void;
}

export function createCarousel(root: HTMLElement, opts: CarouselOptions, signal: AbortSignal) {
  const viewport = root.querySelector<HTMLElement>('[data-carousel-viewport]')!;
  const slides = gsap.utils.toArray<HTMLElement>('[data-slide]', root);
  const probe = root.querySelector<HTMLElement>('[data-carousel-probe]');
  const prev = root.querySelector<HTMLElement>('[data-carousel-prev]');
  const next = root.querySelector<HTMLElement>('[data-carousel-next]');
  const N = slides.length;
  const reduced = reducedMotion();
  const speed = reduced ? 0 : (opts.speed ?? 0.6);
  const stateDur = reduced ? 0 : (opts.stateDuration ?? 0.5);
  const st = { pos: 0 };
  const act = slides.map((_, i) => ({ a: i === 0 ? 1 : 0 }));
  let active = 0;
  let slot = slides[0].offsetWidth;
  let half = viewport.offsetWidth / 2;
  let inView = false;
  let autoplayOn = !!opts.autoplay && !reduced;
  let timer: gsap.core.Tween | null = null;
  let hovering = false;

  const mod = (v: number) => ((v % N) + N) % N;
  const dist = (i: number) => {
    let d = (i - st.pos) % N;
    if (d < -N / 2) d += N;
    if (d >= N / 2) d -= N;
    return d;
  };

  function render() {
    const pull = opts.pull ? opts.pull() : 0;
    for (let i = 0; i < N; i++) {
      const d = dist(i);
      const ad = Math.abs(d);
      const x = d * slot - Math.sign(d) * pull * gsap.utils.clamp(0, 1, ad - 1);
      const hidden = Math.abs(x) > half + slot;
      slides[i].style.visibility = hidden ? 'hidden' : 'visible';
      if (!hidden) gsap.set(slides[i], { x });
    }
    if (probe) gsap.set(probe, { x: -st.pos * slot });
  }

  function setActive(index: number) {
    index = mod(index);
    if (index === active) return;
    active = index;
    slides.forEach((s, i) => {
      const on = i === active;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
      gsap.to(act[i], {
        a: on ? 1 : 0,
        duration: stateDur,
        ease: ease.css,
        overwrite: true,
        onUpdate: () => opts.applyState(s, act[i].a),
      });
    });
    opts.onChange?.(active, N);
  }

  function goTo(target: number, user = false) {
    setActive(target);
    gsap.to(st, {
      pos: target,
      duration: speed,
      ease: ease.css,
      overwrite: true,
      onUpdate: render,
    });
    if (user) interacted();
    else startTimer();
  }
  const step = (dir: number, user = false) => goTo(Math.round(st.pos) + dir, user);

  function startTimer() {
    timer?.kill();
    timer = null;
    if (!autoplayOn) return;
    timer = gsap.delayedCall(opts.autoplay!, () => step(1));
    opts.onAutoplay?.('start', opts.autoplay!);
    if (hovering) {
      timer.pause();
      opts.onAutoplay?.('pause', opts.autoplay!);
    }
  }
  function interacted() {
    if (opts.disableOnInteraction && autoplayOn) {
      autoplayOn = false;
      timer?.kill();
      timer = null;
      opts.onAutoplay?.('stop', 0);
      return;
    }
    startTimer();
  }

  // drag (Swiper touch/mouse move with grabCursor)
  const proxy = document.createElement('div');
  let startPos = 0;
  let pressTime = 0;
  disposeOn(
    signal,
    ...Draggable.create(proxy, {
      type: 'x',
      trigger: viewport,
      cursor: 'grab',
      activeCursor: 'grabbing',
      minimumMovement: 4,
      onPress() {
        gsap.killTweensOf(st);
        gsap.set(proxy, { x: 0 });
        this.update();
        startPos = st.pos;
        pressTime = performance.now();
      },
      onDrag() {
        st.pos = startPos - this.x / slot;
        render();
      },
      onDragEnd() {
        const moved = st.pos - startPos;
        const quick = performance.now() - pressTime < 300;
        let target = Math.round(st.pos);
        // Swiper: short swipes always advance, long swipes advance past 50% of the slide
        if (quick && Math.abs(moved) > 0.02 && target === Math.round(startPos))
          target = Math.round(startPos) + Math.sign(moved);
        goTo(target, true);
      },
      onClick(e: Event) {
        const slide = (e.target as HTMLElement).closest<HTMLElement>('[data-slide]');
        if (!slide) return;
        const i = slides.indexOf(slide);
        if (i < 0 || i === active) return;
        goTo(Math.round(st.pos) + Math.round(dist(i)), true); // slideToClickedSlide
      },
    }),
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

  // keyboard: true (only while the carousel is on screen, as Swiper does)
  const io = new IntersectionObserver((en) => {
    inView = en[0].isIntersecting;
  });
  io.observe(root);
  disposeOn(signal, io);
  window.addEventListener(
    'keydown',
    (e) => {
      if (!inView || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === 'ArrowRight') step(1, true);
      else if (e.key === 'ArrowLeft') step(-1, true);
    },
    { signal },
  );

  // autoplay.pauseOnMouseEnter
  root.addEventListener(
    'pointerenter',
    (e) => {
      if ((e as PointerEvent).pointerType !== 'mouse') return;
      hovering = true;
      if (timer) {
        timer.pause();
        opts.onAutoplay?.('pause', opts.autoplay!);
      }
    },
    { signal },
  );
  root.addEventListener(
    'pointerleave',
    () => {
      if (!hovering) return;
      hovering = false;
      if (timer) {
        timer.resume();
        opts.onAutoplay?.('resume', opts.autoplay!);
      }
    },
    { signal },
  );

  function measure() {
    slot = slides[0].offsetWidth;
    half = viewport.offsetWidth / 2;
    render();
  }
  window.addEventListener('resize', measure, { signal });

  slides.forEach((s, i) => {
    s.classList.toggle('is-active', i === 0);
    s.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    opts.applyState(s, act[i].a);
  });
  measure();
  root.setAttribute('data-carousel-ready', '');
  opts.onChange?.(0, N);
  startTimer();

  return {
    goTo: (i: number) => goTo(Math.round(st.pos) + Math.round(dist(mod(i))), true),
    step,
    get active() {
      return active;
    },
    count: N,
  };
}
