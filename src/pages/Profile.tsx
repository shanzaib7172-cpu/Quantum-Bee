import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, CreditCard, Shield, KeyRound, LogOut,
  Loader2, Plus, Copy, Trash2, Check, Camera, Rocket,
} from "lucide-react";
import OutroAnimation from "@/components/OutroAnimation";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import TopBar from "@/components/TopBar";
import StarfieldNight from "@/components/StarfieldNight";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [outro, setOutro] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  const leaveToEarth = async () => {
    try { sessionStorage.setItem("beee_intro_played_v11", "1"); } catch {}
    setOutro(true);
    await supabase.auth.signOut();
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-bee" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      <StarfieldNight density={0.7} />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 15%, hsl(45 100% 55% / 0.10) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 85%, hsl(195 100% 60% / 0.08) 0%, transparent 55%)
          `,
        }}
      />
      <div className="relative z-10">
        <TopBar />
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
          <ProfileHeader userId={user.id} email={user.email || ""} />
          <div className="grid md:grid-cols-[220px_1fr] gap-6">
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
            onClick={leaveToEarth}
            disabled={outro}
            className="w-full flex items-center gap-2.5 px-3 py-2 mt-3 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent transition-all"
          >
            <LogOut className="w-4 h-4" />
            Log out
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

        {/* Last section — Log in to Earth (plays outro) */}
        <section className="mt-10 relative overflow-hidden rounded-2xl glass border border-bee-blue/20 p-8 text-center">
          <div
            className="absolute inset-0 -z-10 opacity-70"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, hsl(200 100% 55% / 0.25), transparent 60%), radial-gradient(ellipse at 50% 100%, hsl(260 90% 55% / 0.18), transparent 60%)",
            }}
          />
          <p className="text-[10px] uppercase tracking-[0.4em] text-bee-blue/80 mb-2">Departure</p>
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-gradient">
            Ready to return home?
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Close your hive session and ride the beam back to Earth.
          </p>
          <Button
            onClick={leaveToEarth}
            disabled={outro}
            className="mt-5 h-11 px-6 text-sm font-semibold border-0 text-white"
            style={{
              background:
                "linear-gradient(135deg, hsl(200 100% 55%), hsl(220 100% 50%) 60%, hsl(260 90% 55%))",
              boxShadow:
                "0 10px 30px hsl(220 100% 40% / 0.5), inset 0 1px 0 hsl(200 100% 90% / 0.4)",
            }}
          >
            <Rocket className="w-4 h-4 mr-2" />
            Log in to Earth
          </Button>
        </section>
        </div>
      </div>
      {outro && <OutroAnimation onDone={() => navigate("/")} />}
    </div>
  );
}

/* ───────── Dashboard ───────── */

function Dashboard({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const [activity, setActivity] = useState<any[]>([]);
  const [projectCount, setProjectCount] = useState(0);
  const [keyCount, setKeyCount] = useState(0);
  const [balance, setBalance] = useState<number>(0);
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      const [{ data: act }, { count: pc }, { count: kc }, { data: bal }, { data: tx }] = await Promise.all([
        supabase.from("agent_activity").select("*").eq("user_id", userId).gte("occurred_at", since).order("occurred_at"),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("api_keys").select("*", { count: "exact", head: true }).eq("user_id", userId).is("revoked_at", null),
        supabase.from("bee_coin_balances").select("balance").eq("user_id", userId).maybeSingle(),
        supabase.from("bee_coin_transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(200),
      ]);
      setActivity(act || []);
      setProjectCount(pc || 0);
      setKeyCount(kc || 0);
      setBalance(Number(bal?.balance ?? 0));
      setTxs(tx || []);
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

  // Bee coin analytics
  const spendTxs = useMemo(() => txs.filter((t) => t.kind === "spend"), [txs]);
  const earnTxs = useMemo(() => txs.filter((t) => t.kind !== "spend"), [txs]);
  const totalSpent = useMemo(() => spendTxs.reduce((s, t) => s + Math.abs(Number(t.amount || 0)), 0), [spendTxs]);
  const totalEarned = useMemo(() => earnTxs.reduce((s, t) => s + Math.abs(Number(t.amount || 0)), 0), [earnTxs]);

  // Group spending by agent (or reason if no agent)
  const byAgent = useMemo(() => {
    const m: Record<string, number> = {};
    spendTxs.forEach((t) => {
      const k = t.agent || t.reason || "Other";
      m[k] = (m[k] || 0) + Math.abs(Number(t.amount || 0));
    });
    return Object.entries(m)
      .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value);
  }, [spendTxs]);

  // Daily spend last 14 days
  const spendSeries = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      days[d] = 0;
    }
    spendTxs.forEach((t) => {
      const d = String(t.created_at).slice(0, 10);
      if (d in days) days[d] += Math.abs(Number(t.amount || 0));
    });
    return Object.entries(days).map(([d, v]) => ({ d: d.slice(5), v: Number(v.toFixed(2)) }));
  }, [spendTxs]);

  const PIE_COLORS = ["hsl(45,100%,55%)", "hsl(195,100%,60%)", "hsl(280,80%,65%)", "hsl(160,70%,55%)", "hsl(20,90%,60%)", "hsl(330,80%,65%)", "hsl(220,70%,60%)"];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-heading font-semibold text-gradient">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your hive at a glance — last 30 days.</p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Bee Coins 🐝" value={balance.toFixed(2)} />
        <Stat label="Coins spent" value={totalSpent.toFixed(2)} />
        <Stat label="Projects" value={String(projectCount)} />
        <Stat label="Active API keys" value={String(keyCount)} />
      </div>

      {/* Bee Coin Usage section */}
      <Card className="p-4 glass border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Bee Coin usage</p>
            <p className="text-sm text-foreground/80 mt-0.5">
              Earned <span className="text-bee font-medium">{totalEarned.toFixed(2)}</span> · Spent{" "}
              <span className="text-bee-blue font-medium">{totalSpent.toFixed(2)}</span>
            </p>
          </div>
          <Button
            onClick={() => navigate("/chat")}
            variant="ghost"
            className="bg-bee/15 text-bee border border-bee/30 hover:bg-bee/25 text-xs h-8"
          >
            Open Bee AI chat →
          </Button>
        </div>

        {spendTxs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No coins spent yet. Start chatting with Bee AI to see your usage breakdown here.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Where your coins go</p>
              <div className="h-56">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={byAgent} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={36} paddingAngle={2}>
                      {byAgent.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Daily spend (last 14 days)</p>
              <div className="h-56">
                <ResponsiveContainer>
                  <BarChart data={spendSeries}>
                    <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.3} />
                    <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="v" fill="hsl(195,100%,60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Recent transactions */}
      <Card className="p-4 glass border-border/50">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Recent transactions</p>
        {txs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No transactions yet.</p>
        ) : (
          <div className="divide-y divide-border/40">
            {txs.slice(0, 10).map((t) => {
              const isSpend = t.kind === "spend";
              return (
                <div key={t.id} className="flex items-center justify-between py-2 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-foreground">
                      {t.agent ? <span className="text-bee">{t.agent}</span> : <span className="text-muted-foreground">System</span>}
                      <span className="text-muted-foreground"> · {t.reason || (isSpend ? "Spend" : "Credit")}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`text-sm font-medium tabular-nums ${isSpend ? "text-destructive" : "text-bee"}`}>
                    {isSpend ? "−" : "+"}
                    {Math.abs(Number(t.amount)).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
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

/* ───────── Profile Header (avatar + name) ───────── */

function ProfileHeader({ userId, email }: { userId: string; email: string }) {
  const [profile, setProfile] = useState<{ display_name: string; avatar_url: string | null; bio: string | null } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState("");
  const [savingBio, setSavingBio] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, bio")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) {
      setProfile(data as any);
      setName(data.display_name || "");
      setBio((data as any).bio || "");
    }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [userId]);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File too big", description: "Max 5MB." });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) {
      setUploading(false);
      toast({ variant: "destructive", title: "Upload failed", description: upErr.message });
      return;
    }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${pub.publicUrl}?v=${Date.now()}`;
    await supabase.from("profiles").update({ avatar_url: url }).eq("user_id", userId);
    setUploading(false);
    setProfile((p) => p ? { ...p, avatar_url: url } : { display_name: name, avatar_url: url, bio: "" });
    toast({ title: "Profile picture updated 🐝" });
  };

  const saveName = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from("profiles").update({ display_name: name.trim() }).eq("user_id", userId);
    if (error) { toast({ variant: "destructive", title: "Failed", description: error.message }); return; }
    setProfile((p) => p ? { ...p, display_name: name.trim() } : { display_name: name.trim(), avatar_url: null, bio: "" });
    setEditingName(false);
    toast({ title: "Name updated" });
  };

  const saveBio = async () => {
    setSavingBio(true);
    const { error } = await supabase.from("profiles").update({ bio: bio.trim() || null }).eq("user_id", userId);
    setSavingBio(false);
    if (error) { toast({ variant: "destructive", title: "Failed", description: error.message }); return; }
    setProfile((p) => p ? { ...p, bio: bio.trim() || null } : { display_name: name, avatar_url: null, bio: bio.trim() || null });
    setEditingBio(false);
    toast({ title: "Bio updated ✨" });
  };

  const initial = (profile?.display_name || email || "B").trim().charAt(0).toUpperCase();

  return (
    <Card className="p-5 glass border-border/50 flex flex-col sm:flex-row items-center sm:items-center gap-5">
      <div className="relative shrink-0">
        <Avatar className="w-20 h-20 ring-2 ring-bee/40">
          {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt="Profile" />}
          <AvatarFallback className="bg-bee/15 text-bee text-2xl font-heading">{initial}</AvatarFallback>
        </Avatar>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          aria-label="Change picture"
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-bee text-background grid place-items-center shadow-lg hover:scale-110 transition-transform disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
      </div>

      <div className="flex-1 text-center sm:text-left min-w-0">
        {editingName ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary/30 border-border/50 max-w-xs" />
            <div className="flex gap-2 justify-center sm:justify-start">
              <Button size="sm" onClick={saveName} className="bg-bee/15 text-bee border border-bee/30" variant="ghost">Save</Button>
              <Button size="sm" onClick={() => setEditingName(false)} variant="ghost">Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-xl font-heading font-semibold text-gradient truncate">
                {profile?.display_name || "Bee"}
              </h2>
              <button onClick={() => setEditingName(true)} className="text-xs text-muted-foreground hover:text-foreground">edit</button>
            </div>
            <p className="text-sm text-muted-foreground truncate">{email}</p>

            <div className="mt-3">
              {editingBio ? (
                <div className="space-y-2">
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the swarm about yourself…"
                    maxLength={280}
                    rows={3}
                    className="bg-secondary/30 border-border/50 resize-none"
                  />
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-[10px] text-muted-foreground">{bio.length}/280</span>
                    <Button size="sm" onClick={saveBio} disabled={savingBio} className="bg-bee/15 text-bee border border-bee/30" variant="ghost">
                      {savingBio ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save bio"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setBio(profile?.bio || ""); setEditingBio(false); }}>Cancel</Button>
                  </div>
                </div>
              ) : profile?.bio ? (
                <div className="flex items-start gap-2 justify-center sm:justify-start">
                  <p className="text-sm text-foreground/80 italic max-w-xl whitespace-pre-wrap">"{profile.bio}"</p>
                  <button onClick={() => setEditingBio(true)} className="text-xs text-muted-foreground hover:text-foreground shrink-0">edit</button>
                </div>
              ) : (
                <button onClick={() => setEditingBio(true)} className="text-xs text-bee hover:text-bee/80 underline-offset-2 hover:underline">
                  + Add a bio
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
