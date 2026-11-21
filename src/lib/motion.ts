// The one place GSAP is configured. Components import gsap, ScrollTrigger, eases, media queries and the
// helpers from here, never from 'gsap' directly (Draggable is the exception: only carousels load it).
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, CustomEase);

export { gsap, ScrollTrigger };

/**
 * Cubic-bezier curves from the reference site's CSS and Webflow interactions. None of GSAP's built-in
 * eases is mathematically identical (power1.in, sine.in, sine.inOut and power4.out are different
 * curves), so these stay custom.
 */
export const ease = {
  /** CSS `ease` */
  css: CustomEase.create('motionCss', '0.25,0.1,0.25,1'),
  /** CSS `ease-in` */
  in: CustomEase.create('motionIn', '0.42,0,1,1'),
  inOutSine: CustomEase.create('motionInOutSine', '0.445,0.05,0.55,0.95'),
  outQuart: CustomEase.create('motionOutQuart', '0.165,0.84,0.44,1'),
} as const;

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const MOTION_REDUCE = '(prefers-reduced-motion: reduce)';

/** Breakpoints in use (the site's tablet and desktop switch widths). */
export const MQ = {
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  mdOnly: '(min-width: 768px) and (max-width: 991px)',
  sm: '(max-width: 767px)',
  always: 'all',
} as const;

/** For interaction code that sets durations to 0 instead of skipping the tween. Read at call time. */
export const reducedMotion = () => window.matchMedia(MOTION_REDUCE).matches;

type Cleanup = () => void;
type Setup<E extends Element> = (root: E, context: gsap.Context) => void | Cleanup;

const contexts = new Set<gsap.MatchMedia>();

/**
 * Runs `setup` while `query` matches and reverts everything it created (tweens, timelines, ScrollTriggers)
 * when it stops matching or the page is swapped out. The context is scoped to `root`, so string
 * selectors inside `setup` resolve within it. A missing root does nothing.
 */
export function media<E extends Element>(root: E | null, setup: Setup<E>, query: string) {
  if (!root) return;
  const mm = gsap.matchMedia(root);
  contexts.add(mm);
  mm.add(query, (context) => setup(root, context));
}

/** `media()` for animation: only runs without a reduced-motion preference, optionally also within `when`. */
export function motion<E extends Element>(root: E | null, setup: Setup<E>, when?: string) {
  media(root, setup, when ? `${MOTION_OK} and ${when}` : MOTION_OK);
}

/** Plays the animations while `trigger` is within the viewport and pauses them otherwise. */
export function playWhileInView(trigger: Element, ...animations: gsap.core.Animation[]) {
  return ScrollTrigger.create({
    trigger,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => animations.forEach((a) => (self.isActive ? a.play() : a.pause())),
  });
}

const pages: Array<{ init: () => void; ran: boolean }> = [];

const start = (page: (typeof pages)[number]) => {
  if (page.ran) return;
  page.ran = true;
  page.init();
};

// Astro's client router fires astro:page-load on the initial load and after every navigation, and
// astro:before-swap before the old page is replaced. Without the router neither event exists and
// onPage() simply runs once.
document.addEventListener('astro:page-load', () => pages.forEach(start));
document.addEventListener('astro:before-swap', () => {
  contexts.forEach((mm) => mm.revert());
  contexts.clear();
  pages.forEach((page) => (page.ran = false));
});

/**
 * Starts a component's script once the DOM is ready, and again after each client-side navigation.
 * An init that already ran for the current document is not run twice.
 */
export function onPage(init: () => void) {
  const page = { init, ran: false };
  pages.push(page);
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', () => start(page), { once: true });
  else start(page);
}
