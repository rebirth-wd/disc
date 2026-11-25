// Carousel slides: the launch success stories, the careers photo gallery and the careers party cards.

import glow from '@assets/photos/launch-glow-laptop.jpg';
import macbook from '@assets/photos/launch-macbook.jpg';
import curve from '@assets/photos/launch-violet-curve.jpg';
import pink from '@assets/photos/launch-pink-laptop.jpg';
import pyramid from '@assets/photos/launch-pyramid.jpg';
import room from '@assets/photos/launch-room.jpg';
import tubes from '@assets/photos/launch-tubes.jpg';
import tower from '@assets/photos/launch-tower.jpg';
import neonStudio from '@assets/photos/careers-gallery-neon-studio.jpg';
import neonDesk from '@assets/photos/careers-gallery-neon-desk.jpg';
import nightOffice from '@assets/photos/careers-gallery-night-office.jpg';
import openOffice from '@assets/photos/careers-gallery-open-office.jpg';
import pairing from '@assets/photos/careers-gallery-pairing.jpg';
import teamReview from '@assets/photos/careers-gallery-team-review.jpg';
import laptopDuo from '@assets/photos/careers-gallery-laptop-duo.jpg';

export interface LaunchStory {
  readonly image: ImageMetadata;
  readonly tag: string;
  readonly text: string;
}

export interface GalleryPhoto {
  readonly image: ImageMetadata;
  readonly alt: string;
}

export interface PartyCard {
  readonly label: string;
  /** A CareersGlyph name. */
  readonly icon: string;
}

export const launchStories: readonly LaunchStory[] = [
  {
    image: glow,
    tag: 'Lorem Ipsum',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    image: room,
    tag: 'Dolor Sit Amet',
    text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    image: pink,
    tag: 'Consectetur',
    text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur sint.',
  },
  {
    image: pyramid,
    tag: 'Adipiscing Elit',
    text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    image: macbook,
    tag: 'Sed Do Eiusmod',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam.',
  },
  {
    image: tower,
    tag: 'Tempor',
    text: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni.',
  },
  {
    image: curve,
    tag: 'Incididunt',
    text: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non.',
  },
  {
    image: tubes,
    tag: 'Magna Aliqua',
    text: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.',
  },
];

export const careersGallery: readonly GalleryPhoto[] = [
  { image: teamReview, alt: 'A small team reviewing a design together around one screen' },
  { image: neonStudio, alt: 'A studio desk lit by violet neon signs' },
  { image: openOffice, alt: 'People working on laptops in an open-plan office' },
  { image: neonDesk, alt: 'A workstation glowing with neon light in a dark room' },
  { image: pairing, alt: 'Two colleagues talking a build through at a laptop' },
  { image: nightOffice, alt: 'A quiet desk with a laptop and monitor at night' },
  { image: laptopDuo, alt: 'Two colleagues sharing a laptop by a bright window' },
];

export const careersParty: readonly PartyCard[] = [
  { label: 'Headers', icon: 'window' },
  { label: 'Heros', icon: 'star' },
  { label: 'Features', icon: 'spark' },
  { label: 'Content', icon: 'layers' },
  { label: 'Call-to-Action', icon: 'bolt' },
  { label: 'Pricing', icon: 'tag' },
  { label: 'Testimonials', icon: 'chat' },
  { label: 'Contact Forms', icon: 'mail' },
  { label: 'Footers', icon: 'cube' },
  { label: 'AI Assistant', icon: 'chat' },
  { label: 'AI Site Maintenance', icon: 'shield' },
  { label: 'AI Performance Tuning', icon: 'gauge' },
  { label: 'AI Content', icon: 'code' },
  { label: 'AI Lead Capture & Qualification', icon: 'pin' },
  { label: 'AI in Your Workplace', icon: 'rocket' },
  { label: 'Astro Builds', icon: 'rocket' },
  { label: 'GitHub Workflow', icon: 'layers' },
  { label: 'Cloudflare Hosting', icon: 'globe' },
  { label: 'Tailwind CSS', icon: 'window' },
  { label: 'Core Web Vitals', icon: 'gauge' },
  { label: 'Local SEO', icon: 'pin' },
  { label: 'Static-first Security', icon: 'shield' },
  { label: 'Edge Delivery', icon: 'globe' },
  { label: 'Managed Updates', icon: 'heart' },
  { label: 'Backups', icon: 'cube' },
  { label: 'Blog & Socials', icon: 'mail' },
];
