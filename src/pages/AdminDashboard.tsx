import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  Ticket,
  CreditCard,
  LogOut,
  Loader2,
  Trash2,
  Plus,
  ShieldCheck,
  UserPlus,
  TrendingUp,
  Pencil,
  ArrowLeft,
  ExternalLink,
  Bell,
  MoreVertical,
  BadgeCheck,
  Ban,
  PauseCircle,
  Send,
  Download,
  Wallet,
  DollarSign,
  Receipt,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Line,
  LineChart,
} from "recharts";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import beeLogo from "@/assets/bee-logo.png";
import { STATIC_BLOGS } from "@/lib/blogClicks";

type Section =
  | "overview"
  | "users"
  | "community"
  | "blogs"
  | "coupons"
  | "payments"
  | "notifications"
  | "expenses";

const NAV: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "users", label: "Users", icon: Users },
  { key: "community", label: "Community", icon: MessageSquare },
  { key: "blogs", label: "Blogs", icon: FileText },
  { key: "coupons", label: "Coupons", icon: Ticket },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "expenses", label: "Expenses", icon: Wallet },
];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const csvEscape = (v: any) => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const downloadCSV = (filename: string, rows: Record<string, any>[]) => {
  if (!rows || rows.length === 0) {
    toast({ title: "Nothing to export", description: "No data available yet." });
    return;
  }
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  hint,
  loading,
  tint = "bee",
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  hint?: string;
  loading?: boolean;
  tint?: "bee" | "primary" | "accent" | "blue";
}) => {
  const tintClass =
    tint === "primary"
      ? "text-primary bg-primary/10"
      : tint === "accent"
      ? "text-accent bg-accent/10"
      : tint === "blue"
      ? "text-bee-blue bg-bee-blue/10"
      : "text-bee bg-bee/10";

  return (
    <Card className="glass glass-highlight border-border/50 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl font-heading font-semibold text-foreground">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : value}
          </p>
          {hint && (
            <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
          )}
        </div>
        <div className={`shrink-0 rounded-xl p-2.5 ${tintClass}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </Card>
  );
};

const SectionHeader = ({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
    <div>
      <h2 className="text-xl sm:text-2xl font-heading font-semibold text-foreground flex items-center gap-2">
        <Icon className="w-5 h-5 text-bee" />
        {title}
      </h2>
      {description && (
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
);

/* ============================== OVERVIEW ============================== */

type RangeKey = "7" | "30" | "60" | "90" | "365" | "all";
const RANGE_OPTIONS: { value: RangeKey; label: string; days: number | null }[] = [
  { value: "7", label: "Last 7 days", days: 7 },
  { value: "30", label: "Last 30 days", days: 30 },
  { value: "60", label: "Last 60 days", days: 60 },
  { value: "90", label: "Last 90 days", days: 90 },
  { value: "365", label: "Last 1 year", days: 365 },
  { value: "all", label: "All time", days: null },
];

const RangedExport = ({
  filename,
  fetcher,
  size = "sm",
  className = "border-border/60",
  defaultRange = "30",
}: {
  filename: string;
  fetcher: (sinceIso: string | null, rangeLabel: string) => Promise<Record<string, any>[]>;
  size?: "sm" | "default";
  className?: string;
  defaultRange?: RangeKey;
}) => {
  const [range, setRange] = useState<RangeKey>(defaultRange);
  const [busy, setBusy] = useState(false);
  const meta = RANGE_OPTIONS.find((r) => r.value === range)!;
  const onClick = async () => {
    setBusy(true);
    try {
      const sinceIso = meta.days ? new Date(Date.now() - meta.days * 86400000).toISOString() : null;
      const rows = await fetcher(sinceIso, meta.label);
      downloadCSV(`${filename}-${range === "all" ? "all-time" : `last-${range}d`}`, rows);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Export failed", description: e?.message ?? "Unknown error" });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
        <SelectTrigger className={`${size === "sm" ? "h-8 text-xs" : "h-9"} w-[140px] bg-secondary/40 border-border/50`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {RANGE_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size={size} variant="outline" className={className} disabled={busy} onClick={onClick}>
        <Download className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} mr-1`} />{busy ? "…" : "Export CSV"}
      </Button>
    </div>
  );
};

const Overview = () => {
  const [range, setRange] = useState<RangeKey>("30");
  const rangeMeta = RANGE_OPTIONS.find((r) => r.value === range)!;

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats-extended", range],
    queryFn: async () => {
      const todayIso = new Date(new Date().toDateString()).toISOString();
      const sinceIso = rangeMeta.days
        ? new Date(Date.now() - rangeMeta.days * 86400000).toISOString()
        : new Date("2020-01-01").toISOString();

      const [users, msgs, admins, today, blogs, coupons, profilesTrend, msgsTrend, paymentsTrend, paymentsAll, sessionsTrend, blogClicksAll] =
        await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("community_messages").select("*", { count: "exact", head: true }),
          supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin"),
          supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", todayIso),
          supabase.from("blogs").select("*", { count: "exact", head: true }),
          supabase.from("coupons").select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("created_at").gte("created_at", sinceIso).order("created_at", { ascending: true }),
          supabase.from("community_messages").select("created_at").gte("created_at", sinceIso).order("created_at", { ascending: true }),
          supabase.from("payments").select("amount, created_at, status").gte("created_at", sinceIso),
          supabase.from("payments").select("amount, created_at, status"),
          supabase.from("chat_sessions").select("created_at").gte("created_at", sinceIso).order("created_at", { ascending: true }),
          supabase.from("blog_clicks").select("slug, clicks, updated_at"),
        ]);

      const allCompleted = ((paymentsAll.data ?? []) as any[]).filter((p) => p.status === "completed");
      const totalRevenue = allCompleted.reduce((s, p) => s + Number(p.amount || 0), 0);
      const todayRevenue = allCompleted
        .filter((p) => p.created_at >= todayIso)
        .reduce((s, p) => s + Number(p.amount || 0), 0);
      const totalClicks = ((blogClicksAll.data ?? []) as any[]).reduce((s, r) => s + Number(r.clicks || 0), 0);

      return {
        totalUsers: users.count ?? 0,
        totalMessages: msgs.count ?? 0,
        totalAdmins: admins.count ?? 0,
        newToday: today.count ?? 0,
        totalBlogs: blogs.count ?? 0,
        totalCoupons: coupons.count ?? 0,
        totalRevenue,
        todayRevenue,
        totalOrders: allCompleted.length,
        totalClicks,
        profilesTrend: (profilesTrend.data ?? []) as { created_at: string }[],
        msgsTrend: (msgsTrend.data ?? []) as { created_at: string }[],
        sessionsTrend: (sessionsTrend.data ?? []) as { created_at: string }[],
        paymentsTrend: ((paymentsTrend.data ?? []) as any[]).filter((p) => p.status === "completed"),
        sinceIso,
      };
    },
  });

  const trendData = useMemo(() => {
    if (!stats) return [];
    const days = rangeMeta.days ?? Math.max(
      1,
      Math.ceil((Date.now() - new Date(stats.sinceIso).getTime()) / 86400000),
    );
    const cap = Math.min(days, 400);
    const bucket: "day" | "month" = days > 90 ? "month" : "day";
    const map: Record<string, { date: string; users: number; messages: number; revenue: number; sessions: number; traffic: number }> = {};

    if (bucket === "day") {
      for (let i = cap - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const k = d.toISOString().slice(0, 10);
        map[k] = {
          date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          users: 0, messages: 0, revenue: 0, sessions: 0, traffic: 0,
        };
      }
    } else {
      const months = Math.max(1, Math.ceil(cap / 30));
      for (let i = months - 1; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i, 1);
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        map[k] = {
          date: d.toLocaleDateString(undefined, { month: "short", year: "2-digit" }),
          users: 0, messages: 0, revenue: 0, sessions: 0, traffic: 0,
        };
      }
    }

    const keyOf = (iso: string) => bucket === "day" ? iso.slice(0, 10) : iso.slice(0, 7);

    stats.profilesTrend.forEach((r) => { const k = keyOf(r.created_at); if (map[k]) map[k].users += 1; });
    stats.msgsTrend.forEach((r) => { const k = keyOf(r.created_at); if (map[k]) map[k].messages += 1; });
    stats.sessionsTrend.forEach((r) => { const k = keyOf(r.created_at); if (map[k]) map[k].sessions += 1; });
    stats.paymentsTrend.forEach((r: any) => { const k = keyOf(r.created_at); if (map[k]) map[k].revenue += Number(r.amount || 0); });
    // Traffic = users + messages + sessions (composite proxy for page activity)
    Object.values(map).forEach((r) => { r.traffic = r.users * 3 + r.messages + r.sessions * 2; });

    return Object.values(map);
  }, [stats, rangeMeta.days]);

  const pieData = [
    { name: "Members", value: Math.max(0, (stats?.totalUsers ?? 0) - (stats?.totalAdmins ?? 0)) },
    { name: "Admins", value: stats?.totalAdmins ?? 0 },
  ];
  const PIE_COLORS = ["hsl(195 100% 60%)", "hsl(45 100% 55%)"];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard"
        description="Live metrics across the Quantum Bee platform"
        icon={LayoutDashboard}
      />

      <Card className="glass glass-highlight border-bee/30 p-5 sm:p-6 bg-gradient-to-br from-bee/10 via-transparent to-bee-blue/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-bee/15 p-3 text-bee">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Total Revenue
              </p>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-bold text-foreground">
                ${(stats?.totalRevenue ?? 0).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.totalOrders ?? 0} completed orders · ${(stats?.todayRevenue ?? 0).toFixed(2)} today
              </p>
            </div>
          </div>
          <Badge className="bg-bee/20 text-bee border-bee/40">USD</Badge>
        </div>
      </Card>

      <Card className="glass glass-highlight border-border/50 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Activity · Users & Revenue
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">{rangeMeta.label}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
              <SelectTrigger className="w-[160px] h-9 bg-secondary/40 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RANGE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              className="border-border/60"
              onClick={() => {
                const rows = trendData.map((r) => ({
                  period: r.date,
                  new_users: r.users,
                  messages: r.messages,
                  revenue: Number(r.revenue ?? 0).toFixed(2),
                }));
                downloadCSV(`activity-${range === "all" ? "all-time" : `last-${range}d`}`, rows);
              }}
            >
              <Download className="w-4 h-4 mr-1" />Export CSV
            </Button>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(45 100% 55%)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(45 100% 55%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(140 80% 55%)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(140 80% 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(140 80% 55%)" fontSize={11} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: any, n: any) => n === "Revenue" ? [`$${Number(v).toFixed(2)}`, n] : [v, n]} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="users" stroke="hsl(45 100% 55%)" fill="url(#gUsers)" name="New users" />
              <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(140 80% 55%)" fill="url(#gRev)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Users" value={stats?.totalUsers ?? 0} icon={Users} loading={isLoading} tint="bee" hint={`${stats?.newToday ?? 0} new today`} />
        <StatCard label="Messages" value={stats?.totalMessages ?? 0} icon={MessageSquare} loading={isLoading} tint="blue" />
        <StatCard label="Admins" value={stats?.totalAdmins ?? 0} icon={ShieldCheck} loading={isLoading} tint="primary" />
        <StatCard label="New Today" value={stats?.newToday ?? 0} icon={UserPlus} loading={isLoading} tint="accent" />
        <StatCard label="Blogs" value={stats?.totalBlogs ?? 0} icon={FileText} loading={isLoading} tint="primary" />
        <StatCard label="Coupons" value={stats?.totalCoupons ?? 0} icon={Ticket} loading={isLoading} tint="bee" />
        <StatCard label="Orders" value={stats?.totalOrders ?? 0} icon={CreditCard} loading={isLoading} tint="blue" />
        <StatCard label="Engagement" value={stats ? Math.round((stats.totalMessages / Math.max(stats.totalUsers, 1)) * 10) / 10 : 0} icon={TrendingUp} loading={isLoading} tint="accent" hint="msgs per user" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass glass-highlight border-border/50 p-4 sm:p-5">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
            Messages per day
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="messages" fill="hsl(195 100% 60%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass glass-highlight border-border/50 p-4 sm:p-5">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
            User roles
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Sessions chart */}
      <Card className="glass glass-highlight border-border/50 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Sessions
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              {trendData.reduce((s, r) => s + r.sessions, 0)} chat sessions · {rangeMeta.label}
            </p>
          </div>
          <Badge variant="outline" className="border-bee-blue/40 text-bee-blue">Live</Badge>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gSess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(280 90% 65%)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(280 90% 65%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Area type="monotone" dataKey="sessions" stroke="hsl(280 90% 65%)" fill="url(#gSess)" name="Sessions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Geography world map */}
      <GeographySection totalUsers={stats?.totalUsers ?? 0} />

      {/* Traffic history */}
      <Card className="glass glass-highlight border-border/50 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Traffic history
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Composite of signups, messages and sessions · {rangeMeta.label}
            </p>
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Line type="monotone" dataKey="traffic" stroke="hsl(195 100% 60%)" strokeWidth={2} dot={false} name="Visits" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Performance data sheet */}
      <Card className="glass glass-highlight border-border/50 p-4 sm:p-5">
        <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
          Performance data sheet
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Per user</TableHead>
              <TableHead className="text-right">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(() => {
              const u = Math.max(stats?.totalUsers ?? 0, 1);
              const totalSessions = trendData.reduce((s, r) => s + r.sessions, 0);
              const totalTraffic = trendData.reduce((s, r) => s + r.traffic, 0);
              const rangeRev = trendData.reduce((s, r) => s + r.revenue, 0);
              const rangeMsgs = trendData.reduce((s, r) => s + r.messages, 0);
              const rangeUsers = trendData.reduce((s, r) => s + r.users, 0);
              const rows = [
                { m: "New users", v: rangeUsers, p: (rangeUsers / u).toFixed(2), t: "↗" },
                { m: "Messages", v: rangeMsgs, p: (rangeMsgs / u).toFixed(2), t: "↗" },
                { m: "Chat sessions", v: totalSessions, p: (totalSessions / u).toFixed(2), t: "↗" },
                { m: "Blog clicks", v: stats?.totalClicks ?? 0, p: ((stats?.totalClicks ?? 0) / u).toFixed(2), t: "→" },
                { m: "Revenue (USD)", v: `$${rangeRev.toFixed(2)}`, p: `$${(rangeRev / u).toFixed(2)}`, t: rangeRev > 0 ? "↗" : "→" },
                { m: "Traffic score", v: totalTraffic, p: (totalTraffic / u).toFixed(2), t: "↗" },
              ];
              return rows.map((r) => (
                <TableRow key={r.m}>
                  <TableCell className="font-medium">{r.m}</TableCell>
                  <TableCell className="text-right font-mono">{r.v}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{r.p}</TableCell>
                  <TableCell className="text-right text-bee">{r.t}</TableCell>
                </TableRow>
              ));
            })()}
          </TableBody>
        </Table>
      </Card>

      {/* Overall combined chart */}
      <Card className="glass glass-highlight border-border/50 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Everything in one graph
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Users, messages, sessions, traffic and revenue overlaid · {rangeMeta.label}
            </p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(140 80% 55%)" fontSize={11} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Legend />
              <Bar yAxisId="left" dataKey="messages" fill="hsl(195 100% 60%)" name="Messages" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="sessions" fill="hsl(280 90% 65%)" name="Sessions" radius={[4, 4, 0, 0]} />
              <Line yAxisId="left" type="monotone" dataKey="users" stroke="hsl(45 100% 55%)" strokeWidth={2} dot={false} name="New users" />
              <Line yAxisId="left" type="monotone" dataKey="traffic" stroke="hsl(0 80% 65%)" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Traffic" />
              <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(140 80% 55%)" fill="hsl(140 80% 55% / 0.2)" name="Revenue" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="glass glass-highlight border-border/50 p-5">
        <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-3">
          Summary in words
        </h3>
        <p className="text-sm text-foreground/80 leading-relaxed">
          The platform has{" "}
          <span className="text-bee font-semibold">{stats?.totalUsers ?? 0}</span>{" "}
          registered users, with{" "}
          <span className="text-bee font-semibold">{stats?.newToday ?? 0}</span>{" "}
          joining today. The community has exchanged{" "}
          <span className="text-bee-blue font-semibold">
            {stats?.totalMessages ?? 0}
          </span>{" "}
          messages and is moderated by{" "}
          <span className="text-primary font-semibold">
            {stats?.totalAdmins ?? 0}
          </span>{" "}
          admins. There are{" "}
          <span className="text-foreground font-semibold">
            {stats?.totalBlogs ?? 0}
          </span>{" "}
          blog posts and{" "}
          <span className="text-foreground font-semibold">
            {stats?.totalCoupons ?? 0}
          </span>{" "}
          coupons available.
        </p>
      </Card>
    </div>
  );
};

/* ============================== USERS ============================== */

const UsersSection = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [detailUid, setDetailUid] = useState<string | null>(null);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, user_id, display_name, avatar_url, bio, created_at, updated_at, verified, suspended, blocked")
          .order("created_at", { ascending: false })
          .limit(200),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      const adminIds = new Set(((roles ?? []) as any[]).filter((r) => r.role === "admin").map((r) => r.user_id));
      return ((profiles ?? []) as any[]).map((p) => ({ ...p, isAdmin: adminIds.has(p.user_id) }));
    },
  });

  const refetchAll = () => qc.invalidateQueries({ queryKey: ["admin-users"] });

  const grant = useMutation({
    mutationFn: async (uid: string) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: "Admin granted" }); refetchAll(); },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });
  const revoke = useMutation({
    mutationFn: async (uid: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "admin");
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: "Admin revoked" }); refetchAll(); },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const updateFlag = useMutation({
    mutationFn: async ({ uid, patch }: { uid: string; patch: Record<string, any> }) => {
      const { error } = await supabase.from("profiles").update(patch as any).eq("user_id", uid);
      if (error) throw error;
    },
    onSuccess: () => refetchAll(),
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const deleteProfile = useMutation({
    mutationFn: async (uid: string) => {
      const { error } = await supabase.from("profiles").delete().eq("user_id", uid);
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: "Profile deleted" }); refetchAll(); },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const detail = (usersData ?? []).find((u) => u.user_id === detailUid);

  return (
    <div>
      <SectionHeader title="Users" description={`${usersData?.length ?? 0} users`} icon={Users} />
      <Card className="glass glass-highlight border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-12"></TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="w-4 h-4 animate-spin mx-auto text-bee" /></TableCell></TableRow>
              )}
              {(usersData ?? []).map((u: any) => {
                const isSelf = user?.id === u.user_id;
                return (
                  <TableRow key={u.id} className="border-border/50 cursor-pointer hover:bg-secondary/20" onClick={() => setDetailUid(u.user_id)}>
                    <TableCell>
                      <Avatar className="w-8 h-8 border border-border/50">
                        <AvatarImage src={u.avatar_url ?? undefined} />
                        <AvatarFallback className="bg-bee/15 text-bee text-xs">
                          {(u.display_name || "B")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1.5">
                        {u.display_name}
                        {u.verified && <BadgeCheck className="w-4 h-4 text-bee-blue" />}
                        {isSelf && <span className="ml-1 text-[10px] text-muted-foreground">(you)</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {u.isAdmin ? (
                        <Badge className="bg-bee/20 text-bee border-bee/40 hover:bg-bee/25">Admin</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-secondary text-muted-foreground">Member</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.blocked && <Badge className="bg-destructive/20 text-destructive border-destructive/40">Blocked</Badge>}
                        {u.suspended && <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">Suspended</Badge>}
                        {!u.blocked && !u.suspended && <Badge variant="secondary" className="text-[10px]">Active</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{fmtDate(u.created_at)}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem onClick={() => setDetailUid(u.user_id)}>
                            <Users className="w-4 h-4 mr-2" /> View profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => updateFlag.mutate({ uid: u.user_id, patch: { verified: !u.verified } })}>
                            <BadgeCheck className="w-4 h-4 mr-2 text-bee-blue" />
                            {u.verified ? "Unverify profile" : "Verify profile"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateFlag.mutate({ uid: u.user_id, patch: { suspended: !u.suspended } })}>
                            <PauseCircle className="w-4 h-4 mr-2 text-amber-400" />
                            {u.suspended ? "Unsuspend" : "Suspend"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateFlag.mutate({ uid: u.user_id, patch: { blocked: !u.blocked } })}>
                            <Ban className="w-4 h-4 mr-2 text-destructive" />
                            {u.blocked ? "Unblock" : "Block"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {u.isAdmin ? (
                            <DropdownMenuItem disabled={isSelf} onClick={() => revoke.mutate(u.user_id)} className="text-destructive">
                              <ShieldCheck className="w-4 h-4 mr-2" /> Remove Admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => grant.mutate(u.user_id)}>
                              <ShieldCheck className="w-4 h-4 mr-2 text-bee" /> Make Admin
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={isSelf}
                            onClick={() => { if (confirm(`Delete profile of ${u.display_name}? This cannot be undone.`)) deleteProfile.mutate(u.user_id); }}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!detailUid} onOpenChange={(o) => !o && setDetailUid(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>User profile</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-bee/30">
                  <AvatarImage src={detail.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-bee/15 text-bee text-xl">
                    {(detail.display_name || "B")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-heading font-semibold">{detail.display_name}</h3>
                    {detail.verified && <BadgeCheck className="w-5 h-5 text-bee-blue" />}
                  </div>
                  <p className="text-xs font-mono text-muted-foreground break-all">{detail.user_id}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {detail.isAdmin && <Badge className="bg-bee/20 text-bee border-bee/40">Admin</Badge>}
                {detail.verified && <Badge className="bg-bee-blue/20 text-bee-blue border-bee-blue/40">Verified</Badge>}
                {detail.blocked && <Badge className="bg-destructive/20 text-destructive border-destructive/40">Blocked</Badge>}
                {detail.suspended && <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">Suspended</Badge>}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-mono text-muted-foreground">Joined</p>
                  <p>{fmtDate(detail.created_at)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-mono text-muted-foreground">Last updated</p>
                  <p>{fmtDate(detail.updated_at)}</p>
                </div>
              </div>

              {detail.bio && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-mono text-muted-foreground">Bio</p>
                  <p className="text-sm text-foreground/80">{detail.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                <Button size="sm" variant="ghost" onClick={() => updateFlag.mutate({ uid: detail.user_id, patch: { verified: !detail.verified } })}>
                  <BadgeCheck className="w-4 h-4 mr-1.5 text-bee-blue" />
                  {detail.verified ? "Unverify" : "Verify"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => updateFlag.mutate({ uid: detail.user_id, patch: { suspended: !detail.suspended } })}>
                  <PauseCircle className="w-4 h-4 mr-1.5 text-amber-400" />
                  {detail.suspended ? "Unsuspend" : "Suspend"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => updateFlag.mutate({ uid: detail.user_id, patch: { blocked: !detail.blocked } })}>
                  <Ban className="w-4 h-4 mr-1.5 text-destructive" />
                  {detail.blocked ? "Unblock" : "Block"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ============================== COMMUNITY ============================== */

const CommunitySection = () => {
  const qc = useQueryClient();
  const { data: channels } = useQuery({
    queryKey: ["admin-channels"],
    queryFn: async () => {
      const { data } = await supabase.from("channels").select("id, name, description, position").order("position");
      return data ?? [];
    },
  });
  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data: msgs } = await supabase.from("community_messages").select("id, content, created_at, user_id, channel_id").order("created_at", { ascending: false }).limit(50);
      const ids = Array.from(new Set((msgs ?? []).map((m) => m.user_id)));
      const { data: profs } = ids.length
        ? await supabase.from("profiles").select("user_id, display_name, avatar_url").in("user_id", ids)
        : { data: [] as any };
      const byId = new Map(((profs ?? []) as any[]).map((p) => [p.user_id, p]));
      return (msgs ?? []).map((m) => ({ ...m, author: byId.get(m.user_id) ?? null }));
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("community_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: "Message deleted" }); qc.invalidateQueries({ queryKey: ["admin-messages"] }); },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const channelNameById = new Map((channels ?? []).map((c: any) => [c.id, c.name]));

  return (
    <div className="space-y-5">
      <SectionHeader title="Community" description="Manage channels and recent messages" icon={MessageSquare} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(channels ?? []).map((c: any) => (
          <Card key={c.id} className="glass glass-highlight border-border/50 p-3">
            <p className="text-[10px] font-mono uppercase text-muted-foreground"># {c.name}</p>
            <p className="text-xs text-foreground/70 mt-1 line-clamp-2">{c.description || "—"}</p>
          </Card>
        ))}
      </div>

      <Card className="glass glass-highlight border-border/50 divide-y divide-border/50">
        {isLoading && <div className="p-6 text-center"><Loader2 className="w-4 h-4 animate-spin mx-auto text-bee" /></div>}
        {(messages ?? []).map((m: any) => (
          <div key={m.id} className="p-4 flex items-start gap-3 hover:bg-secondary/20 transition-colors">
            <Avatar className="w-8 h-8 border border-border/50 shrink-0">
              <AvatarImage src={m.author?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-bee-blue/15 text-bee-blue text-xs">
                {((m.author?.display_name as string) || "B")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">{m.author?.display_name || "Unknown"}</span>
                <Badge variant="secondary" className="text-[10px]">#{channelNameById.get(m.channel_id) || "—"}</Badge>
                <span className="text-[10px] text-muted-foreground">{fmtDate(m.created_at)}</span>
              </div>
              <p className="mt-1 text-sm text-foreground/80 break-words whitespace-pre-wrap">{m.content}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => del.mutate(m.id)} disabled={del.isPending} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {!isLoading && (messages ?? []).length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">No messages yet.</div>
        )}
      </Card>
    </div>
  );
};

/* ============================== BLOGS ============================== */

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const BlogsSection = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", cover_url: "", published: true });

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: clicksMap } = useQuery({
    queryKey: ["admin-blog-clicks"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_clicks").select("slug, clicks");
      const m = new Map<string, number>();
      ((data ?? []) as any[]).forEach((r) => m.set(r.slug, Number(r.clicks)));
      return m;
    },
  });

  const totalClicks = useMemo(() => {
    let t = 0;
    clicksMap?.forEach((v) => (t += v));
    return t;
  }, [clicksMap]);

  const reset = () => { setEditing(null); setForm({ title: "", slug: "", excerpt: "", content: "", cover_url: "", published: true }); };
  const openNew = () => { reset(); setOpen(true); };
  const openEdit = (b: any) => { setEditing(b); setForm({ title: b.title, slug: b.slug, excerpt: b.excerpt ?? "", content: b.content, cover_url: b.cover_url ?? "", published: b.published }); setOpen(true); };

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, slug: form.slug || slugify(form.title), author_id: user?.id };
      if (editing) {
        const { error } = await supabase.from("blogs").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blogs").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast({ title: editing ? "Blog updated" : "Blog created" }); setOpen(false); reset(); qc.invalidateQueries({ queryKey: ["admin-blogs"] }); },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: "Blog deleted" }); qc.invalidateQueries({ queryKey: ["admin-blogs"] }); },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Blogs"
        description={`${(blogs?.length ?? 0) + STATIC_BLOGS.length} total · ${totalClicks} clicks`}
        icon={FileText}
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <RangedExport
              filename="blog-clicks"
              fetcher={async (sinceIso) => {
                let bq = supabase.from("blogs").select("title, slug, published, created_at");
                if (sinceIso) bq = bq.gte("created_at", sinceIso);
                const { data: dbBlogs, error } = await bq;
                if (error) throw error;
                let cq = supabase.from("blog_clicks").select("slug, clicks, updated_at");
                if (sinceIso) cq = cq.gte("updated_at", sinceIso);
                const { data: clicksRows } = await cq;
                const cmap = new Map<string, number>();
                ((clicksRows ?? []) as any[]).forEach((c) => cmap.set(c.slug, Number(c.clicks || 0)));
                return [
                  ...((dbBlogs ?? []) as any[]).map((b) => ({
                    type: "custom",
                    title: b.title,
                    slug: b.slug,
                    status: b.published ? "published" : "draft",
                    clicks: cmap.get(b.slug) ?? 0,
                    created_at: b.created_at,
                  })),
                  ...STATIC_BLOGS.map((b) => ({
                    type: "built-in",
                    title: b.title,
                    slug: b.slug,
                    status: "published",
                    clicks: cmap.get(b.slug) ?? 0,
                    created_at: "",
                  })),
                ];
              }}
            />
            <Button onClick={openNew} className="bg-bee text-bee-foreground hover:bg-bee/90"><Plus className="w-4 h-4 mr-1" />New blog</Button>
          </div>
        }
      />

      <Card className="glass glass-highlight border-border/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Custom blogs (database)</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="w-4 h-4 animate-spin mx-auto text-bee" /></TableCell></TableRow>}
            {(blogs ?? []).map((b: any) => (
              <TableRow key={b.id} className="border-border/50">
                <TableCell className="font-medium">{b.title}</TableCell>
                <TableCell className="text-muted-foreground text-xs font-mono">{b.slug}</TableCell>
                <TableCell>
                  {b.published ? (
                    <Badge className="bg-bee/20 text-bee border-bee/40">Published</Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono text-bee-blue">{clicksMap?.get(b.slug) ?? 0}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{fmtDate(b.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(b)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => del.mutate(b.id)} disabled={del.isPending} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && (blogs ?? []).length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">No custom blogs yet — click "New blog" to create one.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Card className="glass glass-highlight border-border/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Built-in site blogs</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead>Path</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">Open</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STATIC_BLOGS.map((b) => (
              <TableRow key={b.slug} className="border-border/50">
                <TableCell className="font-medium">{b.title}</TableCell>
                <TableCell className="text-muted-foreground text-xs font-mono">{b.slug}</TableCell>
                <TableCell className="text-right font-mono text-bee-blue">{clicksMap?.get(b.slug) ?? 0}</TableCell>
                <TableCell className="text-right">
                  <Button asChild size="icon" variant="ghost">
                    <Link to={b.slug} target="_blank"><ExternalLink className="w-4 h-4" /></Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit blog" : "New blog"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: f.slug || slugify(e.target.value) }))} /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} /></div>
            <div><Label>Cover image URL</Label><Input value={form.cover_url} onChange={(e) => setForm((f) => ({ ...f, cover_url: e.target.value }))} placeholder="https://..." /></div>
            <div><Label>Excerpt</Label><Textarea rows={2} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} /></div>
            <div><Label>Content (Markdown)</Label><Textarea rows={10} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.published} onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))} /><Label>Published</Label></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending || !form.title || !form.content} className="bg-bee text-bee-foreground hover:bg-bee/90">
              {save.isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              {editing ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ============================== COUPONS ============================== */

const CouponsSection = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ code: "", discount_percent: 10, description: "", max_uses: "", expires_at: "", active: true });

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: redemptions } = useQuery({
    queryKey: ["admin-coupon-redemptions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("coupon_redemptions")
        .select("id, coupon_code, order_amount, discount_amount, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(100);
      return data ?? [];
    },
  });

  const reset = () => { setEditing(null); setForm({ code: "", discount_percent: 10, description: "", max_uses: "", expires_at: "", active: true }); };
  const openNew = () => { reset(); setOpen(true); };
  const openEdit = (c: any) => { setEditing(c); setForm({ code: c.code, discount_percent: c.discount_percent, description: c.description ?? "", max_uses: c.max_uses?.toString() ?? "", expires_at: c.expires_at ? c.expires_at.slice(0, 10) : "", active: c.active }); setOpen(true); };

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = {
        code: form.code.toUpperCase().trim(),
        discount_percent: Number(form.discount_percent),
        description: form.description || null,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
        active: form.active,
      };
      if (editing) {
        const { error } = await supabase.from("coupons").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("coupons").insert({ ...payload, created_by: user?.id });
        if (error) throw error;
      }
    },
    onSuccess: () => { toast({ title: editing ? "Coupon updated" : "Coupon created" }); setOpen(false); reset(); qc.invalidateQueries({ queryKey: ["admin-coupons"] }); },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("coupons").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast({ title: "Coupon deleted" }); qc.invalidateQueries({ queryKey: ["admin-coupons"] }); },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const toggle = useMutation({
    mutationFn: async (c: any) => { const { error } = await supabase.from("coupons").update({ active: !c.active }).eq("id", c.id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Coupons & Offers"
        description="Create discount codes for Bee Coin packs"
        icon={Ticket}
        action={<Button onClick={openNew} className="bg-bee text-bee-foreground hover:bg-bee/90"><Plus className="w-4 h-4 mr-1" />New coupon</Button>}
      />

      <Card className="glass glass-highlight border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Uses</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="w-4 h-4 animate-spin mx-auto text-bee" /></TableCell></TableRow>}
            {(coupons ?? []).map((c: any) => (
              <TableRow key={c.id} className="border-border/50">
                <TableCell className="font-mono font-semibold text-bee">{c.code}</TableCell>
                <TableCell>{c.discount_percent}%</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.uses}{c.max_uses ? `/${c.max_uses}` : ""}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.expires_at ? fmtDate(c.expires_at) : "Never"}</TableCell>
                <TableCell><Switch checked={c.active} onCheckedChange={() => toggle.mutate(c)} /></TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => del.mutate(c.id)} disabled={del.isPending} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && (coupons ?? []).length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">No coupons yet — click "New coupon" to create one.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Card className="glass glass-highlight border-border/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Redemption history</p>
          <div className="flex items-center gap-2 flex-wrap">
            <RangedExport
              filename="coupon-redemptions"
              fetcher={async (sinceIso) => {
                let q = supabase
                  .from("coupon_redemptions")
                  .select("id, created_at, coupon_code, user_id, order_amount, discount_amount")
                  .order("created_at", { ascending: false });
                if (sinceIso) q = q.gte("created_at", sinceIso);
                const { data, error } = await q;
                if (error) throw error;
                return (data ?? []) as any[];
              }}
            />
            <Badge variant="secondary" className="text-[10px]">{redemptions?.length ?? 0} recent</Badge>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Code</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Order</TableHead>
              <TableHead className="text-right">Discount</TableHead>
              <TableHead>When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(redemptions ?? []).map((r: any) => (
              <TableRow key={r.id} className="border-border/50">
                <TableCell className="font-mono font-semibold text-bee">{r.coupon_code}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{r.user_id ? r.user_id.slice(0, 8) : "—"}</TableCell>
                <TableCell className="text-right">{r.order_amount != null ? `$${Number(r.order_amount).toFixed(2)}` : "—"}</TableCell>
                <TableCell className="text-right text-bee-blue">{r.discount_amount != null ? `-$${Number(r.discount_amount).toFixed(2)}` : "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{fmtDate(r.created_at)}</TableCell>
              </TableRow>
            ))}
            {(redemptions ?? []).length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground">No redemptions yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit coupon" : "New coupon"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="BEE20" /></div>
            <div><Label>Discount %</Label><Input type="number" min={1} max={100} value={form.discount_percent} onChange={(e) => setForm((f) => ({ ...f, discount_percent: Number(e.target.value) }))} /></div>
            <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Welcome offer" /></div>
            <div><Label>Max uses (optional)</Label><Input type="number" value={form.max_uses} onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value }))} /></div>
            <div><Label>Expires (optional)</Label><Input type="date" value={form.expires_at} onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))} /><Label>Active</Label></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending || !form.code} className="bg-bee text-bee-foreground hover:bg-bee/90">
              {save.isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              {editing ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ============================== PAYMENTS ============================== */

const PaymentsSection = () => {
  const providers = [
    { name: "Stripe", desc: "Cards, Apple Pay, Google Pay, subscriptions. Best for global digital products.", color: "hsl(259 95% 65%)" },
    { name: "Paddle", desc: "Merchant of record — handles tax, VAT, compliance automatically.", color: "hsl(195 100% 60%)" },
    { name: "PayPal", desc: "Wallet checkout, popular for one-time purchases.", color: "hsl(45 100% 55%)" },
    { name: "Razorpay", desc: "Best for India — UPI, netbanking, cards.", color: "hsl(330 90% 60%)" },
  ];
  return (
    <div className="space-y-5">
      <SectionHeader title="Payments" description="Connect a payment provider to start charging" icon={CreditCard} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((p) => (
          <Card key={p.name} className="glass glass-highlight border-border/50 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  <h3 className="font-heading font-semibold text-lg">{p.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>
              </div>
              <Badge variant="secondary" className="text-[10px]">Not connected</Badge>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" disabled className="border-border/60">Connect</Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground" asChild>
                <a href={`https://${p.name.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-3 h-3 mr-1" />Docs</a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="glass glass-highlight border-border/50 p-5">
        <h3 className="font-heading font-semibold mb-2">Setup instructions</h3>
        <p className="text-sm text-foreground/70 leading-relaxed">
          Payment integration requires backend keys. Ask Lovable to <span className="text-bee font-semibold">"enable Stripe payments"</span> in chat to start the secure setup flow — you'll be guided to connect a provider, store secret keys, and wire up checkout for the Bee Coin packs in the Recharge page.
        </p>
      </Card>
    </div>
  );
};

/* ============================== NOTIFICATIONS ============================== */

const NotificationsSection = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [form, setForm] = useState({ title: "", body: "", link: "" });

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  const send = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title.trim(),
        body: form.body.trim() || null,
        link: form.link.trim() || null,
        created_by: user?.id ?? null,
      };
      const { error } = await supabase.from("notifications").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Notification sent" });
      setForm({ title: "", body: "", link: "" });
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
      qc.invalidateQueries({ queryKey: ["site-notifications"] });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Deleted" });
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
      qc.invalidateQueries({ queryKey: ["site-notifications"] });
    },
  });

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Notifications"
        description="Broadcast announcements visible across the site"
        icon={Bell}
      />

      <Card className="glass glass-highlight border-border/50 p-5 space-y-3">
        <div>
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="New release · Bee AI v2 is live" />
        </div>
        <div>
          <Label>Message</Label>
          <Textarea rows={3} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} placeholder="Tell your community what's new..." />
        </div>
        <div>
          <Label>Link (optional)</Label>
          <Input value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} placeholder="/blogs/bee-ai-engine" />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => send.mutate()}
            disabled={!form.title.trim() || send.isPending}
            className="bg-bee text-bee-foreground hover:bg-bee/90"
          >
            {send.isPending ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Send className="w-4 h-4 mr-1.5" />}
            Send notification
          </Button>
        </div>
      </Card>

      <Card className="glass glass-highlight border-border/50 divide-y divide-border/50">
        <div className="px-4 py-3">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Recent notifications · {items?.length ?? 0}
          </p>
        </div>
        {isLoading && <div className="p-6 text-center"><Loader2 className="w-4 h-4 animate-spin mx-auto text-bee" /></div>}
        {(items ?? []).map((n: any) => (
          <div key={n.id} className="p-4 flex items-start gap-3">
            <div className="rounded-xl bg-bee/15 text-bee p-2 shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{n.title}</p>
              {n.body && <p className="text-xs text-foreground/70 mt-0.5 whitespace-pre-wrap break-words">{n.body}</p>}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] font-mono text-muted-foreground">{fmtDate(n.created_at)}</span>
                {n.link && (
                  <Link to={n.link} className="text-[10px] font-mono text-bee-blue hover:underline inline-flex items-center gap-1">
                    {n.link} <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => del.mutate(n.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {!isLoading && (items ?? []).length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">No notifications sent yet.</div>
        )}
      </Card>
    </div>
  );
};

/* ============================== EXPENSES ============================== */

const ExpensesSection = () => {
  const qc = useQueryClient();
  const [range, setRange] = useState<RangeKey>("30");
  const meta = RANGE_OPTIONS.find((r) => r.value === range)!;
  const sinceIso = meta.days ? new Date(Date.now() - meta.days * 86400000).toISOString() : null;
  const [form, setForm] = useState({ title: "", category: "", amount: "", notes: "" });

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["admin-expenses", range],
    queryFn: async () => {
      let q = supabase.from("expenses").select("*").order("incurred_at", { ascending: false });
      if (sinceIso) q = q.gte("incurred_at", sinceIso);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

  const { data: payments } = useQuery({
    queryKey: ["admin-expenses-revenue", range],
    queryFn: async () => {
      let q = supabase.from("payments").select("amount, created_at, status");
      if (sinceIso) q = q.gte("created_at", sinceIso);
      const { data, error } = await q;
      if (error) throw error;
      return ((data ?? []) as any[]).filter((p) => p.status === "completed");
    },
  });

  const totalRevenue = (payments ?? []).reduce((s, p) => s + Number(p.amount || 0), 0);
  const totalExpenses = (expenses ?? []).reduce((s, e) => s + Number(e.amount || 0), 0);
  const profit = totalRevenue - totalExpenses;

  const trend = useMemo(() => {
    const days = meta.days ?? 365;
    const cap = Math.min(days, 400);
    const bucket: "day" | "month" = days > 90 ? "month" : "day";
    const map: Record<string, { date: string; revenue: number; expenses: number }> = {};
    if (bucket === "day") {
      for (let i = cap - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const k = d.toISOString().slice(0, 10);
        map[k] = { date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), revenue: 0, expenses: 0 };
      }
    } else {
      const months = Math.max(1, Math.ceil(cap / 30));
      for (let i = months - 1; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i, 1);
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        map[k] = { date: d.toLocaleDateString(undefined, { month: "short", year: "2-digit" }), revenue: 0, expenses: 0 };
      }
    }
    const keyOf = (iso: string) => bucket === "day" ? iso.slice(0, 10) : iso.slice(0, 7);
    (payments ?? []).forEach((r: any) => { const k = keyOf(r.created_at); if (map[k]) map[k].revenue += Number(r.amount || 0); });
    (expenses ?? []).forEach((r: any) => { const k = keyOf(r.incurred_at); if (map[k]) map[k].expenses += Number(r.amount || 0); });
    return Object.values(map);
  }, [payments, expenses, meta.days]);

  const add = useMutation({
    mutationFn: async () => {
      const amt = parseFloat(form.amount);
      if (!form.title.trim() || isNaN(amt) || amt <= 0) throw new Error("Title and a positive amount are required.");
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("expenses").insert({
        title: form.title.trim(),
        category: form.category.trim() || null,
        amount: amt,
        notes: form.notes.trim() || null,
        created_by: user?.id ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Expense added" });
      setForm({ title: "", category: "", amount: "", notes: "" });
      qc.invalidateQueries({ queryKey: ["admin-expenses"] });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Could not save", description: e.message }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Removed" });
      qc.invalidateQueries({ queryKey: ["admin-expenses"] });
    },
  });

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Expenses"
        description="Track operating costs and monitor profitability"
        icon={Wallet}
      />

      <Card className="glass glass-highlight border-border/50 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Revenue vs Expenses</h3>
            <p className="text-[11px] text-muted-foreground mt-1">{meta.label}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
              <SelectTrigger className="w-[160px] h-9 bg-secondary/40 border-border/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {RANGE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              className="border-border/60"
              onClick={() => downloadCSV(`expenses-${range === "all" ? "all-time" : `last-${range}d`}`, (expenses ?? []) as any[])}
            >
              <Download className="w-4 h-4 mr-1" />Export CSV
            </Button>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="gExpRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(140 80% 55%)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(140 80% 55%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExpExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0 80% 60%)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(0 80% 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: any, n: any) => [`$${Number(v).toFixed(2)}`, n]} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="hsl(140 80% 55%)" fill="url(#gExpRev)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="hsl(0 80% 60%)" fill="url(#gExpExp)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass glass-highlight border-border/50 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/15 text-emerald-400 p-3"><DollarSign className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-heading font-bold mt-0.5">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="glass glass-highlight border-border/50 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-rose-500/15 text-rose-400 p-3"><Receipt className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-heading font-bold mt-0.5">${totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className={`glass glass-highlight p-5 ${profit >= 0 ? "border-bee/40 bg-gradient-to-br from-bee/10 to-transparent" : "border-rose-500/40 bg-gradient-to-br from-rose-500/10 to-transparent"}`}>
          <div className="flex items-center gap-3">
            <div className={`rounded-2xl p-3 ${profit >= 0 ? "bg-bee/20 text-bee" : "bg-rose-500/20 text-rose-400"}`}><TrendingUp className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Profit</p>
              <p className={`text-2xl font-heading font-bold mt-0.5 ${profit >= 0 ? "text-bee" : "text-rose-400"}`}>${profit.toFixed(2)}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Revenue − Expenses</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass glass-highlight border-border/50 p-5 space-y-3">
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Add expense</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Server hosting · Vercel" />
          </div>
          <div>
            <Label>Category</Label>
            <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Infrastructure" />
          </div>
          <div>
            <Label>Amount (USD)</Label>
            <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="49.00" />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Optional" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => add.mutate()} disabled={add.isPending} className="bg-bee text-bee-foreground hover:bg-bee/90">
            {add.isPending ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Plus className="w-4 h-4 mr-1.5" />}
            Add expense
          </Button>
        </div>
      </Card>

      <Card className="glass glass-highlight border-border/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">All expenses · {expenses?.length ?? 0}</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (<TableRow><TableCell colSpan={5} className="text-center py-6"><Loader2 className="w-4 h-4 animate-spin inline text-bee" /></TableCell></TableRow>)}
            {(expenses ?? []).map((e: any) => (
              <TableRow key={e.id} className="border-border/50">
                <TableCell className="font-medium">{e.title}{e.notes && <p className="text-[10px] text-muted-foreground mt-0.5">{e.notes}</p>}</TableCell>
                <TableCell><Badge variant="secondary" className="text-[10px]">{e.category || "—"}</Badge></TableCell>
                <TableCell className="text-right font-mono text-rose-400">−${Number(e.amount).toFixed(2)}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{fmtDate(e.incurred_at)}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => del.mutate(e.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && (expenses ?? []).length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground">No expenses recorded for this period.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

/* ============================== LAYOUT ============================== */

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overview");

  useEffect(() => { document.title = "Admin Dashboard · Quantum Bee"; }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
    navigate("/");
  };

  const SectionView = {
    overview: <Overview />,
    users: <UsersSection />,
    community: <CommunitySection />,
    blogs: <BlogsSection />,
    coupons: <CouponsSection />,
    payments: <PaymentsSection />,
    notifications: <NotificationsSection />,
    expenses: <ExpensesSection />,
  }[section];

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, hsl(45 100% 55% / 0.08), transparent 55%), radial-gradient(ellipse at 80% 100%, hsl(195 100% 60% / 0.06), transparent 55%)",
        }}
      />

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="lg:w-64 lg:min-h-screen lg:border-r border-border/50 lg:sticky lg:top-0 bg-background/40 backdrop-blur-sm">
          <div className="p-5 flex items-center gap-3 border-b border-border/50">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={beeLogo} alt="Quantum Bee" className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" />
              <div>
                <p className="text-sm font-heading font-semibold text-gradient">Quantum Bee</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Admin</p>
              </div>
            </Link>
          </div>

          <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {NAV.map((n) => {
              const active = section === n.key;
              return (
                <button
                  key={n.key}
                  onClick={() => setSection(n.key)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap ${
                    active
                      ? "bg-bee/15 text-bee border border-bee/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent"
                  }`}
                >
                  <n.icon className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{n.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="lg:absolute lg:bottom-0 lg:w-64 p-3 lg:border-t border-border/50">
            <Link to="/" className="hidden lg:flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-lg">
              <ArrowLeft className="w-3 h-3" /> Back to site
            </Link>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sign out</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl">
          {SectionView}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
