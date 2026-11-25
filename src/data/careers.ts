// Careers page copy.

export interface CareersCard {
  /** A CareersGlyph name. */
  readonly icon: string;
  readonly title: string;
  readonly text: string;
}

export const careersCards: readonly CareersCard[] = [
  {
    icon: 'rocket',
    title: 'Built on Astro',
    text: "The framework behind IKEA, Microsoft, Porsche, Visa, NBC News, and The Guardian. Astro ships zero unnecessary JavaScript, so your site loads in a blink — and scores 90-100 on Google's performance metrics by default.",
  },
  {
    icon: 'layers',
    title: 'Version-controlled',
    text: "Where 90% of the Fortune 100 safeguard their code, alongside 180+ million developers. Every change to your site is tracked, backed up, and reversible — the same professional workflow that runs the world's biggest software. Nothing ships without a record of it.",
  },
  {
    icon: 'gauge',
    title: 'Engineered to rank',
    text: 'Google weighs Core Web Vitals and crawlable, semantic HTML in its rankings. Astro outputs both by default — pre-rendered static pages, minimal client JS, clean markup. The SEO groundwork is in the architecture, not bolted on afterward, so it is there on day one.',
  },
  {
    icon: 'shield',
    title: 'Secure by design',
    text: "Most website hacks happen through databases and plugins. Your site doesn't use either, so there's simply far less that can be broken into.",
  },
  {
    icon: 'bolt',
    title: 'Under a second',
    text: "Over half of mobile visitors abandon a site that takes more than three seconds to load. Ours are served as static pages from Cloudflare's edge.",
  },
  {
    icon: 'globe',
    title: 'Edge-delivered',
    text: "Your site is distributed across Cloudflare's network and served from the node closest to each visitor, with no origin server to fall over under traffic.",
  },
  {
    icon: 'heart',
    title: 'Always current',
    text: 'Security patches and framework updates are applied deliberately and tested before they ever hit production.',
  },
  {
    icon: 'chat',
    title: 'AI on your side',
    text: 'The same tools we build into your site, brought into your business — quoting, admin, correspondence, whatever eats your week. We set it up and stay on the phone.',
  },
];
