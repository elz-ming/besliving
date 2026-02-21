


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."availability_status_enum" AS ENUM (
    'available',
    'reserved',
    'occupied'
);


ALTER TYPE "public"."availability_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."media_type_enum" AS ENUM (
    'image',
    'video'
);


ALTER TYPE "public"."media_type_enum" OWNER TO "postgres";


CREATE TYPE "public"."property_type_enum" AS ENUM (
    'condo',
    'landed',
    'apartment',
    'studio',
    'serviced',
    'other'
);


ALTER TYPE "public"."property_type_enum" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'superadmin',
    'admin',
    'user'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."current_user_role"() RETURNS "public"."user_role"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT role
  FROM public.users
  WHERE clerk_id = auth.jwt() ->> 'sub'
  LIMIT 1;
$$;


ALTER FUNCTION "public"."current_user_role"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."current_user_role"() IS 'Returns app role for current JWT. Used by RLS.';



CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_permissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "admin_id" "uuid" NOT NULL,
    "permission" "text" NOT NULL,
    "granted_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."admin_permissions" OWNER TO "postgres";


COMMENT ON TABLE "public"."admin_permissions" IS 'Granular permissions for admins. Managed by superadmin.';



CREATE TABLE IF NOT EXISTS "public"."media" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "unit_id" "uuid",
    "room_id" "uuid",
    "file_path" "text" NOT NULL,
    "media_type" "public"."media_type_enum" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "media_unit_or_room" CHECK ((("unit_id" IS NOT NULL) OR ("room_id" IS NOT NULL)))
);


ALTER TABLE "public"."media" OWNER TO "postgres";


COMMENT ON TABLE "public"."media" IS 'Metadata for images/videos in Supabase Storage. Either unit or room level.';



CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenancy_id" "uuid" NOT NULL,
    "amount_cents" integer NOT NULL,
    "due_date" "date" NOT NULL,
    "paid_at" timestamp with time zone,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "payments_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'paid'::"text", 'overdue'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


COMMENT ON TABLE "public"."payments" IS 'Rent payments. amount_cents in cents. paid_at set when payment completes.';



CREATE TABLE IF NOT EXISTS "public"."properties" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "location" "text" NOT NULL,
    "description" "text",
    "price_monthly_cents" integer NOT NULL,
    "rooms_total" integer DEFAULT 1 NOT NULL,
    "rooms_available" integer DEFAULT 1 NOT NULL,
    "image_url" "text",
    "amenities" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."properties" OWNER TO "postgres";


COMMENT ON TABLE "public"."properties" IS 'Co-living properties. price_monthly_cents is in cents to avoid float.';



CREATE TABLE IF NOT EXISTS "public"."rooms" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "unit_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "price" numeric(12,2) NOT NULL,
    "size_sqm" numeric(8,2),
    "availability_status" "public"."availability_status_enum" DEFAULT 'available'::"public"."availability_status_enum" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "rooms_price_check" CHECK (("price" >= (0)::numeric)),
    CONSTRAINT "rooms_size_sqm_check" CHECK (("size_sqm" >= (0)::numeric))
);


ALTER TABLE "public"."rooms" OWNER TO "postgres";


COMMENT ON TABLE "public"."rooms" IS 'Rooms within a unit. Rent by room model.';



CREATE TABLE IF NOT EXISTS "public"."tenancies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "tenancies_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'ended'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."tenancies" OWNER TO "postgres";


COMMENT ON TABLE "public"."tenancies" IS 'Active and past tenancies. One tenant per property room/slot.';



CREATE TABLE IF NOT EXISTS "public"."units" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "property_type" "public"."property_type_enum" NOT NULL,
    "city" "text" NOT NULL,
    "address" "text" NOT NULL,
    "description" "text",
    "is_published" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."units" OWNER TO "postgres";


COMMENT ON TABLE "public"."units" IS 'Property-level listings (condo, landed, etc). Only published visible to public.';



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "clerk_id" "text" NOT NULL,
    "email" "text",
    "full_name" "text",
    "avatar_url" "text",
    "role" "public"."user_role" DEFAULT 'user'::"public"."user_role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_sign_in_at" timestamp with time zone
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON TABLE "public"."users" IS 'App users synced from Clerk. clerk_id is the source of truth.';



COMMENT ON COLUMN "public"."users"."role" IS 'superadmin: edit admin roles/permissions | admin: BesLiving manager | user: signed-in, sees waitlist';



CREATE TABLE IF NOT EXISTS "public"."waitlist_registrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "property_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "waitlist_registrations_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'offered'::"text", 'accepted'::"text", 'declined'::"text", 'expired'::"text"])))
);


ALTER TABLE "public"."waitlist_registrations" OWNER TO "postgres";


COMMENT ON TABLE "public"."waitlist_registrations" IS 'Users on waitlist for properties. When a room opens, they may be offered.';



ALTER TABLE ONLY "public"."admin_permissions"
    ADD CONSTRAINT "admin_permissions_admin_id_permission_key" UNIQUE ("admin_id", "permission");



ALTER TABLE ONLY "public"."admin_permissions"
    ADD CONSTRAINT "admin_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."media"
    ADD CONSTRAINT "media_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenancies"
    ADD CONSTRAINT "tenancies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenancies"
    ADD CONSTRAINT "tenancies_property_id_tenant_id_key" UNIQUE ("property_id", "tenant_id");



ALTER TABLE ONLY "public"."units"
    ADD CONSTRAINT "units_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_clerk_id_key" UNIQUE ("clerk_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."waitlist_registrations"
    ADD CONSTRAINT "waitlist_registrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."waitlist_registrations"
    ADD CONSTRAINT "waitlist_registrations_user_id_property_id_key" UNIQUE ("user_id", "property_id");



CREATE INDEX "idx_admin_permissions_admin_id" ON "public"."admin_permissions" USING "btree" ("admin_id");



CREATE INDEX "idx_media_room_id" ON "public"."media" USING "btree" ("room_id");



CREATE INDEX "idx_media_unit_id" ON "public"."media" USING "btree" ("unit_id");



CREATE INDEX "idx_payments_due_date" ON "public"."payments" USING "btree" ("due_date");



CREATE INDEX "idx_payments_status" ON "public"."payments" USING "btree" ("status");



CREATE INDEX "idx_payments_tenancy_id" ON "public"."payments" USING "btree" ("tenancy_id");



CREATE INDEX "idx_properties_location" ON "public"."properties" USING "btree" ("location");



CREATE INDEX "idx_properties_owner_id" ON "public"."properties" USING "btree" ("owner_id");



CREATE INDEX "idx_properties_rooms_available" ON "public"."properties" USING "btree" ("rooms_available") WHERE ("rooms_available" > 0);



CREATE INDEX "idx_rooms_availability_status" ON "public"."rooms" USING "btree" ("availability_status");



CREATE INDEX "idx_rooms_unit_id" ON "public"."rooms" USING "btree" ("unit_id");



CREATE INDEX "idx_tenancies_property_id" ON "public"."tenancies" USING "btree" ("property_id");



CREATE INDEX "idx_tenancies_status" ON "public"."tenancies" USING "btree" ("status");



CREATE INDEX "idx_tenancies_tenant_id" ON "public"."tenancies" USING "btree" ("tenant_id");



CREATE INDEX "idx_units_city" ON "public"."units" USING "btree" ("city");



CREATE INDEX "idx_units_is_published" ON "public"."units" USING "btree" ("is_published") WHERE ("is_published" = true);



CREATE INDEX "idx_units_property_type" ON "public"."units" USING "btree" ("property_type");



CREATE INDEX "idx_users_clerk_id" ON "public"."users" USING "btree" ("clerk_id");



CREATE INDEX "idx_users_email" ON "public"."users" USING "btree" ("email");



CREATE INDEX "idx_waitlist_property_id" ON "public"."waitlist_registrations" USING "btree" ("property_id");



CREATE INDEX "idx_waitlist_status" ON "public"."waitlist_registrations" USING "btree" ("status");



CREATE INDEX "idx_waitlist_user_id" ON "public"."waitlist_registrations" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "rooms_updated_at" BEFORE UPDATE ON "public"."rooms" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "units_updated_at" BEFORE UPDATE ON "public"."units" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."admin_permissions"
    ADD CONSTRAINT "admin_permissions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."admin_permissions"
    ADD CONSTRAINT "admin_permissions_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."media"
    ADD CONSTRAINT "media_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."media"
    ADD CONSTRAINT "media_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_tenancy_id_fkey" FOREIGN KEY ("tenancy_id") REFERENCES "public"."tenancies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tenancies"
    ADD CONSTRAINT "tenancies_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tenancies"
    ADD CONSTRAINT "tenancies_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."waitlist_registrations"
    ADD CONSTRAINT "waitlist_registrations_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."waitlist_registrations"
    ADD CONSTRAINT "waitlist_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admin manage media" ON "public"."media" USING (("public"."current_user_role"() = ANY (ARRAY['admin'::"public"."user_role", 'superadmin'::"public"."user_role"]))) WITH CHECK (("public"."current_user_role"() = ANY (ARRAY['admin'::"public"."user_role", 'superadmin'::"public"."user_role"])));



CREATE POLICY "Admin manage payments" ON "public"."payments" USING (("public"."current_user_role"() = ANY (ARRAY['admin'::"public"."user_role", 'superadmin'::"public"."user_role"]))) WITH CHECK (("public"."current_user_role"() = ANY (ARRAY['admin'::"public"."user_role", 'superadmin'::"public"."user_role"])));



CREATE POLICY "Admin manage properties" ON "public"."properties" USING (("public"."current_user_role"() = ANY (ARRAY['admin'::"public"."user_role", 'superadmin'::"public"."user_role"]))) WITH CHECK (("public"."current_user_role"() = ANY (ARRAY['admin'::"public"."user_role", 'superadmin'::"public"."user_role"])));



CREATE POLICY "Admin manage rooms" ON "public"."rooms" USING (("public"."current_user_role"() = ANY (ARRAY['admin'::"public"."user_role", 'superadmin'::"public"."user_role"]))) WITH CHECK (("public"."current_user_role"() = ANY (ARRAY['admin'::"public"."user_role", 'superadmin'::"public"."user_role"])));



CREATE POLICY "Admin manage tenancies" ON "public"."tenancies" USING (("public"."current_user_role"() = ANY (ARRAY['admin'::"public"."user_role", 'superadmin'::"public"."user_role"]))) WITH CHECK (("public"."current_user_role"() = ANY (ARRAY['admin'::"public"."user_role", 'superadmin'::"public"."user_role"])));



CREATE POLICY "Admin manage units" ON "public"."units" USING (("public"."current_user_role"() = ANY (ARRAY['admin'::"public"."user_role", 'superadmin'::"public"."user_role"]))) WITH CHECK (("public"."current_user_role"() = ANY (ARRAY['admin'::"public"."user_role", 'superadmin'::"public"."user_role"])));



CREATE POLICY "Admin manage waitlist" ON "public"."waitlist_registrations" USING (("public"."current_user_role"() = ANY (ARRAY['admin'::"public"."user_role", 'superadmin'::"public"."user_role"]))) WITH CHECK (("public"."current_user_role"() = ANY (ARRAY['admin'::"public"."user_role", 'superadmin'::"public"."user_role"])));



CREATE POLICY "Owner manage own properties" ON "public"."properties" USING (("owner_id" = ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."clerk_id" = ("auth"."jwt"() ->> 'sub'::"text"))
 LIMIT 1))) WITH CHECK (("owner_id" = ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."clerk_id" = ("auth"."jwt"() ->> 'sub'::"text"))
 LIMIT 1)));



CREATE POLICY "Public: select media for published units" ON "public"."media" FOR SELECT USING (((("unit_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."units" "u"
  WHERE (("u"."id" = "media"."unit_id") AND ("u"."is_published" = true))))) OR (("room_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM ("public"."rooms" "r"
     JOIN "public"."units" "u" ON (("u"."id" = "r"."unit_id")))
  WHERE (("r"."id" = "media"."room_id") AND ("u"."is_published" = true)))))));



CREATE POLICY "Public: select published units" ON "public"."units" FOR SELECT USING (("is_published" = true));



CREATE POLICY "Public: select rooms of published units" ON "public"."rooms" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."units" "u"
  WHERE (("u"."id" = "rooms"."unit_id") AND ("u"."is_published" = true)))));



CREATE POLICY "Superadmin manage admin permissions" ON "public"."admin_permissions" USING (("public"."current_user_role"() = 'superadmin'::"public"."user_role")) WITH CHECK (("public"."current_user_role"() = 'superadmin'::"public"."user_role"));



CREATE POLICY "Superadmin manage users" ON "public"."users" USING (("public"."current_user_role"() = 'superadmin'::"public"."user_role")) WITH CHECK (("public"."current_user_role"() = 'superadmin'::"public"."user_role"));



CREATE POLICY "User insert own profile" ON "public"."users" FOR INSERT WITH CHECK (("clerk_id" = ("auth"."jwt"() ->> 'sub'::"text")));



CREATE POLICY "User insert own waitlist" ON "public"."waitlist_registrations" FOR INSERT WITH CHECK (("user_id" = ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."clerk_id" = ("auth"."jwt"() ->> 'sub'::"text"))
 LIMIT 1)));



CREATE POLICY "User read own payments" ON "public"."payments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."tenancies" "t"
     JOIN "public"."users" "u" ON (("u"."id" = "t"."tenant_id")))
  WHERE (("t"."id" = "payments"."tenancy_id") AND ("u"."clerk_id" = ("auth"."jwt"() ->> 'sub'::"text"))))));



CREATE POLICY "User read own profile" ON "public"."users" FOR SELECT USING (("clerk_id" = ("auth"."jwt"() ->> 'sub'::"text")));



CREATE POLICY "User read own tenancy" ON "public"."tenancies" FOR SELECT USING (("tenant_id" = ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."clerk_id" = ("auth"."jwt"() ->> 'sub'::"text"))
 LIMIT 1)));



CREATE POLICY "User read own waitlist" ON "public"."waitlist_registrations" FOR SELECT USING (("user_id" = ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."clerk_id" = ("auth"."jwt"() ->> 'sub'::"text"))
 LIMIT 1)));



CREATE POLICY "User read properties in waitlist or tenancy" ON "public"."properties" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM ("public"."waitlist_registrations" "w"
     JOIN "public"."users" "u" ON (("u"."id" = "w"."user_id")))
  WHERE (("w"."property_id" = "properties"."id") AND ("u"."clerk_id" = ("auth"."jwt"() ->> 'sub'::"text"))))) OR (EXISTS ( SELECT 1
   FROM ("public"."tenancies" "t"
     JOIN "public"."users" "u" ON (("u"."id" = "t"."tenant_id")))
  WHERE (("t"."property_id" = "properties"."id") AND ("u"."clerk_id" = ("auth"."jwt"() ->> 'sub'::"text")))))));



CREATE POLICY "User update own profile" ON "public"."users" FOR UPDATE USING (("clerk_id" = ("auth"."jwt"() ->> 'sub'::"text"))) WITH CHECK (("clerk_id" = ("auth"."jwt"() ->> 'sub'::"text")));



ALTER TABLE "public"."admin_permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."media" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."properties" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rooms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tenancies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."units" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."waitlist_registrations" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."current_user_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."current_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON TABLE "public"."admin_permissions" TO "anon";
GRANT ALL ON TABLE "public"."admin_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."media" TO "anon";
GRANT ALL ON TABLE "public"."media" TO "authenticated";
GRANT ALL ON TABLE "public"."media" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."properties" TO "anon";
GRANT ALL ON TABLE "public"."properties" TO "authenticated";
GRANT ALL ON TABLE "public"."properties" TO "service_role";



GRANT ALL ON TABLE "public"."rooms" TO "anon";
GRANT ALL ON TABLE "public"."rooms" TO "authenticated";
GRANT ALL ON TABLE "public"."rooms" TO "service_role";



GRANT ALL ON TABLE "public"."tenancies" TO "anon";
GRANT ALL ON TABLE "public"."tenancies" TO "authenticated";
GRANT ALL ON TABLE "public"."tenancies" TO "service_role";



GRANT ALL ON TABLE "public"."units" TO "anon";
GRANT ALL ON TABLE "public"."units" TO "authenticated";
GRANT ALL ON TABLE "public"."units" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."waitlist_registrations" TO "anon";
GRANT ALL ON TABLE "public"."waitlist_registrations" TO "authenticated";
GRANT ALL ON TABLE "public"."waitlist_registrations" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







