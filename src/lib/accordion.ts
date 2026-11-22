// Accordion behaviour for ui/Accordion.astro: one item open at a time per group, closing on Escape and on a
// click outside every item of the group, the plus icon fading with the answer.
import { gsap, ease, ScrollTrigger, reducedMotion } from './motion';

const ITEM = '[data-accordion-item]';
const toggleOf = (item: HTMLElement) => item.querySelector<HTMLElement>('[data-accordion-toggle]')!;

/** Shows or hides one item's answer and fades its plus icon (0.25s open, 0.5s close). False if nothing changed. */
function setOpen(item: HTMLElement, open: boolean) {
  const toggle = toggleOf(item);
  if ((toggle.getAttribute('aria-expanded') === 'true') === open) return false;
  toggle.setAttribute('aria-expanded', String(open));
  item.querySelector<HTMLElement>('[data-accordion-panel]')!.hidden = !open;
  gsap.to(item.querySelector('[data-accordion-plus]'), {
    opacity: open ? 0 : 1,
    duration: reducedMotion() ? 0 : open ? 0.25 : 0.5,
    ease: ease.css,
    overwrite: true,
  });
  return true;
}

/** Closes every open item inside `scope`. Layout changes, so the caller refreshes ScrollTrigger. */
export function closeAccordions(scope: ParentNode) {
  scope.querySelectorAll<HTMLElement>(ITEM).forEach((item) => setOpen(item, false));
}

function initGroup(roots: HTMLElement[], signal: AbortSignal) {
  const items = roots.flatMap((root) => [...root.querySelectorAll<HTMLElement>(ITEM)]);
  const closeOthers = (except?: HTMLElement) =>
    items.map((item) => item !== except && setOpen(item, false)).some(Boolean);

  items.forEach((item) =>
    toggleOf(item).addEventListener(
      'click',
      () => {
        const open = toggleOf(item).getAttribute('aria-expanded') !== 'true';
        closeOthers(item);
        setOpen(item, open);
        ScrollTrigger.refresh();
      },
      { signal },
    ),
  );
  document.addEventListener(
    'click',
    (e) => {
      if (items.some((item) => item.contains(e.target as Node))) return;
      if (closeOthers()) ScrollTrigger.refresh();
    },
    { signal },
  );
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && closeOthers()) ScrollTrigger.refresh();
    },
    { signal },
  );
}

/** Sets up every `[data-accordion]` on the page; roots sharing a `data-accordion-group` open one at a time together. */
export function initAccordions(signal: AbortSignal) {
  const groups = new Map<string, HTMLElement[]>();
  document.querySelectorAll<HTMLElement>('[data-accordion]').forEach((root, i) => {
    const key = root.dataset.accordionGroup || `accordion-${i}`;
    groups.set(key, [...(groups.get(key) ?? []), root]);
  });
  groups.forEach((roots) => initGroup(roots, signal));
}
