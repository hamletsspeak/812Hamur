create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  displayName text,
  photoURL text,
  fullName text,
  phone text,
  bio text,
  location text,
  skills text,
  github text,
  website text,
  githubProfile boolean default false,
  avatar jsonb,
  createdAt timestamptz default now(),
  updatedAt timestamptz default now(),
  lastLogin timestamptz,
  lastLogout timestamptz,
  lastModified timestamptz
);

create table if not exists public.counters (
  id text primary key,
  value bigint not null default 0
);

create table if not exists public.user_indices (
  user_id uuid primary key references auth.users(id) on delete cascade,
  user_index bigint not null
);

alter table public.users enable row level security;
alter table public.counters enable row level security;
alter table public.user_indices enable row level security;

drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
for select to authenticated using (auth.uid() = id);

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
for insert to authenticated with check (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
for update to authenticated using (auth.uid() = id);

drop policy if exists "counters_rw_auth" on public.counters;
create policy "counters_rw_auth" on public.counters
for all to authenticated using (true) with check (true);

drop policy if exists "user_indices_rw_own" on public.user_indices;
create policy "user_indices_rw_own" on public.user_indices
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
