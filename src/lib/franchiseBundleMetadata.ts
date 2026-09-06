import type { FranchiseBundleRecord } from '@/types/franchiseBundle';

/**
 * Builds the NFT metadata JSON a Franchise Bundle's tokenURI should point
 * to (the standard `name` / `description` / `image` / `attributes` shape
 * most marketplaces and wallets expect).
 *
 * This is a pure function, not a hosted endpoint — this site currently has
 * no serverless function / API route capability (no `functions/`, `api/`,
 * or similar directory; it builds as a static Vite site). Whichever hosting
 * option gets picked for tokenURI (a dynamic per-token API route, or a
 * static JSON file generated per bundle and pinned to IPFS) can import and
 * call this function directly rather than reimplementing the shape. See the
 * PR description for the two options and the tradeoffs.
 *
 * IMPORTANT — scope: a Franchise Bundle is a verified, structured business
 * plan and asset inventory, presented to a lender in support of a loan
 * application. It is NOT an investment or security. This metadata must
 * never claim or imply a profit share, ownership stake, or expected
 * appreciation — see the fixed disclaimer text below, which is deliberately
 * not configurable per bundle.
 */

const NOT_INVESTMENT_DISCLAIMER =
  'This token is a verified record of a business’s operating plan and itemized asset inventory, ' +
  'presented in support of a small-business loan application. It confers no ownership interest, ' +
  'profit share, or investment return, and is not a security.';

export interface FranchiseBundleMetadataAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'date';
}

export interface FranchiseBundleMetadata {
  name: string;
  description: string;
  /** Present only when the bundle has an associated image (e.g. a business logo). */
  image?: string;
  external_url: string;
  attributes: FranchiseBundleMetadataAttribute[];
}

export interface BuildFranchiseBundleMetadataOptions {
  /**
   * Base URL of the lender-presentation page, e.g.
   * "https://w3bbworldwide.com/business-plan". The bundle id is appended.
   */
  baseUrl: string;
  /** Optional image URL (e.g. a business logo) if the bundle has one. */
  image?: string;
}

/**
 * Pure function: given a fetched FranchiseBundleRecord (see
 * src/lib/franchiseBundle.ts), returns the JSON object a tokenURI for that
 * bundle should serve.
 */
export function buildFranchiseBundleMetadata(
  bundle: FranchiseBundleRecord,
  options: BuildFranchiseBundleMetadataOptions,
): FranchiseBundleMetadata {
  const externalUrl = `${options.baseUrl.replace(/\/$/, '')}/${bundle.id}`;

  const attributes: FranchiseBundleMetadataAttribute[] = [
    { trait_type: 'Record Type', value: 'Business Plan & Asset Inventory (Not an Investment)' },
    { trait_type: 'Industry', value: bundle.industry },
    {
      trait_type: `Total Asset Value (${bundle.currency})`,
      value: round2(bundle.totalAssetValue),
      display_type: 'number',
    },
    { trait_type: 'Itemized Asset Count', value: bundle.assets.length, display_type: 'number' },
    { trait_type: 'Verification Status', value: bundle.status === 'minted' ? 'Minted' : 'Not Yet Minted' },
  ];

  return {
    name: `${bundle.businessName} — Franchise Bundle`,
    description: `${bundle.description.trim() || 'No operating plan provided.'}\n\n${NOT_INVESTMENT_DISCLAIMER}`,
    ...(options.image ? { image: options.image } : {}),
    external_url: externalUrl,
    attributes,
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
