/**
 * Content for the /community page. Most sections here are "Coming Soon" —
 * real event dates, workshop schedules, and stories go here as they exist.
 */
import {
  CalendarDays,
  Users2,
  Palette,
  BookOpen,
  HandHeart,
  MessageSquareQuote,
  type LucideIcon,
} from 'lucide-react';
import { CDI_FULL_NAME } from '@/data/ecosystem';

export interface CommunitySection {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
}

export const COMMUNITY = {
  eyebrow: 'THE SOCIAL LAYER',
  heading: 'Community',
  sub: 'Where the people building inside W3BB Worldwide connect, learn, and support each other.',
  body: 'Beyond the platform, W3BB Worldwide is a community — creators, craftspeople, volunteers, and young entrepreneurs learning and growing together.',
  sections: [
    {
      icon: CalendarDays,
      title: 'Events',
      description: 'Live and virtual gatherings for the W3BB community. Details coming soon.',
    },
    {
      icon: Users2,
      title: 'Workshops',
      description: 'Hands-on sessions on building, branding, and launching a business. Schedule coming soon.',
    },
    {
      icon: Palette,
      title: 'Craft Groups',
      description: 'WhichCraft, our crafting group membership organization, lives here.',
      href: '/businesses/whichcraft',
      linkLabel: 'Visit WhichCraft',
    },
    {
      icon: BookOpen,
      title: 'Youth Reader Network',
      description: 'A youth development and literacy program connected to the W3BB ecosystem. Details coming soon.',
    },
    {
      icon: HandHeart,
      title: 'Volunteer Opportunities',
      description: `Ways to support entrepreneurs and community programs through CDI (${CDI_FULL_NAME}).`,
      href: '/community#volunteer',
      linkLabel: 'Volunteer with us',
    },
    {
      icon: MessageSquareQuote,
      title: 'Community Stories',
      description: 'Stories from the entrepreneurs and volunteers building inside W3BB. Coming soon.',
    },
  ] satisfies CommunitySection[],
  closingHeading: 'Want to Get Involved?',
  closingBody: 'Whether you want to volunteer, join a craft group, or just stay in the loop, tell us how you’d like to be part of the community.',
};
