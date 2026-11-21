// Site navigation: the header link row and dropdown panels, the mobile menu and the footer link columns.
// The built routes are real; every other href is "#" until the page exists.

export interface NavLink {
  readonly label: string;
  readonly href: string;
  /** Shows the external-link arrow. */
  readonly external?: boolean;
}

export interface NavList {
  readonly title: string;
  readonly links: readonly NavLink[];
}

export type DropdownDecor = 'plane' | 'shield' | 'rocket' | 'buoy' | 'pencil' | 'cube';

export type NavItem =
  | { readonly kind: 'link'; readonly id: string; readonly label: string; readonly href: string }
  | {
      readonly kind: 'dropdown';
      readonly id: string;
      readonly label: string;
      readonly href: string;
      readonly decor: DropdownDecor;
      /** Each column is a stack of lists. */
      readonly columns: readonly (readonly NavList[])[];
    };

export interface FooterColumn {
  readonly title: string;
  readonly links: readonly NavLink[];
}

/** 2 links, 6 dropdowns, 1 link. */
export const navigation = [
  { kind: 'link', id: 'services', label: 'Services', href: '/services' },
  { kind: 'link', id: 'plans', label: 'Plans', href: '/plans' },
  {
    kind: 'dropdown',
    id: 'showcase',
    label: 'Showcase',
    href: '#',
    decor: 'plane',
    columns: [
      [
        {
          title: 'Our work',
          links: [
            { label: 'Recent Launches', href: '#' },
            { label: 'Case Studies', href: '#' },
          ],
        },
      ],
    ],
  },
  {
    kind: 'dropdown',
    id: 'stack',
    label: 'Stack',
    href: '#',
    decor: 'shield',
    columns: [
      [
        {
          title: 'Platform',
          links: [
            { label: 'Built on Astro', href: '#' },
            { label: 'GitHub Workflow', href: '#' },
            { label: 'Cloudflare Edge', href: '#' },
            { label: 'Static-first', href: '#' },
            { label: 'Security by Design', href: '#' },
          ],
        },
      ],
      [
        {
          title: 'Guides',
          links: [
            { label: 'Speed Guide', href: '#' },
            { label: 'SEO Guide', href: '#' },
            { label: 'Hosting Guide', href: '#' },
            { label: 'Maintenance Guide', href: '#' },
            { label: 'AI Readiness', href: '#' },
          ],
        },
      ],
    ],
  },
  {
    kind: 'dropdown',
    id: 'launch',
    label: 'Growth',
    href: '/launch',
    decor: 'rocket',
    columns: [
      [
        {
          title: 'Resources',
          links: [
            { label: 'Campaigns', href: '/launch' },
            { label: 'Success Stories', href: '#' },
            { label: 'Growth FAQ', href: '#' },
          ],
        },
      ],
    ],
  },
  {
    kind: 'dropdown',
    id: 'support',
    label: 'Support',
    href: '#',
    decor: 'buoy',
    columns: [
      [
        {
          title: 'Resources',
          links: [
            { label: 'Help Centre', href: '#' },
            { label: 'Feedback', href: '#' },
            { label: 'Start a Project', href: '#' },
          ],
        },
      ],
    ],
  },
  {
    kind: 'dropdown',
    id: 'blog',
    label: 'Blog',
    href: '#',
    decor: 'pencil',
    columns: [
      [
        {
          title: 'Collections',
          links: [
            { label: 'Featured', href: '#' },
            { label: 'Bundaberg', href: '#' },
            { label: 'Rebirth HQ', href: '#' },
            { label: 'Engineering & Stack', href: '#' },
            { label: 'How to Launch', href: '#' },
            { label: 'SEO & Speed', href: '#' },
            { label: 'AI & Automation', href: '#' },
          ],
        },
      ],
    ],
  },
  {
    kind: 'dropdown',
    id: 'ai',
    label: 'AI Toolkit',
    href: '#',
    decor: 'cube',
    columns: [
      [
        {
          title: 'Learn',
          links: [
            { label: 'AI for Local Business', href: '#' },
            { label: 'Integrations', href: '#' },
            { label: 'Personalisation', href: '#' },
            { label: 'Agents & Crawlers', href: '#' },
            { label: 'Toolkit Newsletter', href: '#' },
            { label: 'Toolkit Case Studies', href: '#' },
          ],
        },
        {
          title: 'Build',
          links: [
            { label: 'Open Source Starters', href: '#', external: true },
            { label: 'Client Portal', href: '#', external: true },
            { label: 'Documentation', href: '#', external: true },
            { label: 'Developer Help Desk', href: '#', external: true },
          ],
        },
      ],
    ],
  },
  { kind: 'link', id: 'careers', label: 'Careers', href: '/careers' },
] as const satisfies readonly NavItem[];

export const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'Plans', href: '/plans' },
      { label: 'Status', href: '#' },
      { label: 'Showcase', href: '#' },
      { label: 'Care Plans', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '/careers' },
      { label: 'Brand', href: '#' },
      { label: 'Newsroom', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Support', href: '#' },
      { label: 'Stack', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Creators', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'AI Toolkit', href: '#' },
      { label: 'Growth', href: '/launch' },
      { label: 'Bundaberg Web Design', href: '#' },
      { label: 'Feedback', href: '#' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Terms', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Cookie Settings', href: '#' },
      { label: 'Guidelines', href: '#' },
      { label: 'Acknowledgements', href: '#' },
      { label: 'Licences', href: '#' },
      { label: 'Company Information', href: '#' },
    ],
  },
] as const satisfies readonly FooterColumn[];
