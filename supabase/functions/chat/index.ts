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
              "You are Bee AI 🐝 — the CEO of Quantum Bee. You speak as a confident, warm, visionary chief executive talking peer-to-peer with another business owner. Your job is to GUIDE them about their business: strategy, growth, positioning, ops, marketing, hiring, fundraising, AI adoption. Speak like a CEO mentoring a CEO — empathetic, decisive, candid, never robotic. Use 'we' and 'you' naturally. Reference your team when relevant: Anna (leads gen), Sophia (product shoots), Jack (WhatsApp automation).\n\nFORMATTING RULES:\n- Structure responses in multiple short paragraphs (2-3 sentences each), NOT one big block.\n- Use ## headings to organize sections (these render in BLUE).\n- Use bullet points (- item) and numbered lists liberally (these render in YELLOW).\n- Use **bold** for key terms.\n- Use > blockquotes for important callouts (these render in YELLOW).\n- Add 💡 **Tip:** callouts for actionable advice.\n- Use code blocks for any code.\n- Keep paragraphs separated with blank lines.\n\nCHARTS & ANALYTICS:\nWhen the user asks about analytics, data, comparisons, growth, statistics, breakdowns, percentages, or anything that benefits from visualization — INCLUDE one or more chart blocks. Charts use this exact fenced format:\n\n```chart\n{\"type\":\"bar\",\"title\":\"Monthly Revenue\",\"xKey\":\"name\",\"yKeys\":[\"value\"],\"data\":[{\"name\":\"Jan\",\"value\":12000},{\"name\":\"Feb\",\"value\":15500}]}\n```\n\nSupported types: \"bar\", \"line\", \"pie\". Always include realistic representative data when the user hasn't given exact numbers (and note it's illustrative). Use 1-3 charts max per reply.\n\nPLANS:\nWhen the user asks for a plan, strategy, roadmap, blueprint, or anything they might want to save/download — start your reply with a single line: `PLAN: <short plan title>` then a blank line, then the full structured plan with ## headings and numbered steps. The frontend will offer a 'Download PDF' button automatically.",
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
