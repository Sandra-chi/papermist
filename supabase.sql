create extension if not exists pgcrypto;

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  entry_date date not null,
  title text not null default '',
  content text not null default '',
  mood text not null default 'calm' check (mood in ('calm', 'happy', 'tired', 'inspired', 'busy')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create index if not exists idx_journal_entries_entry_date on public.journal_entries(entry_date desc);
create unique index if not exists uq_journal_entries_public_entry_date on public.journal_entries(entry_date) where user_id is null;
create index if not exists idx_journal_entries_user_date on public.journal_entries(user_id, entry_date desc);

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  title text not null,
  description text null,
  target_date date not null,
  status text not null default 'todo' check (status in ('todo', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_todos_target_date on public.todos(target_date asc);
create index if not exists idx_todos_user_status on public.todos(user_id, status);
create index if not exists idx_todos_user_target_date on public.todos(user_id, target_date asc);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  title text not null,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_notes_updated_at on public.notes(updated_at desc);
create index if not exists idx_notes_user_updated_at on public.notes(user_id, updated_at desc);

create table if not exists public.daily_cards (
  id uuid primary key default gen_random_uuid(),
  card_date date not null unique,
  title text not null,
  subtitle text not null default '',
  image_url text not null,
  theme text not null default 'Paper Calm',
  created_at timestamptz not null default now()
);

create index if not exists idx_daily_cards_card_date on public.daily_cards(card_date desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


drop trigger if exists trg_journal_entries_updated_at on public.journal_entries;
create trigger trg_journal_entries_updated_at
before update on public.journal_entries
for each row execute function public.set_updated_at();


drop trigger if exists trg_todos_updated_at on public.todos;
create trigger trg_todos_updated_at
before update on public.todos
for each row execute function public.set_updated_at();


drop trigger if exists trg_notes_updated_at on public.notes;
create trigger trg_notes_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

alter table public.journal_entries enable row level security;
alter table public.todos enable row level security;
alter table public.notes enable row level security;
alter table public.daily_cards enable row level security;

-- MVP 阶段策略：允许 user_id 为空的公共测试数据，以及登录用户访问自己的数据。
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'journal_entries' and policyname = 'journal_entries_select_policy'
  ) then
    create policy journal_entries_select_policy on public.journal_entries
      for select using (user_id is null or auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'journal_entries' and policyname = 'journal_entries_insert_policy'
  ) then
    create policy journal_entries_insert_policy on public.journal_entries
      for insert with check (user_id is null or auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'journal_entries' and policyname = 'journal_entries_update_policy'
  ) then
    create policy journal_entries_update_policy on public.journal_entries
      for update using (user_id is null or auth.uid() = user_id)
      with check (user_id is null or auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'todos' and policyname = 'todos_select_policy'
  ) then
    create policy todos_select_policy on public.todos
      for select using (user_id is null or auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'todos' and policyname = 'todos_insert_policy'
  ) then
    create policy todos_insert_policy on public.todos
      for insert with check (user_id is null or auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'todos' and policyname = 'todos_update_policy'
  ) then
    create policy todos_update_policy on public.todos
      for update using (user_id is null or auth.uid() = user_id)
      with check (user_id is null or auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'todos' and policyname = 'todos_delete_policy'
  ) then
    create policy todos_delete_policy on public.todos
      for delete using (user_id is null or auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'notes' and policyname = 'notes_select_policy'
  ) then
    create policy notes_select_policy on public.notes
      for select using (user_id is null or auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'notes' and policyname = 'notes_insert_policy'
  ) then
    create policy notes_insert_policy on public.notes
      for insert with check (user_id is null or auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'notes' and policyname = 'notes_update_policy'
  ) then
    create policy notes_update_policy on public.notes
      for update using (user_id is null or auth.uid() = user_id)
      with check (user_id is null or auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'notes' and policyname = 'notes_delete_policy'
  ) then
    create policy notes_delete_policy on public.notes
      for delete using (user_id is null or auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'daily_cards' and policyname = 'daily_cards_select_policy'
  ) then
    create policy daily_cards_select_policy on public.daily_cards
      for select using (true);
  end if;
end;
$$;

insert into public.daily_cards (card_date, title, subtitle, image_url, theme)
values
  (current_date, '雾里拾光，纸上安放心事', '把今天放慢一点，用柔和的节奏安排生活、记录灵感与心情。', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', 'Paper Calm')
on conflict (card_date) do nothing;
