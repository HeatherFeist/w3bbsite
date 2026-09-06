-- W3BB Worldwide lead-capture schema.
-- Recreates what every form on the site (Contact, Build, Certification,
-- Enterprise, Mint waitlist, all program applications, Community
-- volunteer signup) submits via useLeadCapture().

-- 1. Simple, flat record of every submission -- easy to browse/export.
create table if not exists public.w3bb_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  organization text,
  interest text not null,
  message text
);

-- 2. Richer "CRM" record -- includes phone/SMS opt-in/source/metadata
--    that individual forms attach (wallet address, plan selected, etc).
create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  name text,
  phone text,
  sms_opt_in boolean not null default false,
  source text,
  metadata jsonb not null default '{}'::jsonb
);

-- RPC the frontend calls for every submission. SECURITY DEFINER so the
-- public anon key can call it without needing direct table INSERT rights;
-- fixed search_path avoids the classic search_path-hijack risk on
-- SECURITY DEFINER functions.
create or replace function public.crm_submit_contact(
  p_email text,
  p_name text,
  p_phone text,
  p_sms_opt_in boolean,
  p_source text,
  p_metadata jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.crm_contacts (email, name, phone, sms_opt_in, source, metadata)
  values (p_email, p_name, p_phone, p_sms_opt_in, p_source, coalesce(p_metadata, '{}'::jsonb));
end;
$$;

-- Lock both tables down: the public anon key may INSERT only -- it can
-- never read back, edit, or delete anyone's submitted lead data.
alter table public.w3bb_enquiries enable row level security;
alter table public.crm_contacts enable row level security;

drop policy if exists "anon can insert enquiries" on public.w3bb_enquiries;
create policy "anon can insert enquiries"
  on public.w3bb_enquiries
  for insert
  to anon
  with check (true);

drop policy if exists "anon can insert crm_contacts" on public.crm_contacts;
create policy "anon can insert crm_contacts"
  on public.crm_contacts
  for insert
  to anon
  with check (true);

-- Let the anon role actually call the RPC.
grant execute on function public.crm_submit_contact(text, text, text, boolean, text, jsonb) to anon;

-- ---------------------------------------------------------------------------
-- Franchise Bundle loan-documentation data model
-- ---------------------------------------------------------------------------
-- A Franchise Bundle is a structured, presentable RECORD of a business's
-- real assets, their costs, and its operating plan -- built so an owner can
-- hand it to a bank/loan officer in support of a small-business loan
-- application. It is explicitly NOT an investment or security: it never
-- represents a claim on profits, an ownership percentage, or expected
-- appreciation. It may *eventually* be minted as a W3BBFranchiseBundle NFT
-- (see /contracts) once a business is certified, but this schema only models
-- the underlying data + presentation layer -- it does not perform or trigger
-- a mint.
--
-- There is no site-wide auth/account system (see useLeadCapture.ts / the
-- tables above), so a bundle's id doubles as its own unguessable share link:
-- anyone with the bundle id can read that ONE bundle back (to show a loan
-- officer), but nothing lets the anon key list or browse other people's
-- bundles. Every read and write goes through a SECURITY DEFINER RPC below
-- rather than a table-level RLS policy, specifically so a broad "anon can
-- select" policy is never on the table for data this sensitive (dollar
-- figures, business descriptions, contact emails).

create table if not exists public.w3bb_franchise_bundles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  business_name text not null,
  industry text not null,
  -- The operating plan / "what are you building" narrative. Extends the
  -- free-text description already collected on the Build page.
  description text not null default '',
  contact_name text not null,
  contact_email text not null,
  -- Whether this bundle has actually been minted as a Franchise Bundle NFT
  -- yet. Minting itself happens separately from /admin/mint -- this column
  -- just records the outcome once it happens, it never triggers it.
  status text not null default 'not_minted' check (status in ('not_minted', 'minted')),
  chain text,
  contract_address text,
  token_id numeric,
  constraint w3bb_franchise_bundles_minted_fields_check check (
    status = 'not_minted' or (chain is not null and contract_address is not null and token_id is not null)
  )
);

create table if not exists public.w3bb_franchise_bundle_assets (
  id uuid primary key default gen_random_uuid(),
  bundle_id uuid not null references public.w3bb_franchise_bundles (id) on delete cascade,
  position integer not null default 0,
  name text not null,
  description text not null default '',
  cost numeric(14, 2) not null check (cost >= 0),
  currency text not null default 'USD'
);

create index if not exists w3bb_franchise_bundle_assets_bundle_id_idx
  on public.w3bb_franchise_bundle_assets (bundle_id);

alter table public.w3bb_franchise_bundles enable row level security;
alter table public.w3bb_franchise_bundle_assets enable row level security;

-- No policies are granted to anon on either table directly -- both RPCs
-- below are SECURITY DEFINER and are the only way in or out.

-- Create a bundle + its itemized assets in one call from the Business
-- Builder flow. Returns the new bundle's id, which the frontend then uses
-- as the share link for the lender-presentation page
-- (/business-plan/:bundleId).
create or replace function public.w3bb_create_franchise_bundle(
  p_business_name text,
  p_industry text,
  p_description text,
  p_contact_name text,
  p_contact_email text,
  p_assets jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bundle_id uuid;
  v_asset jsonb;
  v_position integer := 0;
begin
  insert into public.w3bb_franchise_bundles (business_name, industry, description, contact_name, contact_email)
  values (p_business_name, p_industry, coalesce(p_description, ''), p_contact_name, p_contact_email)
  returning id into v_bundle_id;

  for v_asset in select * from jsonb_array_elements(coalesce(p_assets, '[]'::jsonb))
  loop
    insert into public.w3bb_franchise_bundle_assets (bundle_id, position, name, description, cost, currency)
    values (
      v_bundle_id,
      v_position,
      v_asset ->> 'name',
      coalesce(v_asset ->> 'description', ''),
      coalesce((v_asset ->> 'cost')::numeric, 0),
      coalesce(v_asset ->> 'currency', 'USD')
    );
    v_position := v_position + 1;
  end loop;

  return v_bundle_id;
end;
$$;

-- Read a single bundle + its assets + computed total asset value back, by
-- exact id only (used by the /business-plan/:bundleId lender view and by
-- the tokenURI metadata generator in src/lib/franchiseBundleMetadata.ts).
-- Returns null if the id doesn't exist -- never throws, so a bad/old link
-- just renders a "not found" state instead of leaking whether other ids
-- exist.
create or replace function public.w3bb_get_franchise_bundle(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_result jsonb;
begin
  select jsonb_build_object(
    'id', b.id,
    'createdAt', b.created_at,
    'businessName', b.business_name,
    'industry', b.industry,
    'description', b.description,
    'contactName', b.contact_name,
    'contactEmail', b.contact_email,
    'status', b.status,
    'chain', b.chain,
    'contractAddress', b.contract_address,
    'tokenId', b.token_id,
    'totalAssetValue', coalesce((
      select sum(a.cost) from public.w3bb_franchise_bundle_assets a where a.bundle_id = b.id
    ), 0),
    'currency', coalesce((
      select a.currency from public.w3bb_franchise_bundle_assets a where a.bundle_id = b.id limit 1
    ), 'USD'),
    'assets', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'name', a.name,
        'description', a.description,
        'cost', a.cost,
        'currency', a.currency
      ) order by a.position)
      from public.w3bb_franchise_bundle_assets a
      where a.bundle_id = b.id
    ), '[]'::jsonb)
  )
  into v_result
  from public.w3bb_franchise_bundles b
  where b.id = p_id;

  return v_result;
end;
$$;

grant execute on function public.w3bb_create_franchise_bundle(text, text, text, text, text, jsonb) to anon;
grant execute on function public.w3bb_get_franchise_bundle(uuid) to anon;
