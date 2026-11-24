// Site-wide config: name, production URL, default description and the footer's language and social labels.

export const site = {
  name: 'Rebirth Web Design',
  /** Must match what the sitemap and canonical URLs are built from. */
  url: 'https://rebirthwebdesign.com.au',
  description: 'Rebirth Web Design — fast, secure, static-first websites.',
  /** Equals --color-deep-indigo, the page canvas; a meta tag cannot read a CSS variable. */
  themeColor: '#1a2081',
} as const;

export const languages: readonly string[] = [
  'English',
  'English (AU)',
  'English (UK)',
  'Deutsch',
  'Español',
  'Français',
  'Italiano',
  '日本語',
];

export const socialLabels: readonly string[] = ['Chat', 'Photos', 'Community', 'Video', 'Feed'];
