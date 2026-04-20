import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function escapeSQL(str: string | null | undefined): string {
  if (str == null) return "";
  return String(str).replace(/'/g, "''");
}

function sqlVal(val: unknown): string {
  if (val == null) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return `'${escapeSQL(JSON.stringify(val))}'::jsonb`;
  return `'${escapeSQL(String(val))}'`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let sql = `-- ══════════════════════════════════════════════════════════\n`;
    sql += `-- Founders KSA — COMPLETE Database Export\n`;
    sql += `-- Generated: ${new Date().toISOString()}\n`;
    sql += `-- Includes: Schema + Enums + Functions + RLS + ALL Data\n`;
    sql += `-- ══════════════════════════════════════════════════════════\n\n`;

    // ─── ENUMS ───
    sql += `-- ══════════════════════════════════════\n`;
    sql += `-- ENUMS\n`;
    sql += `-- ══════════════════════════════════════\n\n`;

    sql += `DO $$ BEGIN\n  CREATE TYPE public.app_role AS ENUM ('admin', 'user');\nEXCEPTION WHEN duplicate_object THEN NULL;\nEND $$;\n\n`;
    sql += `DO $$ BEGIN\n  CREATE TYPE public.article_status AS ENUM ('public', 'private', 'draft');\nEXCEPTION WHEN duplicate_object THEN NULL;\nEND $$;\n\n`;
    sql += `DO $$ BEGIN\n  CREATE TYPE public.article_type AS ENUM ('founder_story', 'insight', 'rising_founder');\nEXCEPTION WHEN duplicate_object THEN NULL;\nEND $$;\n\n`;

    // ─── TABLES ───
    sql += `-- ══════════════════════════════════════\n`;
    sql += `-- TABLES\n`;
    sql += `-- ══════════════════════════════════════\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS public.articles (\n`;
    sql += `  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n`;
    sql += `  title text NOT NULL,\n`;
    sql += `  slug text NOT NULL,\n`;
    sql += `  type article_type NOT NULL,\n`;
    sql += `  status article_status NOT NULL DEFAULT 'draft',\n`;
    sql += `  category text,\n`;
    sql += `  excerpt text,\n`;
    sql += `  content jsonb NOT NULL DEFAULT '[]'::jsonb,\n`;
    sql += `  metadata jsonb DEFAULT '{}'::jsonb,\n`;
    sql += `  country text DEFAULT 'Saudi Arabia',\n`;
    sql += `  created_at timestamptz NOT NULL DEFAULT now(),\n`;
    sql += `  updated_at timestamptz NOT NULL DEFAULT now()\n`;
    sql += `);\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS public.submissions (\n`;
    sql += `  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n`;
    sql += `  created_at timestamptz NOT NULL DEFAULT now(),\n`;
    sql += `  email text NOT NULL,\n`;
    sql += `  name text,\n`;
    sql += `  message text,\n`;
    sql += `  type text NOT NULL DEFAULT 'subscription'\n`;
    sql += `);\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS public.founder_applications (\n`;
    sql += `  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n`;
    sql += `  created_at timestamptz NOT NULL DEFAULT now(),\n`;
    sql += `  founder_name text NOT NULL,\n`;
    sql += `  email text NOT NULL,\n`;
    sql += `  phone text,\n`;
    sql += `  country text NOT NULL,\n`;
    sql += `  city text,\n`;
    sql += `  linkedin_url text,\n`;
    sql += `  company_name text NOT NULL,\n`;
    sql += `  company_website text,\n`;
    sql += `  industry text NOT NULL,\n`;
    sql += `  one_liner text NOT NULL,\n`;
    sql += `  founded_date text,\n`;
    sql += `  stage text NOT NULL,\n`;
    sql += `  num_cofounders integer NOT NULL DEFAULT 1,\n`;
    sql += `  cofounder_details jsonb,\n`;
    sql += `  is_incubated boolean NOT NULL DEFAULT false,\n`;
    sql += `  incubator_name text,\n`;
    sql += `  funding_amount text,\n`;
    sql += `  funding_type text,\n`;
    sql += `  grants_received text,\n`;
    sql += `  feature_type text NOT NULL DEFAULT 'rising_founder',\n`;
    sql += `  message text,\n`;
    sql += `  status text NOT NULL DEFAULT 'new',\n`;
    sql += `  age text,\n`;
    sql += `  gender text,\n`;
    sql += `  education text,\n`;
    sql += `  team_size text,\n`;
    sql += `  revenue text,\n`;
    sql += `  social_media text,\n`;
    sql += `  founder_role text\n`;
    sql += `);\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS public.kickstart_signups (\n`;
    sql += `  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n`;
    sql += `  created_at timestamptz NOT NULL DEFAULT now(),\n`;
    sql += `  name text NOT NULL,\n`;
    sql += `  email text NOT NULL,\n`;
    sql += `  whatsapp text NOT NULL,\n`;
    sql += `  business_idea text NOT NULL,\n`;
    sql += `  help_needed text[] NOT NULL DEFAULT '{}',\n`;
    sql += `  status text NOT NULL DEFAULT 'new'\n`;
    sql += `);\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS public.user_roles (\n`;
    sql += `  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n`;
    sql += `  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,\n`;
    sql += `  role app_role NOT NULL,\n`;
    sql += `  UNIQUE (user_id, role)\n`;
    sql += `);\n\n`;

    // ─── FUNCTIONS ───
    sql += `-- ══════════════════════════════════════\n`;
    sql += `-- FUNCTIONS\n`;
    sql += `-- ══════════════════════════════════════\n\n`;

    sql += `CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)\n`;
    sql += `RETURNS boolean\nLANGUAGE sql\nSTABLE\nSECURITY DEFINER\nSET search_path = public\nAS $$\n`;
    sql += `  SELECT EXISTS (\n    SELECT 1 FROM public.user_roles\n    WHERE user_id = _user_id AND role = 'admin'\n  )\n$$;\n\n`;

    sql += `CREATE OR REPLACE FUNCTION public.update_updated_at_column()\n`;
    sql += `RETURNS trigger\nLANGUAGE plpgsql\nSET search_path = public\nAS $$\nBEGIN\n  NEW.updated_at = now();\n  RETURN NEW;\nEND;\n$$;\n\n`;

    // ─── RLS ───
    sql += `-- ══════════════════════════════════════\n`;
    sql += `-- ROW LEVEL SECURITY\n`;
    sql += `-- ══════════════════════════════════════\n\n`;

    const tables = ['articles', 'submissions', 'founder_applications', 'kickstart_signups', 'user_roles'];
    for (const t of tables) {
      sql += `ALTER TABLE public.${t} ENABLE ROW LEVEL SECURITY;\n`;
    }
    sql += `\n`;

    // Articles RLS
    sql += `CREATE POLICY "Public can read published articles" ON public.articles FOR SELECT TO public USING ((status = 'public'::article_status) OR is_admin(auth.uid()));\n`;
    sql += `CREATE POLICY "Admins can insert articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));\n`;
    sql += `CREATE POLICY "Admins can update articles" ON public.articles FOR UPDATE TO authenticated USING (is_admin(auth.uid()));\n`;
    sql += `CREATE POLICY "Admins can delete articles" ON public.articles FOR DELETE TO authenticated USING (is_admin(auth.uid()));\n\n`;

    // Submissions RLS
    sql += `CREATE POLICY "Anyone can insert submissions" ON public.submissions FOR INSERT TO public WITH CHECK (true);\n`;
    sql += `CREATE POLICY "Admins can view submissions" ON public.submissions FOR SELECT TO public USING (is_admin(auth.uid()));\n`;
    sql += `CREATE POLICY "Admins can delete submissions" ON public.submissions FOR DELETE TO public USING (is_admin(auth.uid()));\n\n`;

    // Founder applications RLS
    sql += `CREATE POLICY "Anyone can submit applications" ON public.founder_applications FOR INSERT TO public WITH CHECK (true);\n`;
    sql += `CREATE POLICY "Admins can view applications" ON public.founder_applications FOR SELECT TO public USING (is_admin(auth.uid()));\n`;
    sql += `CREATE POLICY "Admins can update applications" ON public.founder_applications FOR UPDATE TO public USING (is_admin(auth.uid()));\n`;
    sql += `CREATE POLICY "Admins can delete applications" ON public.founder_applications FOR DELETE TO public USING (is_admin(auth.uid()));\n\n`;

    // Kickstart signups RLS
    sql += `CREATE POLICY "Anyone can submit a kickstart signup" ON public.kickstart_signups FOR INSERT TO public WITH CHECK (true);\n`;
    sql += `CREATE POLICY "Only admins can view kickstart signups" ON public.kickstart_signups FOR SELECT TO public USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role));\n`;
    sql += `CREATE POLICY "Admins can update kickstart signups" ON public.kickstart_signups FOR UPDATE TO public USING (is_admin(auth.uid()));\n\n`;

    // User roles RLS
    sql += `CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated USING (is_admin(auth.uid()));\n`;
    sql += `CREATE POLICY "Only admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));\n`;
    sql += `CREATE POLICY "Only admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (is_admin(auth.uid()));\n`;
    sql += `CREATE POLICY "Only admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (is_admin(auth.uid()));\n\n`;

    // ─── DATA ───
    sql += `-- ══════════════════════════════════════\n`;
    sql += `-- ALL DATA\n`;
    sql += `-- ══════════════════════════════════════\n\n`;

    // Helper to export a table
    async function exportTable(tableName: string, columns: string[]) {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw new Error(`Error fetching ${tableName}: ${error.message}`);
      if (!data || data.length === 0) {
        sql += `-- ${tableName}: No data\n\n`;
        return;
      }

      sql += `-- ${tableName}: ${data.length} rows\n`;
      for (const row of data) {
        const cols = columns.join(", ");
        const vals = columns.map(c => sqlVal(row[c])).join(",\n  ");
        sql += `INSERT INTO public.${tableName} (${cols})\nVALUES (\n  ${vals}\n) ON CONFLICT (id) DO UPDATE SET\n`;
        sql += columns.filter(c => c !== "id").map(c => `  ${c} = EXCLUDED.${c}`).join(",\n");
        sql += `;\n\n`;
      }
    }

    await exportTable("articles", [
      "id", "title", "slug", "type", "status", "category", "excerpt",
      "content", "metadata", "country", "created_at", "updated_at"
    ]);

    await exportTable("submissions", [
      "id", "created_at", "email", "name", "message", "type"
    ]);

    await exportTable("founder_applications", [
      "id", "created_at", "founder_name", "email", "phone", "country", "city",
      "linkedin_url", "company_name", "company_website", "industry", "one_liner",
      "founded_date", "stage", "num_cofounders", "cofounder_details", "is_incubated",
      "incubator_name", "funding_amount", "funding_type", "grants_received",
      "feature_type", "message", "status", "age", "gender", "education",
      "team_size", "revenue", "social_media", "founder_role"
    ]);

    await exportTable("kickstart_signups", [
      "id", "created_at", "name", "email", "whatsapp", "business_idea",
      "help_needed", "status"
    ]);

    sql += `-- ══════════════════════════════════════\n`;
    sql += `-- END OF EXPORT\n`;
    sql += `-- ══════════════════════════════════════\n`;

    return new Response(sql, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": "attachment; filename=founders-ksa-complete-export.sql",
      },
    });
  } catch (e) {
    console.error("export error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
