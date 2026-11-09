-- Cercana schema v1.
-- Privacy rule: Cercana stores no client (patient) data. Shifts carry an area,
-- an approximate pin, the time, the role and the pay. No names, addresses,
-- diagnoses or care notes. Agencies keep those in their own systems.

create extension if not exists postgis;
create extension if not exists citext;
create extension if not exists pgcrypto;

create table users (
  id            uuid primary key default gen_random_uuid(),
  email         citext unique not null,
  name          text,
  kind          text not null check (kind in ('agency', 'caregiver', 'admin')),
  created_at    timestamptz not null default now(),
  last_login_at timestamptz
);

create table agencies (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  agency_type    text not null,
  license_number text not null,
  license_state  text,
  zip            text not null,
  city           text,
  timezone       text not null default 'America/New_York',
  location       geography(point, 4326),
  plan           text not null default 'starter',
  status         text not null default 'pending' check (status in ('pending', 'approved', 'suspended')),
  approved_at    timestamptz,
  created_at     timestamptz not null default now()
);

create table agency_members (
  agency_id  uuid not null references agencies(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  role       text not null check (role in ('owner', 'scheduler')),
  invited_by uuid references users(id),
  created_at timestamptz not null default now(),
  primary key (agency_id, user_id)
);
create index on agency_members (user_id);

create table caregiver_profiles (
  user_id      uuid primary key references users(id) on delete cascade,
  first_name   text not null,
  last_name    text not null,
  mobile       text,                       -- private: never shown to agencies
  zip          text not null,
  city         text,
  location     geography(point, 4326),     -- ZIP centre, not a home address
  radius_miles int  not null default 10 check (radius_miles between 1 and 50),
  role         text not null check (role in ('Companion', 'HHA', 'CNA', 'LPN')),
  languages    text[] not null default '{}',
  days         int[]  not null default '{}',   -- 0 = Monday
  slots        text[] not null default '{}',   -- am | pm | eve | night
  bio          text,
  photo        text,                       -- small JPEG data URL (≤ 60 KB)
  visible      boolean not null default true,
  updated_at   timestamptz not null default now()
);
create index on caregiver_profiles using gist (location);

create sequence shift_number start 1001;
create table shifts (
  id                uuid primary key default gen_random_uuid(),
  number            int  not null default nextval('shift_number'),
  agency_id         uuid not null references agencies(id) on delete cascade,
  area              text not null,           -- neighborhood label, e.g. "Little Havana"
  zip               text not null,
  location          geography(point, 4326),  -- rounded to ~1 km
  starts_at         timestamptz not null,
  ends_at           timestamptz not null,
  role              text not null check (role in ('Companion', 'HHA', 'CNA', 'LPN')),
  language          text,
  language_required boolean not null default false,
  skills            text[] not null default '{}',
  pay_min           numeric(6,2) not null check (pay_min > 0),
  pay_max           numeric(6,2) not null,
  status            text not null default 'open' check (status in ('open', 'outreach', 'filled', 'cancelled')),
  created_by        uuid references users(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  check (ends_at > starts_at),
  check (pay_max >= pay_min)
);
create index on shifts (agency_id, starts_at);
create index on shifts using gist (location);

create table login_codes (
  id         uuid primary key default gen_random_uuid(),
  email      citext not null,
  code_hash  text not null,
  attempts   int not null default 0,
  expires_at timestamptz not null,
  used_at    timestamptz,
  created_at timestamptz not null default now()
);
create index on login_codes (email, created_at desc);

create table sessions (
  id         text primary key,               -- sha256 of the cookie token
  user_id    uuid not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index on sessions (user_id);

-- Basis for the compliance log: who did what, when.
create table audit_log (
  id        bigserial primary key,
  agency_id uuid references agencies(id) on delete cascade,
  user_id   uuid references users(id) on delete set null,
  action    text not null,
  detail    jsonb not null default '{}',
  at        timestamptz not null default now()
);
create index on audit_log (agency_id, at desc);
