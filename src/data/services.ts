// Services page copy.

export interface ServiceType {
  readonly label: string;
}

/** Options in the banner dropdown. */
export const serviceTypes: readonly ServiceType[] = [
  'Portfolio',
  'Business landing page',
  'Marketing site',
  'Documentation hub',
  'Personal brand',
  'AI Tools',
  'Maintenance',
  'Something else',
].map((label) => ({ label }));
