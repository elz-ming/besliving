-- Seed data for local development
-- Run after migrations on `supabase db reset`

-- System user for owning seed properties (never signs in via Clerk)
INSERT INTO public.users (id, clerk_id, email, full_name, role)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'seed_system',
  'system@besliving.local',
  'BesLiving System',
  'admin'
)
ON CONFLICT (clerk_id) DO NOTHING;

-- Sample properties
INSERT INTO public.properties (
  id,
  owner_id,
  name,
  location,
  description,
  price_monthly_cents,
  rooms_total,
  rooms_available,
  image_url,
  amenities
) VALUES
  (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Sunrise House',
    'Brooklyn, NY',
    'A vibrant co-living house in the heart of Brooklyn. Shared kitchen, rooftop access, and a tight-knit community of professionals.',
    120000,
    6,
    2,
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
    ARRAY['WiFi', 'Gym', 'Rooftop']
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'Ocean View Loft',
    'San Francisco, CA',
    'Modern loft with bay views. Parking, laundry, and a shared garden.',
    145000,
    4,
    1,
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    ARRAY['Parking', 'Laundry', 'Garden']
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'Green Garden Apartments',
    'Austin, TX',
    'Spacious co-living with pool, BBQ area, and co-working space.',
    98000,
    8,
    3,
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
    ARRAY['Pool', 'BBQ', 'Co-working']
  )
ON CONFLICT (id) DO NOTHING;
