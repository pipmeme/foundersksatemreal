import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://foundersksa.com";
const LOGO_URL = "https://foundersksa.com/logo.png";

function buildHTML(opts: {
  title: string;
  description: string;
  url: string;
  type?: string;
  image?: string;
}) {
  const { title, description, url, type = "website", image = LOGO_URL } = opts;
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${safeTitle}</title>
<meta name="description" content="${safeDesc}">

<!-- Open Graph -->
<meta property="og:title" content="${safeTitle}">
<meta property="og:description" content="${safeDesc}">
<meta property="og:type" content="${type}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta property="og:site_name" content="Founders KSA">
<meta property="og:locale" content="en_US">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${safeTitle}">
<meta name="twitter:description" content="${safeDesc}">
<meta name="twitter:image" content="${image}">

<meta http-equiv="refresh" content="0;url=${url}">
<link rel="canonical" href="${url}">
<script>window.location.replace(${JSON.stringify(url)});</script>
</head>
<body>
<p>Redirecting to <a href="${url}">${safeTitle}</a>...</p>
<script>window.location.href=${JSON.stringify(url)};</script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "/";

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const pageUrl = `${SITE_URL}${path}`;

  // ── Story pages ──
  const storyMatch = path.match(/^\/stories\/(.+)$/);
  if (storyMatch) {
    const slug = storyMatch[1];
    const { data } = await supabase
      .from("articles")
      .select("title, excerpt, metadata, category")
      .eq("slug", slug)
      .eq("type", "founder_story")
      .eq("status", "public")
      .maybeSingle();

    if (data) {
      const meta = data.metadata as any;
      const desc =
        data.excerpt ||
        meta?.intro?.slice(0, 155) ||
        `Read the founder story of ${meta?.founder || "an entrepreneur"} building in Saudi Arabia.`;

      return new Response(
        buildHTML({
          title: `${data.title} — Founders KSA`,
          description: desc,
          url: pageUrl,
          type: "article",
        }),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
  }

  // ── Insight pages ──
  const insightMatch = path.match(/^\/insights\/(.+)$/);
  if (insightMatch) {
    const slug = insightMatch[1];
    const { data } = await supabase
      .from("articles")
      .select("title, excerpt, category")
      .eq("slug", slug)
      .eq("type", "insight")
      .eq("status", "public")
      .maybeSingle();

    if (data) {
      const desc =
        data.excerpt ||
        `Read this insight about ${data.category || "business"} in Saudi Arabia.`;

      return new Response(
        buildHTML({
          title: `${data.title} — Founders KSA`,
          description: desc,
          url: pageUrl,
          type: "article",
        }),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
  }

  // ── Static pages ──
  const staticPages: Record<string, { title: string; description: string }> = {
    "/": {
      title: "Founders KSA — Real Stories from Saudi Arabia's Boldest Entrepreneurs",
      description: "Go behind the scenes with entrepreneurs building in Saudi Arabia. Real lessons, real failures, real wins.",
    },
    "/stories": {
      title: "Founder Stories — Founders KSA",
      description: "Real stories from real founders across Saudi Arabia. From gaming to biotech, healthcare to F&B.",
    },
    "/insights": {
      title: "Insights — Founders KSA",
      description: "Strategic insights, market analysis, and ecosystem intelligence for doing business in Saudi Arabia.",
    },
    "/about": {
      title: "About — Founders KSA",
      description: "Learn about our mission to empower entrepreneurs with knowledge, resources, and inspiration to build in Saudi Arabia.",
    },
    "/startup-guide": {
      title: "Startup Guide — Founders KSA",
      description: "Your complete guide to starting a business in Saudi Arabia. Licensing, regulations, and step-by-step setup.",
    },
    "/startup-guide/misa-license": {
      title: "MISA License Guide — Founders KSA",
      description: "Step-by-step guide to obtaining a MISA foreign investment license in Saudi Arabia.",
    },
    "/startup-guide/business-faq": {
      title: "Business FAQ — Founders KSA",
      description: "Common questions and answers about starting and running a business in Saudi Arabia.",
    },
    "/startup-guide/premium-residency": {
      title: "Premium Residency Guide — Founders KSA",
      description: "Everything you need to know about Saudi Arabia's Premium Residency program for entrepreneurs and investors.",
    },
  };

  const staticPage = staticPages[path];
  if (staticPage) {
    return new Response(
      buildHTML({
        title: staticPage.title,
        description: staticPage.description,
        url: pageUrl,
      }),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // Fallback
  return new Response(
    buildHTML({
      title: "Founders KSA — Real Stories from Saudi Arabia's Boldest Entrepreneurs",
      description: "Go behind the scenes with entrepreneurs building in Saudi Arabia. Real lessons, real failures, real wins.",
      url: pageUrl,
    }),
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
});
