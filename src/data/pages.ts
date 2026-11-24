// Per-page SEO: the title and meta description, keyed by route.
// The og: and twitter: tags are built from these in layouts/BaseLayout.astro.

export interface PageSeo {
  readonly title: string;
  /** Falls back to the site description. */
  readonly description?: string;
}

export const pages = {
  '/': {
    title: 'Rebirth Web Design — High-performance websites',
    description:
      'Rebirth Online builds fast, secure, static-first websites using a modern, production-grade web architecture. Websites in Bundaberg just got an upgrade.',
  },
  '/services': {
    title: 'Get started — Rebirth Web Design',
    description:
      'Rebirth Online builds fast, secure, static-first websites on a modern web architecture. Start on desktop, mobile or by phone.',
  },
  '/plans': {
    title: 'Care Plans — Rebirth Web Design',
    description: 'Hosting, backups, security, and updates — managed for you, every month.',
  },
  '/careers': {
    title: 'Work with Rebirth — Rebirth Web Design',
    description:
      'Rebirth Online builds fast, secure, static-first websites on a modern, production-grade stack. You work with the person writing the code — not an account manager or an offshore team.',
  },
  '/launch': {
    title: 'Launch your site — Rebirth Web Design',
    description:
      'Rebirth builds fast, secure, static-first websites on a production-grade web stack. Full custom sites typically take 2–4 weeks, kickoff to launch.',
  },
} as const satisfies Record<string, PageSeo>;
