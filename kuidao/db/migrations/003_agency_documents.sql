-- Each agency's list of onboarding documents it asks caregivers for. Editable in Settings.
create table agency_documents (
  agency_id uuid not null references agencies(id) on delete cascade,
  key       text not null,
  label_en  text not null,
  label_es  text not null,
  status    text not null default 'required' check (status in ('required', 'optional')),
  position  int  not null,
  custom    boolean not null default false,
  primary key (agency_id, key)
);
