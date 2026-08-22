/**
 * Content for the U.S. Business Partner Services line and its Programs —
 * ported from the W3BB-Worldwide-Commercial-Partnerships static site into
 * this app's design system. Icons are stored as components (not string
 * names) since these grids are page-specific and not reused elsewhere.
 */
import {
  MapPin,
  Headset,
  PackageCheck,
  ShieldCheck,
  Palette,
  FileCheck2,
  Rocket,
  Sprout,
  Handshake,
  Share2,
  Layers,
  Briefcase,
  Percent,
  Server,
  LifeBuoy,
  GraduationCap,
  UsersRound,
  LayoutTemplate,
  Monitor,
  Building2,
  Scale,
  CreditCard,
  TrendingUp,
  Sparkles,
  HandHeart,
  Map,
  Package,
  Users,
  Network,
  LayoutDashboard,
  Megaphone,
  Repeat,
  Zap,
  Video,
  Target,
  Star,
  HeartHandshake,
  Store,
  Lightbulb,
  Puzzle,
  Workflow,
  Compass,
  Check,
  type LucideIcon,
} from 'lucide-react';

export interface IconCard {
  icon: LucideIcon;
  title: string;
}

export const PROGRAMS = [
  {
    to: '/launchpad',
    icon: Rocket,
    title: 'Entrepreneur Launchpad',
    description: 'A nonprofit-powered pathway to start your business from zero — no capital, no LLC, no barriers.',
  },
  {
    to: '/zero-dollar-startup',
    icon: Sprout,
    title: 'Zero-Dollar Startup Path',
    description: 'Our signature method for launching a real business with no money, no LLC, and no risk.',
  },
  {
    to: '/agency-partner-program',
    icon: Handshake,
    title: 'Agency Partner Program',
    description: 'Exclusive tools, referrals, and commissions through our partnership with GoDaddy.',
  },
  {
    to: '/affiliate-program',
    icon: Share2,
    title: 'Affiliate Partnership Program',
    description: 'Earn recurring commissions by referring entrepreneurs and businesses to W3BB Worldwide.',
  },
  {
    to: '/mint',
    icon: Layers,
    title: 'Franchise Bundle System',
    description: 'Package your business into a digital, duplicatable model and earn royalties.',
  },
  {
    to: '/business-services',
    icon: Briefcase,
    title: 'Business Services',
    description: 'Professional branding, websites, and digital solutions from Constructive Design LLC.',
  },
] as const;

export const PARTNER_SERVICES = {
  eyebrow: 'A U.S. GATEWAY FOR GLOBAL SELLERS',
  heading: 'Your U.S. Presence, Powered by W3BB Worldwide',
  body: 'A U.S. mailing address, U.S.-based customer support, returns handling, and marketplace compliance guidance — so you can sell to American customers without opening a U.S. office.',
  disclosure:
    'W3BB Worldwide is an independent U.S. service provider operating under a written service agreement with each client. We represent our own business — not yours — and disclose our role as your back-office partner in every interaction we handle on your behalf.',
  whatWeDo: [
    { icon: MapPin, title: 'U.S. Mailing Address', description: 'A registered commercial mailing address for mail and package receipt, with forwarding handled on your schedule.' },
    { icon: Headset, title: 'U.S.-Based Customer Support', description: 'A dedicated support inbox staffed in U.S. business hours, using response templates approved by you.' },
    { icon: PackageCheck, title: 'Returns Handling', description: 'Returned packages are received, inspected, and forwarded or disposed of per your written instructions.' },
    { icon: ShieldCheck, title: 'Marketplace Compliance Guidance', description: 'Help understanding Amazon, Etsy, and Shopify seller policies, shipping-policy requirements, and disclosure rules.' },
    { icon: Palette, title: 'Brand & Storefront Support', description: 'Guidance on product descriptions, storefront layout, and presentation for U.S. shoppers.' },
    { icon: FileCheck2, title: 'Written Service Agreement', description: 'Every engagement runs on a clear contract defining scope, fees, responsibilities, and termination terms.' },
  ] as { icon: LucideIcon; title: string; description: string }[],
  packages: [
    {
      name: 'U.S. Address Only',
      tagline: 'Perfect for small sellers getting started.',
      price: '$49',
      suffix: '/mo',
      features: ['Use of U.S. business mailing address', 'Mail forwarding', 'Basic compliance guidance'],
      tone: 'default' as const,
    },
    {
      name: 'U.S. Business Partner',
      tagline: 'Our most popular tier for active sellers.',
      price: '$99',
      suffix: '/mo',
      features: [
        'U.S. mailing address',
        'Returns handling',
        'Dedicated customer support inbox',
        'Brand representation support',
        'Marketplace compliance guidance',
      ],
      tone: 'featured' as const,
    },
    {
      name: 'Full U.S. Presence',
      tagline: 'End-to-end support for growing brands.',
      price: '$199',
      suffix: '/mo + 5% of sales',
      features: [
        'Everything in Business Partner',
        'Storefront setup (Shopify, Etsy, Amazon)',
        'Branding support',
        'Marketing guidance',
        'Full compliance support',
      ],
      tone: 'gold' as const,
    },
  ],
  packagesFootnote: "All packages require a signed service agreement. Pricing subject to change with 30 days' notice.",
  howItWorks: [
    { n: '1', title: 'Sign the Agreement', description: 'Tell us about your business, products, and country. Sign the service agreement and choose a plan.' },
    { n: '2', title: 'Get Your U.S. Address', description: 'We assign your commercial mailing address and set up your dedicated support inbox.' },
    { n: '3', title: 'We Handle the U.S. Side', description: 'Mail, returns, and customer messages are managed using the templates and instructions you approve.' },
    { n: '4', title: 'Scale Up', description: 'Upgrade your plan as volume grows, or add storefront and branding support.' },
  ],
  faq: [
    {
      q: 'Will my business appear to be U.S.-based?',
      a: "No. We provide a real U.S. mailing address and U.S.-based support for your operations — we do not represent your business as American-owned or located in the U.S. if it isn't. Marketplace and consumer-disclosure rules require accurate seller information, and we help you stay compliant with them, not work around them.",
    },
    {
      q: 'Do you handle my payments or hold my funds?',
      a: 'No. You keep your own payment processor and bank account. We never take custody of your sales proceeds.',
    },
    {
      q: "What products or sellers can't you work with?",
      a: "We don't work with counterfeit goods, weapons, drugs, or other high-risk or unlawful categories, and we vet every client before signing an agreement.",
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes. Either party can terminate per the notice terms in the service agreement.',
    },
  ],
};

export const LAUNCHPAD = {
  eyebrow: 'A NONPROFIT PROGRAM',
  heading: 'Entrepreneur Launchpad',
  sub: 'Start your business from zero — no capital, no LLC, no barriers.',
  body: "The W3BB Entrepreneur Launchpad is a nonprofit-powered pathway designed for creators, dreamers, and innovators who are ready to build a real business but don't yet have the resources to get started. This program gives you the tools, training, and support you need to launch your business with no upfront cost.",
  ctaLabel: 'Join the Launchpad',
  whoFor: [
    { icon: Sparkles, title: 'First-time entrepreneurs' },
    { icon: Palette, title: 'Creatives and freelancers' },
    { icon: HandHeart, title: 'Individuals with limited resources' },
    { icon: Compass, title: "Anyone who wants to start a business but doesn't know where to begin" },
  ] as IconCard[],
  whatYouGet: [
    { icon: Map, title: 'Step-by-step "Start From Zero" roadmap' },
    { icon: FileCheck2, title: 'Free EIN guidance' },
    { icon: Building2, title: 'Free business structure education' },
    { icon: LayoutTemplate, title: 'Website + branding starter templates' },
    { icon: Package, title: 'Digital product creation tools' },
    { icon: Users, title: 'Mentorship and community support' },
    { icon: Network, title: 'Access to W3BB Worldwide business systems' },
  ] as IconCard[],
  steps: [
    'Join the Launchpad',
    'Learn the Fundamentals',
    'Build Your First Offer',
    'Start Earning Revenue',
    'Transition Into Your Own LLC',
    'Graduate Into the W3BB Ecosystem',
  ],
  closingHeading: 'Your Future Starts Here',
  closingBody: "You don't need money to start a business — you need a pathway. This is that pathway.",
};

export const ZERO_DOLLAR = {
  eyebrow: 'THE W3BB SIGNATURE METHOD',
  heading: 'Zero-Dollar Startup Path',
  sub: 'Launch a real business with no money, no LLC, and no risk.',
  body: 'This is the W3BB signature method — a fully guided process that shows you how to start earning income before you spend a single dollar on business formation.',
  ctaLabel: 'Get Started',
  whatYoullLearn: [
    { icon: Scale, title: 'How to operate legally as a sole proprietor' },
    { icon: FileCheck2, title: 'How to get a free EIN' },
    { icon: CreditCard, title: 'How to set up Stripe without an LLC' },
    { icon: Package, title: 'How to create your first digital product or service' },
    { icon: TrendingUp, title: 'How to start earning revenue immediately' },
    { icon: Building2, title: "How to transition into an LLC when you're ready" },
  ] as IconCard[],
  startWith: ['Your skills', 'Your creativity', 'Your drive', 'Our tools'],
  closingHeading: 'This Is the Most Accessible Path to Entrepreneurship',
  closingBody: 'No gatekeeping. No barriers. Just momentum.',
};

export const AGENCY_PARTNER = {
  eyebrow: 'POWERED BY GODADDY',
  heading: 'Agency Partner Program',
  sub: 'Unlock exclusive tools, referrals, and commissions through our partnership with GoDaddy.',
  body: 'W3BB Worldwide is an approved participant in the GoDaddy Agency Partner Program — giving our entrepreneurs and partners access to powerful tools, support, and opportunities.',
  ctaLabel: 'Become a Partner',
  whatItMeans: [
    { icon: Percent, title: 'Up to 20% commissions on client purchases', featured: true },
    { icon: Server, title: 'Free Managed WordPress hosting credits' },
    { icon: LifeBuoy, title: 'WordPress Premium Support' },
    { icon: GraduationCap, title: 'Sales enablement and training' },
    { icon: Headset, title: "Access to GoDaddy's Agency Success Team" },
    { icon: UsersRound, title: 'Potential client referrals from GoDaddy' },
  ] as (IconCard & { featured?: boolean })[],
  whoFor: [
    { icon: LayoutTemplate, title: 'Web designers' },
    { icon: Monitor, title: 'Digital service providers' },
    { icon: Building2, title: 'Agencies' },
    { icon: Briefcase, title: 'Freelancers' },
    { icon: Rocket, title: 'Entrepreneurs building online businesses' },
  ] as IconCard[],
  closingHeading: 'Why This Matters',
  closingBody: 'You gain access to enterprise-level tools and support — without enterprise-level costs. This partnership strengthens your business, your services, and your earning potential.',
};

export const AFFILIATE = {
  eyebrow: 'EARN WHILE YOU SHARE',
  heading: 'Affiliate Partnership Program',
  sub: 'Earn income by sharing W3BB Worldwide tools, products, and opportunities.',
  body: 'Our Affiliate Partnership Program allows you to earn commissions by referring entrepreneurs, creators, and businesses to W3BB Worldwide.',
  ctaLabel: 'Become an Affiliate',
  whatYouGet: [
    { icon: LayoutDashboard, title: 'Custom affiliate dashboard' },
    { icon: Megaphone, title: 'High-converting marketing materials' },
    { icon: Repeat, title: 'Recurring commissions' },
    { icon: Zap, title: 'Priority access to new products' },
    { icon: GraduationCap, title: 'Exclusive partner training' },
  ] as IconCard[],
  whoFor: [
    { icon: Video, title: 'Content creators' },
    { icon: Target, title: 'Coaches' },
    { icon: Star, title: 'Influencers' },
    { icon: Users, title: 'Community leaders' },
    { icon: HeartHandshake, title: 'Anyone who wants to earn income by sharing value' },
  ] as IconCard[],
  closingHeading: 'Your Network Becomes Your Income Stream',
  closingBody: 'Help others build their business — and get rewarded for it.',
};

export const BUSINESS_SERVICES = {
  eyebrow: 'CONSTRUCTIVE DESIGN LLC',
  heading: 'Business Services',
  sub: 'Professional branding, websites, and digital solutions for entrepreneurs and organizations.',
  body: 'Constructive Design LLC is the for-profit creative and development arm of W3BB Worldwide — offering premium services for businesses ready to grow.',
  disclosure:
    'Constructive Design LLC is a separate for-profit entity from CDI (Constructive Designs Inc.), the nonprofit arm of W3BB Worldwide.',
  ctaLabel: 'Start a Project',
  services: [
    {
      slug: 'website-design',
      icon: LayoutTemplate,
      title: 'Website design & development',
      description:
        'Custom, conversion-focused websites built to represent your brand and turn visitors into customers — not another generic template.',
      highlights: [
        'Custom design, not a generic template',
        'Mobile-first, fast-loading builds',
        'E-commerce and booking integrations',
        'Ongoing maintenance available',
      ],
    },
    {
      slug: 'branding',
      icon: Palette,
      title: 'Branding & identity systems',
      description:
        'A cohesive visual identity — logo, color palette, typography, and brand guidelines — so your business looks professional everywhere it shows up.',
      highlights: [
        'Logo design and brand mark',
        'Color palette and typography system',
        'Brand guidelines document',
        'Social and print-ready assets',
      ],
    },
    {
      slug: 'digital-products',
      icon: Package,
      title: 'Digital product creation',
      description:
        'From ebooks and courses to templates and software, we help you package your expertise into a sellable digital product.',
      highlights: [
        'Product strategy and structure',
        'Design and content production',
        'Delivery and payment setup',
        'Launch-ready packaging',
      ],
    },
    {
      slug: 'automation',
      icon: Workflow,
      title: 'Business automation',
      description:
        "Streamline the repetitive parts of running your business — onboarding, invoicing, follow-ups — with systems that work while you don't.",
      highlights: [
        'Workflow mapping and audit',
        'CRM and email automation setup',
        'Integrations between your existing tools',
        'Documentation and training',
      ],
    },
    {
      slug: 'marketing-systems',
      icon: Megaphone,
      title: 'Marketing systems',
      description:
        'Repeatable marketing infrastructure — funnels, email sequences, content systems — built to bring in customers on a schedule, not by chance.',
      highlights: [
        'Funnel and landing page builds',
        'Email/SMS sequence setup',
        'Content and campaign planning',
        'Analytics and tracking setup',
      ],
    },
    {
      slug: 'consulting',
      icon: Lightbulb,
      title: 'Consulting & strategy',
      description:
        'One-on-one strategic guidance to help you make the right calls on positioning, offers, and growth before you spend time or money building the wrong thing.',
      highlights: [
        'Business and offer strategy sessions',
        'Positioning and pricing guidance',
        'Growth roadmap development',
        'Ongoing advisory available',
      ],
    },
    {
      slug: 'custom-solutions',
      icon: Puzzle,
      title: 'Custom solutions',
      description:
        "Have something that doesn't fit a neat category? We scope and build custom tools and systems tailored to exactly what your business needs.",
      highlights: [
        'Discovery and scoping session',
        'Custom-built to your requirements',
        'Integration with existing systems',
        'Direct collaboration with our team',
      ],
    },
  ] as (IconCard & { slug: string; description: string; highlights: string[] })[],
  whoWeServe: [
    { icon: Rocket, title: 'Startups' },
    { icon: Store, title: 'Small businesses' },
    { icon: Palette, title: 'Creators' },
    { icon: HandHeart, title: 'Nonprofits' },
    { icon: Building2, title: 'Agencies' },
    { icon: Users, title: 'Entrepreneurs' },
  ] as IconCard[],
  closingHeading: 'Your Vision, Built Professionally',
  closingBody: "Whether you're launching or scaling, we bring your ideas to life with clarity, precision, and creativity.",
};

export const CHOOSE_YOUR_PATH = {
  eyebrow: 'FIND YOUR STARTING POINT',
  heading: 'Choose Your Path',
  sub: 'Every entrepreneur starts somewhere. Choose the path that fits your journey.',
  body: 'W3BB Worldwide offers multiple pathways depending on where you are and where you want to go.',
  paths: [
    {
      n: '1',
      title: 'Start From Zero',
      description: 'For beginners with no money and no LLC.',
      items: ['Learn the basics', 'Build your first offer', 'Start earning immediately'],
      cta: 'Zero-Dollar Startup Path',
      to: '/zero-dollar-startup',
      tone: 'default' as const,
    },
    {
      n: '2',
      title: 'Build Your Business',
      description: 'For entrepreneurs ready to grow.',
      items: ['Branding', 'Website', 'Digital products', 'Automation'],
      cta: 'Business Services',
      to: '/business-services',
      tone: 'default' as const,
    },
    {
      n: '3',
      title: 'Become a Partner',
      description: 'For agencies, freelancers, and collaborators.',
      items: ['GoDaddy Agency Program', 'W3BB Affiliate Program', 'Commercial Partnerships'],
      cta: 'Explore Partnerships',
      to: '/agency-partner-program',
      tone: 'gold' as const,
    },
    {
      n: '4',
      title: 'Franchise Your Business',
      description: 'For entrepreneurs ready to scale.',
      items: ['Package your business', 'List it in the marketplace', 'Earn royalties'],
      cta: 'Franchise Bundle System',
      to: '/mint',
      tone: 'gold' as const,
    },
  ],
  closingHeading: 'Your Path Is Yours — We Just Help You Walk It',
  closingBody: "Wherever you're starting, W3BB Worldwide has a place for you.",
};

export { Check };
