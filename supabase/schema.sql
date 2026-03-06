create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null default '',
  age integer not null check (age between 10 and 120),
  gender text not null check (gender in ('male', 'female', 'other')),
  height double precision not null check (height > 0),
  height_unit text not null check (height_unit in ('cm', 'ft')),
  weight double precision not null check (weight > 0),
  weight_unit text not null check (weight_unit in ('kg', 'lbs')),
  activity_level text not null check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  food_preferences text[] not null default '{}',
  goal text not null check (goal in ('lose_weight', 'maintain', 'build_muscle', 'get_fit')),
  daily_calorie_target integer not null check (daily_calorie_target > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  log_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, log_date)
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  daily_log_id uuid not null references public.daily_logs(id) on delete cascade,
  name text not null,
  calories integer not null check (calories >= 0),
  protein integer not null check (protein >= 0),
  carbs integer not null check (carbs >= 0),
  fat integer not null check (fat >= 0),
  fiber integer not null check (fiber >= 0),
  items jsonb not null default '[]'::jsonb,
  image_url text,
  consumed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_daily_logs_profile_date on public.daily_logs(profile_id, log_date);
create index if not exists idx_meals_daily_log on public.meals(daily_log_id);
create index if not exists idx_meals_consumed_at on public.meals(consumed_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();

drop trigger if exists trg_daily_logs_updated_at on public.daily_logs;
create trigger trg_daily_logs_updated_at
before update on public.daily_logs
for each row
execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.daily_logs enable row level security;
alter table public.meals enable row level security;
