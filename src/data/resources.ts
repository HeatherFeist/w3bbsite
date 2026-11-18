/**
 * Content for the /resources page. Library cards link to tools that
 * already exist. A card without `to` is not published yet — do not invent
 * a destination for it. `growPrograms` links to the partner and service pages.
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
  Compass,
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
  /** Existing route. Omit when the resource is not published yet. */
  to?: string;
  linkLabel?: string;
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
  libraryIntro: 'These open the guides, plans, and tools already on the site. A card without a link is not published yet.',
  library: [
    {
      icon: BookOpen,
      title: 'Guides',
      description: 'The Business Builder walks through naming, the offer, assets, customers, operations, and launch. Each step has its own page.',
      to: '/build',
      linkLabel: 'Open the builder',
    },
    {
      icon: LayoutTemplate,
      title: 'Templates',
      description: 'The blueprint turns an assessment into a written plan, a 90-day outline, and a launch checklist.',
      to: '/launch/blueprint',
      linkLabel: 'Open the blueprint',
    },
    {
      icon: Cpu,
      title: 'AI Tools',
      description: 'After the assessment, Launch With AI writes a name, landing copy, a campaign, a plan, and a funding draft. The coach is still there if you want to talk it through.',
      to: '/launch/with-ai',
      linkLabel: 'Open Launch With AI',
    },
    {
      icon: ClipboardList,
      title: 'Business Playbooks',
      description: 'After the assessment, the rules engine ranks business models already in the catalog. You choose which one to build.',
      to: '/launch/matches',
      linkLabel: 'See model matches',
    },
    {
      icon: HandCoins,
      title: 'Funding Resources',
      description: 'Practice matching against sample funding records. These are not live grants, and they have no award amounts or deadlines.',
      to: '/launch/funding',
      linkLabel: 'Open the funding hub',
    },
    {
      icon: Scale,
      title: 'Legal Basics',
      description: 'Plain-language guidance on business structure is not published here yet.',
    },
    {
      icon: Palette,
      title: 'Branding Kits',
      description: 'Start a brand kit in the builder: color, type, and a visual system that stays consistent.',
      to: '/build/brand-kit',
      linkLabel: 'Start a brand kit',
    },
  ] satisfies ResourceCategory[],
  growHeading: 'Grow & Partner With Us',
  growIntro: 'Existing programs for entrepreneurs, agencies, affiliates, and international sellers — live today.',
  growPrograms: [
    { icon: Compass, title: 'Founder Launch Platform', description: 'Take the assessment, match a model, and carry a blueprint into the Business Builder.', to: '/launch' },
    { icon: Rocket, title: 'Entrepreneur Launchpad', description: 'Start your business from zero — no capital, no LLC, no barriers.', to: '/launchpad' },
    { icon: Sprout, title: 'Zero-Dollar Startup Path', description: 'Our signature method for launching with no money and no risk.', to: '/zero-dollar-startup' },
    { icon: Handshake, title: 'Agency Partner Program', description: 'Exclusive tools, referrals, and commissions through our GoDaddy partnership.', to: '/agency-partner-program' },
    { icon: Share2, title: 'Affiliate Partnership Program', description: 'Earn recurring commissions referring entrepreneurs to W3BB.', to: '/affiliate-program' },
    { icon: Briefcase, title: 'Business Services', description: 'Professional branding, websites, and digital solutions from Constructive Design LLC.', to: '/business-services' },
    { icon: MapPin, title: 'U.S. Business Partner Services', description: 'A U.S. mailing address and back-office support for global sellers.', to: '/partner-services' },
  ] satisfies GrowProgram[],
};
