-- Migration 02: Stakeholder roles (superadmin, admin, user) + waitlist
-- Stakeholders: superadmin | admin | user (signed-in) | guest (not signed-in)

-- Update users.role: superadmin, admin, user (drop tenant, owner)
UPDATE public.users SET role = 'user' WHERE role IN ('tenant', 'owner');
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check
  CHECK (role IN ('superadmin', 'admin', 'user'));

ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'user';

COMMENT ON COLUMN public.users.role IS 'superadmin: edit admin roles/permissions | admin: BesLiving manager | user: signed-in, sees waitlist';

-- Waitlist: users register interest in rooms/units at a property
CREATE TABLE IF NOT EXISTS public.waitlist_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties (id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'offered', 'accepted', 'declined', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, property_id)
);

CREATE INDEX idx_waitlist_user_id ON public.waitlist_registrations (user_id);
CREATE INDEX idx_waitlist_property_id ON public.waitlist_registrations (property_id);
CREATE INDEX idx_waitlist_status ON public.waitlist_registrations (status);

COMMENT ON TABLE public.waitlist_registrations IS 'Users on waitlist for properties. When a room opens, they may be offered.';

-- Admin permissions: superadmin can manage these (which admins can do what)
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  granted_by UUID REFERENCES public.users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (admin_id, permission)
);

CREATE INDEX idx_admin_permissions_admin_id ON public.admin_permissions (admin_id);

COMMENT ON TABLE public.admin_permissions IS 'Granular permissions for admins. Managed by superadmin.';
