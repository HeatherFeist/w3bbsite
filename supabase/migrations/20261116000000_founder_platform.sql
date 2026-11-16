-- Founder Launch Platform.
-- Additive only. Does not change w3bb_enquiries, crm_contacts, or franchise tables.
-- The browser restores a founder from founders.snapshot and rewrites the
-- normalized tables below on each save so they can be queried directly.
-- Run this in the Supabase project whose URL and anon key are set as
-- VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.

create or replace function public.founder_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.founders (
  user_id uuid primary key references auth.users (id) on delete cascade,
  location text,
  org_type text,
  image_url text,
  video_url text,
  story text,
  skills text[] not null default '{}',
  interests text[] not null default '{}',
  ventures jsonb not null default '[]'::jsonb,
  milestones jsonb not null default '[]'::jsonb,
  achievements text[] not null default '{}',
  credibility_score integer not null default 0 check (credibility_score between 0 and 100),
  xp integer not null default 0 check (xp >= 0),
  level_key text not null default 'explorer',
  snapshot jsonb,
  state_updated_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  status text not null default 'in_progress' check (status in ('in_progress', 'complete')),
  step integer not null default 0 check (step >= 0),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assessment_answers (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_key text not null,
  answer jsonb not null,
  unique (assessment_id, question_key)
);

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  assessment_id uuid references public.assessments (id) on delete set null,
  founder_readiness integer not null check (founder_readiness between 0 and 100),
  business_launch integer not null check (business_launch between 0 and 100),
  funding_readiness integer not null check (funding_readiness between 0 and 100),
  breakdown jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.archetypes (
  user_id uuid primary key references auth.users (id) on delete cascade,
  archetype_key text not null,
  name text not null,
  summary text not null,
  rationale jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.business_matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  model_key text not null,
  match_score integer not null check (match_score between 0 and 100),
  payload jsonb not null,
  selected boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, model_key)
);

create table if not exists public.blueprints (
  user_id uuid primary key references auth.users (id) on delete cascade,
  model_key text,
  title text,
  payload jsonb not null,
  source text not null default 'rules' check (source in ('rules', 'ai')),
  updated_at timestamptz not null default now()
);

create table if not exists public.coach_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  title text not null default 'Launch Coach',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.coach_conversations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.coach_memory (
  user_id uuid primary key references auth.users (id) on delete cascade,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id text not null,
  title text not null,
  done boolean not null default false,
  href text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, client_id)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id text not null,
  title text not null,
  week_of date,
  done boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, client_id)
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id text not null,
  title text not null,
  note text,
  target_date date,
  kind text not null default 'recorded',
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  unique (user_id, client_id)
);

create table if not exists public.certifications (
  id text primary key,
  name text not null,
  summary text not null,
  modules jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0
);

create table if not exists public.certification_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  certification_id text not null references public.certifications (id),
  modules jsonb not null default '{}'::jsonb,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, certification_id)
);

create table if not exists public.funding_opportunities (
  id text primary key,
  name text not null,
  summary text not null,
  is_sample boolean not null default true,
  industries text[] not null default '{}',
  locations text[] not null default '{}',
  business_types text[] not null default '{}',
  stages text[] not null default '{}',
  revenue_goals text[] not null default '{}',
  org_types text[] not null default '{}',
  amount_label text not null,
  deadline_label text not null
);

create table if not exists public.funding_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id text not null,
  opportunity_id text not null references public.funding_opportunities (id),
  status text not null default 'preparing',
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, client_id)
);

create table if not exists public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id text not null,
  xp integer not null check (xp >= 0),
  reason text not null,
  created_at timestamptz not null default now(),
  unique (user_id, client_id)
);

create table if not exists public.badges (
  id text primary key,
  name text not null,
  detail text not null
);

create table if not exists public.founder_badges (
  user_id uuid not null references auth.users (id) on delete cascade,
  badge_id text not null references public.badges (id),
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

insert into public.certifications (id, name, summary, modules, sort_order) values
  ('business-foundations', 'Business Foundations', 'New learning track. Prepares a founder for the Business Builder. Not an existing W3BB course.', '[{"id":"offer","label":"Write the offer in one sentence"},{"id":"customer","label":"Name the customer and the problem"},{"id":"earn","label":"Choose how the business earns"}]'::jsonb, 1),
  ('ai-entrepreneurship', 'AI Entrepreneurship', 'New learning track for using AI inside a real offer.', '[{"id":"use","label":"Name one task AI will do and one task you will keep"},{"id":"offer","label":"Describe the customer result, not the model"},{"id":"review","label":"Decide how you will check the work before a customer sees it"}]'::jsonb, 2),
  ('sales-marketing', 'Sales & Marketing', 'New learning track for one channel and one ask.', '[{"id":"channel","label":"Pick one channel you will actually use"},{"id":"proof","label":"Write the proof you can show today"},{"id":"ask","label":"Write the sentence you will use to invite a customer"}]'::jsonb, 3),
  ('operations', 'Operations', 'New learning track for a weekly delivery rhythm.', '[{"id":"delivery","label":"List the steps from yes to delivered"},{"id":"week","label":"Block the weekly operating hour"},{"id":"handoff","label":"Note what the Business Builder still needs to capture"}]'::jsonb, 4),
  ('financial-literacy', 'Financial Literacy', 'New learning track for price, costs, and records.', '[{"id":"price","label":"Price the offer in time as well as money"},{"id":"costs","label":"List the costs you already know"},{"id":"records","label":"Choose where payments and expenses will be written down"}]'::jsonb, 5),
  ('business-technology', 'Business Technology', 'New learning track for the smallest useful stack.', '[{"id":"stack","label":"Write the tools you will use in the first 90 days"},{"id":"account","label":"Decide who owns each account"},{"id":"backup","label":"Note where the blueprint and customer list live"}]'::jsonb, 6),
  ('startup-launch-readiness', 'Startup Launch Readiness', 'New learning track before a founder considers Trust-Approved Certification.', '[{"id":"builder","label":"Move the plan into the Business Builder"},{"id":"proof","label":"Collect one piece of real-world proof"},{"id":"capstone","label":"Read the Trust Certification page and decide if you are ready to apply"}]'::jsonb, 7)
on conflict (id) do nothing;

insert into public.badges (id, name, detail) values
  ('assessment_done', 'Assessment complete', 'Finished the Founder Discovery Assessment.'),
  ('blueprint_created', 'Blueprint created', 'Saved a business blueprint.'),
  ('profile_complete', 'Profile complete', 'Filled in the founder profile.'),
  ('pathway_complete', 'Certification pathway earned', 'Finished a learning pathway. This is not the Trust-Approved badge.')
on conflict (id) do nothing;

insert into public.funding_opportunities (
  id, name, summary, is_sample, industries, locations, business_types, stages, revenue_goals, org_types, amount_label, deadline_label
) values
  ('sample-community-start', 'Sample: Community start support', 'Illustrative record for a neighborhood or education program. Not a live grant.', true, array['community','education'], array['local','hybrid'], array['nonprofit','local_service'], array['idea','pre-revenue'], array['explore','side_income'], array['nonprofit','individual'], 'Not a real amount — sample record', 'No deadline — sample record'),
  ('sample-local-service', 'Sample: Local service starter', 'Illustrative record for a local service founder. Not a live grant.', true, array['home-services','food','professional-services'], array['local','hybrid'], array['local_service'], array['idea','pre-revenue','operating'], array['side_income','replace_job'], array['individual','sole_prop','llc'], 'Not a real amount — sample record', 'No deadline — sample record'),
  ('sample-digital-offer', 'Sample: Digital offer practice match', 'Illustrative record for an online product or coaching offer. Not a live grant.', true, array['creative','education','technology'], array['online','hybrid'], array['digital_products','coaching','education_platform'], array['idea','pre-revenue'], array['explore','side_income'], array['individual','sole_prop'], 'Not a real amount — sample record', 'No deadline — sample record'),
  ('sample-software-tools', 'Sample: Software tools match', 'Illustrative record for a software or AI service model. Not a live grant.', true, array['technology'], array['online','hybrid'], array['saas','ai_agency'], array['pre-revenue','operating'], array['side_income','replace_job','scale'], array['individual','llc'], 'Not a real amount — sample record', 'No deadline — sample record'),
  ('sample-membership', 'Sample: Membership and community', 'Illustrative record for a group, cohort, or membership. Not a live grant.', true, array['community','education','creative'], array['online','hybrid','local'], array['membership','education_platform','nonprofit'], array['idea','pre-revenue'], array['explore','side_income','scale'], array['individual','nonprofit','llc'], 'Not a real amount — sample record', 'No deadline — sample record'),
  ('sample-operating-business', 'Sample: Operating business paperwork', 'Illustrative record for a founder who has already operated something. Not a live grant.', true, array['professional-services','retail','food','technology'], array['local','online','hybrid'], array['ecommerce','local_service','saas','ai_agency'], array['operating'], array['replace_job','scale'], array['llc','sole_prop','nonprofit'], 'Not a real amount — sample record', 'No deadline — sample record')
on conflict (id) do nothing;

create or replace function public.handle_new_founder_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_founder_profile on auth.users;
create trigger on_auth_user_created_founder_profile
  after insert on auth.users
  for each row execute function public.handle_new_founder_user();

drop trigger if exists founders_set_updated_at on public.founders;
create trigger founders_set_updated_at before update on public.founders
  for each row execute function public.founder_set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.founder_set_updated_at();

drop trigger if exists assessments_set_updated_at on public.assessments;
create trigger assessments_set_updated_at before update on public.assessments
  for each row execute function public.founder_set_updated_at();

alter table public.profiles enable row level security;
alter table public.founders enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_answers enable row level security;
alter table public.scores enable row level security;
alter table public.archetypes enable row level security;
alter table public.business_matches enable row level security;
alter table public.blueprints enable row level security;
alter table public.coach_conversations enable row level security;
alter table public.coach_messages enable row level security;
alter table public.coach_memory enable row level security;
alter table public.tasks enable row level security;
alter table public.goals enable row level security;
alter table public.milestones enable row level security;
alter table public.certifications enable row level security;
alter table public.certification_progress enable row level security;
alter table public.funding_opportunities enable row level security;
alter table public.funding_applications enable row level security;
alter table public.xp_events enable row level security;
alter table public.badges enable row level security;
alter table public.founder_badges enable row level security;

-- Profiles use the account id itself.
drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles for select to authenticated using (id = auth.uid());
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles for insert to authenticated with check (id = auth.uid());
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "profiles delete own" on public.profiles;
create policy "profiles delete own" on public.profiles for delete to authenticated using (id = auth.uid());

-- Repeat the owner policy for every founder-owned table.
do $$
declare
  table_name text;
begin
  foreach table_name in array ARRAY[
    'founders',
    'assessments',
    'assessment_answers',
    'scores',
    'archetypes',
    'business_matches',
    'blueprints',
    'coach_conversations',
    'coach_messages',
    'coach_memory',
    'tasks',
    'goals',
    'milestones',
    'certification_progress',
    'funding_applications',
    'xp_events',
    'founder_badges'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', table_name || ' select own', table_name);
    execute format('create policy %I on public.%I for select to authenticated using (user_id = auth.uid())', table_name || ' select own', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || ' insert own', table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check (user_id = auth.uid())', table_name || ' insert own', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || ' update own', table_name);
    execute format('create policy %I on public.%I for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())', table_name || ' update own', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || ' delete own', table_name);
    execute format('create policy %I on public.%I for delete to authenticated using (user_id = auth.uid())', table_name || ' delete own', table_name);
  end loop;
end $$;

drop policy if exists "certifications are readable" on public.certifications;
create policy "certifications are readable" on public.certifications for select to anon, authenticated using (true);
drop policy if exists "badges are readable" on public.badges;
create policy "badges are readable" on public.badges for select to anon, authenticated using (true);
drop policy if exists "sample funding is readable" on public.funding_opportunities;
create policy "sample funding is readable" on public.funding_opportunities for select to anon, authenticated using (is_sample = true);

revoke all on table
  public.profiles,
  public.founders,
  public.assessments,
  public.assessment_answers,
  public.scores,
  public.archetypes,
  public.business_matches,
  public.blueprints,
  public.coach_conversations,
  public.coach_messages,
  public.coach_memory,
  public.tasks,
  public.goals,
  public.milestones,
  public.certification_progress,
  public.funding_applications,
  public.xp_events,
  public.founder_badges
from anon, public;

grant select, insert, update, delete on table
  public.profiles,
  public.founders,
  public.assessments,
  public.assessment_answers,
  public.scores,
  public.archetypes,
  public.business_matches,
  public.blueprints,
  public.coach_conversations,
  public.coach_messages,
  public.coach_memory,
  public.tasks,
  public.goals,
  public.milestones,
  public.certification_progress,
  public.funding_applications,
  public.xp_events,
  public.founder_badges
to authenticated;

grant select on table public.certifications, public.badges, public.funding_opportunities to anon, authenticated;
