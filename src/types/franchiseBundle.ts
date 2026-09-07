/**
 * A Franchise Bundle is a structured, presentable RECORD of a business's
 * real assets, their costs, and its operating plan — built so an owner can
 * hand it to a bank/loan officer in support of a small-business loan
 * application.
 *
 * It is explicitly NOT an investment or security: it never represents a
 * claim on profits, an ownership percentage, or expected appreciation. It
 * may eventually back a W3BBFranchiseBundle NFT mint once a business is
 * certified (see /contracts and /admin/mint), but nothing here performs or
 * triggers that mint — this is only the data + presentation layer.
 */

export interface FranchiseBundleAssetInput {
  name: string;
  description: string;
  /** Numeric cost/valuation for this single asset. */
  cost: number;
  /** ISO 4217 currency code, e.g. "USD". */
  currency: string;
}

export interface FranchiseBundleAsset extends FranchiseBundleAssetInput {
  id: string;
}

export type FranchiseBundleStatus = 'not_minted' | 'minted';

export interface FranchiseBundleRecord {
  id: string;
  createdAt: string;
  businessName: string;
  industry: string;
  /** The operating plan / business description narrative. */
  description: string;
  contactName: string;
  contactEmail: string;
  /** Whether this bundle has been minted as a Franchise Bundle NFT yet. */
  status: FranchiseBundleStatus;
  chain: string | null;
  contractAddress: string | null;
  tokenId: string | null;
  assets: FranchiseBundleAsset[];
  /** Sum of every itemized asset's cost. */
  totalAssetValue: number;
  /** Currency used for totalAssetValue (assumes a single currency across assets). */
  currency: string;
}

export interface CreateFranchiseBundleInput {
  businessName: string;
  industry: string;
  description: string;
  contactName: string;
  contactEmail: string;
  assets: FranchiseBundleAssetInput[];
}
