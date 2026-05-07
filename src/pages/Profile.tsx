import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, CreditCard, Shield, KeyRound, LogOut,
  Loader2, Plus, Copy, Trash2, Check, Camera,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import TopBar from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

type Tab = "dashboard" | "projects" | "billing" | "security" | "api";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
  { id: "api", label: "API", icon: KeyRound },
];

const AGENTS = ["Anna", "Sophia", "Jack", "David", "Mark", "Peter"];

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-bee" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="space-y-1">
          <div className="px-3 py-3 mb-2 rounded-xl glass">
            <p className="text-xs text-muted-foreground">Signed in</p>
            <p className="text-sm font-medium truncate">{user.email}</p>
          </div>
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-bee/15 text-bee border border-bee/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/");
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 mt-3 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent transition-all"
          >
            <LogOut className="w-4 h-4" />
            Log in to Earth
          </button>
        </aside>

        <main className="min-w-0">
          {tab === "dashboard" && <Dashboard userId={user.id} />}
          {tab === "projects" && <Projects userId={user.id} />}
          {tab === "billing" && <Billing />}
          {tab === "security" && <Security email={user.email || ""} />}
          {tab === "api" && <ApiKeys />}
        </main>
      </div>
    </div>
  );
}

/* ───────── Dashboard ───────── */

function Dashboard({ userId }: { userId: string }) {
  const [activity, setActivity] = useState<any[]>([]);
  const [projectCount, setProjectCount] = useState(0);
  const [keyCount, setKeyCount] = useState(0);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      const [{ data: act }, { count: pc }, { count: kc }] = await Promise.all([
        supabase.from("agent_activity").select("*").eq("user_id", userId).gte("occurred_at", since).order("occurred_at"),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("api_keys").select("*", { count: "exact", head: true }).eq("user_id", userId).is("revoked_at", null),
      ]);
      setActivity(act || []);
      setProjectCount(pc || 0);
      setKeyCount(kc || 0);
    })();
  }, [userId]);

  // Build per-day totals + per-agent scores
  const series = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      days[d] = 0;
    }
    activity.forEach((r) => {
      const d = String(r.occurred_at).slice(0, 10);
      if (d in days) days[d] += Number(r.value || 1);
    });
    return Object.entries(days).map(([d, v]) => ({ d: d.slice(5), v }));
  }, [activity]);

  const totalScore = activity.reduce((s, r) => s + Number(r.value || 1), 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-heading font-semibold text-gradient">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your hive at a glance — last 30 days.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat label="Total activity" value={String(totalScore)} />
        <Stat label="Projects" value={String(projectCount)} />
        <Stat label="Active API keys" value={String(keyCount)} />
      </div>

      <Card className="p-4 glass border-border/50">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Activity over time</p>
        <div className="h-56">
          <ResponsiveContainer>
            <LineChart data={series}>
              <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.3} />
              <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Line type="monotone" dataKey="v" stroke="hsl(45,100%,55%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 glass border-border/50">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Score by agent</p>
        <div className="space-y-3">
          {AGENTS.map((agent) => {
            const score = activity.filter((r) => r.agent === agent).reduce((s, r) => s + Number(r.value || 1), 0);
            const max = Math.max(1, ...AGENTS.map((a) => activity.filter((r) => r.agent === a).reduce((s, r) => s + Number(r.value || 1), 0)));
            const pct = (score / max) * 100;
            return (
              <div key={agent} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground">{agent}</span>
                  <span className="text-muted-foreground">{score}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary/40 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-bee to-bee-blue" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4 glass border-border/50">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-2xl font-heading font-semibold text-foreground mt-1">{value}</p>
    </Card>
  );
}

/* ───────── Projects ───────── */

function Projects({ userId }: { userId: string }) {
  const [filter, setFilter] = useState<"all" | "draft">("all");
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const { toast } = useToast();

  const load = async () => {
    let q = supabase.from("projects").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (filter === "draft") q = q.eq("status", "draft");
    const { data } = await q;
    setItems(data || []);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  const create = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from("projects").insert({ user_id: userId, name: name.trim(), status: "draft" });
    if (error) { toast({ variant: "destructive", title: "Could not create", description: error.message }); return; }
    setName(""); load();
  };

  const remove = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-semibold text-gradient">Projects</h1>
        <div className="flex gap-1 p-1 rounded-lg glass">
          {(["all", "draft"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-md transition-all ${filter === f ? "bg-bee/20 text-bee" : "text-muted-foreground"}`}>
              {f === "all" ? "All projects" : "Drafts"}
            </button>
          ))}
        </div>
      </header>

      <Card className="p-4 glass border-border/50 flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New project name…"
          onKeyDown={(e) => e.key === "Enter" && create()} className="bg-secondary/30 border-border/50" />
        <Button onClick={create} className="bg-bee/15 text-bee border border-bee/30 hover:bg-bee/25" variant="ghost">
          <Plus className="w-4 h-4 mr-1" /> Create
        </Button>
      </Card>

      <div className="grid gap-2">
        {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No projects yet.</p>}
        {items.map((p) => (
          <Card key={p.id} className="p-3 glass border-border/50 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.status} · {new Date(p.created_at).toLocaleDateString()}</p>
            </div>
            <button onClick={() => remove(p.id)} className="p-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ───────── Billing ───────── */

function Billing() {
  const plans = [
    { name: "Worker Bee", price: "$0", features: ["Bee CEO chat", "1 active agent", "Community access"] },
    { name: "Queen Bee", price: "$29/mo", features: ["All agents unlocked", "10 projects", "Priority support"], featured: true },
    { name: "Hive Master", price: "$99/mo", features: ["Unlimited", "API access", "Dedicated CEO sessions"] },
  ];
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-heading font-semibold text-gradient">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">Pick the plan that fits your hive.</p>
      </header>
      <div className="grid sm:grid-cols-3 gap-3">
        {plans.map((p) => (
          <Card key={p.name} className={`p-5 glass border-border/50 ${p.featured ? "ring-2 ring-bee/40" : ""}`}>
            <p className="text-sm text-muted-foreground">{p.name}</p>
            <p className="text-2xl font-heading font-semibold mt-1">{p.price}</p>
            <ul className="mt-4 space-y-1.5">
              {p.features.map((f) => (
                <li key={f} className="text-xs text-foreground/80 flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-bee" /> {f}
                </li>
              ))}
            </ul>
            <Button className="w-full mt-4 bg-bee/15 text-bee border border-bee/30 hover:bg-bee/25" variant="ghost">
              {p.featured ? "Upgrade" : "Choose"}
            </Button>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center">Real billing coming soon.</p>
    </div>
  );
}

/* ───────── Security ───────── */

function Security({ email }: { email: string }) {
  const [newPass, setNewPass] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const updatePassword = async () => {
    if (newPass.length < 8) { toast({ variant: "destructive", title: "Password too short", description: "Min 8 characters." }); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setBusy(false);
    if (error) toast({ variant: "destructive", title: "Failed", description: error.message });
    else { toast({ title: "Password updated 🔒" }); setNewPass(""); }
  };

  const updateEmail = async () => {
    if (!newEmail.includes("@")) return;
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setBusy(false);
    if (error) toast({ variant: "destructive", title: "Failed", description: error.message });
    else { toast({ title: "Check your inbox to confirm new email" }); setNewEmail(""); }
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-heading font-semibold text-gradient">Security</h1>
        <p className="text-sm text-muted-foreground mt-1">Lock down your account.</p>
      </header>

      <Card className="p-5 glass border-border/50 space-y-3">
        <p className="text-sm font-medium">Two-factor authentication</p>
        <p className="text-xs text-muted-foreground">2FA via authenticator app — coming soon. Currently your account is protected by password + email.</p>
        <Button disabled className="bg-bee/10 text-bee border border-bee/20 cursor-not-allowed" variant="ghost">Enable 2FA (soon)</Button>
      </Card>

      <Card className="p-5 glass border-border/50 space-y-3">
        <p className="text-sm font-medium">Change password</p>
        <Input type="password" placeholder="New password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="bg-secondary/30 border-border/50" />
        <Button onClick={updatePassword} disabled={busy} className="bg-bee/15 text-bee border border-bee/30 hover:bg-bee/25" variant="ghost">Update password</Button>
      </Card>

      <Card className="p-5 glass border-border/50 space-y-3">
        <p className="text-sm font-medium">Email address</p>
        <p className="text-xs text-muted-foreground">Current: {email}</p>
        <Input type="email" placeholder="New email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="bg-secondary/30 border-border/50" />
        <Button onClick={updateEmail} disabled={busy} className="bg-bee/15 text-bee border border-bee/30 hover:bg-bee/25" variant="ghost">Update email</Button>
      </Card>
    </div>
  );
}

/* ───────── API Keys ───────── */

function ApiKeys() {
  const [keys, setKeys] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("api_keys").select("*").order("created_at", { ascending: false });
    setKeys(data || []);
  };
  useEffect(() => { load(); }, []);

  const generate = async () => {
    if (!name.trim()) return;
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("api-keys", { body: { action: "create", name: name.trim() } });
    setBusy(false);
    if (error || !data?.key) { toast({ variant: "destructive", title: "Failed", description: error?.message || data?.error || "" }); return; }
    setNewKey(data.key);
    setName("");
    load();
  };

  const revoke = async (id: string) => {
    await supabase.functions.invoke("api-keys", { body: { action: "revoke", id } });
    load();
  };

  const copy = async (k: string) => {
    await navigator.clipboard.writeText(k);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-heading font-semibold text-gradient">API Keys</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate keys to call the Bee AI API. Keys are shown once — store them safely.</p>
      </header>

      <Card className="p-4 glass border-border/50 flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Key name (e.g. production)"
          onKeyDown={(e) => e.key === "Enter" && generate()} className="bg-secondary/30 border-border/50" />
        <Button onClick={generate} disabled={busy} className="bg-bee/15 text-bee border border-bee/30 hover:bg-bee/25" variant="ghost">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-1" /> Generate</>}
        </Button>
      </Card>

      {newKey && (
        <Card className="p-4 border-bee/40 bg-bee/5 space-y-2">
          <p className="text-xs text-bee uppercase tracking-wider">Your new key — copy it now, you won't see it again</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-background/60 p-2 rounded font-mono break-all">{newKey}</code>
            <Button size="sm" onClick={() => copy(newKey)} variant="ghost" className="bg-bee/15 text-bee border border-bee/30">
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>
          <button onClick={() => setNewKey(null)} className="text-xs text-muted-foreground hover:text-foreground">I've saved it, dismiss</button>
        </Card>
      )}

      <div className="grid gap-2">
        {keys.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No API keys yet.</p>}
        {keys.map((k) => (
          <Card key={k.id} className="p-3 glass border-border/50 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{k.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{k.key_prefix}…··· · {new Date(k.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              {k.revoked_at ? (
                <span className="text-xs text-destructive">revoked</span>
              ) : (
                <button onClick={() => revoke(k.id)} className="text-xs text-muted-foreground hover:text-destructive">
                  Revoke
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 glass border-border/50">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Usage</p>
        <pre className="text-[11px] bg-background/40 p-3 rounded overflow-x-auto"><code>{`curl https://api.quantumbee.ai/v1/chat \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"Hello Bee"}'`}</code></pre>
      </Card>
    </div>
  );
}
