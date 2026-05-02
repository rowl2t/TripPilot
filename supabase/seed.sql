-- Public reference seed data only (no user-specific records)
insert into public.places (
  id,
  google_place_id,
  name,
  address,
  lat,
  lng,
  country,
  city,
  rating,
  price_level,
  categories,
  opening_hours,
  source_payload
)
values
  (
    gen_random_uuid(),
    'ChIJN1t_tDeuEmsRUsoyG83frY4',
    'Sydney Opera House',
    'Bennelong Point, Sydney NSW 2000, Australia',
    -33.8567844,
    151.2152967,
    'AU',
    'Sydney',
    4.7,
    3,
    array['attraction', 'landmark'],
    '{"note":"verify with Places API during sync"}'::jsonb,
    '{"seed":"reference"}'::jsonb
  ),
  (
    gen_random_uuid(),
    'ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
    'Eiffel Tower',
    'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
    48.8583701,
    2.2944813,
    'FR',
    'Paris',
    4.6,
    3,
    array['attraction', 'landmark'],
    '{"note":"verify with Places API during sync"}'::jsonb,
    '{"seed":"reference"}'::jsonb
  )
on conflict do nothing;
