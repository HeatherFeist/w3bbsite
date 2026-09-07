import { db } from '@/lib/db';
import type { CreateFranchiseBundleInput, FranchiseBundleRecord } from '@/types/franchiseBundle';

/**
 * Data access for Franchise Bundles (see src/types/franchiseBundle.ts and
 * supabase/schema.sql). Both calls go through SECURITY DEFINER RPCs — there
 * is no direct table access from the anon key, and no site-wide auth, so a
 * bundle's id is itself the unguessable link used to view it later.
 */

export async function createFranchiseBundle(input: CreateFranchiseBundleInput): Promise<string> {
  const { data, error } = await db.rpc('w3bb_create_franchise_bundle', {
    p_business_name: input.businessName.trim(),
    p_industry: input.industry,
    p_description: input.description.trim(),
    p_contact_name: input.contactName.trim(),
    p_contact_email: input.contactEmail.trim(),
    p_assets: input.assets
      .filter((asset) => asset.name.trim().length > 0)
      .map((asset) => ({
        name: asset.name.trim(),
        description: asset.description.trim(),
        cost: Number.isFinite(asset.cost) ? asset.cost : 0,
        currency: asset.currency || 'USD',
      })),
  });

  if (error) throw error;
  return data as string;
}

export async function getFranchiseBundle(bundleId: string): Promise<FranchiseBundleRecord | null> {
  const { data, error } = await db.rpc('w3bb_get_franchise_bundle', { p_id: bundleId });
  if (error) throw error;
  return (data as FranchiseBundleRecord | null) ?? null;
}
