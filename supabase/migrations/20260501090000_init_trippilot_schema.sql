-- TripPilot initial production schema for Supabase Postgres
create extension if not exists "pgcrypto";

create schema if not exists app;

create or replace function app.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function app.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'role', '') in ('service_role', 'admin');
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  locale text not null default 'en-US',
  home_airport text,
  travel_style_defaults jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('revenuecat', 'stripe', 'manual')),
  entitlement text not null,
  status text not null,
  current_period_end timestamptz,
  raw_provider_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  destination_text text not null,
  destination_place_id text,
  start_date date not null,
  end_date date not null,
  travelers_count integer not null default 1 check (travelers_count > 0),
  budget_amount numeric(12,2),
  budget_currency char(3) not null default 'USD',
  travel_styles text[] not null default '{}'::text[],
  status text not null check (status in ('draft', 'planning', 'ready', 'archived')) default 'draft',
  visibility text not null check (visibility in ('private', 'shared')) default 'private',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint trips_date_window check (start_date <= end_date)
);

create table if not exists public.trip_members (
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'editor', 'viewer')),
  invite_email text,
  invite_status text not null default 'accepted',
  created_at timestamptz not null default timezone('utc', now()),
  primary key (trip_id, user_id),
  constraint member_identity_present check (user_id is not null or invite_email is not null)
);

create table if not exists public.trip_inputs (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  raw_input jsonb not null,
  normalized_input jsonb not null,
  ai_summary text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.itinerary_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  date date not null,
  title text,
  summary text,
  day_order integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (trip_id, date),
  unique (trip_id, day_order)
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  google_place_id text unique,
  name text not null,
  address text,
  lat numeric(10,7),
  lng numeric(10,7),
  country text,
  city text,
  rating numeric(2,1),
  price_level smallint,
  categories text[] not null default '{}'::text[],
  opening_hours jsonb not null default '{}'::jsonb,
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  day_id uuid references public.itinerary_days(id) on delete set null,
  place_id uuid references public.places(id) on delete set null,
  title text not null,
  description text,
  start_time timestamptz,
  end_time timestamptz,
  item_type text not null check (item_type in ('attraction', 'meal', 'transport', 'hotel', 'activity', 'buffer', 'booking', 'note')),
  estimated_cost numeric(12,2),
  booking_required boolean not null default false,
  booking_status text,
  source text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.trip_place_options (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete restrict,
  option_group text,
  reason text,
  pros text[] not null default '{}'::text[],
  cons text[] not null default '{}'::text[],
  estimated_cost numeric(12,2),
  fit_score numeric(4,3),
  selected boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  place_option_id uuid not null references public.trip_place_options(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  vote text not null check (vote in ('must', 'like', 'neutral', 'dislike')),
  created_at timestamptz not null default timezone('utc', now()),
  unique (place_option_id, user_id)
);

create table if not exists public.saved_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  url text not null,
  source_platform text,
  title text,
  description text,
  thumbnail_url text,
  raw_metadata jsonb not null default '{}'::jsonb,
  analysis_status text not null check (analysis_status in ('pending', 'processing', 'completed', 'failed')) default 'pending',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.saved_link_places (
  id uuid primary key default gen_random_uuid(),
  saved_link_id uuid not null references public.saved_links(id) on delete cascade,
  place_id uuid references public.places(id) on delete set null,
  candidate_name text not null,
  confidence numeric(4,3),
  evidence jsonb not null default '{}'::jsonb,
  user_confirmed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.booking_tasks (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  item_id uuid references public.itinerary_items(id) on delete set null,
  task_type text not null check (task_type in ('flight', 'hotel', 'transport', 'activity', 'restaurant', 'insurance', 'esim', 'document')),
  title text not null,
  description text,
  recommended_booking_window text,
  due_date date,
  provider_name text,
  affiliate_url text,
  status text not null check (status in ('todo', 'scheduled', 'done', 'skipped')) default 'todo',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('local', 'google', 'apple')),
  external_event_id text,
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint calendar_events_time_window check (start_at <= end_at)
);

create table if not exists public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  trip_id uuid references public.trips(id) on delete set null,
  run_type text not null,
  model text not null,
  input_hash text not null,
  prompt_version text not null,
  status text not null,
  token_usage jsonb not null default '{}'::jsonb,
  cost_estimate numeric(10,5),
  output jsonb,
  error_message text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);
create index if not exists idx_trips_owner_id on public.trips(owner_id);
create index if not exists idx_trips_dates on public.trips(start_date, end_date);
create index if not exists idx_trip_members_user_id on public.trip_members(user_id);
create index if not exists idx_itinerary_days_trip_id on public.itinerary_days(trip_id);
create index if not exists idx_itinerary_items_trip_day on public.itinerary_items(trip_id, day_id, sort_order);
create index if not exists idx_places_google_place_id on public.places(google_place_id);
create index if not exists idx_trip_place_options_trip_id on public.trip_place_options(trip_id);
create index if not exists idx_votes_trip_id on public.votes(trip_id);
create index if not exists idx_saved_links_user_id_created_at on public.saved_links(user_id, created_at desc);
create index if not exists idx_saved_link_places_saved_link_id on public.saved_link_places(saved_link_id);
create index if not exists idx_booking_tasks_trip_id on public.booking_tasks(trip_id);
create index if not exists idx_calendar_events_trip_user on public.calendar_events(trip_id, user_id);
create index if not exists idx_ai_runs_user_trip on public.ai_runs(user_id, trip_id);
create index if not exists idx_audit_logs_actor_created_at on public.audit_logs(actor_user_id, created_at desc);

create trigger set_profiles_updated_at before update on public.profiles for each row execute function app.set_updated_at();
create trigger set_subscriptions_updated_at before update on public.subscriptions for each row execute function app.set_updated_at();
create trigger set_trips_updated_at before update on public.trips for each row execute function app.set_updated_at();
create trigger set_places_updated_at before update on public.places for each row execute function app.set_updated_at();
create trigger set_booking_tasks_updated_at before update on public.booking_tasks for each row execute function app.set_updated_at();
create trigger set_calendar_events_updated_at before update on public.calendar_events for each row execute function app.set_updated_at();

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.trip_inputs enable row level security;
alter table public.itinerary_days enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.places enable row level security;
alter table public.trip_place_options enable row level security;
alter table public.votes enable row level security;
alter table public.saved_links enable row level security;
alter table public.saved_link_places enable row level security;
alter table public.booking_tasks enable row level security;
alter table public.calendar_events enable row level security;
alter table public.ai_runs enable row level security;
alter table public.audit_logs enable row level security;

create or replace function app.user_has_trip_access(target_trip_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.trips t
    left join public.trip_members tm on tm.trip_id = t.id and tm.user_id = auth.uid()
    where t.id = target_trip_id
      and (t.owner_id = auth.uid() or tm.user_id is not null)
  ) or app.is_admin();
$$;

create policy profiles_self_select on public.profiles for select using (id = auth.uid() or app.is_admin());
create policy profiles_self_update on public.profiles for update using (id = auth.uid() or app.is_admin()) with check (id = auth.uid() or app.is_admin());
create policy profiles_self_insert on public.profiles for insert with check (id = auth.uid() or app.is_admin());

create policy subscriptions_owner_read on public.subscriptions for select using (user_id = auth.uid() or app.is_admin());
create policy subscriptions_owner_write on public.subscriptions for all using (app.is_admin()) with check (app.is_admin());

create policy trips_member_read on public.trips for select using (app.user_has_trip_access(id));
create policy trips_owner_insert on public.trips for insert with check (owner_id = auth.uid() or app.is_admin());
create policy trips_owner_update on public.trips for update using (owner_id = auth.uid() or app.is_admin()) with check (owner_id = auth.uid() or app.is_admin());
create policy trips_owner_delete on public.trips for delete using (owner_id = auth.uid() or app.is_admin());

create policy trip_members_read on public.trip_members for select using (app.user_has_trip_access(trip_id));
create policy trip_members_manage on public.trip_members for all using (app.user_has_trip_access(trip_id)) with check (app.user_has_trip_access(trip_id));

create policy trip_inputs_access on public.trip_inputs for all using (app.user_has_trip_access(trip_id)) with check (app.user_has_trip_access(trip_id));
create policy itinerary_days_access on public.itinerary_days for all using (app.user_has_trip_access(trip_id)) with check (app.user_has_trip_access(trip_id));
create policy itinerary_items_access on public.itinerary_items for all using (app.user_has_trip_access(trip_id)) with check (app.user_has_trip_access(trip_id));
create policy trip_place_options_access on public.trip_place_options for all using (app.user_has_trip_access(trip_id)) with check (app.user_has_trip_access(trip_id));
create policy votes_access on public.votes for all using (app.user_has_trip_access(trip_id)) with check (app.user_has_trip_access(trip_id));
create policy booking_tasks_access on public.booking_tasks for all using (app.user_has_trip_access(trip_id)) with check (app.user_has_trip_access(trip_id));
create policy calendar_events_access on public.calendar_events for all using (app.user_has_trip_access(trip_id) and user_id = auth.uid() or app.is_admin()) with check (app.user_has_trip_access(trip_id) and user_id = auth.uid() or app.is_admin());

create policy saved_links_owner_access on public.saved_links for all using (user_id = auth.uid() or app.is_admin()) with check (user_id = auth.uid() or app.is_admin());
create policy saved_link_places_owner_access on public.saved_link_places for all using (
  exists (select 1 from public.saved_links sl where sl.id = saved_link_id and (sl.user_id = auth.uid() or app.is_admin()))
) with check (
  exists (select 1 from public.saved_links sl where sl.id = saved_link_id and (sl.user_id = auth.uid() or app.is_admin()))
);

create policy places_public_read on public.places for select using (true);
create policy places_admin_write on public.places for all using (app.is_admin()) with check (app.is_admin());

create policy ai_runs_owner_read on public.ai_runs for select using (user_id = auth.uid() or app.is_admin());
create policy ai_runs_owner_insert on public.ai_runs for insert with check (user_id = auth.uid() or app.is_admin());
create policy ai_runs_admin_update on public.ai_runs for update using (app.is_admin()) with check (app.is_admin());

create policy audit_logs_admin_only on public.audit_logs for all using (app.is_admin()) with check (app.is_admin());
