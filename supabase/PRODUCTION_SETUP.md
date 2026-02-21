# Production Database Setup

Use one of the methods below to apply the schema to a fresh production Supabase database.

---

## Option 1: Supabase CLI (recommended)

1. **Install the Supabase CLI**
   ```bash
   npm install -g supabase
   ```
   Or use npx: `npx supabase`

2. **Log in and link your production project**
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   Find your Project Ref in: Supabase Dashboard → Project Settings → General → Reference ID.

3. **Apply migrations**
   ```bash
   supabase db push
   ```
   This applies all migrations in `supabase/migrations/` in order.

4. **(Optional) Seed initial data**
   In Supabase Dashboard → SQL Editor, run the contents of `supabase/seed.sql`.
   Skip this if you want a blank production DB.

---

## Option 2: Manual via Supabase Dashboard SQL Editor

If you prefer not to use the CLI, run each migration file **in order** in the SQL Editor:

1. `20260221164544_01_initial_schema.sql`
2. `20260221170000_02_roles_and_waitlist.sql`
3. `20260221180000_03_role_enum.sql`
4. `20260221190000_04_rental_listing_schema.sql`
5. `20260221200000_05_rls_role_based.sql`
6. `20260221210000_06_room_detail_and_waitlist.sql`
7. `20260221220000_07_tenancies_room_id.sql`

For each file: open it → copy contents → paste into SQL Editor → Run.

Then optionally run `supabase/seed.sql` for sample units/rooms.

---

## After schema is applied

1. **Production env** – Update `.env` with production Supabase URL and keys (and production Clerk keys).
2. **First superadmin** – Sign up via your app, then in Supabase Dashboard → Table Editor → `users`, set that user's `role` to `superadmin` (create via your app’s auth flow, then update the DB).
3. **Clerk webhook** – Configure `/api/users/sync` in Clerk Dashboard for production so new sign-ups sync to `public.users`.
4. **npm script** – With Supabase CLI installed, run `npm run db:push` from the project root to apply migrations.
