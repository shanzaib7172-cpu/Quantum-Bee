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
} from "recharts";
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
  | "notifications";

const NAV: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "users", label: "Users", icon: Users },
  { key: "community", label: "Community", icon: MessageSquare },
  { key: "blogs", label: "Blogs", icon: FileText },
  { key: "coupons", label: "Coupons", icon: Ticket },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "notifications", label: "Notifications", icon: Bell },
];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

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

const Overview = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats-extended"],
    queryFn: async () => {
      const todayIso = new Date(new Date().toDateString()).toISOString();
      const last30 = new Date(Date.now() - 30 * 86400000).toISOString();
      const [users, msgs, admins, today, blogs, coupons, profilesTrend, msgsTrend, payments] =
        await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase
            .from("community_messages")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("user_roles")
            .select("*", { count: "exact", head: true })
            .eq("role", "admin"),
          supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .gte("created_at", todayIso),
          supabase.from("blogs").select("*", { count: "exact", head: true }),
          supabase.from("coupons").select("*", { count: "exact", head: true }),
          supabase
            .from("profiles")
            .select("created_at")
            .gte("created_at", last30)
            .order("created_at", { ascending: true }),
          supabase
            .from("community_messages")
            .select("created_at")
            .gte("created_at", last30)
            .order("created_at", { ascending: true }),
          supabase.from("payments").select("amount, created_at, status"),
        ]);
      const completed = ((payments.data ?? []) as any[]).filter((p) => p.status === "completed");
      const totalRevenue = completed.reduce((s, p) => s + Number(p.amount || 0), 0);
      const todayRevenue = completed
        .filter((p) => p.created_at >= todayIso)
        .reduce((s, p) => s + Number(p.amount || 0), 0);
      return {
        totalUsers: users.count ?? 0,
        totalMessages: msgs.count ?? 0,
        totalAdmins: admins.count ?? 0,
        newToday: today.count ?? 0,
        totalBlogs: blogs.count ?? 0,
        totalCoupons: coupons.count ?? 0,
        totalRevenue,
        todayRevenue,
        totalOrders: completed.length,
        profilesTrend: (profilesTrend.data ?? []) as { created_at: string }[],
        msgsTrend: (msgsTrend.data ?? []) as { created_at: string }[],
      };
    },
  });

  const trendData = useMemo(() => {
    const days: Record<string, { date: string; users: number; messages: number }> =
      {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const k = d.toISOString().slice(0, 10);
      days[k] = {
        date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        users: 0,
        messages: 0,
      };
    }
    (stats?.profilesTrend ?? []).forEach((r) => {
      const k = r.created_at.slice(0, 10);
      if (days[k]) days[k].users += 1;
    });
    (stats?.msgsTrend ?? []).forEach((r) => {
      const k = r.created_at.slice(0, 10);
      if (days[k]) days[k].messages += 1;
    });
    return Object.values(days);
  }, [stats]);

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

      <Card className="glass glass-highlight border-border/50 p-4 sm:p-5">
        <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
          Activity — Last 30 days
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(45 100% 55%)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(45 100% 55%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gMsgs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(195 100% 60%)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(195 100% 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Area type="monotone" dataKey="users" stroke="hsl(45 100% 55%)" fill="url(#gUsers)" name="New users" />
              <Area type="monotone" dataKey="messages" stroke="hsl(195 100% 60%)" fill="url(#gMsgs)" name="Messages" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

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
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, user_id, display_name, avatar_url, created_at")
          .order("created_at", { ascending: false })
          .limit(200),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      const adminIds = new Set(
        ((roles ?? []) as any[])
          .filter((r) => r.role === "admin")
          .map((r) => r.user_id),
      );
      return ((profiles ?? []) as any[]).map((p) => ({
        ...p,
        isAdmin: adminIds.has(p.user_id),
      }));
    },
  });

  const grant = useMutation({
    mutationFn: async (uid: string) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: "Admin granted" }); qc.invalidateQueries({ queryKey: ["admin-users"] }); },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });
  const revoke = useMutation({
    mutationFn: async (uid: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "admin");
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: "Admin revoked" }); qc.invalidateQueries({ queryKey: ["admin-users"] }); },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

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
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="w-4 h-4 animate-spin mx-auto text-bee" /></TableCell></TableRow>
              )}
              {(usersData ?? []).map((u) => {
                const isSelf = user?.id === u.user_id;
                return (
                  <TableRow key={u.id} className="border-border/50">
                    <TableCell>
                      <Avatar className="w-8 h-8 border border-border/50">
                        <AvatarImage src={u.avatar_url ?? undefined} />
                        <AvatarFallback className="bg-bee/15 text-bee text-xs">
                          {(u.display_name || "B")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {u.display_name}
                      {isSelf && <span className="ml-2 text-[10px] text-muted-foreground">(you)</span>}
                    </TableCell>
                    <TableCell>
                      {u.isAdmin ? (
                        <Badge className="bg-bee/20 text-bee border-bee/40 hover:bg-bee/25">Admin</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-secondary text-muted-foreground">Member</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{fmtDate(u.created_at)}</TableCell>
                    <TableCell className="text-right">
                      {u.isAdmin ? (
                        <Button size="sm" variant="ghost" disabled={isSelf || revoke.isPending} onClick={() => revoke.mutate(u.user_id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          Remove Admin
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled={grant.isPending} onClick={() => grant.mutate(u.user_id)} className="text-bee hover:text-bee hover:bg-bee/10">
                          Make Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
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
        action={<Button onClick={openNew} className="bg-bee text-bee-foreground hover:bg-bee/90"><Plus className="w-4 h-4 mr-1" />New blog</Button>}
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
          <Badge variant="secondary" className="text-[10px]">{redemptions?.length ?? 0} recent</Badge>
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
