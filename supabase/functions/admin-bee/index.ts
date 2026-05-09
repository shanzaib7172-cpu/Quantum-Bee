import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

const tools = [
  {
    type: "function",
    function: {
      name: "create_notification",
      description: "Send a site-wide notification to all users.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          body: { type: "string" },
          link: { type: "string" },
          icon: { type: "string" },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_blog",
      description: "Create and optionally publish a blog post.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          slug: { type: "string", description: "url-friendly slug" },
          content: { type: "string", description: "markdown content" },
          excerpt: { type: "string" },
          published: { type: "boolean" },
        },
        required: ["title", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_stats",
      description: "Get overall platform stats: users, revenue, expenses, blogs, sessions, messages.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "list_recent_users",
      description: "List most recent user profiles.",
      parameters: {
        type: "object",
        properties: { limit: { type: "number" } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "moderate_user",
      description: "Block, unblock, suspend, unsuspend, verify or unverify a user by user_id.",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: "string" },
          action: {
            type: "string",
            enum: ["block", "unblock", "suspend", "unsuspend", "verify", "unverify"],
          },
        },
        required: ["user_id", "action"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_expense",
      description: "Add an expense entry.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          amount: { type: "number" },
          category: { type: "string" },
          notes: { type: "string" },
        },
        required: ["title", "amount"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "open_david",
      description: "Open David, the Web Developer agent, optionally with a starter prompt for the user. Use this when the admin asks to build, prototype, design or generate a website, landing page, tool, or web app.",
      parameters: {
        type: "object",
        properties: {
          prompt: { type: "string", description: "Initial prompt to seed David with" },
        },
      },
    },
  },
];

async function runTool(name: string, args: any, admin: any, adminUserId: string) {
  switch (name) {
    case "create_notification": {
      const { data, error } = await admin.from("notifications").insert({
        title: args.title,
        body: args.body ?? null,
        link: args.link ?? null,
        icon: args.icon ?? null,
        created_by: adminUserId,
      }).select().single();
      if (error) return { error: error.message };
      return { ok: true, notification: data };
    }
    case "create_blog": {
      const slug = (args.slug || args.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const { data, error } = await admin.from("blogs").insert({
        title: args.title,
        slug,
        content: args.content,
        excerpt: args.excerpt ?? null,
        published: args.published ?? false,
        author_id: adminUserId,
      }).select().single();
      if (error) return { error: error.message };
      return { ok: true, blog: data };
    }
    case "get_stats": {
      const [users, payments, expenses, blogs, sessions, messages] = await Promise.all([
        admin.from("profiles").select("*", { count: "exact", head: true }),
        admin.from("payments").select("amount,status"),
        admin.from("expenses").select("amount"),
        admin.from("blogs").select("*", { count: "exact", head: true }),
        admin.from("chat_sessions").select("*", { count: "exact", head: true }),
        admin.from("chat_messages").select("*", { count: "exact", head: true }),
      ]);
      const revenue = (payments.data || [])
        .filter((p: any) => p.status === "completed")
        .reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
      const totalExpenses = (expenses.data || []).reduce(
        (s: number, e: any) => s + Number(e.amount || 0),
        0,
      );
      return {
        users: users.count ?? 0,
        revenue,
        expenses: totalExpenses,
        profit: revenue - totalExpenses,
        blogs: blogs.count ?? 0,
        sessions: sessions.count ?? 0,
        messages: messages.count ?? 0,
      };
    }
    case "list_recent_users": {
      const { data, error } = await admin
        .from("profiles")
        .select("user_id,display_name,verified,blocked,suspended,created_at")
        .order("created_at", { ascending: false })
        .limit(Math.min(args.limit ?? 10, 50));
      if (error) return { error: error.message };
      return { users: data };
    }
    case "moderate_user": {
      const updates: any = {};
      if (args.action === "block") updates.blocked = true;
      if (args.action === "unblock") updates.blocked = false;
      if (args.action === "suspend") updates.suspended = true;
      if (args.action === "unsuspend") updates.suspended = false;
      if (args.action === "verify") updates.verified = true;
      if (args.action === "unverify") updates.verified = false;
      const { error } = await admin.from("profiles").update(updates).eq("user_id", args.user_id);
      if (error) return { error: error.message };
      return { ok: true, action: args.action };
    }
    case "add_expense": {
      const { data, error } = await admin.from("expenses").insert({
        title: args.title,
        amount: args.amount,
        category: args.category ?? null,
        notes: args.notes ?? null,
        created_by: adminUserId,
      }).select().single();
      if (error) return { error: error.message };
      return { ok: true, expense: data };
    }
    case "open_david": {
      const url = "/david" + (args.prompt ? `?prompt=${encodeURIComponent(args.prompt)}` : "");
      return { ok: true, action: "navigate", url, message: "Opening David — Web Developer." };
    }
  }
  return { error: "unknown tool" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return new Response(JSON.stringify({ error: "no auth" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
    });
    const { data: ures } = await userClient.auth.getUser();
    const user = ures?.user;
    if (!user) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { messages } = await req.json();

    const systemPrompt = `You are Bee, the admin AI assistant for the Quantum Bee admin dashboard. You speak warmly and confidently. You have tools to query stats, manage users (verify/block/suspend), create site-wide notifications, publish blog posts, and log expenses. When the admin asks for action, USE the tools — don't just describe. After tool calls, summarize the result in a short friendly reply. For data questions, call get_stats or list_recent_users first. Always confirm destructive actions briefly. Format with markdown when helpful.`;

    const convo: any[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    // Tool-call loop (max 5 iterations)
    for (let i = 0; i < 5; i++) {
      const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: convo,
          tools,
        }),
      });
      if (!r.ok) {
        const t = await r.text();
        return new Response(JSON.stringify({ error: "AI gateway error", detail: t }), { status: r.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const data = await r.json();
      const msg = data.choices?.[0]?.message;
      if (!msg) break;
      convo.push(msg);

      const calls = msg.tool_calls;
      if (!calls || calls.length === 0) {
        return new Response(JSON.stringify({ reply: msg.content || "" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      for (const c of calls) {
        let args: any = {};
        try { args = JSON.parse(c.function.arguments || "{}"); } catch {}
        const result = await runTool(c.function.name, args, admin, user.id);
        convo.push({
          role: "tool",
          tool_call_id: c.id,
          content: JSON.stringify(result),
        });
      }
    }

    return new Response(JSON.stringify({ reply: "Done." }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("admin-bee error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
