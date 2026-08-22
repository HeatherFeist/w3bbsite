/**
 * Single source of truth for every piece of W3BB Worldwide site content.
 * All sections import from here — never duplicate copy in components.
 */

export type IconName =
  | 'sparkles'
  | 'shield'
  | 'badge'
  | 'store'
  | 'fingerprint'
  | 'palette'
  | 'package'
  | 'workflow'
  | 'megaphone'
  | 'clapperboard'
  | 'route'
  | 'coins'
  | 'school'
  | 'heart'
  | 'users'
  | 'landmark'
  | 'rocket'
  | 'graduation'
  | 'wrench'
  | 'scroll'
  | 'globe'
  | 'hexagon'
  | 'cpu'
  | 'link'
  | 'trending'
  | 'home'
  | 'building'
  | 'handshake'
  | 'infinity';

export const SITE = {
  name: 'W3BB',
  fullName: 'W3BB Worldwide',
  domain: 'w3bbworldwide.com',
  email: 'hello@w3bbworldwide.com',
  descriptor: 'A trust-backed digital business ecosystem.',
  trustLine: 'Backed by the Webb Family Dynasty Trust',
  copyright: '© 2026 W3BB Worldwide. All rights reserved.',
  tagline: 'Entrepreneurship, simplified. Legacy, amplified.',
};

export const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'build', label: 'Build' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'certification', label: 'Certification' },
  { id: 'enterprise', label: 'Enterprise' },
  { id: 'contact', label: 'Contact' },
] as const;

/* ---------------------------------- 1. HERO --------------------------------- */

export const HERO = {
  eyebrow: 'TRUST-BACKED DIGITAL BUSINESS ECOSYSTEM',
  headlineLines: ['Build.', 'Certify.', 'Launch.'],
  subheadline: 'The Future of Digital Business Starts Here.',
  body:
    'W3BB Worldwide is a trust-backed digital business ecosystem that empowers anyone to build, mint, certify, and monetize fully packaged businesses. Create your brand, generate your assets, and launch your enterprise — all inside one unified platform.',
  closing: 'Entrepreneurship, simplified. Legacy, amplified.',
  primaryCta: 'Start Creating Today',
  secondaryCta: 'Explore the Marketplace',
  stats: [
    { label: 'AI-Powered Creation', icon: 'sparkles' as IconName },
    { label: 'Blockchain Verified', icon: 'link' as IconName },
    { label: 'Trust-Approved', icon: 'shield' as IconName },
    { label: 'Automatic Royalties', icon: 'coins' as IconName },
  ],
};

/* --------------------------------- 2. ABOUT --------------------------------- */

export const ABOUT = {
  label: 'ABOUT',
  heading: 'A New Kind of Digital Economy',
  paragraph:
    'W3BB Worldwide is a next-generation business creation platform designed for creators, families, entrepreneurs, and organizations who want to build real, verifiable businesses with modern tools.',
  cardsTitle: 'We combine:',
  cards: [
    {
      title: 'AI-Powered Creation',
      description: 'Generate brands, products, and assets in minutes instead of months.',
      icon: 'sparkles' as IconName,
    },
    {
      title: 'Blockchain Verification',
      description: 'Every business is minted, timestamped, and provably owned on-chain.',
      icon: 'link' as IconName,
    },
    {
      title: 'Trust-Approved Certification',
      description: 'An independent trust layer that validates quality and structure.',
      icon: 'shield' as IconName,
    },
    {
      title: 'Resale Marketplace with Automatic Royalties',
      description: 'List, sell, and earn recurring royalties on every future resale.',
      icon: 'store' as IconName,
    },
  ],
  closing:
    'The result is a new kind of digital economy — one where businesses are built, owned, sold, and scaled with clarity, legitimacy, and multi-generational value.',
};

/* --------------------------- 3. WHAT YOU CAN BUILD -------------------------- */

export const BUILD = {
  label: 'WHAT YOU CAN BUILD',
  heading: 'Your Business. Your Blueprint. Your Legacy.',
  intro: 'Inside W3BB Worldwide, you can create:',
  items: [
    {
      slug: 'business-identity',
      title: 'Complete business identities',
      icon: 'fingerprint' as IconName,
      description:
        'Name, story, positioning, and legal-ready foundations packaged into one cohesive business identity.',
    },
    {
      slug: 'brand-kit',
      title: 'Brand kits and visual systems',
      icon: 'palette' as IconName,
      description:
        'Logos, color palettes, typography, and a full visual system so your brand looks consistent everywhere.',
    },
    {
      slug: 'product-catalog',
      title: 'Product catalogs',
      icon: 'package' as IconName,
      description: 'Structured product and service listings ready to sell, sync, and scale.',
    },
    {
      slug: 'operational-workflows',
      title: 'Operational workflows',
      icon: 'workflow' as IconName,
      description: 'The day-to-day processes and systems that keep your business running smoothly.',
    },
    {
      slug: 'marketing-assets',
      title: 'Marketing assets',
      icon: 'megaphone' as IconName,
      description: 'Campaign-ready copy, graphics, and materials to promote your business from day one.',
    },
    {
      slug: 'multimedia-content',
      title: 'AI-powered multimedia content',
      icon: 'clapperboard' as IconName,
      description: 'Photos, video, and audio generated with AI to bring your brand to life across every channel.',
    },
    {
      slug: 'customer-experience',
      title: 'Customer experience flows',
      icon: 'route' as IconName,
      description: 'The journeys your customers take, from first touch to loyal repeat business.',
    },
    {
      slug: 'revenue-models',
      title: 'Revenue models',
      icon: 'coins' as IconName,
      description: 'Pricing, packaging, and monetization strategies built to fit how your business earns.',
    },
  ],
  callout:
    'Every business you build can be minted as a Business NFT, packaged into a Franchise Bundle, and listed on the W3BB Marketplace.',
};

/* ----------------------------- 4. BUSINESS BUILDER -------------------------- */

export const BUILDER = {
  label: 'THE BUSINESS BUILDER',
  heading: 'A Guided System for Creating Real Businesses',
  intro: 'Our Business Builder walks you through every step:',
  steps: [
    { n: '01', title: 'Naming and branding' },
    { n: '02', title: 'Product development' },
    { n: '03', title: 'Asset generation' },
    { n: '04', title: 'Business logic' },
    { n: '05', title: 'Customer journey design' },
    { n: '06', title: 'Operational structure' },
    { n: '07', title: 'Multimedia creation' },
    { n: '08', title: 'Launch preparation' },
  ],
  closing:
    "Whether you're a beginner or a seasoned creator, W3BB gives you the tools to build a business that looks, feels, and operates like a professional enterprise.",
};

/* ------------------------------ 5. MARKETPLACE ------------------------------ */

export const MARKETPLACE = {
  label: 'MARKETPLACE',
  heading: 'Turn Your Business Into a Sellable Asset',
  paragraph:
    'Once your business is complete, you can package it into a Franchise Bundle NFT — a fully documented, ready-to-run business blueprint.',
  includesTitle: 'Each bundle includes:',
  includes: [
    'Brand identity',
    'Product catalog',
    'Operational system',
    'Marketing materials',
    'AI workflows',
    'Revenue model',
    'Launch instructions',
  ],
  emphasis: [
    'Buyers receive everything they need to run the business immediately.',
    'Creators earn automatic royalties every time their bundle is resold.',
  ],
  tokenMeta: [
    { key: 'Standard', value: 'W3BB-721' },
    { key: 'Royalty', value: '8% perpetual' },
    { key: 'Status', value: 'Trust-Approved' },
    { key: 'Includes', value: '7 asset modules' },
  ],
};

/* ----------------------------- 6. CERTIFICATION ----------------------------- */

export const CERTIFICATION = {
  label: 'CERTIFICATION',
  heading: 'Legitimacy That Opens Doors',
  paragraph:
    'W3BB Worldwide is backed by the Webb Family Dynasty Trust — a multi-generational entity that provides a unique certification layer.',
  signalsTitle: 'A Trust-Approved badge signals:',
  signals: [
    'Verified quality',
    'Sound business logic',
    'Professional structure',
    'Funding readiness',
    'Long-term viability',
  ],
  closing:
    'Certified businesses gain increased value, marketplace visibility, and stronger appeal to investors, banks, and grant committees.',
};

/* ------------------------------- 7. ENTERPRISE ------------------------------ */

export const ENTERPRISE = {
  label: 'ENTERPRISE',
  heading: 'Enterprise Tools for Organizations',
  intro: 'W3BB Worldwide offers a scalable platform for:',
  audiences: [
    { label: 'Schools', icon: 'school' as IconName },
    { label: 'Nonprofits', icon: 'heart' as IconName },
    { label: 'Community programs', icon: 'users' as IconName },
    { label: 'Family trusts', icon: 'landmark' as IconName },
    { label: 'Entrepreneurship groups', icon: 'rocket' as IconName },
    { label: 'Youth development organizations', icon: 'graduation' as IconName },
  ],
  provideTitle: 'We provide:',
  provide: [
    { title: 'Business builder tools', icon: 'wrench' as IconName },
    { title: 'Certification frameworks', icon: 'scroll' as IconName },
    { title: 'Marketplace access', icon: 'globe' as IconName },
    { title: 'Digital asset minting', icon: 'hexagon' as IconName },
    { title: 'AI multimedia pipelines', icon: 'cpu' as IconName },
  ],
  closing: 'Empower your community to build real businesses with modern tools.',
  cta: 'Talk to Our Team',
};

/* ----------------------------- 8. SOCIAL MISSION ---------------------------- */

export const MISSION = {
  label: 'SOCIAL MISSION',
  heading: 'Entrepreneurship for Everyone',
  paragraph: 'W3BB Worldwide is built with accessibility at its core.',
  supportTitle: 'We support:',
  support: [
    { title: 'Youth entrepreneurship', icon: 'graduation' as IconName },
    { title: 'Work-from-home creators', icon: 'home' as IconName },
    { title: 'Community business development', icon: 'building' as IconName },
    { title: 'Nonprofit funding models', icon: 'handshake' as IconName },
    { title: 'Multi-generational wealth building', icon: 'infinity' as IconName },
  ],
  closing:
    'Our platform makes business creation achievable for anyone — regardless of background, experience, or resources.',
};

/* ------------------------------- 9. THE ECONOMY ----------------------------- */

export const ECONOMY = {
  label: 'THE W3BB ECONOMY',
  heading: 'Three Powerful Revenue Streams',
  streams: [
    {
      n: '1',
      title: 'Business Creation',
      description: 'Users pay to build, mint, and generate assets.',
      icon: 'sparkles' as IconName,
    },
    {
      n: '2',
      title: 'Marketplace Royalties',
      description: 'Creators earn recurring royalties from bundle resales.',
      icon: 'coins' as IconName,
    },
    {
      n: '3',
      title: 'Enterprise Licensing',
      description: 'Organizations license W3BB tools and certification systems.',
      icon: 'landmark' as IconName,
    },
  ],
  closing: 'This creates a sustainable, multi-layered digital economy.',
};

/* -------------------------------- 10. WHY W3BB ------------------------------ */

export const WHY = {
  label: 'WHY W3BB',
  heading: 'A New Standard for Digital Entrepreneurship',
  paragraph: 'W3BB Worldwide is the first platform to combine:',
  pillars: [
    { title: 'AI creation', icon: 'sparkles' as IconName },
    { title: 'Blockchain verification', icon: 'link' as IconName },
    { title: 'Trust certification', icon: 'shield' as IconName },
    { title: 'Marketplace resale', icon: 'store' as IconName },
    { title: 'Multi-generational wealth architecture', icon: 'infinity' as IconName },
  ],
  emphasis: "It's not just a tool — it's an ecosystem.",
  flow: ['Built', 'Verified', 'Certified', 'Sold', 'Resold', 'Funded', 'Scaled'],
  closing: 'All in one seamless experience.',
};

/* ------------------------------- 11. FINAL CTA ------------------------------ */

export const FINAL_CTA = {
  lines: ['Build your business.', 'Mint your legacy.', 'Join the W3BB Worldwide economy.'],
  button: 'Start Creating Today',
  subline: 'Entrepreneurship, simplified. Legacy, amplified.',
};

/* -------------------------------- 12. CONTACT ------------------------------- */

export const CONTACT = {
  label: 'CONTACT',
  heading: 'Start the Conversation',
  paragraph:
    'Tell us what you want to build. Join the waitlist and our team will reach out with early access to the W3BB Worldwide platform.',
  interests: [
    'Building a business',
    'Buying a Franchise Bundle',
    'Enterprise & Organizations',
    'Trust Certification',
    'Partnership Inquiries',
    'Sponsorship Applications',
    'Press',
    'General Support',
  ],
  successTitle: "You're on the list.",
  successBody:
    "Thank you — your details are with the W3BB Worldwide team. We'll be in touch shortly with your next steps.",
};

/* --------------------------------- 13. FOOTER ------------------------------- */

export interface FooterLink {
  label: string;
  /** Anchor id on the homepage — scrolls there, jumping home first if needed. */
  id?: string;
  /** A real route — takes priority over `id` when both would apply. */
  to?: string;
}

export const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Platform',
    links: [
      { label: 'About', id: 'about' },
      { label: 'What You Can Build', id: 'build' },
      { label: 'Business Builder', id: 'builder' },
      { label: 'Sponsored Businesses', to: '/businesses' },
    ],
  },
  {
    title: 'Ecosystem',
    links: [
      { label: 'The Ecosystem', to: '/ecosystem' },
      { label: 'Marketplace', id: 'marketplace' },
      { label: 'Certification', id: 'certification' },
      { label: 'The W3BB Economy', id: 'economy' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Community', to: '/community' },
      { label: 'Resources', to: '/resources' },
      { label: 'Enterprise', id: 'enterprise' },
      { label: 'Social Mission', id: 'mission' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', id: 'contact' },
      { label: 'Choose Your Path', to: '/choose-your-path' },
      { label: 'Privacy Policy', to: '/privacy' },
    ],
  },
];

/* --------------------------------- IMAGERY ---------------------------------- */

export const IMAGES = {
  heroAura:
    'https://d38kszyerljeoa.cloudfront.net/posts/scb_bf9e3c4cfa65a677c023043d/f851838e3cd849dc.webp',
  orbField:
    'https://d38kszyerljeoa.cloudfront.net/posts/scb_bf9e3c4cfa65a677c023043d/053dea4d88d3402b.webp',
  ribbon:
    'https://d38kszyerljeoa.cloudfront.net/posts/scb_bf9e3c4cfa65a677c023043d/6ccb76a29b244757.webp',
};

export const SECTION_IDS = [
  'hero',
  'about',
  'businesses',
  'build',
  'builder',
  'marketplace',
  'certification',
  'enterprise',
  'mission',
  'economy',
  'why',
  'contact',
];
