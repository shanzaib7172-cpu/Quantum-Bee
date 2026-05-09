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

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const escapeHtml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

const latestUserPrompt = (messages: Array<{ role?: string; content?: string }>) =>
  [...messages].reverse().find((m) => m?.role === "user" && typeof m.content === "string")?.content?.trim() || "a polished web app";

const fallbackBuild = (prompt: string) => {
  const title = escapeHtml(prompt.slice(0, 70) || "Your web app");
  const promptText = escapeHtml(prompt.slice(0, 220));
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>David Starter Preview</title>
  <style>
    *{box-sizing:border-box} body{margin:0;min-height:100vh;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#071018;color:#f8fafc;display:grid;place-items:center;padding:28px;overflow:hidden} body:before{content:"";position:fixed;inset:-20%;background:radial-gradient(circle at 20% 25%,rgba(45,212,191,.22),transparent 28%),radial-gradient(circle at 80% 10%,rgba(250,204,21,.18),transparent 24%),linear-gradient(135deg,#071018,#101827 52%,#041712);z-index:-1}.shell{width:min(980px,100%);border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);backdrop-filter:blur(18px);box-shadow:0 24px 90px rgba(0,0,0,.34);border-radius:24px;overflow:hidden}.bar{height:48px;display:flex;align-items:center;gap:8px;padding:0 18px;border-bottom:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04)}.dot{width:11px;height:11px;border-radius:50%;background:#ef4444}.dot:nth-child(2){background:#facc15}.dot:nth-child(3){background:#2dd4bf}.content{padding:clamp(28px,6vw,72px);display:grid;grid-template-columns:1.15fr .85fr;gap:34px;align-items:center}.eyebrow{color:#5eead4;text-transform:uppercase;font-weight:800;font-size:12px;letter-spacing:.18em}h1{font-size:clamp(34px,7vw,74px);line-height:.95;margin:14px 0 18px;letter-spacing:0}.lead{color:rgba(248,250,252,.78);font-size:18px;line-height:1.65;max-width:58ch}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}.button{border:0;border-radius:999px;padding:13px 18px;font-weight:800;cursor:pointer}.primary{background:#facc15;color:#111827}.secondary{background:rgba(255,255,255,.1);color:#f8fafc;border:1px solid rgba(255,255,255,.12)}.panel{display:grid;gap:12px}.card{padding:18px;border-radius:18px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12)}.metric{font-size:34px;font-weight:900;color:#facc15}.small{color:rgba(248,250,252,.64);font-size:13px;line-height:1.5}@media(max-width:760px){.content{grid-template-columns:1fr}.shell{border-radius:18px}.actions{flex-direction:column}.button{width:100%}}
  </style>
</head>
<body>
  <main class="shell">
    <div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
    <section class="content">
      <div>
        <div class="eyebrow">David safe preview</div>
        <h1>${title}</h1>
        <p class="lead">${promptText}</p>
        <div class="actions"><button class="button primary">Launch idea</button><button class="button secondary">Customize</button></div>
      </div>
      <div class="panel">
        <div class="card"><div class="metric">3</div><div class="small">Core sections prepared while the AI builder reconnects.</div></div>
        <div class="card"><strong>Next step</strong><div class="small">Try the prompt again in a moment and David will replace this starter with a full generated app.</div></div>
      </div>
    </section>
  </main>
</body>
</html>`;

  return {
    fallback: true,
    tasks: ["Kept the build session alive", "Generated a safe starter preview", "Avoided charging Bee Coins for the failed AI call"],
    summary: "David's AI builder is temporarily busy, so I created a safe starter preview instead. No Bee Coins were charged — try again in a moment for the full build.",
    html,
  };
};

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
      return jsonResponse({ error: "messages required" }, 400);
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

    let r: Response;
    try {
      r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
    } catch (e) {
      console.error("AI gateway fetch failed:", e);
      return jsonResponse(fallbackBuild(latestUserPrompt(messages)));
    }

    if (!r.ok) {
      const t = await r.text();
      console.error("AI gateway error:", r.status, t);
      if (r.status >= 500) return jsonResponse(fallbackBuild(latestUserPrompt(messages)));
      return jsonResponse({ error: "ai_error", detail: t }, r.status);
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
      console.error("Bad AI output:", raw.slice(0, 500));
      return jsonResponse(fallbackBuild(latestUserPrompt(messages)));
    }

    // Charge 1 bee coin only after a successful AI build.
    const { data: deducted, error: deductErr } = await userClient.rpc("deduct_bee_coins", {
      _amount: 1,
      _reason: "David web build",
      _agent: "david",
    });
    if (deductErr || deducted === false) {
      return jsonResponse({ error: "insufficient_coins", message: "Not enough Bee Coins. Recharge to keep building." }, 402);
    }

    return new Response(JSON.stringify({
      fallback: false,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks.slice(0, 12) : [],
      summary: parsed.summary || "Built your app.",
      html: parsed.html,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("david-build error:", e);
    return jsonResponse(fallbackBuild("a polished web app"));
  }
});
