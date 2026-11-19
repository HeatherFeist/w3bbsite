-- Remote Viewer memorials. The access code is the private link.
-- There is no public table policy. Family reach a memorial only through these functions.

create table if not exists public.viewings (
  code text primary key,
  memorial jsonb not null,
  memories jsonb not null default '[]'::jsonb,
  messages jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.viewings enable row level security;

create or replace function public.read_viewing(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.viewings;
begin
  if p_code is null or length(p_code) < 8 then
    return null;
  end if;
  select * into row from public.viewings where code = p_code;
  if not found then
    return null;
  end if;
  return jsonb_build_object(
    'memorial', row.memorial,
    'memories', row.memories,
    'messages', row.messages
  );
end;
$$;

create or replace function public.save_viewing_memorial(p_code text, p_memorial jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_code is null or length(p_code) < 8 or p_memorial is null then
    raise exception 'A private viewing code is required';
  end if;
  insert into public.viewings (code, memorial)
  values (p_code, p_memorial)
  on conflict (code) do update
    set memorial = excluded.memorial,
        updated_at = now();
end;
$$;

create or replace function public.add_viewing_memory(p_code text, p_memory jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_code is null or length(p_code) < 8 or p_memory is null then
    raise exception 'A private viewing code is required';
  end if;
  update public.viewings
    set memories = case
          when memories @> jsonb_build_array(p_memory) then memories
          else memories || jsonb_build_array(p_memory)
        end,
        updated_at = now()
    where code = p_code;
end;
$$;

create or replace function public.add_viewing_message(p_code text, p_message jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_code is null or length(p_code) < 8 or p_message is null then
    raise exception 'A private viewing code is required';
  end if;
  update public.viewings
    set messages = case
          when messages @> jsonb_build_array(p_message) then messages
          else messages || jsonb_build_array(p_message)
        end,
        updated_at = now()
    where code = p_code;
end;
$$;

revoke all on function public.read_viewing(text) from public;
revoke all on function public.save_viewing_memorial(text, jsonb) from public;
revoke all on function public.add_viewing_memory(text, jsonb) from public;
revoke all on function public.add_viewing_message(text, jsonb) from public;

grant execute on function public.read_viewing(text) to anon, authenticated;
grant execute on function public.save_viewing_memorial(text, jsonb) to anon, authenticated;
grant execute on function public.add_viewing_memory(text, jsonb) to anon, authenticated;
grant execute on function public.add_viewing_message(text, jsonb) to anon, authenticated;
