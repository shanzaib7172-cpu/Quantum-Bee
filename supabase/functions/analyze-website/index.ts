import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMeta(html: string) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
  const desc =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1] ??
    "";
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const imgs = html.match(/<img[\s>][^>]*>/gi) || [];
  const imgsWithoutAlt = imgs.filter((t) => !/\salt\s*=/.test(t)).length;
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(html);
  const hasOg = /<meta[^>]+property=["']og:/i.test(html);
  const hasJsonLd = /application\/ld\+json/i.test(html);
  return {
    title,
    description: desc,
    h1Count,
    imgCount: imgs.length,
    imgsWithoutAlt,
    hasViewport,
    hasCanonical,
    hasOg,
    hasJsonLd,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let target = url.trim();
    if (!/^https?:\/\//i.test(target)) target = "https://" + target;

    let html = "";
    let status = 0;
    let loadMs = 0;
    try {
      const t0 = Date.now();
      const resp = await fetch(target, {
        headers: { "User-Agent": "Mozilla/5.0 BeeAI-Analyzer" },
      });
      loadMs = Date.now() - t0;
      status = resp.status;
      html = await resp.text();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: `Could not reach site: ${e instanceof Error ? e.message : "unknown"}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const meta = extractMeta(html);
    const text = stripHtml(html).slice(0, 6000);
    const sizeKb = Math.round(html.length / 1024);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a senior web growth & SEO consultant. Analyze the website and return a single function call with: an overall score (0-100), category scores, concise strengths, prioritized improvements, and growth/scale recommendations. Be specific and actionable.",
          },
          {
            role: "user",
            content: `Analyze this website.\n\nURL: ${target}\nHTTP status: ${status}\nLoad time: ${loadMs}ms\nHTML size: ${sizeKb}KB\n\nMeta:\n- Title: ${meta.title}\n- Description: ${meta.description}\n- H1 count: ${meta.h1Count}\n- Images: ${meta.imgCount} (missing alt: ${meta.imgsWithoutAlt})\n- Viewport meta: ${meta.hasViewport}\n- Canonical: ${meta.hasCanonical}\n- OpenGraph: ${meta.hasOg}\n- JSON-LD: ${meta.hasJsonLd}\n\nVisible text excerpt:\n${text}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_website_analysis",
              description: "Return the structured website analysis.",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "Overall score 0-100" },
                  summary: { type: "string", description: "2-3 sentence summary" },
                  categories: {
                    type: "object",
                    properties: {
                      seo: { type: "number" },
                      performance: { type: "number" },
                      design: { type: "number" },
                      content: { type: "number" },
                      conversion: { type: "number" },
                    },
                    required: ["seo", "performance", "design", "content", "conversion"],
                    additionalProperties: false,
                  },
                  strengths: { type: "array", items: { type: "string" } },
                  improvements: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        priority: { type: "string", enum: ["high", "medium", "low"] },
                        detail: { type: "string" },
                      },
                      required: ["title", "priority", "detail"],
                      additionalProperties: false,
                    },
                  },
                  scale_recommendations: { type: "array", items: { type: "string" } },
                },
                required: ["score", "summary", "categories", "strengths", "improvements", "scale_recommendations"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_website_analysis" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiResp.json();
    const args = aiJson?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) {
      return new Response(JSON.stringify({ error: "No analysis returned" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const analysis = JSON.parse(args);

    return new Response(
      JSON.stringify({
        url: target,
        meta: { ...meta, status, loadMs, sizeKb },
        analysis,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("analyze-website error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
