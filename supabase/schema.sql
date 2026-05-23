create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('Writer', 'Reader', 'Subject Expert', 'Client')),
  name text,
  email text,
  mobile text,
  domain text,
  gender text,
  dob date,
  expertise_domains text[] not null default '{}',
  credential_file_path text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles alter column expertise_domains set default '{}';

create table if not exists public.domains (
  name text primary key,
  created_at timestamptz not null default now()
);

insert into public.domains (name)
values
  ('Technology'),
  ('Finance'),
  ('Medical'),
  ('Medical / Health'),
  ('Health'),
  ('Law'),
  ('Science'),
  ('Engineering'),
  ('Education'),
  ('Business'),
  ('Culture'),
  ('Design'),
  ('Career'),
  ('AI'),
  ('Politics'),
  ('Sports'),
  ('Other')
on conflict (name) do nothing;

create table if not exists public.profile_domains (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  domain_name text not null references public.domains(name) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (profile_id, domain_name)
);

create table if not exists public.public_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  role text not null check (role in ('Writer', 'Reader', 'Subject Expert', 'Client')),
  name text,
  domain text,
  expertise_domains text[] not null default '{}',
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.profiles(id) on delete cascade,
  assigned_writer_id uuid references public.profiles(id) on delete set null,
  topic text not null,
  domain_name text not null references public.domains(name) on delete restrict,
  due_date date,
  word_count integer,
  payment_amount numeric(12,2),
  payment_currency text not null default 'INR',
  payment_status text not null default 'metadata_only'
    check (payment_status in ('metadata_only', 'pending', 'paid', 'failed', 'refunded')),
  instructions text[] not null default '{}',
  status text not null default 'open'
    check (status in ('open', 'applied', 'assigned', 'in_progress', 'submitted', 'under_sme_review', 'revision_requested', 'delivered', 'completed', 'cancelled')),
  assignment_type text check (assignment_type in ('application', 'direct')),
  assigned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  commission_id uuid references public.commissions(id) on delete set null,
  domain_name text not null references public.domains(name) on delete restrict,
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null default '',
  tags text[] not null default '{}',
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'in_review', 'revision_requested', 'published', 'archived')),
  word_count integer not null default 0,
  read_time_minutes integer not null default 0,
  submitted_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.article_reviews (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  sme_id uuid not null references public.profiles(id) on delete cascade,
  decision text not null default 'approved'
    check (decision in ('approved', 'revision_requested')),
  dimension_ratings jsonb not null default '{}'::jsonb,
  summary text,
  feedback text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (article_id, sme_id)
);

create table if not exists public.article_comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  quality_rating integer check (quality_rating between 1 and 5),
  attachment_path text,
  reward_amount numeric(12,2),
  reward_currency text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commission_applications (
  id uuid primary key default gen_random_uuid(),
  commission_id uuid not null references public.commissions(id) on delete cascade,
  writer_id uuid not null references public.profiles(id) on delete cascade,
  pitch text,
  status text not null default 'applied'
    check (status in ('applied', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (commission_id, writer_id)
);

create table if not exists public.commission_payments (
  id uuid primary key default gen_random_uuid(),
  commission_id uuid not null references public.commissions(id) on delete cascade,
  amount numeric(12,2) not null,
  currency text not null default 'INR',
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'refunded')),
  provider text,
  provider_reference text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reading_lists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  genre text,
  is_private boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reading_list_items (
  id uuid primary key default gen_random_uuid(),
  reading_list_id uuid not null references public.reading_lists(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  note text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (reading_list_id, article_id)
);

create table if not exists public.reading_progress (
  reader_id uuid not null references public.profiles(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  progress integer not null default 0 check (progress between 0 and 100),
  total_minutes integer not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (reader_id, article_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = (select auth.uid());
$$;

create or replace function public.has_profile_role(expected_role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() = expected_role, false);
$$;

create or replace function public.has_profile_domain(target_domain text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profile_domains pd
    where pd.profile_id = (select auth.uid())
      and pd.domain_name = target_domain
  );
$$;

create or replace function public.can_read_commission(target_commission_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.commissions c
    where c.id = target_commission_id
      and (
        c.business_id = (select auth.uid())
        or c.assigned_writer_id = (select auth.uid())
        or c.status in ('open', 'applied')
        or (
          public.has_profile_role('Subject Expert')
          and public.has_profile_domain(c.domain_name)
          and c.status in ('submitted', 'under_sme_review', 'delivered', 'completed')
        )
      )
  );
$$;

create or replace function public.can_read_article(target_article_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.articles a
    where a.id = target_article_id
      and (
        a.status = 'published'
        or a.author_id = (select auth.uid())
        or (
          a.commission_id is not null
          and public.can_read_commission(a.commission_id)
        )
        or (
          public.has_profile_role('Subject Expert')
          and a.status <> 'draft'
          and public.has_profile_domain(a.domain_name)
        )
      )
  );
$$;

create or replace function public.can_review_article(target_article_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.articles a
    where a.id = target_article_id
      and a.status in ('submitted', 'in_review', 'revision_requested', 'published')
      and public.has_profile_role('Subject Expert')
      and public.has_profile_domain(a.domain_name)
  );
$$;

create or replace function public.can_read_reading_list(target_list_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.reading_lists rl
    where rl.id = target_list_id
      and (rl.owner_id = (select auth.uid()) or rl.is_private = false)
  );
$$;

create or replace function public.can_manage_reading_list(target_list_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.reading_lists rl
    where rl.id = target_list_id
      and rl.owner_id = (select auth.uid())
  );
$$;

create or replace function public.sync_public_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.public_profiles (
    id, role, name, domain, expertise_domains, avatar_url, bio, created_at, updated_at
  )
  values (
    new.id,
    new.role,
    new.name,
    new.domain,
    coalesce(new.expertise_domains, '{}'),
    new.avatar_url,
    new.bio,
    coalesce(new.created_at, now()),
    now()
  )
  on conflict (id) do update set
    role = excluded.role,
    name = excluded.name,
    domain = excluded.domain,
    expertise_domains = excluded.expertise_domains,
    avatar_url = excluded.avatar_url,
    bio = excluded.bio,
    updated_at = now();
  return new;
end;
$$;

create or replace function public.mark_commission_applied()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.commissions
  set status = case when status = 'open' then 'applied' else status end,
      updated_at = now()
  where id = new.commission_id;
  return new;
end;
$$;

create or replace function public.apply_review_decision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.articles
  set status = case
      when new.decision = 'approved' then 'published'
      else 'revision_requested'
    end,
    published_at = case
      when new.decision = 'approved' then coalesce(published_at, now())
      else null
    end,
    updated_at = now()
  where id = new.article_id;

  update public.commissions
  set status = case
      when new.decision = 'approved' then 'delivered'
      else 'revision_requested'
    end,
    updated_at = now()
  where id = (
    select commission_id from public.articles where id = new.article_id
  );

  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'public_profiles',
    'commissions',
    'articles',
    'article_reviews',
    'article_comments',
    'commission_applications',
    'commission_payments',
    'reading_lists'
  ]
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end;
$$;

drop trigger if exists sync_public_profile_after_profile_write on public.profiles;
create trigger sync_public_profile_after_profile_write
after insert or update on public.profiles
for each row execute function public.sync_public_profile();

drop trigger if exists mark_commission_applied_after_insert on public.commission_applications;
create trigger mark_commission_applied_after_insert
after insert on public.commission_applications
for each row execute function public.mark_commission_applied();

drop trigger if exists apply_review_decision_after_write on public.article_reviews;
create trigger apply_review_decision_after_write
after insert or update on public.article_reviews
for each row execute function public.apply_review_decision();

alter table public.profiles enable row level security;
alter table public.domains enable row level security;
alter table public.profile_domains enable row level security;
alter table public.public_profiles enable row level security;
alter table public.commissions enable row level security;
alter table public.articles enable row level security;
alter table public.article_reviews enable row level security;
alter table public.article_comments enable row level security;
alter table public.commission_applications enable row level security;
alter table public.commission_payments enable row level security;
alter table public.reading_lists enable row level security;
alter table public.reading_list_items enable row level security;
alter table public.reading_progress enable row level security;

drop policy if exists "Profiles are readable by owner" on public.profiles;
drop policy if exists "Profiles are insertable by owner" on public.profiles;
drop policy if exists "Profiles are updatable by owner" on public.profiles;
drop policy if exists "Profiles owner or client writer directory select" on public.profiles;
drop policy if exists "Profiles owner insert" on public.profiles;
drop policy if exists "Profiles owner update" on public.profiles;
create policy "Profiles owner or client writer directory select"
  on public.profiles for select
  using (
    id = (select auth.uid())
    or (role = 'Writer' and public.has_profile_role('Client'))
  );
create policy "Profiles owner insert"
  on public.profiles for insert
  with check (id = (select auth.uid()));
create policy "Profiles owner update"
  on public.profiles for update
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "Domains are readable" on public.domains;
create policy "Domains are readable"
  on public.domains for select
  using (true);

drop policy if exists "Profile domains readable" on public.profile_domains;
drop policy if exists "Profile domains owner insert" on public.profile_domains;
drop policy if exists "Profile domains owner delete" on public.profile_domains;
create policy "Profile domains readable"
  on public.profile_domains for select
  using (true);
create policy "Profile domains owner insert"
  on public.profile_domains for insert
  with check (profile_id = (select auth.uid()));
create policy "Profile domains owner delete"
  on public.profile_domains for delete
  using (profile_id = (select auth.uid()));

drop policy if exists "Public profiles readable" on public.public_profiles;
create policy "Public profiles readable"
  on public.public_profiles for select
  using (true);

drop policy if exists "Commissions readable by participants and open market" on public.commissions;
drop policy if exists "Clients create commissions" on public.commissions;
drop policy if exists "Commission participants update" on public.commissions;
create policy "Commissions readable by participants and open market"
  on public.commissions for select
  using (public.can_read_commission(id));
create policy "Clients create commissions"
  on public.commissions for insert
  with check (business_id = (select auth.uid()) and public.has_profile_role('Client'));
create policy "Commission participants update"
  on public.commissions for update
  using (
    business_id = (select auth.uid())
    or assigned_writer_id = (select auth.uid())
  )
  with check (
    business_id = (select auth.uid())
    or assigned_writer_id = (select auth.uid())
  );

drop policy if exists "Articles readable by role" on public.articles;
drop policy if exists "Writers create articles" on public.articles;
drop policy if exists "Authors update articles" on public.articles;
drop policy if exists "Authors delete draft articles" on public.articles;
create policy "Articles readable by role"
  on public.articles for select
  using (
    status = 'published'
    or author_id = (select auth.uid())
    or (commission_id is not null and public.can_read_commission(commission_id))
    or (
      public.has_profile_role('Subject Expert')
      and status <> 'draft'
      and public.has_profile_domain(domain_name)
    )
  );
create policy "Writers create articles"
  on public.articles for insert
  with check (author_id = (select auth.uid()) and public.has_profile_role('Writer'));
create policy "Authors update articles"
  on public.articles for update
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));
create policy "Authors delete draft articles"
  on public.articles for delete
  using (author_id = (select auth.uid()) and status = 'draft');

drop policy if exists "Reviews readable by article readers" on public.article_reviews;
drop policy if exists "SMEs create domain reviews" on public.article_reviews;
drop policy if exists "SMEs update own reviews" on public.article_reviews;
create policy "Reviews readable by article readers"
  on public.article_reviews for select
  using (public.can_read_article(article_id));
create policy "SMEs create domain reviews"
  on public.article_reviews for insert
  with check (sme_id = (select auth.uid()) and public.can_review_article(article_id));
create policy "SMEs update own reviews"
  on public.article_reviews for update
  using (sme_id = (select auth.uid()) and public.can_review_article(article_id))
  with check (sme_id = (select auth.uid()) and public.can_review_article(article_id));

drop policy if exists "Comments readable by article readers" on public.article_comments;
drop policy if exists "Signed in users comment on readable articles" on public.article_comments;
drop policy if exists "Comment owners update comments" on public.article_comments;
drop policy if exists "Comment owners delete comments" on public.article_comments;
create policy "Comments readable by article readers"
  on public.article_comments for select
  using (public.can_read_article(article_id));
create policy "Signed in users comment on readable articles"
  on public.article_comments for insert
  with check (user_id = (select auth.uid()) and public.can_read_article(article_id));
create policy "Comment owners update comments"
  on public.article_comments for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "Comment owners delete comments"
  on public.article_comments for delete
  using (user_id = (select auth.uid()));

drop policy if exists "Applications readable by writer or client" on public.commission_applications;
drop policy if exists "Writers apply to open commissions" on public.commission_applications;
drop policy if exists "Application owner or client update" on public.commission_applications;
create policy "Applications readable by writer or client"
  on public.commission_applications for select
  using (
    writer_id = (select auth.uid())
    or exists (
      select 1 from public.commissions c
      where c.id = commission_id and c.business_id = (select auth.uid())
    )
  );
create policy "Writers apply to open commissions"
  on public.commission_applications for insert
  with check (
    writer_id = (select auth.uid())
    and public.has_profile_role('Writer')
    and exists (
      select 1 from public.commissions c
      where c.id = commission_id and c.status in ('open', 'applied')
    )
  );
create policy "Application owner or client update"
  on public.commission_applications for update
  using (
    writer_id = (select auth.uid())
    or exists (
      select 1 from public.commissions c
      where c.id = commission_id and c.business_id = (select auth.uid())
    )
  )
  with check (
    writer_id = (select auth.uid())
    or exists (
      select 1 from public.commissions c
      where c.id = commission_id and c.business_id = (select auth.uid())
    )
  );

drop policy if exists "Payments readable by commission participants" on public.commission_payments;
drop policy if exists "Clients create payment metadata" on public.commission_payments;
drop policy if exists "Clients update payment metadata" on public.commission_payments;
create policy "Payments readable by commission participants"
  on public.commission_payments for select
  using (public.can_read_commission(commission_id));
create policy "Clients create payment metadata"
  on public.commission_payments for insert
  with check (
    exists (
      select 1 from public.commissions c
      where c.id = commission_id and c.business_id = (select auth.uid())
    )
  );
create policy "Clients update payment metadata"
  on public.commission_payments for update
  using (
    exists (
      select 1 from public.commissions c
      where c.id = commission_id and c.business_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.commissions c
      where c.id = commission_id and c.business_id = (select auth.uid())
    )
  );

drop policy if exists "Reading lists readable by visibility" on public.reading_lists;
drop policy if exists "Readers create lists" on public.reading_lists;
drop policy if exists "Readers update own lists" on public.reading_lists;
drop policy if exists "Readers delete own lists" on public.reading_lists;
create policy "Reading lists readable by visibility"
  on public.reading_lists for select
  using (owner_id = (select auth.uid()) or is_private = false);
create policy "Readers create lists"
  on public.reading_lists for insert
  with check (owner_id = (select auth.uid()) and public.has_profile_role('Reader'));
create policy "Readers update own lists"
  on public.reading_lists for update
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
create policy "Readers delete own lists"
  on public.reading_lists for delete
  using (owner_id = (select auth.uid()));

drop policy if exists "Reading list items readable with list" on public.reading_list_items;
drop policy if exists "Reading list owners insert items" on public.reading_list_items;
drop policy if exists "Reading list owners update items" on public.reading_list_items;
drop policy if exists "Reading list owners delete items" on public.reading_list_items;
create policy "Reading list items readable with list"
  on public.reading_list_items for select
  using (public.can_read_reading_list(reading_list_id));
create policy "Reading list owners insert items"
  on public.reading_list_items for insert
  with check (public.can_manage_reading_list(reading_list_id));
create policy "Reading list owners update items"
  on public.reading_list_items for update
  using (public.can_manage_reading_list(reading_list_id))
  with check (public.can_manage_reading_list(reading_list_id));
create policy "Reading list owners delete items"
  on public.reading_list_items for delete
  using (public.can_manage_reading_list(reading_list_id));

drop policy if exists "Readers read own progress" on public.reading_progress;
drop policy if exists "Readers upsert own progress" on public.reading_progress;
drop policy if exists "Readers update own progress" on public.reading_progress;
create policy "Readers read own progress"
  on public.reading_progress for select
  using (reader_id = (select auth.uid()));
create policy "Readers upsert own progress"
  on public.reading_progress for insert
  with check (reader_id = (select auth.uid()) and public.has_profile_role('Reader'));
create policy "Readers update own progress"
  on public.reading_progress for update
  using (reader_id = (select auth.uid()))
  with check (reader_id = (select auth.uid()));

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profile_domains_domain_idx on public.profile_domains(domain_name);
create index if not exists articles_author_idx on public.articles(author_id);
create index if not exists articles_commission_idx on public.articles(commission_id);
create index if not exists articles_status_idx on public.articles(status);
create index if not exists articles_domain_idx on public.articles(domain_name);
create index if not exists articles_published_at_idx on public.articles(published_at desc);
create index if not exists commissions_business_idx on public.commissions(business_id);
create index if not exists commissions_assigned_writer_idx on public.commissions(assigned_writer_id);
create index if not exists commissions_status_idx on public.commissions(status);
create index if not exists article_comments_article_idx on public.article_comments(article_id);
create index if not exists reading_lists_owner_idx on public.reading_lists(owner_id);
create index if not exists reading_list_items_list_idx on public.reading_list_items(reading_list_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-files',
  'profile-files',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-assets',
  'article-assets',
  false,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'comment-files',
  'comment-files',
  false,
  10485760,
  array[
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Profile files are readable by owner" on storage.objects;
drop policy if exists "Profile files are insertable by owner" on storage.objects;
drop policy if exists "Profile files are updatable by owner" on storage.objects;
create policy "Profile files are readable by owner"
  on storage.objects for select
  using (bucket_id = 'profile-files' and (select auth.uid())::text = (storage.foldername(name))[1]);
create policy "Profile files are insertable by owner"
  on storage.objects for insert
  with check (bucket_id = 'profile-files' and (select auth.uid())::text = (storage.foldername(name))[1]);
create policy "Profile files are updatable by owner"
  on storage.objects for update
  using (bucket_id = 'profile-files' and (select auth.uid())::text = (storage.foldername(name))[1])
  with check (bucket_id = 'profile-files' and (select auth.uid())::text = (storage.foldername(name))[1]);

drop policy if exists "Article assets owner read" on storage.objects;
drop policy if exists "Article assets owner insert" on storage.objects;
drop policy if exists "Article assets owner update" on storage.objects;
create policy "Article assets owner read"
  on storage.objects for select
  using (bucket_id = 'article-assets' and (select auth.uid())::text = (storage.foldername(name))[1]);
create policy "Article assets owner insert"
  on storage.objects for insert
  with check (bucket_id = 'article-assets' and (select auth.uid())::text = (storage.foldername(name))[1]);
create policy "Article assets owner update"
  on storage.objects for update
  using (bucket_id = 'article-assets' and (select auth.uid())::text = (storage.foldername(name))[1])
  with check (bucket_id = 'article-assets' and (select auth.uid())::text = (storage.foldername(name))[1]);

drop policy if exists "Comment files owner read" on storage.objects;
drop policy if exists "Comment files owner insert" on storage.objects;
drop policy if exists "Comment files owner update" on storage.objects;
create policy "Comment files owner read"
  on storage.objects for select
  using (bucket_id = 'comment-files' and (select auth.uid())::text = (storage.foldername(name))[1]);
create policy "Comment files owner insert"
  on storage.objects for insert
  with check (bucket_id = 'comment-files' and (select auth.uid())::text = (storage.foldername(name))[1]);
create policy "Comment files owner update"
  on storage.objects for update
  using (bucket_id = 'comment-files' and (select auth.uid())::text = (storage.foldername(name))[1])
  with check (bucket_id = 'comment-files' and (select auth.uid())::text = (storage.foldername(name))[1]);
