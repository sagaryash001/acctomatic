-- Security advisor flagged both SECURITY DEFINER functions as directly
-- callable via PostgREST's /rest/v1/rpc/* by anon/authenticated clients -
-- neither is meant to be a public API. PostgreSQL grants EXECUTE to PUBLIC
-- by default on function creation, and every role implicitly inherits
-- PUBLIC's grants - so PUBLIC has to be revoked (not the individual roles)
-- and then re-granted only where actually needed.

-- handle_new_user() only ever runs as the on_auth_user_created trigger,
-- invoked internally when Supabase's Auth service inserts into auth.users -
-- that doesn't depend on PostgREST role grants, so no role needs it.
revoke execute on function public.handle_new_user() from public;

-- is_admin() is read by RLS policies evaluated *as* the querying role, so
-- `authenticated` must keep EXECUTE or every policy that calls it would
-- start failing for every authenticated query, not just direct RPC calls
-- (this is why the security advisor still flags is_admin() as callable by
-- `authenticated` after this migration - that's the intentional trade-off,
-- not an oversight). `anon` never has an is_admin()-gated policy to
-- evaluate, so it doesn't need it back.
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
