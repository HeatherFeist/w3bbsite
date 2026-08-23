/**
 * The Sponsored Businesses Directory. Each entry gets a card in the
 * directory grid and its own profile page at /businesses/:slug.
 *
 * These are placeholder/"Coming Soon" profiles — real founder info,
 * services, descriptions, logos, and links go here once each business
 * provides them.
 */
import { CDI_FULL_NAME } from '@/data/ecosystem';

export interface SponsoredBusiness {
  slug: string;
  name: string;
  tagline: string;
  /** Set true once W3BB Trust-Approved Certification is granted. */
  certified: boolean;
  /** Whether this business is backed by CDI (Constructive Designs Inc.). */
  supportedByCdi: boolean;
  /** Full profile content not published yet. */
  comingSoon: boolean;
  /** The business's own live site, if it has one. When set, directory/home
   *  cards link straight there instead of the internal placeholder profile. */
  website?: string;
}

export const SPONSORED_BUSINESSES: SponsoredBusiness[] = [
  {
    slug: 'whichcraft',
    name: 'WhichCraft',
    tagline: 'A crafting group membership organization.',
    certified: false,
    supportedByCdi: true,
    comingSoon: true,
    website: 'https://whichcraft.shop',
  },
  {
    slug: 'webb-catchers-llc',
    name: "Webb Catcher's LLC",
    tagline: 'Full profile coming soon.',
    certified: false,
    supportedByCdi: true,
    comingSoon: true,
  },
];

export const BUSINESS_DIRECTORY = {
  label: 'THE W3BB NETWORK',
  heading: 'Sponsored Businesses',
  intro: `Every business on this page was built inside the W3BB ecosystem — supported by CDI (${CDI_FULL_NAME}), powered by the W3BB platform. Profiles are filled in as each business is ready to share theirs.`,
  closingHeading: 'Building Something Inside the Ecosystem?',
  closingBody: 'Every sponsored business started with the Business Builder. Yours can too.',
};
