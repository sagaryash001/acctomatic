-- Admin write access to content, gated by is_admin() (defined in
-- 0003_profiles.sql). Direct supabase-js client writes are fine here -
-- no side effect or secret involved, RLS is a sufficient gate on its own.
create policy "static_pages_admin_write" on public.static_pages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "faq_items_admin_write" on public.faq_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "blog_posts_admin_write" on public.blog_posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "pricing_plans_admin_write" on public.pricing_plans
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- leads has no public policies at all (see 0001_leads.sql) - admins need
-- their own explicit read/update grant to review and action them.
create policy "leads_admin_read" on public.leads
  for select to authenticated using (public.is_admin());

create policy "leads_admin_update" on public.leads
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
