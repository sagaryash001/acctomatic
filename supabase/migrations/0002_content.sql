-- Content backing the site's "Coming Soon" placeholder pages. Four
-- separate tables rather than one generic blob: FAQ needs question/answer
-- columns with ordering, blog needs slugs and publish-date ordering,
-- pricing needs numeric price columns - these are known, stable shapes.

create table public.static_pages ( -- privacy, affiliate (future: terms, about)
  slug         text primary key,
  title        text not null,
  body         text not null, -- markdown
  published    boolean not null default false,
  updated_at   timestamptz not null default now()
);

create table public.faq_items (
  id           uuid primary key default gen_random_uuid(),
  question     text not null,
  answer       text not null, -- markdown
  category     text,
  sort_order   int not null default 0,
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index faq_items_published_sort_idx on public.faq_items (published, sort_order);

create table public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  excerpt         text,
  body            text not null, -- markdown
  cover_image_url text,
  author_name     text,
  published       boolean not null default false,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index blog_posts_published_idx on public.blog_posts (published, published_at desc);

create table public.pricing_plans (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  tagline           text,
  price_monthly     numeric,
  is_custom_pricing boolean not null default false,
  features          jsonb not null default '[]'::jsonb, -- list-shaped, jsonb is fine here
  cta_label         text not null default 'Talk to Sales',
  highlighted       boolean not null default false,
  sort_order        int not null default 0,
  published         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index pricing_plans_published_sort_idx on public.pricing_plans (published, sort_order);

alter table public.static_pages enable row level security;
create policy "static_pages_public_read" on public.static_pages
  for select to anon, authenticated using (published = true);

alter table public.faq_items enable row level security;
create policy "faq_items_public_read" on public.faq_items
  for select to anon, authenticated using (published = true);

alter table public.blog_posts enable row level security;
create policy "blog_posts_public_read" on public.blog_posts
  for select to anon, authenticated using (published = true);

alter table public.pricing_plans enable row level security;
create policy "pricing_plans_public_read" on public.pricing_plans
  for select to anon, authenticated using (published = true);
