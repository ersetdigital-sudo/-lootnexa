-- LOOTNEXA schema — jalankan di Supabase SQL Editor
-- Semua statement pakai IF NOT EXISTS jadi aman dijalankan berulang kali.

-- ========================
-- games
-- ========================
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  icon_url text,
  is_active boolean default true,
  sort_order int default 0,
  range_label text,
  icon_width int default 120,
  icon_height int default 120,
  user_id_label text default 'ID Pengguna',
  user_id_placeholder text default '12345678',
  server_id_label text default 'Server ID',
  server_id_placeholder text default '1000',
  server_id_required boolean default false,
  hide_server_id boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ========================
-- pricing (nominal & paket spesial)
-- category: 'nominal' | 'pass'
-- badge: 'terlaris' | 'best_value' | 'hemat' | NULL
-- ========================
create table if not exists public.pricing (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  nominal_label text not null,
  price int not null,
  category text not null default 'nominal',
  badge text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.pricing add column if not exists category text not null default 'nominal';
alter table public.pricing add column if not exists badge text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'pricing_category_check'
  ) then
    alter table public.pricing add constraint pricing_category_check check (category in ('nominal', 'pass'));
  end if;
end $$;

-- ========================
-- settings (key-value)
-- ========================
create table if not exists public.settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- ========================
-- admin_users
-- ========================
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz default now()
);

-- ========================
-- RLS: publik hanya bisa SELECT games/pricing/settings;
-- admin (authenticated) boleh full akses
-- ========================
alter table public.games enable row level security;
alter table public.pricing enable row level security;
alter table public.settings enable row level security;
alter table public.admin_users enable row level security;

do $$
begin
  -- games
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'games' and policyname = 'games_select_public') then
    create policy games_select_public on public.games for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'games' and policyname = 'games_insert_auth') then
    create policy games_insert_auth on public.games for insert to authenticated with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'games' and policyname = 'games_update_auth') then
    create policy games_update_auth on public.games for update to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'games' and policyname = 'games_delete_auth') then
    create policy games_delete_auth on public.games for delete to authenticated using (true);
  end if;

  -- pricing
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'pricing' and policyname = 'pricing_select_public') then
    create policy pricing_select_public on public.pricing for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'pricing' and policyname = 'pricing_insert_auth') then
    create policy pricing_insert_auth on public.pricing for insert to authenticated with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'pricing' and policyname = 'pricing_update_auth') then
    create policy pricing_update_auth on public.pricing for update to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'pricing' and policyname = 'pricing_delete_auth') then
    create policy pricing_delete_auth on public.pricing for delete to authenticated using (true);
  end if;

  -- settings
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'settings' and policyname = 'settings_select_public') then
    create policy settings_select_public on public.settings for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'settings' and policyname = 'settings_insert_auth') then
    create policy settings_insert_auth on public.settings for insert to authenticated with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'settings' and policyname = 'settings_update_auth') then
    create policy settings_update_auth on public.settings for update to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'settings' and policyname = 'settings_delete_auth') then
    create policy settings_delete_auth on public.settings for delete to authenticated using (true);
  end if;

  -- admin_users
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'admin_users' and policyname = 'admin_users_select_auth') then
    create policy admin_users_select_auth on public.admin_users for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'admin_users' and policyname = 'admin_users_insert_auth') then
    create policy admin_users_insert_auth on public.admin_users for insert to authenticated with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'admin_users' and policyname = 'admin_users_update_auth') then
    create policy admin_users_update_auth on public.admin_users for update to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'admin_users' and policyname = 'admin_users_delete_auth') then
    create policy admin_users_delete_auth on public.admin_users for delete to authenticated using (true);
  end if;
end $$;
