-- Optional. Coach memory works without this. If pgvector is not available the
-- block records a notice and leaves coach_memory as plain text.
do $$
begin
  begin
    create extension if not exists vector;
  exception when others then
    raise notice 'pgvector is not available; coach_memory.embedding was not added: %', sqlerrm;
    return;
  end;

  begin
    execute 'alter table public.coach_memory add column if not exists embedding vector(1536)';
  exception when others then
    raise notice 'coach_memory.embedding was not added: %', sqlerrm;
  end;
end $$;
