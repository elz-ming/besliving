-- BesLiving Master Schema
-- Run this script from scratch to create the exact current version of the database.
-- For incremental changes, use migrations 01_xxx.sql, 02_xxx.sql, etc.

-- =============================================================================
-- SCHEMA VERSION: 1.0 (matches migrations 01–04)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. USERS (synced from Clerk)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'tenant' CHECK (role IN ('tenant', 'owner', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_sign_in_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users (clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

COMMENT ON TABLE users IS 'App users synced from Clerk. clerk_id is the source of truth.';

-- -----------------------------------------------------------------------------
-- 2. PROPERTIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  price_monthly_cents INTEGER NOT NULL,
  rooms_total INTEGER NOT NULL DEFAULT 1,
  rooms_available INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties (owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties (location);
CREATE INDEX IF NOT EXISTS idx_properties_rooms_available ON properties (rooms_available) WHERE rooms_available > 0;

COMMENT ON TABLE properties IS 'Co-living properties. price_monthly_cents is in cents to avoid float.';

-- -----------------------------------------------------------------------------
-- 3. TENANCIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_tenancies_property_id ON tenancies (property_id);
CREATE INDEX IF NOT EXISTS idx_tenancies_tenant_id ON tenancies (tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenancies_status ON tenancies (status);

COMMENT ON TABLE tenancies IS 'Active and past tenancies. One tenant per property room/slot.';

-- -----------------------------------------------------------------------------
-- 4. PAYMENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenancy_id UUID NOT NULL REFERENCES tenancies (id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_tenancy_id ON payments (tenancy_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments (status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments (due_date);

COMMENT ON TABLE payments IS 'Rent payments. amount_cents in cents. paid_at set when payment completes.';
