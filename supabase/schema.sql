-- ═══════════════════════════════════════════════════════════════
--  ReelRecipes — Supabase / Postgres Schema
--  Paste into Supabase SQL Editor and click Run
-- ═══════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── recipes ────────────────────────────────────────────────────
create table if not exists public.recipes (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        references auth.users(id) on delete cascade,

  source_url   text,
  platform     text        check (platform in ('youtube','tiktok','instagram','upload')),
  thumbnail    text,

  title        text        not null,
  cuisine      text,
  tags         text[]      default '{}',

  prep_time    integer,
  cook_time    integer,
  total_time   integer,
  servings     integer,

  -- [{ "amount": "200", "unit": "g", "name": "pasta" }]
  ingredients  jsonb       default '[]',
  -- [{ "text": "Boil water", "time": 12 }]
  steps        jsonb       default '[]',
  notes        text,

  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists recipes_set_updated_at on public.recipes;
create trigger recipes_set_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

-- ── Row Level Security ─────────────────────────────────────────
alter table public.recipes enable row level security;

create policy "recipes: select own"
  on public.recipes for select
  using (auth.uid() = user_id);

create policy "recipes: insert own"
  on public.recipes for insert
  with check (auth.uid() = user_id);

create policy "recipes: update own"
  on public.recipes for update
  using (auth.uid() = user_id);

create policy "recipes: delete own"
  on public.recipes for delete
  using (auth.uid() = user_id);

-- ── Indexes ────────────────────────────────────────────────────
create index if not exists recipes_user_id_idx    on public.recipes(user_id);
create index if not exists recipes_created_at_idx on public.recipes(created_at desc);
create index if not exists recipes_platform_idx   on public.recipes(platform);
create index if not exists recipes_fts_idx        on public.recipes
  using gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(cuisine,'')));

-- ── Full-text search helper ────────────────────────────────────
create or replace function public.search_recipes(query text, p_user_id uuid)
returns setof public.recipes language sql stable as $$
  select * from public.recipes
  where user_id = p_user_id
    and (
      to_tsvector('english', coalesce(title,'') || ' ' || coalesce(cuisine,''))
        @@ plainto_tsquery('english', query)
      or tags && array[lower(query)]
    )
  order by created_at desc;
$$;

-- ── collections (optional future feature) ─────────────────────
create table if not exists public.collections (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references auth.users(id) on delete cascade,
  name        text        not null,
  description text,
  is_public   boolean     default false,
  created_at  timestamptz default now()
);

create table if not exists public.collection_recipes (
  collection_id uuid references public.collections(id) on delete cascade,
  recipe_id     uuid references public.recipes(id)     on delete cascade,
  added_at      timestamptz default now(),
  primary key (collection_id, recipe_id)
);

alter table public.collections enable row level security;

create policy "collections: select own or public"
  on public.collections for select
  using (auth.uid() = user_id or is_public = true);

create policy "collections: insert own"
  on public.collections for insert
  with check (auth.uid() = user_id);

create policy "collections: delete own"
  on public.collections for delete
  using (auth.uid() = user_id);
