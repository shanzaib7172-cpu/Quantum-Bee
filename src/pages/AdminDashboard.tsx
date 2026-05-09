import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Shield,
  Users,
  MessageSquare,
  ShieldCheck,
  UserPlus,
  Loader2,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface ProfileRow {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
}

interface RoleRow {
  user_id: string;
  role: string;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  loading,
  tint = "bee",
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
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
        </div>
        <div className={`shrink-0 rounded-xl p-2.5 ${tintClass}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </Card>
  );
};

const AdminDashboard = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Admin Dashboard · Quantum Bee";
  }, []);

  // Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const todayIso = new Date(new Date().toDateString()).toISOString();
      const [users, msgs, admins, today] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("community_messages").select("*", { count: "exact", head: true }),
        supabase
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "admin"),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", todayIso),
      ]);
      return {
        totalUsers: users.count ?? 0,
        totalMessages: msgs.count ?? 0,
        totalAdmins: admins.count ?? 0,
        newToday: today.count ?? 0,
      };
    },
  });

  // Users + roles
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, user_id, display_name, avatar_url, created_at")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      const adminIds = new Set(
        ((roles ?? []) as RoleRow[])
          .filter((r) => r.role === "admin")
          .map((r) => r.user_id),
      );
      return ((profiles ?? []) as ProfileRow[]).map((p) => ({
        ...p,
        isAdmin: adminIds.has(p.user_id),
      }));
    },
  });

  // Messages
  const { data: messages, isLoading: msgsLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data: msgs } = await supabase
        .from("community_messages")
        .select("id, content, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(20);
      const ids = Array.from(new Set((msgs ?? []).map((m) => m.user_id)));
      const { data: profs } = ids.length
        ? await supabase
            .from("profiles")
            .select("user_id, display_name, avatar_url")
            .in("user_id", ids)
        : { data: [] as any };
      const byId = new Map(
        ((profs ?? []) as any[]).map((p) => [p.user_id, p]),
      );
      return (msgs ?? []).map((m) => ({
        ...m,
        author: byId.get(m.user_id) ?? null,
      }));
    },
  });

  const grantAdmin = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Admin granted" });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (e: any) =>
      toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const revokeAdmin = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Admin revoked" });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (e: any) =>
      toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("community_messages")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Message deleted" });
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (e: any) =>
      toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Ambient bee glow */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, hsl(45 100% 55% / 0.08), transparent 55%), radial-gradient(ellipse at 80% 100%, hsl(195 100% 60% / 0.06), transparent 55%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Header */}
        <header className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              aria-label="Back home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="rounded-2xl bg-bee/15 border border-bee/30 p-2.5">
              <Shield className="w-5 h-5 text-bee" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-semibold text-gradient">
                Admin Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Quantum Bee Control Panel
              </p>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Total Users"
            value={stats?.totalUsers ?? 0}
            icon={Users}
            loading={statsLoading}
            tint="bee"
          />
          <StatCard
            label="Community Messages"
            value={stats?.totalMessages ?? 0}
            icon={MessageSquare}
            loading={statsLoading}
            tint="blue"
          />
          <StatCard
            label="Admins"
            value={stats?.totalAdmins ?? 0}
            icon={ShieldCheck}
            loading={statsLoading}
            tint="primary"
          />
          <StatCard
            label="New Today"
            value={stats?.newToday ?? 0}
            icon={UserPlus}
            loading={statsLoading}
            tint="accent"
          />
        </section>

        {/* Users */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-bee" />
              Users
            </h2>
            <span className="text-xs text-muted-foreground">
              {usersData?.length ?? 0} shown
            </span>
          </div>
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
                  {usersLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="w-4 h-4 animate-spin mx-auto text-bee" />
                      </TableCell>
                    </TableRow>
                  )}
                  {!usersLoading &&
                    (usersData ?? []).map((u) => {
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
                            {isSelf && (
                              <span className="ml-2 text-[10px] text-muted-foreground">
                                (you)
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {u.isAdmin ? (
                              <Badge className="bg-bee/20 text-bee border-bee/40 hover:bg-bee/25">
                                Admin
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-secondary text-muted-foreground"
                              >
                                Member
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {fmtDate(u.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            {u.isAdmin ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={isSelf || revokeAdmin.isPending}
                                onClick={() => revokeAdmin.mutate(u.user_id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                Remove Admin
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={grantAdmin.isPending}
                                onClick={() => grantAdmin.mutate(u.user_id)}
                                className="text-bee hover:text-bee hover:bg-bee/10"
                              >
                                Make Admin
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {!usersLoading && (usersData ?? []).length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground text-sm"
                      >
                        No users yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </section>

        {/* Community messages */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-bee-blue" />
              Recent Community Messages
            </h2>
            <span className="text-xs text-muted-foreground">
              Last {messages?.length ?? 0}
            </span>
          </div>
          <Card className="glass glass-highlight border-border/50 divide-y divide-border/50">
            {msgsLoading && (
              <div className="p-6 text-center">
                <Loader2 className="w-4 h-4 animate-spin mx-auto text-bee" />
              </div>
            )}
            {!msgsLoading && (messages ?? []).length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No messages yet.
              </div>
            )}
            {!msgsLoading &&
              (messages ?? []).map((m) => (
                <div
                  key={m.id}
                  className="p-4 flex items-start gap-3 hover:bg-secondary/20 transition-colors"
                >
                  <Avatar className="w-8 h-8 border border-border/50 shrink-0">
                    <AvatarImage src={m.author?.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-bee-blue/15 text-bee-blue text-xs">
                      {((m.author?.display_name as string) || "B")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground truncate">
                        {m.author?.display_name || "Unknown"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {fmtDate(m.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground/80 break-words whitespace-pre-wrap">
                      {m.content}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteMessage.mutate(m.id)}
                    disabled={deleteMessage.isPending}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                    aria-label="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
          </Card>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
