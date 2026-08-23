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
