create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  headline text not null,
  seo_title text,
  description text,
  category text,
  body text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  publish_at timestamptz,
  slug_locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'draft') = (publish_at is null))
);

create table admin_users (
  id serial primary key,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table admin_sessions (
  token_hash text primary key,
  user_id int not null references admin_users on delete cascade,
  expires_at timestamptz not null
);

create table login_failures (
  id bigserial primary key,
  ip text,
  email text,
  at timestamptz not null default now()
);
create index login_failures_at_idx on login_failures (at);
