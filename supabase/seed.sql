-- ================================
-- IDEAL PROPERTY GROUP (Penang)
-- 8 units
-- ================================

INSERT INTO public.units (id, title, property_type, city, address, description, is_published)
VALUES
  ('10000000-0000-4000-8000-000000000001', 'I-Regency', 'condo', 'Penang', 'Sungai Ara, Penang', 'I-Regency by Ideal Property Group. High-rise residence near Bayan Lepas industrial hub.', true),
  ('10000000-0000-4000-8000-000000000002', 'Ideal Venice Residency', 'condo', 'Penang', 'Bayan Lepas, Penang', 'Modern high-rise living by Ideal Property Group.', true),
  ('10000000-0000-4000-8000-000000000003', 'Lucerne Residences', 'condo', 'Penang', 'Bayan Lepas, Penang', 'Family-oriented condo with full facilities.', true),
  ('10000000-0000-4000-8000-000000000004', 'Havana Beach Residences', 'condo', 'Penang', 'Bayan Lepas, Penang', 'Seaside themed condominium with resort facilities.', true),
  ('10000000-0000-4000-8000-000000000005', 'Queens Residences Q1', 'condo', 'Penang', 'Bayan Lepas, Penang', 'Premium seafront residence near Queensbay Mall.', true),
  ('10000000-0000-4000-8000-000000000006', 'The Amarene', 'condo', 'Penang', 'Bayan Lepas, Penang', 'Modern urban residence with community facilities.', true),
  ('10000000-0000-4000-8000-000000000007', 'ForestVille', 'condo', 'Penang', 'Bayan Lepas, Penang', 'Green-themed residence by Ideal Property Group.', true),
  ('10000000-0000-4000-8000-000000000008', 'I-Santorini', 'condo', 'Penang', 'Tanjung Tokong, Penang', 'Mediterranean-inspired high-rise residence.', true),

-- ================================
-- SKYWORLD (KUALA LUMPUR)
-- 6 units
-- ================================
  ('20000000-0000-4000-8000-000000000001', 'SkyMeridien Residences', 'condo', 'Kuala Lumpur', 'Sentul, KL', 'SkyMeridien by SkyWorld near Sentul East.', true),
  ('20000000-0000-4000-8000-000000000002', 'SkyAwani 1 Residences', 'condo', 'Kuala Lumpur', 'Setapak, KL', 'Affordable urban residence under SkyAwani series.', true),
  ('20000000-0000-4000-8000-000000000003', 'SkyAwani 2 Residences', 'condo', 'Kuala Lumpur', 'Sentul, KL', 'Part of SkyAwani series with modern facilities.', true),
  ('20000000-0000-4000-8000-000000000004', 'SkyAwani 3 Residences', 'condo', 'Kuala Lumpur', 'Setapak, KL', 'Contemporary high-rise living by SkyWorld.', true),
  ('20000000-0000-4000-8000-000000000005', 'SkyAwani 4 Residences', 'condo', 'Kuala Lumpur', 'Setapak, KL', 'Modern city living by SkyWorld.', true),
  ('20000000-0000-4000-8000-000000000006', 'SkyAwani 5 Residences', 'condo', 'Kuala Lumpur', 'Sentul, KL', 'Latest addition to SkyAwani series.', true)
ON CONFLICT (id) DO NOTHING;

-- ================================
-- ROOMS: IDEAL PROPERTY GROUP (Penang)
-- Bayan Lepas/Sungai Ara band: RM 1050–1600
-- Tanjung Tokong (I-Santorini): slightly premium
-- ================================

-- I-Regency (Sungai Ara)
INSERT INTO public.rooms (unit_id, name, price, size_sqm, availability_status)
VALUES
  ('10000000-0000-4000-8000-000000000001', 'Master Room', 1600, 18, 'available'),
  ('10000000-0000-4000-8000-000000000001', 'Room A', 1200, 12, 'available'),
  ('10000000-0000-4000-8000-000000000001', 'Room B', 1150, 11, 'available'),
  ('10000000-0000-4000-8000-000000000001', 'Room C', 1100, 10, 'available'),
  ('10000000-0000-4000-8000-000000000001', 'Room D', 1050, 10, 'available');

-- Ideal Venice Residency
INSERT INTO public.rooms (unit_id, name, price, size_sqm, availability_status)
VALUES
  ('10000000-0000-4000-8000-000000000002', 'Master Room', 1550, 17, 'available'),
  ('10000000-0000-4000-8000-000000000002', 'Room A', 1180, 12, 'available'),
  ('10000000-0000-4000-8000-000000000002', 'Room B', 1120, 11, 'available'),
  ('10000000-0000-4000-8000-000000000002', 'Room C', 1080, 10, 'available');

-- Lucerne Residences
INSERT INTO public.rooms (unit_id, name, price, size_sqm, availability_status)
VALUES
  ('10000000-0000-4000-8000-000000000003', 'Master Room', 1650, 19, 'available'),
  ('10000000-0000-4000-8000-000000000003', 'Room A', 1220, 12, 'available'),
  ('10000000-0000-4000-8000-000000000003', 'Room B', 1160, 11, 'available'),
  ('10000000-0000-4000-8000-000000000003', 'Room C', 1110, 10, 'available'),
  ('10000000-0000-4000-8000-000000000003', 'Room D', 1060, 10, 'available');

-- Havana Beach Residences (seaside – slight premium)
INSERT INTO public.rooms (unit_id, name, price, size_sqm, availability_status)
VALUES
  ('10000000-0000-4000-8000-000000000004', 'Master Room', 1800, 20, 'available'),
  ('10000000-0000-4000-8000-000000000004', 'Room A', 1400, 14, 'available'),
  ('10000000-0000-4000-8000-000000000004', 'Room B', 1300, 12, 'available'),
  ('10000000-0000-4000-8000-000000000004', 'Room C', 1250, 11, 'available');

-- Queens Residences Q1 (premium seafront)
INSERT INTO public.rooms (unit_id, name, price, size_sqm, availability_status)
VALUES
  ('10000000-0000-4000-8000-000000000005', 'Master Room', 2200, 22, 'available'),
  ('10000000-0000-4000-8000-000000000005', 'Room A', 1650, 15, 'available'),
  ('10000000-0000-4000-8000-000000000005', 'Room B', 1550, 13, 'available'),
  ('10000000-0000-4000-8000-000000000005', 'Room C', 1450, 12, 'available'),
  ('10000000-0000-4000-8000-000000000005', 'Room D', 1350, 11, 'available');

-- The Amarene
INSERT INTO public.rooms (unit_id, name, price, size_sqm, availability_status)
VALUES
  ('10000000-0000-4000-8000-000000000006', 'Master Room', 1580, 17, 'available'),
  ('10000000-0000-4000-8000-000000000006', 'Room A', 1190, 12, 'available'),
  ('10000000-0000-4000-8000-000000000006', 'Room B', 1130, 11, 'available'),
  ('10000000-0000-4000-8000-000000000006', 'Room C', 1090, 10, 'available');

-- ForestVille
INSERT INTO public.rooms (unit_id, name, price, size_sqm, availability_status)
VALUES
  ('10000000-0000-4000-8000-000000000007', 'Master Room', 1620, 18, 'available'),
  ('10000000-0000-4000-8000-000000000007', 'Room A', 1210, 12, 'available'),
  ('10000000-0000-4000-8000-000000000007', 'Room B', 1155, 11, 'available'),
  ('10000000-0000-4000-8000-000000000007', 'Room C', 1105, 10, 'available'),
  ('10000000-0000-4000-8000-000000000007', 'Room D', 1055, 10, 'available');

-- I-Santorini (Tanjung Tokong – Mediterranean, slightly premium)
INSERT INTO public.rooms (unit_id, name, price, size_sqm, availability_status)
VALUES
  ('10000000-0000-4000-8000-000000000008', 'Master Room', 1750, 19, 'available'),
  ('10000000-0000-4000-8000-000000000008', 'Room A', 1350, 13, 'available'),
  ('10000000-0000-4000-8000-000000000008', 'Room B', 1280, 12, 'available'),
  ('10000000-0000-4000-8000-000000000008', 'Room C', 1220, 11, 'available'),
  ('10000000-0000-4000-8000-000000000008', 'Room D', 1160, 10, 'available');

-- ================================
-- ROOMS: SKYWORLD (Kuala Lumpur)
-- SkyMeridien: premium KL band
-- SkyAwani 1–5: affordable series, slightly lower
-- ================================

-- SkyMeridien Residences (Sentul)
INSERT INTO public.rooms (unit_id, name, price, size_sqm, availability_status)
VALUES
  ('20000000-0000-4000-8000-000000000001', 'Master Room', 1900, 20, 'available'),
  ('20000000-0000-4000-8000-000000000001', 'Room A', 1500, 14, 'available'),
  ('20000000-0000-4000-8000-000000000001', 'Room B', 1450, 12, 'available'),
  ('20000000-0000-4000-8000-000000000001', 'Room C', 1400, 11, 'available'),
  ('20000000-0000-4000-8000-000000000001', 'Room D', 1350, 10, 'available');

-- SkyAwani 1 Residences (Setapak – affordable)
INSERT INTO public.rooms (unit_id, name, price, size_sqm, availability_status)
VALUES
  ('20000000-0000-4000-8000-000000000002', 'Master Room', 1500, 18, 'available'),
  ('20000000-0000-4000-8000-000000000002', 'Room A', 1150, 12, 'available'),
  ('20000000-0000-4000-8000-000000000002', 'Room B', 1100, 11, 'available'),
  ('20000000-0000-4000-8000-000000000002', 'Room C', 1050, 10, 'available'),
  ('20000000-0000-4000-8000-000000000002', 'Room D', 1000, 9, 'available');

-- SkyAwani 2 Residences (Sentul)
INSERT INTO public.rooms (unit_id, name, price, size_sqm, availability_status)
VALUES
  ('20000000-0000-4000-8000-000000000003', 'Master Room', 1520, 18, 'available'),
  ('20000000-0000-4000-8000-000000000003', 'Room A', 1160, 12, 'available'),
  ('20000000-0000-4000-8000-000000000003', 'Room B', 1110, 11, 'available'),
  ('20000000-0000-4000-8000-000000000003', 'Room C', 1060, 10, 'available');

-- SkyAwani 3 Residences (Setapak)
INSERT INTO public.rooms (unit_id, name, price, size_sqm, availability_status)
VALUES
  ('20000000-0000-4000-8000-000000000004', 'Master Room', 1480, 17, 'available'),
  ('20000000-0000-4000-8000-000000000004', 'Room A', 1140, 12, 'available'),
  ('20000000-0000-4000-8000-000000000004', 'Room B', 1090, 11, 'available'),
  ('20000000-0000-4000-8000-000000000004', 'Room C', 1040, 10, 'available'),
  ('20000000-0000-4000-8000-000000000004', 'Room D', 990, 9, 'available');

-- SkyAwani 4 Residences
INSERT INTO public.rooms (unit_id, name, price, size_sqm, availability_status)
VALUES
  ('20000000-0000-4000-8000-000000000005', 'Master Room', 1550, 18, 'available'),
  ('20000000-0000-4000-8000-000000000005', 'Room A', 1180, 12, 'available'),
  ('20000000-0000-4000-8000-000000000005', 'Room B', 1120, 11, 'available'),
  ('20000000-0000-4000-8000-000000000005', 'Room C', 1070, 10, 'available');

-- SkyAwani 5 Residences (Sentul)
INSERT INTO public.rooms (unit_id, name, price, size_sqm, availability_status)
VALUES
  ('20000000-0000-4000-8000-000000000006', 'Master Room', 1580, 18, 'available'),
  ('20000000-0000-4000-8000-000000000006', 'Room A', 1200, 12, 'available'),
  ('20000000-0000-4000-8000-000000000006', 'Room B', 1140, 11, 'available'),
  ('20000000-0000-4000-8000-000000000006', 'Room C', 1090, 10, 'available'),
  ('20000000-0000-4000-8000-000000000006', 'Room D', 1040, 10, 'available');

-- ================================
-- Sample room details (for room detail pages)
-- Update Master Rooms with amenities
-- ================================
UPDATE public.rooms SET
  description = 'Spacious master bedroom with private en-suite. Ideal for professionals seeking comfort and privacy.',
  bed_size = 'King',
  wardrobe_size = 'Built-in 2.4m',
  has_study_table = true,
  has_aircond = true,
  has_private_toilet = true
WHERE unit_id = '10000000-0000-4000-8000-000000000001' AND name = 'Master Room';

UPDATE public.rooms SET
  description = 'Premium master suite with city views. Features air conditioning and dedicated study area.',
  bed_size = 'King',
  wardrobe_size = 'Built-in 2.2m',
  has_study_table = true,
  has_aircond = true,
  has_private_toilet = true
WHERE unit_id = '20000000-0000-4000-8000-000000000001' AND name = 'Master Room';
