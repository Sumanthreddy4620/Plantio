-- ============================================================
-- Plantio — Supabase SQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. USERS TABLE
create table if not exists public.users (
  id            bigserial primary key,
  first_name    text      not null,
  last_name     text      not null,
  email         text      not null unique,
  password      text      not null,   -- pbkdf2 hashed, NEVER plain text
  created_at    timestamptz default now()
);

-- Index for fast email lookups on login/signup
create index if not exists idx_users_email on public.users (email);

-- 2. USER_PLANTS TABLE
create table if not exists public.user_plants (
  id                 bigserial primary key,
  user_id            bigint    not null references public.users(id) on delete cascade,
  title              text      not null,
  text               text      default '',
  img_url            text      default '',
  watering_frequency text      default '7',
  last_watered       date      default current_date,
  created_at         timestamptz default now()
);

-- Index for fast per-user plant queries
create index if not exists idx_user_plants_user_id on public.user_plants (user_id);

-- 3. ROW LEVEL SECURITY (disabled — server uses service role key which bypasses RLS)
-- The server never exposes the service role key to the browser, so this is safe.
alter table public.users      disable row level security;
alter table public.user_plants disable row level security;
 