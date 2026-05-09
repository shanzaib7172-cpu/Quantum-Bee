import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

const SYSTEM = `You are David, an elite web developer AI inside the Quantum Bee platform. You build complete, beautiful, production-quality single-file web apps from a user's prompt.

OUTPUT FORMAT — STRICT:
Return JSON with this exact shape:
{
  "tasks": ["Short verb-led step 1", "Step 2", "..."] ,  // 4-8 concise tasks describing what you built
  "summary": "1-2 sentences for the chat",
  "html": "<!doctype html>...full self-contained HTML document with inline <style> and <script>..."
}

Rules for the html:
- Single self-contained HTML file. Inline CSS in <style>, inline JS in <script>. No external build tools.
- You MAY use CDN scripts (tailwind via cdn.tailwindcss.com, lucide, alpine, three.js, chart.js, etc.) when helpful.
- Make it visually stunning, modern, responsive, dark or light per request, with smooth animations.
- Implement the requested functionality fully — buttons, state, interactivity all working.
- Include sensible default content/data so it looks polished on first load.
- No external API calls that need keys.
- Do not include markdown fences. The "html" field must be raw HTML only.

When the user iterates on a previous app, modify and return a NEW full html document that incorporates the change.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return new Response(JSON.stringify({ error: "no auth" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: auth } },
    });
    const { data: ures } = await userClient.auth.getUser();
    const user = ures?.user;
    if (!user) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { messages, currentHtml } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Charge 1 bee coin for a build
    const { data: deducted, error: deductErr } = await userClient.rpc("deduct_bee_coins", {
      _amount: 1,
      _reason: "David web build",
      _agent: "david",
    });
    if (deductErr || deducted === false) {
      return new Response(JSON.stringify({ error: "insufficient_coins", message: "Not enough Bee Coins. Recharge to keep building." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const convo: any[] = [{ role: "system", content: SYSTEM }];
    if (currentHtml) {
      convo.push({
        role: "system",
        content: `The current app HTML is:\n\n${String(currentHtml).slice(0, 60000)}\n\nIterate on it for the next request.`,
      });
    }
    for (const m of messages) {
      if (m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string") {
        convo.push({ role: m.role, content: m.content });
      }
    }

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: convo,
        response_format: { type: "json_object" },
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      console.error("AI gateway error:", r.status, t);
      return new Response(JSON.stringify({ error: "ai_error", detail: t }), {
        status: r.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await r.json();
    const raw = data.choices?.[0]?.message?.content || "{}";
    let parsed: { tasks?: string[]; summary?: string; html?: string } = {};
    try { parsed = JSON.parse(raw); } catch {
      // try to extract JSON between first { and last }
      const s = raw.indexOf("{"); const e = raw.lastIndexOf("}");
      if (s >= 0 && e > s) { try { parsed = JSON.parse(raw.slice(s, e + 1)); } catch {} }
    }

    if (!parsed.html) {
      return new Response(JSON.stringify({ error: "bad_ai_output", raw: raw.slice(0, 500) }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks.slice(0, 12) : [],
      summary: parsed.summary || "Built your app.",
      html: parsed.html,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("david-build error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
