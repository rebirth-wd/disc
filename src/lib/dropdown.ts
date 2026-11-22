// Dropdown behaviour for ui/Dropdown.astro. Every dropdown: one open at a time per group, closes on a click
// outside it, on Escape (focus returns to its trigger), when focus leaves it and when the desktop breakpoint
// changes. Hover dropdowns also open on mouse hover and keyboard focus.
import { gsap, ease, MQ, reducedMotion } from './motion';

const OPENED_RECENTLY_MS = 300;
const openedAt = new WeakMap<HTMLElement, number>();

const isOpen = (root: HTMLElement) => root.classList.contains('is-open');
const triggerOf = (root: HTMLElement) =>
  root.querySelector<HTMLElement>('[data-dropdown-trigger]')!;
const listOf = (root: HTMLElement) => root.querySelector<HTMLElement>('[data-dropdown-list]')!;

/**
 * Opens or closes one dropdown: aria-expanded, the `is-open` class, the list (fade 0.25s, or an instant
 * hidden toggle) and the arrow (0.2s). Dispatches `dropdown-toggle` ({ detail: { open } }) for extras.
 */
function setOpen(root: HTMLElement, open: boolean) {
  if (isOpen(root) === open) return;
  const list = listOf(root);
  const arrow = root.querySelector('[data-dropdown-arrow]');
  const seconds = (s: number) => (reducedMotion() ? 0 : s);
  root.classList.toggle('is-open', open);
  if (open) openedAt.set(root, performance.now());
  triggerOf(root).setAttribute('aria-expanded', String(open));
  if (root.hasAttribute('data-dropdown-fade')) {
    gsap.to(list, {
      autoAlpha: open ? 1 : 0,
      duration: seconds(0.25),
      ease: ease.css,
      overwrite: true,
    });
  } else list.hidden = !open;
  if (arrow)
    gsap.to(arrow, {
      rotation: open ? 180 : 0,
      transformOrigin: '50% 50%',
      duration: seconds(0.2),
      ease: ease.css,
      overwrite: true,
    });
  root.dispatchEvent(new CustomEvent('dropdown-toggle', { detail: { open } }));
}

function initGroup(members: HTMLElement[], signal: AbortSignal) {
  const closeOthers = (except?: HTMLElement) =>
    members.forEach((m) => m !== except && setOpen(m, false));
  const show = (root: HTMLElement) => {
    closeOthers(root);
    setOpen(root, true);
  };

  members.forEach((root) => {
    const trigger = triggerOf(root);
    const hover = root.dataset.dropdownOpensOn === 'hover';

    trigger.addEventListener(
      'click',
      (e) => {
        if (trigger instanceof HTMLAnchorElement) {
          if (trigger.getAttribute('href') !== '#') return; // a real route: navigate
          e.preventDefault();
        }
        if (hover) {
          // hover and focus already opened it; only a touch tap toggles, and not right after they did
          const type = (e as PointerEvent).pointerType;
          if (type !== 'touch' && type !== 'pen') return;
          if (performance.now() - (openedAt.get(root) ?? 0) < OPENED_RECENTLY_MS) return;
        }
        if (isOpen(root)) setOpen(root, false);
        else show(root);
      },
      { signal },
    );
    root.addEventListener(
      'focusout',
      (e) => {
        if (!root.contains(e.relatedTarget as Node | null)) setOpen(root, false);
      },
      { signal },
    );

    if (!hover) return;
    root.addEventListener(
      'pointerenter',
      (e) => {
        if (e.pointerType === 'mouse') show(root);
      },
      { signal },
    );
    root.addEventListener(
      'pointerleave',
      (e) => {
        if (e.pointerType === 'mouse') setOpen(root, false);
      },
      { signal },
    );
    root.addEventListener('focusin', () => show(root), { signal });
    trigger.addEventListener(
      'keydown',
      (e) => {
        if (e.key !== ' ' && e.key !== 'ArrowDown') return;
        e.preventDefault();
        show(root);
        listOf(root).querySelector<HTMLElement>('a[href], button')?.focus();
      },
      { signal },
    );
  });

  document.addEventListener(
    'click',
    (e) => members.forEach((m) => !m.contains(e.target as Node) && setOpen(m, false)),
    { signal },
  );
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Escape') return;
      members.filter(isOpen).forEach((m) => {
        // Only take focus back when it is in the dropdown (or nowhere): something else may have claimed it.
        const focused = document.activeElement;
        if (!focused || focused === document.body || m.contains(focused)) triggerOf(m).focus();
        setOpen(m, false);
      });
    },
    { signal },
  );
  window.matchMedia(MQ.lg).addEventListener('change', () => closeOthers(), { signal });
}

/** Sets up every `[data-dropdown]` on the page; ones sharing a `data-dropdown-group` are open one at a time. */
export function initDropdowns(signal: AbortSignal) {
  const groups = new Map<string, HTMLElement[]>();
  document.querySelectorAll<HTMLElement>('[data-dropdown]').forEach((root, i) => {
    const key = root.dataset.dropdownGroup || `dropdown-${i}`;
    groups.set(key, [...(groups.get(key) ?? []), root]);
  });
  groups.forEach((members) => initGroup(members, signal));
}
