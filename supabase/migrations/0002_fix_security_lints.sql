-- Fix: pin search_path on the trigger function (prevents search_path hijacking)
alter function public.credit_loyalty_points() set search_path = public;

-- Fix: revoke direct RPC execution — this function should only run via the
-- AFTER UPDATE trigger on orders, never called directly by anon/authenticated
revoke execute on function public.credit_loyalty_points() from anon, authenticated;

-- Fix: payment_config and reward_rules have RLS enabled with no policies,
-- which correctly blocks all access via anon/authenticated (admin-only via
-- service_role, which bypasses RLS). This is intentional, but add an explicit
-- deny-all policy so the linter recognizes it as a deliberate choice.
create policy "No public access" on payment_config for all using (false);
create policy "No public access" on reward_rules for all using (false);
