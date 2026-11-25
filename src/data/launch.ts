// Launch page copy: subnav links, steps, solution tabs, impact cards and platform stats.

export interface LaunchSubnavLink {
  readonly label: string;
  readonly href?: string;
  readonly current?: boolean;
  /** A hover dropdown under the tab. */
  readonly drop?: readonly LaunchSubnavLink[];
}

export interface LaunchStep {
  readonly title: string;
  readonly text: string;
  /** Picks the LaunchMock scene. */
  readonly mock: string;
}

export interface LaunchSolution {
  readonly title: string;
  readonly text: string;
  /** Picks the LaunchMock scene. */
  readonly mock: string;
}

export interface LaunchImpactCard {
  /** Picks the card illustration. */
  readonly icon: string;
  readonly title: string;
  readonly text: string;
}

export interface LaunchPlatformStat {
  readonly value: string;
  readonly label: string;
  readonly source: string;
}

export const launchSubnavLinks: readonly LaunchSubnavLink[] = [
  { label: 'Your Launch', href: '/launch', current: true },
  {
    label: 'What We Do',
    drop: [
      { label: 'Websites', href: '#' },
      { label: 'AI Tools & Integrations', href: '#' },
    ],
  },
  { label: 'Success Stories', href: '#launch-stories' },
  { label: 'FAQ', href: '#' },
];

export const launchSubnavMobile: readonly LaunchSubnavLink[] = [
  { label: 'Websites', href: '#' },
  { label: 'AI Tools & Integrations', href: '#' },
  { label: 'Success Stories', href: '#launch-stories' },
  { label: 'FAQ', href: '#' },
];

export const launchSteps = [
  {
    title: '1. You share your goals',
    text: 'Clear goals, existing branding, content and reference sites you love.',
    mock: 'brief',
  },
  {
    title: '2. We build fast',
    text: 'A focused prototype is ready in just a few days.',
    mock: 'build',
  },
  {
    title: '3. And launch in weeks',
    text: 'Full custom sites typically take 2–4 weeks, kickoff to launch.',
    mock: 'launch',
  },
] as const satisfies readonly LaunchStep[];

export const launchSolutions = [
  {
    title: 'AI Assistant',
    text: 'A chatbot that actually knows your business — your services, your pricing, your FAQs — not a generic bot reading off a script.',
    mock: 'chat',
  },
  {
    title: 'AI Site Maintenance',
    text: 'Your site monitors and repairs itself: security patching, uptime alerts, and backups that run without anyone remembering.',
    mock: 'maintain',
  },
  {
    title: 'AI Content',
    text: 'Blog posts drafted, published, and pushed to your socials on schedule, with site copy adjusted to what people are searching for.',
    mock: 'content',
  },
  {
    title: 'AI Lead Capture',
    text: 'Every enquiry — chat, form, or call-back request — gets read, summarised, and scored before it hits your inbox.',
    mock: 'leads',
  },
] as const satisfies readonly LaunchSolution[];

export const launchImpactCards: readonly LaunchImpactCard[] = [
  {
    icon: 'speed',
    title: 'Built on Astro for raw speed',
    text: 'Astro ships zero unnecessary JavaScript, so your site loads in a blink for every visitor, on any device they use.',
  },
  {
    icon: 'branch',
    title: 'Version-controlled with GitHub',
    text: 'Every change to your site is tracked, backed up, and reversible, start to finish.',
  },
  {
    icon: 'globe',
    title: 'Powered by Cloudflare’s edge',
    text: 'Your site is distributed across Cloudflare’s network and served from the node closest to each of your visitors.',
  },
];

export const launchPlatformStats: readonly LaunchPlatformStat[] = [
  {
    value: 'XX%',
    label: 'Performance Score',
    source: 'Placeholder figure, to be replaced with measured data',
  },
  {
    value: '0.0s',
    label: 'Median Load Time',
    source: 'Placeholder figure, to be replaced with measured data',
  },
  {
    value: 'XXX+',
    label: 'Edge locations worldwide',
    source: 'Placeholder figure, to be replaced with measured data',
  },
];
