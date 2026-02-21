-- =============================================================================
-- MIGRATION 06: Room detail columns + room-level waitlist
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Room detail columns
-- -----------------------------------------------------------------------------
ALTER TABLE public.rooms
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS bed_size text,
ADD COLUMN IF NOT EXISTS wardrobe_size text,
ADD COLUMN IF NOT EXISTS has_study_table boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_aircond boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_private_toilet boolean DEFAULT false;

COMMENT ON COLUMN public.rooms.description IS 'Room-level description for detail page';
COMMENT ON COLUMN public.rooms.bed_size IS 'e.g. Single, King, Queen';
COMMENT ON COLUMN public.rooms.has_private_toilet IS 'En-suite or shared bathroom';

-- -----------------------------------------------------------------------------
-- 2. Waitlist: add room_id (room-level waitlist)
-- -----------------------------------------------------------------------------
ALTER TABLE public.waitlist_registrations
ADD COLUMN IF NOT EXISTS room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE;

-- Make property_id nullable for migration; new entries use room_id
ALTER TABLE public.waitlist_registrations
ALTER COLUMN property_id DROP NOT NULL;

-- Drop old unique; add new for room-level
ALTER TABLE public.waitlist_registrations
DROP CONSTRAINT IF EXISTS waitlist_registrations_user_id_property_id_key;

-- Unique: one waitlist entry per user per room
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_user_room_unique
ON public.waitlist_registrations (user_id, room_id)
WHERE room_id IS NOT NULL;

-- Unique: one per user per property (keeps old behavior if property_id used)
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_user_property_unique
ON public.waitlist_registrations (user_id, property_id)
WHERE property_id IS NOT NULL;

-- At least one of room_id or property_id must be set
ALTER TABLE public.waitlist_registrations
ADD CONSTRAINT waitlist_room_or_property CHECK (
  (room_id IS NOT NULL) OR (property_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_waitlist_room_id ON public.waitlist_registrations(room_id);

COMMENT ON COLUMN public.waitlist_registrations.room_id IS 'Room-level waitlist. Prefer over property_id for units/rooms model.';
