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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are readable by owner" on public.profiles;
create policy "Profiles are readable by owner"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

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

drop policy if exists "Profile files are readable by owner" on storage.objects;
create policy "Profile files are readable by owner"
  on storage.objects
  for select
  using (
    bucket_id = 'profile-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Profile files are insertable by owner" on storage.objects;
create policy "Profile files are insertable by owner"
  on storage.objects
  for insert
  with check (
    bucket_id = 'profile-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Profile files are updatable by owner" on storage.objects;
create policy "Profile files are updatable by owner"
  on storage.objects
  for update
  using (
    bucket_id = 'profile-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'profile-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
