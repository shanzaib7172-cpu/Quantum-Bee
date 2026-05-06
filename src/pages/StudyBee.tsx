import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Send, Megaphone, Shield, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TopBar from "@/components/TopBar";
import SpaceBackground from "@/components/SpaceBackground";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const ACCENT = "hsl(50,100%,65%)";

interface Message {
  id: string;
  user_id: string;
  content: string;
  is_announcement: boolean;
  created_at: string;
  display_name?: string;
}

const StudyBee = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [announce, setAnnounce] = useState(false);
  const [sending, setSending] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [bio, setBio] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load profile
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name, bio").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) { setProfileName(data.display_name ?? ""); setBio(data.bio ?? ""); }
      });
  }, [user]);

  // Load messages + realtime
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: msgs } = await supabase
        .from("community_messages")
        .select("id, user_id, content, is_announcement, created_at")
        .order("created_at", { ascending: true })
        .limit(200);
      if (!msgs) return;
      const ids = Array.from(new Set(msgs.map((m) => m.user_id)));
      const { data: profs } = await supabase.from("profiles").select("user_id, display_name").in("user_id", ids);
      const nameMap = new Map(profs?.map((p) => [p.user_id, p.display_name]) ?? []);
      setMessages(msgs.map((m) => ({ ...m, display_name: nameMap.get(m.user_id) ?? "Bee" })));
    };
    load();

    const channel = supabase
      .channel("community-messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "community_messages" }, async (payload) => {
        const m = payload.new as Message;
        const { data: prof } = await supabase.from("profiles").select("display_name").eq("user_id", m.user_id).maybeSingle();
        setMessages((prev) => [...prev, { ...m, display_name: prof?.display_name ?? "Bee" }]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    setSending(true);
    const { error } = await supabase.from("community_messages").insert({
      user_id: user.id,
      content: input.trim(),
      is_announcement: announce && isAdmin,
    });
    if (error) toast({ variant: "destructive", title: "Couldn't send", description: error.message });
    else { setInput(""); setAnnounce(false); }
    setSending(false);
  };

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: profileName || "Bee", bio })
      .eq("user_id", user.id);
    if (error) toast({ variant: "destructive", title: "Save failed", description: error.message });
    else toast({ title: "Profile saved 🐝" });
    setSavingProfile(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(220,60%,3%)] text-foreground relative overflow-hidden">
      <SpaceBackground density={0.7} rocks={0} blackhole={false} />
      <TopBar />

      <header className="relative z-10 px-6 pt-12 pb-6 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4"
          style={{ borderColor: `${ACCENT}55`, background: `${ACCENT}15` }}>
          <GraduationCap className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
            Study Bee · Community Hive
          </span>
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-5xl">
          <span className="bg-gradient-to-r from-white to-[hsl(50,100%,65%)] bg-clip-text text-transparent">
            Learn. Build. Buzz Together.
          </span>
        </h1>
        <p className="text-foreground/65 mt-4">
          The Study Bee community — where learners, builders and the Quantum Bee team chat live, share progress and get major updates straight from admins.
        </p>
      </header>

      {loading ? (
        <div className="relative z-10 px-6 py-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin inline-block text-[hsl(50,100%,65%)]" />
        </div>
      ) : !user ? (
        <div className="relative z-10 px-6 pb-20 max-w-md mx-auto w-full text-center">
          <div className="rounded-2xl p-8 bg-[hsl(220,40%,8%)]/70 backdrop-blur-xl border border-[hsl(50,100%,65%)]/20">
            <Shield className="w-7 h-7 mx-auto mb-3 text-[hsl(50,100%,65%)]" />
            <h2 className="font-heading font-bold text-xl text-white">Sign in to join the hive</h2>
            <p className="text-sm text-foreground/65 mt-2 mb-5">
              Create your Study Bee profile and chat with the community in real time.
            </p>
            <Button asChild className="h-11 px-6 text-[hsl(220,60%,3%)] border-0"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, hsl(40 100% 60%))` }}>
              <Link to="/login"><LogIn className="w-4 h-4 mr-2" />Sign in</Link>
            </Button>
          </div>
        </div>
      ) : (
        <main className="relative z-10 px-4 sm:px-6 pb-16 grid gap-5 lg:grid-cols-[300px_1fr] max-w-6xl mx-auto w-full">
          {/* Profile */}
          <aside className="rounded-2xl p-5 bg-[hsl(220,40%,8%)]/70 backdrop-blur-xl border border-[hsl(50,100%,65%)]/20 h-fit">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[hsl(50,100%,65%)] mb-3">Your Profile</div>
            <label className="text-xs text-white/60">Display name</label>
            <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="mt-1 mb-3 bg-white/5 border-white/10 text-white" />
            <label className="text-xs text-white/60">Bio</label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="mt-1 bg-white/5 border-white/10 text-white" />
            <Button onClick={saveProfile} disabled={savingProfile} className="w-full mt-3 h-9 text-xs"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, hsl(40 100% 55%))`, color: "hsl(220 60% 3%)" }}>
              {savingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save profile"}
            </Button>
            {isAdmin && (
              <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full border border-[hsl(50,100%,65%)]/40 text-[hsl(50,100%,75%)]">
                <Shield className="w-3 h-3" /> Admin
              </div>
            )}
          </aside>

          {/* Chat */}
          <section className="rounded-2xl bg-[hsl(220,40%,7%)]/70 backdrop-blur-xl border border-[hsl(50,100%,65%)]/20 flex flex-col min-h-[60vh] overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-sm text-foreground/50 py-10">No messages yet — be the first to say hi!</p>
              )}
              {messages.map((m) => {
                const mine = m.user_id === user.id;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.is_announcement
                          ? "border border-[hsl(50,100%,65%)]/50 bg-[hsl(50,100%,65%)]/10 text-[hsl(50,100%,90%)]"
                          : mine
                          ? "bg-gradient-to-br from-[hsl(200,100%,50%)] to-[hsl(220,100%,55%)] text-white"
                          : "bg-white/5 text-white/90 border border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-80 mb-1">
                        {m.is_announcement && <Megaphone className="w-3 h-3" />}
                        <span>{m.display_name}{m.is_announcement && " · ANNOUNCEMENT"}</span>
                      </div>
                      <div className="whitespace-pre-wrap break-words">{m.content}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={send} className="border-t border-white/5 p-3 flex flex-col gap-2 bg-[hsl(220,40%,5%)]/70">
              {isAdmin && (
                <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[hsl(50,100%,75%)]">
                  <input type="checkbox" checked={announce} onChange={(e) => setAnnounce(e.target.checked)} className="accent-[hsl(50,100%,65%)]" />
                  Post as announcement
                </label>
              )}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write a message…"
                  className="flex-1 bg-white/5 border-white/10 text-white"
                />
                <Button type="submit" disabled={sending || !input.trim()} className="h-10 px-4 text-white border-0"
                  style={{ background: `linear-gradient(135deg, hsl(200 100% 55%), hsl(220 100% 50%))` }}>
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          </section>
        </main>
      )}
    </div>
  );
};

export default StudyBee;
