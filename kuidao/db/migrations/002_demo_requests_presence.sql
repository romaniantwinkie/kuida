-- Demo bookings from the agency homepage.
create table demo_requests (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      citext not null,
  agency     text not null,
  phone      text,
  slot       timestamptz not null,
  timezone   text not null,
  status     text not null default 'requested' check (status in ('requested', 'confirmed', 'done', 'cancelled')),
  created_at timestamptz not null default now()
);
create index on demo_requests (slot);

-- "Who's editing this shift": a heartbeat per open edit panel.
create table shift_presence (
  shift_id   uuid not null references shifts(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  seen_at    timestamptz not null default now(),
  primary key (shift_id, user_id)
);
