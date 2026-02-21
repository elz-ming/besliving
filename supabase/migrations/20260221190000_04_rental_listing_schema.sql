-- =============================================================================
-- RENTAL LISTING SCHEMA
-- Co-living platform: Units (properties) → Rooms (rent by room) → Media
-- =============================================================================

-- -----------------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.property_type_enum AS ENUM (
    'condo', 'landed', 'apartment', 'studio', 'serviced', 'other'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.availability_status_enum AS ENUM (
    'available', 'reserved', 'occupied'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.media_type_enum AS ENUM ('image', 'video');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- UPDATED_AT TRIGGER
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 1. UNITS (property level)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  property_type public.property_type_enum NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_units_city ON public.units (city);
CREATE INDEX idx_units_property_type ON public.units (property_type);
CREATE INDEX idx_units_is_published ON public.units (is_published) WHERE is_published = true;

COMMENT ON TABLE public.units IS 'Property-level listings (condo, landed, etc). Only published visible to public.';

DROP TRIGGER IF EXISTS units_updated_at ON public.units;
CREATE TRIGGER units_updated_at
  BEFORE UPDATE ON public.units
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 2. ROOMS (rent by room)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES public.units (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  size_sqm NUMERIC(8, 2) CHECK (size_sqm >= 0),
  availability_status public.availability_status_enum NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rooms_unit_id ON public.rooms (unit_id);
CREATE INDEX idx_rooms_availability_status ON public.rooms (availability_status);

COMMENT ON TABLE public.rooms IS 'Rooms within a unit. Rent by room model.';

DROP TRIGGER IF EXISTS rooms_updated_at ON public.rooms;
CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 3. MEDIA (metadata for Supabase Storage files)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units (id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms (id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  media_type public.media_type_enum NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT media_unit_or_room CHECK (
    (unit_id IS NOT NULL) OR (room_id IS NOT NULL)
  )
);

CREATE INDEX idx_media_unit_id ON public.media (unit_id);
CREATE INDEX idx_media_room_id ON public.media (room_id);

COMMENT ON TABLE public.media IS 'Metadata for images/videos in Supabase Storage. Either unit or room level.';

GRANT SELECT ON public.units TO anon, authenticated;
GRANT ALL ON public.units TO authenticated;
GRANT SELECT ON public.rooms TO anon, authenticated;
GRANT ALL ON public.rooms TO authenticated;
GRANT SELECT ON public.media TO anon, authenticated;
GRANT INSERT, DELETE ON public.media TO authenticated;

-- -----------------------------------------------------------------------------
-- RLS: UNITS
-- -----------------------------------------------------------------------------
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public: select published units"
  ON public.units FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admin: all operations on units"
  ON public.units
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- RLS: ROOMS
-- -----------------------------------------------------------------------------
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public: select rooms of published units"
  ON public.rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.units u
      WHERE u.id = rooms.unit_id AND u.is_published = true
    )
  );

CREATE POLICY "Admin: all operations on rooms"
  ON public.rooms
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- RLS: MEDIA
-- -----------------------------------------------------------------------------
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public: select media for published units"
  ON public.media FOR SELECT
  USING (
    (unit_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.units u
      WHERE u.id = media.unit_id AND u.is_published = true
    ))
    OR
    (room_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.rooms r
      JOIN public.units u ON u.id = r.unit_id
      WHERE r.id = media.room_id AND u.is_published = true
    ))
  );

CREATE POLICY "Admin: insert media"
  ON public.media FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin: delete media"
  ON public.media FOR DELETE
  USING (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- STORAGE: listing-media bucket
-- Create via Dashboard if preferred; this works for local dev.
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-media', 'listing-media', true)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- STORAGE POLICIES: listing-media
-- -----------------------------------------------------------------------------
CREATE POLICY "listing_media_public_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-media');

CREATE POLICY "listing_media_auth_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listing-media'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "listing_media_auth_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'listing-media'
    AND auth.role() = 'authenticated'
  );
