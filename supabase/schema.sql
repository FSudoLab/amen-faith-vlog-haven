-- ========================================================
-- AMEN FAITH VLOG HAVEN - COMPLETE SUPABASE SCHEMA
-- ========================================================

-- 1. PROFILES / USERS TABLE
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text default 'creator',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Allow public read on profiles" on public.profiles for select using (true);
create policy "Allow all on profiles for authenticated" on public.profiles for all using (true);

-- Insert the pre-made creator user
insert into public.profiles (email, role)
values ('matthew1@gmail.com', 'creator')
on conflict (email) do nothing;


-- 2. VLOGS TABLE
create table if not exists public.vlogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  video_url text default '',
  image_url text default '',
  date text default to_char(current_date, 'YYYY-MM-DD'),
  created_at timestamptz default now()
);

alter table public.vlogs enable row level security;
create policy "Allow public read on vlogs" on public.vlogs for select using (true);
create policy "Allow insert on vlogs" on public.vlogs for insert with check (true);
create policy "Allow update on vlogs" on public.vlogs for update using (true);
create policy "Allow delete on vlogs" on public.vlogs for delete using (true);

-- Seed initial vlogs
insert into public.vlogs (title, description, date)
values 
  ('Simbang Gabi Diaries', 'Isang gabi ng panalangin at pagkakaisa kasama ang mga kapanalig.', '2026-10-01'),
  ('Alab ng Pananampalataya', 'Mga kwento ng pag-asa mula sa ating komunidad.', '2026-09-15')
on conflict do nothing;


-- 3. IMAGES TABLE
create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  vlog_id uuid references public.vlogs(id) on delete cascade,
  url text not null,
  caption text default '',
  created_at timestamptz default now()
);

alter table public.images enable row level security;
create policy "Allow public read on images" on public.images for select using (true);
create policy "Allow insert on images" on public.images for insert with check (true);
create policy "Allow update on images" on public.images for update using (true);
create policy "Allow delete on images" on public.images for delete using (true);
