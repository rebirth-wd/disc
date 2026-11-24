// Plans page copy: tier feature lists, the highlight rows, the "what's new" block and the comparison table.

import codeNeon from '@assets/photos/plans-code-neon.jpg';
import laptopGlow from '@assets/photos/plans-laptop-glow.jpg';
import serversGreen from '@assets/photos/plans-servers-green.jpg';
import setupRgb from '@assets/photos/plans-setup-rgb.jpg';
import keyboardViolet from '@assets/photos/plans-keyboard-violet.jpg';
import fansDatacenter from '@assets/photos/plans-fans-datacenter.jpg';
import rackGreen from '@assets/photos/plans-rack-green.jpg';
import studioDesk from '@assets/photos/plans-studio-desk.jpg';
import laptopMagenta from '@assets/photos/plans-laptop-magenta.jpg';

export interface TierFeatures {
  readonly basic: readonly string[];
  readonly care: readonly string[];
}

export interface PlanHighlight {
  /** Picks the demo graphic. */
  readonly kind: string;
  readonly lines: readonly string[];
  readonly narrow?: boolean;
  readonly text: string;
  readonly note?: string;
}

export interface WhatsNewCard {
  /** Picks the demo graphic. */
  readonly kind: string;
  readonly title: string;
  readonly text: string;
}

/** A tick, a cross, or text. */
export type CompareCell = boolean | string;

/** Feature label, then the Care Basic cell, then the Care cell. */
export type CompareRow = readonly [label: string, basic: CompareCell, care: CompareCell];

export interface CompareGroup {
  readonly title: string;
  readonly link?: boolean;
  readonly tall?: boolean;
  readonly rows: readonly CompareRow[];
}

export const tierFeatures = {
  basic: ['Managed edge hosting', 'Daily backups', 'Security patches'],
  care: [
    'AI Site Assistant*',
    'AI performance tuning',
    'Uptime alerts',
    'Monthly content edits',
    'AI lead scoring and more!',
  ],
} as const satisfies TierFeatures;

export const planHighlights = [
  {
    kind: 'posts',
    lines: ['Fresh posts', 'on schedule'],
    narrow: true,
    text: 'Blog posts drafted, published and pushed to your socials on schedule, every single month.',
  },
  {
    kind: 'inbox',
    lines: ['Every enquiry', 'read and scored'],
    text: 'Chat, form or call-back, each lead is summarised and scored before it hits your inbox.',
  },
  {
    kind: 'chat',
    lines: ['A chatbot that', 'knows your', 'business'],
    text: 'It answers after hours and guides visitors to the right page, never reading off a script*.',
    note: '*Scripts not included, sorry',
  },
  {
    kind: 'speed',
    lines: ['Loads in under', 'a second'],
    text: 'Static pages served from the edge, built to turn casual traffic into customers.',
  },
] as const satisfies readonly PlanHighlight[];

export const whatsNewTiles: readonly ImageMetadata[] = [
  codeNeon,
  laptopGlow,
  serversGreen,
  setupRgb,
  keyboardViolet,
  fansDatacenter,
  rackGreen,
  studioDesk,
  laptopMagenta,
];

export const whatsNewPoints: readonly string[] = [
  'Trained on your services, pricing, suburbs and FAQs',
  'Answers visitor questions after hours',
  'Guides every visitor to the right page',
  'Works from your information, not the internet’s',
];

export const whatsNewCards = [
  {
    kind: 'repairs',
    title: 'Site repairs',
    text: 'Your site monitors and repairs itself, with scanning, patching and uptime alerts.',
  },
  {
    kind: 'faster',
    title: 'Faster pages',
    text: 'Audited against Google’s own metrics, with the fixes applied, not just reported.',
  },
] as const satisfies readonly WhatsNewCard[];

export const compareGroups: readonly CompareGroup[] = [
  {
    title: 'Care Rewards',
    link: true,
    tall: true,
    rows: [
      ['AI Site Assistant (Starter Edition)', false, true],
      ['Monthly performance tuning', false, true],
      ['Monthly content refresh', false, true],
    ],
  },
  {
    title: 'Always online',
    rows: [
      ['Managed edge hosting', true, true],
      ['Uptime monitoring with instant alerts', false, true],
      ['Self-repairing site checks', false, true],
      ['Tested preview deploys', false, true],
    ],
  },
  {
    title: 'Keep your site safe',
    rows: [
      ['Daily automatic backups', true, true],
      ['Security scanning and patching, plus framework updates', true, true],
      ['Version control', true, true],
      ['Dependency updates on a schedule', false, true],
      ['20+ tested integrations', false, true],
    ],
  },
  {
    title: 'No limits, all fast',
    rows: [
      ['Speed Multiplier', false, true],
      ['Monthly Reports', false, true],
      ['Backup retention', '30 days', '1 year'],
      ['Core Web Vitals audits', true, true],
      ['SSL certificate', true, true],
      ['AI lead scoring', false, true],
      ['2 content edits + 30% off extra edits', false, true],
      ['3 blog posts drafted', false, true],
      ['Market-shift suggestions, and copy changes', false, true],
      ['Priority Support', false, true],
      ['Direct line to the developer, same day', false, true],
      ['AI tools in your workplace', false, true],
    ],
  },
];
