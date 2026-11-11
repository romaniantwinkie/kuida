-- Connections: an agency asks to connect, the caregiver accepts. Cercana never schedules;
-- a connection just lets the two talk and unlocks sensitive documents.
create table connections (
  agency_id    uuid not null references agencies(id) on delete cascade,
  caregiver_id uuid not null references users(id) on delete cascade,
  status       text not null default 'requested' check (status in ('requested', 'connected', 'declined')),
  shift_id     uuid references shifts(id) on delete set null,
  requested_by uuid references users(id) on delete set null,
  created_at   timestamptz not null default now(),
  responded_at timestamptz,
  primary key (agency_id, caregiver_id)
);
create index on connections (caregiver_id, status);

-- Caregiver document vault. Files are encrypted on disk (AES-256-GCM, one key per file,
-- wrapped with the server's master key); only metadata lives here.
create table caregiver_documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  doc_key     text not null,
  label       text not null,
  filename    text not null,
  mime        text not null,
  size_bytes  int  not null,
  sha256      text not null,
  storage_key text not null,
  wrapped_key text not null,
  expires_on  date,
  uploaded_at timestamptz not null default now(),
  unique (user_id, doc_key)
);

-- Which documents a caregiver shares with which agency, until when.
create table document_shares (
  caregiver_id uuid not null references users(id) on delete cascade,
  agency_id    uuid not null references agencies(id) on delete cascade,
  doc_key      text not null,
  expires_at   timestamptz not null,
  created_at   timestamptz not null default now(),
  primary key (caregiver_id, agency_id, doc_key)
);

-- An agency asking a caregiver for specific documents.
create table document_requests (
  agency_id    uuid not null references agencies(id) on delete cascade,
  caregiver_id uuid not null references users(id) on delete cascade,
  doc_key      text not null,
  created_at   timestamptz not null default now(),
  primary key (agency_id, caregiver_id, doc_key)
);

-- Every time someone at an agency opens a caregiver's document. The caregiver sees this log.
create table document_views (
  id           bigserial primary key,
  caregiver_id uuid not null references users(id) on delete cascade,
  agency_id    uuid not null references agencies(id) on delete cascade,
  user_id      uuid references users(id) on delete set null,
  doc_key      text not null,
  at           timestamptz not null default now()
);
create index on document_views (caregiver_id, at desc);

-- An agency's own caregivers, imported from a spreadsheet and invited by email.
create table roster_entries (
  id           uuid primary key default gen_random_uuid(),
  agency_id    uuid not null references agencies(id) on delete cascade,
  name         text not null,
  email        citext,
  phone        text,
  role         text,
  zip          text,
  languages    text[] not null default '{}',
  caregiver_id uuid references users(id) on delete set null,
  invited_at   timestamptz,
  created_at   timestamptz not null default now()
);
create unique index on roster_entries (agency_id, email) where email is not null;
create index on roster_entries (email);
