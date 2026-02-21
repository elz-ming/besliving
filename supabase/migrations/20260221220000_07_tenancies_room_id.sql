-- =============================================================================
-- MIGRATION 07: Tenancies room_id for room-level tenancies
-- =============================================================================

ALTER TABLE public.tenancies
ADD COLUMN IF NOT EXISTS room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE;

ALTER TABLE public.tenancies
ALTER COLUMN property_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tenancies_room_id ON public.tenancies(room_id);

ALTER TABLE public.tenancies
ADD CONSTRAINT tenancies_room_or_property CHECK (
  (room_id IS NOT NULL) OR (property_id IS NOT NULL)
);

COMMENT ON COLUMN public.tenancies.room_id IS 'Room-level tenancy. Prefer over property_id for units/rooms model.';
