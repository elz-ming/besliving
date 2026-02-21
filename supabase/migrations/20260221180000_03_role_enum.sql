-- Migration 03: Use ENUM for users.role so Supabase Studio shows a dropdown
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('superadmin', 'admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ALTER COLUMN role DROP DEFAULT;
ALTER TABLE public.users
  ALTER COLUMN role TYPE public.user_role
  USING role::public.user_role;
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'user'::public.user_role;
