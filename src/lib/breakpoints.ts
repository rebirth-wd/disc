/** The site's switch widths in px. CSS has the same numbers as --breakpoint-* in styles/theme.css; plain @media rules repeat them (each minus 1 for max-width). */
export const breakpoints = {
  xs: 480,
  md: 768,
  desktop: 992,
  xl: 1280,
  wide: 1440,
  ultra: 1920,
} as const;
