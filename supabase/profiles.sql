-- Optional. Kuidao routes from auth user metadata (role, agency_name, full_name).
-- Run this in the Supabase SQL editor if you want a profiles row per account.
-- Signup still succeeds when this table is absent.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('agency', 'caregiver')),
  agency_name text,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles select own"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "profiles insert own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, agency_name, full_name)
  values (
    new.id,
    case
      when new.raw_user_meta_data->>'role' = 'agency' then 'agency'
      else 'caregiver'
    end,
    new.raw_user_meta_data->>'agency_name',
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
