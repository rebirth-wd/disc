import { gsap } from './motion';

/** Seconds of hold before each 0.5s fade: in, out, in, out. The three sequences keep neighbouring stars out of step. */
export const TWINKLE_HOLDS = {
  1: [1, 2, 1, 2],
  2: [2, 2, 1, 2],
  3: [1, 1, 1, 2],
} as const;

export type TwinkleSequence = keyof typeof TWINKLE_HOLDS;

/** One star's endless opacity loop. `paused` hands control to the caller (e.g. `playWhileInView`). */
export function twinkleTimeline(el: Element, sequence: TwinkleSequence, paused: boolean) {
  const tl = gsap.timeline({
    repeat: -1,
    paused,
    defaults: { duration: 0.5, ease: 'power1.in' },
  });
  tl.set(el, { opacity: 0 });
  TWINKLE_HOLDS[sequence].forEach((hold, i) => tl.to(el, { opacity: i % 2 ? 0 : 1 }, `+=${hold}`));
  return tl;
}
