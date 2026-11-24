import { gsap, motion, MQ } from '@lib/motion';

/** Keeps a decor object bobbing while the page is open; independent of scroll. */
interface IdleFloat {
  /** The element that bobs, so the scroll parallax on `el` and the bob do not fight over one transform. */
  target: Element | null;
  /** Half the vertical travel in px; the bob goes -y → y. */
  y: number;
  /** Half the rotation in degrees; the bob goes -rotation → rotation. */
  rotation: number;
  /** Seconds for one way. */
  duration: number;
  /** Seconds to offset the loop by (negative starts it part-way through). */
  delay: number;
}

interface ParallaxOptions {
  /** Start of translateY in px. Leave out to tween from wherever the element sits (a `gsap.to`). */
  from?: number;
  /** End of translateY in px. */
  to: number;
  /** GSAP ease for the scroll mapping. */
  ease?: gsap.EaseString | gsap.EaseFunction;
  /** Seconds of smoothing behind the scrollbar. */
  scrub?: number;
  /** The element whose pass through the viewport drives the tween: the section, or the wrapper's trigger box. */
  trigger: Element | null;
  /** ScrollTrigger start and end positions. */
  start?: ScrollTrigger.Vars['start'];
  end?: ScrollTrigger.Vars['end'];
  /** Media query the parallax runs under, on top of no reduced-motion preference. */
  media?: string;
  /** Adds the idle bob; it runs under every width. */
  float?: IdleFloat;
}

/**
 * Scroll parallax for one element: translateY goes `from` → `to` while `trigger` travels through the viewport
 * (progress 0 when its top meets the viewport bottom, 1 when its bottom leaves the top). Defaults are the
 * home page's decor objects: smoothing 0.8, desktop and tablet only. A missing `el` does nothing.
 */
export function parallax(el: HTMLElement | null, options: ParallaxOptions) {
  const {
    from,
    to,
    ease: easing = 'none',
    scrub = 0.8,
    trigger,
    start = 'top bottom',
    end = 'bottom top',
    media = MQ.md,
    float,
  } = options;

  motion(
    el,
    () => {
      if (!trigger) return;
      const scrollTrigger = { trigger, start, end, scrub };
      const tween =
        from === undefined
          ? gsap.to(el, { y: to, ease: easing, scrollTrigger })
          : gsap.fromTo(el, { y: from }, { y: to, ease: easing, scrollTrigger });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(el, { clearProps: 'transform' });
      };
    },
    media,
  );

  if (float)
    motion(el, () => {
      if (!float.target) return;
      const tween = gsap.fromTo(
        float.target,
        { y: -float.y, rotation: -float.rotation },
        {
          y: float.y,
          rotation: float.rotation,
          duration: float.duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: float.delay,
        },
      );
      return () => {
        tween.kill();
        gsap.set(float.target, { clearProps: 'transform' });
      };
    });
}
