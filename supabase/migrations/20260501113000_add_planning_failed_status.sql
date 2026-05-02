alter table public.trips drop constraint if exists trips_status_check;
alter table public.trips add constraint trips_status_check check (status in ('draft', 'planning', 'planning_failed', 'ready', 'archived'));
