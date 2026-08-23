-- Contact form leads. Deliberately NO RLS policies for anon/authenticated:
-- RLS is enabled with a default-deny posture, so the only way a row can be
-- inserted is via the submit-lead Edge Function using the service-role key,
-- which bypasses RLS by design. There is no direct client-write path.
create table public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  email        text not null,
  company      text,
  doc_volume   text check (doc_volume in ('Under 100','100–1,000','1,000–10,000','10,000+')),
  tools        text,
  message      text not null,
  source       text not null default 'contact_modal',
  status       text not null default 'new' check (status in ('new','contacted','qualified','closed')),
  notified_at  timestamptz
);

create index leads_email_created_idx on public.leads (email, created_at desc);

alter table public.leads enable row level security;
