import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  if (!slug) {
    const { data: articles } = await supabase
      .from("articles")
      .select("title, slug, category, type, excerpt, metadata")
      .eq("status", "public")
      .order("created_at", { ascending: false });

    if (!articles || articles.length === 0) {
      return new Response("No articles found.", {
        headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    let text = "# Founders KSA — All Articles\n\n";
    for (const a of articles) {
      const meta = a.metadata as any;
      text += `## ${a.title}\n`;
      text += `- Category: ${a.category || "General"}\n`;
      text += `- Type: ${a.type}\n`;
      if (meta?.founder) text += `- Founder: ${meta.founder}\n`;
      if (meta?.company) text += `- Company: ${meta.company}\n`;
      if (a.excerpt) text += `- Summary: ${a.excerpt}\n`;
      const path = a.type === "founder_story" ? "stories" : "insights";
      text += `- Read: https://foundersksa.com/${path}/${a.slug}\n\n`;
    }

    return new Response(text, {
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const { data, error } = await supabase
    .from("articles")
    .select("title, category, content, metadata, excerpt, type")
    .eq("slug", slug)
    .eq("status", "public")
    .maybeSingle();

  if (error || !data) {
    return new Response("Article not found.", {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const metadata = data.metadata as any;
  const content = data.content as any[];

  let text = `# ${data.title}\n\n`;
  if (metadata?.founder) text += `**Founder:** ${metadata.founder}\n`;
  if (metadata?.company) text += `**Company:** ${metadata.company}\n`;
  if (data.category) text += `**Category:** ${data.category}\n`;
  text += `**Source:** Founders KSA (https://foundersksa.com)\n\n---\n\n`;

  if (metadata?.intro) text += `${metadata.intro}\n\n`;

  if (metadata?.milestones?.length > 0) {
    text += "## Key Milestones\n\n";
    for (const m of metadata.milestones) {
      text += `- **${m.year}** — ${m.title}: ${m.description}\n`;
    }
    text += "\n";
  }

  if (Array.isArray(content)) {
    for (const section of content) {
      if (section.heading) text += `## ${section.heading}\n\n`;
      if (section.pullQuote) text += `> "${section.pullQuote}"\n\n`;
      if (section.paragraphs) {
        for (const para of section.paragraphs) {
          text += `${para}\n\n`;
        }
      }
    }
  }

  text += "---\nPublished on Founders KSA\n";

  return new Response(text, {
    headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
  });
});
