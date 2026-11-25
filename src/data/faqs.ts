// FAQ copy for the Plans and Careers pages.

export interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

/** A tab of the Plans FAQ. */
export interface FaqTab {
  readonly name: string;
  readonly items: readonly FaqEntry[];
}

export const plansFaq: readonly FaqTab[] = [
  {
    name: 'General',
    items: [
      {
        question: 'What’s Care?',
        answer:
          'Care is a monthly plan that keeps your Rebirth site hosted, backed up, secured and updated, with AI features that answer visitors, tune performance and keep your content current.',
      },
      {
        question: 'Does Rebirth Care include the AI Site Assistant?',
        answer:
          'Yes. Care members get an AI Site Assistant (Starter Edition) trained on your services, your pricing, your suburbs and your FAQs. It answers after hours and guides visitors to the right page.',
      },
      {
        question: 'What are Care Rewards?',
        answer:
          'Care Rewards is the set of extras included with a Care plan: the AI Site Assistant, monthly performance tuning and a monthly content refresh. Terms and eligibility rules apply.',
      },
      {
        question: 'How does Care work?',
        answer:
          'Once you join, hosting, backups, security and updates are managed for you, every month. Patches and framework updates are tested against a preview deploy before they ever hit production.',
      },
      {
        question: 'What’s the difference between Care and Care Basic?',
        answer:
          'Care is our most popular plan and unlocks every perk. Care Basic covers the essentials that keep a site online: managed edge hosting, daily backups and security patches.',
      },
      {
        question: 'How much does Care cost?',
        answer:
          'Placeholder pricing only: Care Basic is $XX / month and Care is $XX / month. Lorem ipsum dolor sit amet, a detailed quote follows our initial discussion.',
      },
      {
        question: 'Where can I join Care?',
        answer:
          'Get in touch through the contact page or call us. You work with the person writing the code, not an account manager, and we can add a plan to any site we build.',
      },
    ],
  },
  {
    name: 'Payments',
    items: [
      {
        question: 'What payment methods do you accept?',
        answer:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Payment methods are confirmed on your quote.',
      },
      {
        question: 'Do you offer Care and Care Basic on yearly billing?',
        answer:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
    ],
  },
  {
    name: 'Hosting and Updates',
    items: [
      {
        question: 'Where is my site hosted?',
        answer:
          'Your site is distributed across Cloudflare’s network and served from the node closest to each visitor, with no origin server to fall over under traffic.',
      },
      {
        question: 'Do you keep backups?',
        answer:
          'Yes. Every change is tracked in version control, backed up and reversible, and backups run without anyone remembering to run them.',
      },
      {
        question: 'How are updates tested?',
        answer:
          'Astro, dependencies and integrations are kept current. Updates are applied deliberately and tested against a preview deploy first.',
      },
      {
        question: 'Can I move an existing site onto Care?',
        answer:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. We will review your stack and tell you what fits.',
      },
      {
        question: 'Does Rebirth offer plan promotions?',
        answer:
          'A limited number of pro-bono or heavily discounted sites are offered each year. Lorem ipsum dolor sit amet.',
      },
    ],
  },
  {
    name: 'Other',
    items: [
      {
        question: 'My Care plan comes with content edits. What are those?',
        answer:
          'Small changes to copy, images or sections that keep your site matching what people are actually searching for.',
      },
      {
        question: 'Are plans lock-in?',
        answer:
          'Lorem ipsum dolor sit amet. You can take the full source code for you or your team to manage at any time.',
      },
      {
        question: 'Why is my site not updating?',
        answer:
          'Changes are tested on a preview deploy before production. If something looks stuck, call us and you get the developer directly.',
      },
    ],
  },
];

export const careersFaq: readonly FaqEntry[] = [
  {
    question:
      'Why choose Rebirth Online for my project? What makes a static-first website different?',
    answer:
      'I focus on fast, modern static websites built with Astro and Tailwind CSS—delivering standout design, blazing speed, and 90+ Lighthouse scores out of the box. Every site is mobile-first, accessible, SEO-ready, and tailored to your vision without unnecessary complexity or bloat.',
  },
  {
    question: 'What kinds of projects do you take on?',
    answer:
      'My core expertise is in high-quality static sites: portfolios, business landing pages, marketing sites, documentation hubs, and personal brands. I’m also open to light dynamic features (e.g., forms, search, or simple APIs) when they add real value, all while keeping performance and maintainability first.',
  },
  {
    question: 'How long does it take to build a website?',
    answer:
      'A focused prototype can be ready in just a few days. Full custom sites typically take 2–4 weeks from kickoff to launch, depending on scope and feedback rounds. I work iteratively—quick wins early, refinements along the way—so you see progress fast.',
  },
  {
    question: 'What do you need from me to get started?',
    answer:
      'Clear goals, any existing branding/assets (logo, colors, photos), content (or a plan for it), and reference sites you love. If you’re not sure about any of that, I can guide you through discovery and help shape the direction.',
  },
  {
    question: 'How much does a website cost?',
    answer:
      'Pricing is custom and transparent based on your needs. Paid projects start in the mid-four-figure range for bespoke, high-performance sites. I’ll provide a detailed quote after our initial discussion.',
  },
  {
    question: 'Do you offer maintenance or updates after launch, or do I manage the site myself?',
    answer:
      'Yes. I can hand off the full source code for you or your team to manage, or I can provide ongoing support (updates, new sections, performance tweaks) on a monthly retainer or per-request basis—whatever fits your workflow best.',
  },
  {
    question: 'What is my site actually built on?',
    answer:
      'Astro — the framework behind IKEA, Microsoft, Porsche, Visa, NBC News, and The Guardian. It ships zero unnecessary JavaScript, so your site loads in a blink.',
  },
  {
    question: 'Where is my code kept, and what happens if something breaks after a change?',
    answer:
      'On GitHub. Every change to your site is tracked, backed up, and reversible — the same professional workflow that runs the world’s biggest software.',
  },
  {
    question: 'Who hosts the site?',
    answer:
      'Cloudflare. Your site is distributed across its network and served from the node closest to each visitor, with no origin server to fall over under traffic.',
  },
  {
    question: 'Will my site rank on Google?',
    answer:
      'Google weighs Core Web Vitals and crawlable, semantic HTML in its rankings. Astro outputs both by default. The SEO groundwork is in the architecture, not bolted on afterward.',
  },
  {
    question: 'How secure is a static site?',
    answer:
      'Most website hacks happen through databases and plugins. Your site doesn’t use either, so there’s simply far less that can be broken into. Fewer weak points, fewer things to worry about.',
  },
  {
    question: 'Who will I be working with?',
    answer:
      'The person writing the code — not an account manager, not an offshore team. One Bundaberg-based developer who knows your entire stack.',
  },
];
