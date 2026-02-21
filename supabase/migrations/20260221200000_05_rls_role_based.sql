-- =============================================================================
-- MIGRATION 05: Production-grade RLS based on app roles
-- Replaces auth.role() = 'authenticated' with actual user_role from public.users
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Step 1: Helper function
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.users
  WHERE clerk_id = auth.jwt() ->> 'sub'
  LIMIT 1;
$$;

COMMENT ON FUNCTION public.current_user_role() IS 'Returns app role for current JWT. Used by RLS.';

GRANT EXECUTE ON FUNCTION public.current_user_role() TO anon;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;

-- -----------------------------------------------------------------------------
-- Step 2: Replace dangerous admin policies on units, rooms, media
-- -----------------------------------------------------------------------------

-- Units: drop old, create role-based
DROP POLICY IF EXISTS "Admin: all operations on units" ON public.units;
CREATE POLICY "Admin manage units"
ON public.units
FOR ALL
USING (
  public.current_user_role() IN ('admin', 'superadmin')
)
WITH CHECK (
  public.current_user_role() IN ('admin', 'superadmin')
);

-- Rooms: drop old, create role-based
DROP POLICY IF EXISTS "Admin: all operations on rooms" ON public.rooms;
CREATE POLICY "Admin manage rooms"
ON public.rooms
FOR ALL
USING (
  public.current_user_role() IN ('admin', 'superadmin')
)
WITH CHECK (
  public.current_user_role() IN ('admin', 'superadmin')
);

-- Media: drop old policies, create single role-based policy
DROP POLICY IF EXISTS "Admin: insert media" ON public.media;
DROP POLICY IF EXISTS "Admin: delete media" ON public.media;
CREATE POLICY "Admin manage media"
ON public.media
FOR ALL
USING (
  public.current_user_role() IN ('admin', 'superadmin')
)
WITH CHECK (
  public.current_user_role() IN ('admin', 'superadmin')
);

-- -----------------------------------------------------------------------------
-- Step 3: Admin permissions (superadmin only)
-- -----------------------------------------------------------------------------
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Superadmin manage admin permissions" ON public.admin_permissions;
CREATE POLICY "Superadmin manage admin permissions"
ON public.admin_permissions
FOR ALL
USING (
  public.current_user_role() = 'superadmin'
)
WITH CHECK (
  public.current_user_role() = 'superadmin'
);

-- -----------------------------------------------------------------------------
-- Step 4: Users table
-- -----------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User read own profile"
ON public.users
FOR SELECT
USING (
  clerk_id = auth.jwt() ->> 'sub'
);

CREATE POLICY "User update own profile"
ON public.users
FOR UPDATE
USING (
  clerk_id = auth.jwt() ->> 'sub'
)
WITH CHECK (
  clerk_id = auth.jwt() ->> 'sub'
);

CREATE POLICY "Superadmin manage users"
ON public.users
FOR ALL
USING (
  public.current_user_role() = 'superadmin'
)
WITH CHECK (
  public.current_user_role() = 'superadmin'
);

-- Allow user sync on first sign-in: authenticated user can insert own row
CREATE POLICY "User insert own profile"
ON public.users
FOR INSERT
WITH CHECK (
  clerk_id = auth.jwt() ->> 'sub'
);

-- -----------------------------------------------------------------------------
-- Step 5: Waitlist
-- -----------------------------------------------------------------------------
ALTER TABLE public.waitlist_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User read own waitlist"
ON public.waitlist_registrations
FOR SELECT
USING (
  user_id = (
    SELECT id FROM public.users
    WHERE clerk_id = auth.jwt() ->> 'sub'
    LIMIT 1
  )
);

CREATE POLICY "User insert own waitlist"
ON public.waitlist_registrations
FOR INSERT
WITH CHECK (
  user_id = (
    SELECT id FROM public.users
    WHERE clerk_id = auth.jwt() ->> 'sub'
    LIMIT 1
  )
);

CREATE POLICY "Admin manage waitlist"
ON public.waitlist_registrations
FOR ALL
USING (
  public.current_user_role() IN ('admin', 'superadmin')
)
WITH CHECK (
  public.current_user_role() IN ('admin', 'superadmin')
);

-- -----------------------------------------------------------------------------
-- Step 6: Tenancies
-- -----------------------------------------------------------------------------
ALTER TABLE public.tenancies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User read own tenancy"
ON public.tenancies
FOR SELECT
USING (
  tenant_id = (
    SELECT id FROM public.users
    WHERE clerk_id = auth.jwt() ->> 'sub'
    LIMIT 1
  )
);

CREATE POLICY "Admin manage tenancies"
ON public.tenancies
FOR ALL
USING (
  public.current_user_role() IN ('admin', 'superadmin')
)
WITH CHECK (
  public.current_user_role() IN ('admin', 'superadmin')
);

-- -----------------------------------------------------------------------------
-- Step 7: Payments
-- -----------------------------------------------------------------------------
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User read own payments"
ON public.payments
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.tenancies t
    JOIN public.users u ON u.id = t.tenant_id
    WHERE t.id = payments.tenancy_id
    AND u.clerk_id = auth.jwt() ->> 'sub'
  )
);

CREATE POLICY "Admin manage payments"
ON public.payments
FOR ALL
USING (
  public.current_user_role() IN ('admin', 'superadmin')
)
WITH CHECK (
  public.current_user_role() IN ('admin', 'superadmin')
);

-- -----------------------------------------------------------------------------
-- Step 8: Properties
-- Admin/superadmin manage all; owner manages own; user reads via waitlist/tenancy
-- -----------------------------------------------------------------------------
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin manage properties"
ON public.properties
FOR ALL
USING (
  public.current_user_role() IN ('admin', 'superadmin')
)
WITH CHECK (
  public.current_user_role() IN ('admin', 'superadmin')
);

CREATE POLICY "Owner manage own properties"
ON public.properties
FOR ALL
USING (
  owner_id = (
    SELECT id FROM public.users
    WHERE clerk_id = auth.jwt() ->> 'sub'
    LIMIT 1
  )
)
WITH CHECK (
  owner_id = (
    SELECT id FROM public.users
    WHERE clerk_id = auth.jwt() ->> 'sub'
    LIMIT 1
  )
);

CREATE POLICY "User read properties in waitlist or tenancy"
ON public.properties
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.waitlist_registrations w
    JOIN public.users u ON u.id = w.user_id
    WHERE w.property_id = properties.id AND u.clerk_id = auth.jwt() ->> 'sub'
  )
  OR EXISTS (
    SELECT 1 FROM public.tenancies t
    JOIN public.users u ON u.id = t.tenant_id
    WHERE t.property_id = properties.id AND u.clerk_id = auth.jwt() ->> 'sub'
  )
);
