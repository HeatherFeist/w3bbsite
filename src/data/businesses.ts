/**
 * The Sponsored Businesses Directory. Each entry gets a card in the
 * directory grid and its own profile page at /businesses/:slug.
 *
 * These are placeholder/"Coming Soon" profiles — real founder info,
 * services, descriptions, logos, and links go here once each business
 * provides them.
 */

export interface SponsoredBusiness {
  slug: string;
  name: string;
  tagline: string;
  /** Set true once W3BB Trust-Approved Certification is granted. */
  certified: boolean;
  /** Whether this business is backed by CDI. */
  supportedByCdi: boolean;
  /** Full profile content not published yet. */
  comingSoon: boolean;
}

export const SPONSORED_BUSINESSES: SponsoredBusiness[] = [
  {
    slug: 'whichcraft',
    name: 'WhichCraft',
    tagline: 'A crafting group membership organization.',
    certified: false,
    supportedByCdi: true,
    comingSoon: true,
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
  intro:
    'Every business on this page was built inside the W3BB ecosystem — supported by CDI, powered by the W3BB platform. Profiles are filled in as each business is ready to share theirs.',
  closingHeading: 'Building Something Inside the Ecosystem?',
  closingBody: 'Every sponsored business started with the Business Builder. Yours can too.',
};
