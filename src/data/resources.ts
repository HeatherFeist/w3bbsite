/**
 * Content for the /resources page. `library` entries are placeholder /
 * "Coming Soon" educational content. `growPrograms` links out to the
 * already-built partner and service pages, folded in here rather than
 * cluttering primary nav.
 */
import {
  BookOpen,
  LayoutTemplate,
  Cpu,
  ClipboardList,
  HandCoins,
  Scale,
  Palette,
  Rocket,
  Sprout,
  Handshake,
  Share2,
  Briefcase,
  MapPin,
  type LucideIcon,
} from 'lucide-react';

export interface ResourceCategory {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface GrowProgram {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
}

export const RESOURCES = {
  eyebrow: 'TOOLS & EDUCATION',
  heading: 'Resources',
  sub: 'Everything you need to learn, plan, and grow — beyond the Business Builder itself.',
  libraryHeading: 'The Resource Library',
  libraryIntro: 'Guides, templates, and tools for every stage of building a business. New resources are added regularly.',
  library: [
    { icon: BookOpen, title: 'Guides', description: 'Step-by-step walkthroughs for every part of starting a business. Coming soon.' },
    { icon: LayoutTemplate, title: 'Templates', description: 'Ready-to-use documents, plans, and layouts. Coming soon.' },
    { icon: Cpu, title: 'AI Tools', description: 'AI-powered tools to help you build faster. Coming soon.' },
    { icon: ClipboardList, title: 'Business Playbooks', description: 'Proven playbooks for common business models. Coming soon.' },
    { icon: HandCoins, title: 'Funding Resources', description: 'Grants, funding paths, and financial resources. Coming soon.' },
    { icon: Scale, title: 'Legal Basics', description: 'Plain-language guidance on business structure and compliance. Coming soon.' },
    { icon: Palette, title: 'Branding Kits', description: 'Starter kits to build a professional brand identity. Coming soon.' },
  ] satisfies ResourceCategory[],
  growHeading: 'Grow & Partner With Us',
  growIntro: 'Existing programs for entrepreneurs, agencies, affiliates, and international sellers — live today.',
  growPrograms: [
    { icon: Rocket, title: 'Entrepreneur Launchpad', description: 'Start your business from zero — no capital, no LLC, no barriers.', to: '/launchpad' },
    { icon: Sprout, title: 'Zero-Dollar Startup Path', description: 'Our signature method for launching with no money and no risk.', to: '/zero-dollar-startup' },
    { icon: Handshake, title: 'Agency Partner Program', description: 'Exclusive tools, referrals, and commissions through our GoDaddy partnership.', to: '/agency-partner-program' },
    { icon: Share2, title: 'Affiliate Partnership Program', description: 'Earn recurring commissions referring entrepreneurs to W3BB.', to: '/affiliate-program' },
    { icon: Briefcase, title: 'Business Services', description: 'Professional branding, websites, and digital solutions from Constructive Design LLC.', to: '/business-services' },
    { icon: MapPin, title: 'U.S. Business Partner Services', description: 'A U.S. mailing address and back-office support for global sellers.', to: '/partner-services' },
  ] satisfies GrowProgram[],
};
