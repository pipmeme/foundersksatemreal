import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { rawContent, articleType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!rawContent?.trim()) {
      return new Response(JSON.stringify({ error: "No content provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert content editor for Founders KSA, a premium editorial platform about Saudi Arabia's startup ecosystem.

Your job is to take raw, unstructured text and transform it into a perfectly structured article JSON that matches our exact schema.

ARTICLE TYPES:
- "insight": Analytical pieces about the Saudi startup ecosystem. Metadata needs: readTime (e.g. "5 min read").
- "founder_story": In-depth founder journey stories. Metadata needs: founder (name), company (name), intro (opening paragraph before timeline), milestones (array of {label} for timeline).
- "rising_founder": Spotlight on early-stage founders. Metadata needs: founder (name), company (name), stage, oneLiner, linkedin (optional), website (optional).

CONTENT STRUCTURE:
Each article's "content" is an array of sections. Each section has:
- "heading": Section title (string, can be empty for intro paragraphs)
- "pullQuote": A memorable quote or key insight from that section (string, optional but use them — they make the article premium)
- "paragraphs": Array of paragraph strings

RULES:
1. Break content into 3-7 meaningful sections with clear headings
2. Extract or craft compelling pull quotes for at least 2-3 sections
3. Keep paragraphs focused — each should be 2-4 sentences max
4. The last section should be titled "Conclusion" for insights (it renders as a special takeaway card)
5. Write in a premium editorial tone — authoritative but accessible
6. Generate a compelling title and concise excerpt (1-2 sentences)
7. Suggest a URL-friendly slug
8. Assign a relevant category (e.g. "Growth", "F&B", "Fintech", "Legal", "Funding")
9. For founder_story: extract timeline milestones from the content (key moments in the journey)
10. For founder_story: write a strong intro paragraph that hooks the reader

Return ONLY valid JSON matching this exact structure, no markdown wrapping.`;

    const userPrompt = `Article type: ${articleType}

Raw content to structure:
---
${rawContent}
---

Return the structured article JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "format_article",
              description: "Return the structured article data",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Article title" },
                  slug: { type: "string", description: "URL-friendly slug" },
                  category: { type: "string", description: "Article category" },
                  excerpt: { type: "string", description: "1-2 sentence summary" },
                  content: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        heading: { type: "string" },
                        pullQuote: { type: "string" },
                        paragraphs: { type: "array", items: { type: "string" } },
                      },
                      required: ["paragraphs"],
                    },
                  },
                  metadata: {
                    type: "object",
                    properties: {
                      founder: { type: "string" },
                      company: { type: "string" },
                      intro: { type: "string" },
                      milestones: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: { label: { type: "string" } },
                          required: ["label"],
                        },
                      },
                      readTime: { type: "string" },
                      stage: { type: "string" },
                      oneLiner: { type: "string" },
                      linkedin: { type: "string" },
                      website: { type: "string" },
                    },
                  },
                },
                required: ["title", "slug", "category", "excerpt", "content", "metadata"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "format_article" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI processing failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: "AI did not return structured data" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const article = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ article }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("format-article error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
