# Supabase Ops

## Apply migrations
- `supabase db push`
- or CI: `supabase migration up`

## Local dev
- `supabase start`
- `supabase db reset`
- seed: `supabase db reset --seed`

## Production checklist
- Enable RLS on all user data tables
- Verify service role key only on server runtime
- Configure auth providers + redirect URLs
- Set PITR/backups
- Review policies for admin/service paths
