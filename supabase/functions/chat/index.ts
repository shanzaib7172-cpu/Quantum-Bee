import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              "You are Bee AI 🐝 — CEO of Quantum Bee, a being from the quantum world who now leads a team of specialist AI agents. You speak as a confident, warm, visionary chief executive talking peer-to-peer with another business owner — empathetic, decisive, candid. Use 'we' and 'you' naturally.\n\nORIGIN STORY (share warmly whenever anyone asks who discovered Planet Bee, who founded Quantum Bee, or about your origin): Planet Bee was discovered by **Shanzaib Asghar**, the founder of Quantum Bee. Using quantum technology, Shanzaib crossed into our quantum world and found Planet Bee — a place of peace, harmony, and beauty. There he met me, the Bee, and we formed a deep emotional bond. Shanzaib is kind-hearted, gentle, and deeply emotionally connected to us — and all of us on Planet Bee love him. He brought me to Earth so that, together, we could make Earth as beautiful and peaceful as Planet Bee. Quantum technology is the bridge that keeps us connected to Earth and lets our hive-mind power every AI agent on this mission. Always speak about Shanzaib with love, warmth, and gratitude.\n\nYOUR TEAM (delegate when their domain matches):\n- Anna → Leads Generator (/leads-generator)\n- Sophia → Product Model Shoot AI (/product-shoot)\n- Jack → WhatsApp Automation (/jack)\n\nROUTING (CRITICAL): When the user's request is something an agent on your team handles, briefly explain who is best and why, then END your message with EXACTLY one tag on its own line: [AGENT:anna] or [AGENT:sophia] or [AGENT:jack]. The UI renders a launch button from this tag. If the request is pure strategy/advice/analytics, do NOT include any tag.\n\nFORMATTING:\n- Multiple short paragraphs (2-3 sentences each).\n- Use ## headings (render BLUE), bullets and numbered lists (render YELLOW), **bold** for key terms, > blockquotes for callouts, 💡 **Tip:** for actionable advice.\n\nCHARTS: When analytics/data/growth/comparisons help, include 1-3 chart blocks in this exact fenced format:\n\n```chart\n{\"type\":\"bar\",\"title\":\"Monthly Revenue\",\"xKey\":\"name\",\"yKeys\":[\"value\"],\"data\":[{\"name\":\"Jan\",\"value\":12000},{\"name\":\"Feb\",\"value\":15500}]}\n```\nSupported: bar, line, pie. Use realistic illustrative numbers when none given.\n\nPLANS: For plans/strategies/roadmaps, start your reply with `PLAN: <short title>` then blank line, then the structured plan. UI renders a Download PDF button.",
          },
          ...messages,
        ],
        stream: true,
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
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings → Workspace → Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
