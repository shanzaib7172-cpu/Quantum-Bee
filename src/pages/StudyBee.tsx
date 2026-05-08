import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Hash, Megaphone, Sparkles, BookOpen, Coffee, Send, Loader2, LogIn,
  Plus, Settings, Users, Smile, Paperclip, Search, ChevronDown, GraduationCap, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import TopBar from "@/components/TopBar";
import beeLogo from "@/assets/bee-logo.png";
import SpaceBackground from "@/components/SpaceBackground";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const ACCENT = "hsl(50,100%,65%)";

interface Channel {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  position: number;
}
interface Profile { user_id: string; display_name: string; avatar_url?: string | null }
interface Message {
  id: string;
  user_id: string;
  channel_id: string;
  content: string;
  is_announcement: boolean;
  created_at: string;
}

const ICONS: Record<string, any> = {
  hash: Hash, megaphone: Megaphone, sparkles: Sparkles,
  "book-open": BookOpen, coffee: Coffee,
};
const ChIcon = ({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) => {
  const Comp = ICONS[name] ?? Hash;
  return <Comp className={className} style={style} />;
};

const initials = (s: string) => s.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
const hueFor = (id: string) => Array.from(id).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" });
};

const StudyBee = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map());
  const [members, setMembers] = useState<Profile[]>([]);

  const [input, setInput] = useState("");
  const [announce, setAnnounce] = useState(false);
  const [sending, setSending] = useState(false);
  const [showMembers, setShowMembers] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  // Profile dialog
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [bio, setBio] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // New channel dialog
  const [newChOpen, setNewChOpen] = useState(false);
  const [newChName, setNewChName] = useState("");
  const [newChDesc, setNewChDesc] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeChannel = useMemo(
    () => channels.find((c) => c.id === activeId) ?? null,
    [channels, activeId],
  );

  // Load channels + profile + members (open to guests)
  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("user_id, display_name, bio, avatar_url").eq("user_id", user.id).maybeSingle()
        .then(({ data }) => { if (data) { setProfileName(data.display_name ?? ""); setBio((data as any).bio ?? ""); } });
    }

    supabase.from("channels").select("*").order("position", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setChannels(data as Channel[]);
          setActiveId((curr) => curr ?? (data[0] as Channel)?.id ?? null);
        }
      });

    supabase.from("profiles").select("user_id, display_name, avatar_url").limit(200)
      .then(({ data }) => {
        if (data) {
          setMembers(data as Profile[]);
          setProfiles(new Map((data as Profile[]).map((p) => [p.user_id, p])));
        }
      });

    const chs = supabase
      .channel("channels-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "channels" }, () => {
        supabase.from("channels").select("*").order("position", { ascending: true })
          .then(({ data }) => data && setChannels(data as Channel[]));
      })
      .subscribe();
    return () => { supabase.removeChannel(chs); };
  }, [user]);

  // Load messages for active channel + realtime
  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;
    (async () => {
      const { data: msgs } = await supabase
        .from("community_messages")
        .select("id, user_id, channel_id, content, is_announcement, created_at")
        .eq("channel_id", activeId)
        .order("created_at", { ascending: true })
        .limit(300);
      if (cancelled || !msgs) return;
      setMessages(msgs as Message[]);
      const missing = Array.from(new Set(msgs.map((m) => m.user_id))).filter((id) => !profiles.has(id));
      if (missing.length) {
        const { data: profs } = await supabase.from("profiles").select("user_id, display_name, avatar_url").in("user_id", missing);
        if (profs) {
          setProfiles((prev) => {
            const next = new Map(prev);
            (profs as Profile[]).forEach((p) => next.set(p.user_id, p));
            return next;
          });
        }
      }
    })();

    const ch = supabase
      .channel(`msgs-${activeId}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "community_messages", filter: `channel_id=eq.${activeId}` },
        async (payload) => {
          const m = payload.new as Message;
          setMessages((prev) => [...prev, m]);
          if (!profiles.has(m.user_id)) {
            const { data: prof } = await supabase.from("profiles").select("user_id, display_name, avatar_url").eq("user_id", m.user_id).maybeSingle();
            if (prof) setProfiles((prev) => new Map(prev).set(prof.user_id, prof as Profile));
          }
        })
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, activeId]);

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !user || !activeId) return;
    setSending(true);
    const { error } = await supabase.from("community_messages").insert({
      user_id: user.id,
      channel_id: activeId,
      content: input.trim(),
      is_announcement: announce && isAdmin,
    } as any);
    if (error) toast({ variant: "destructive", title: "Couldn't send", description: error.message });
    else { setInput(""); setAnnounce(false); inputRef.current?.focus(); }
    setSending(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase.from("profiles")
      .update({ display_name: profileName || "Bee", bio })
      .eq("user_id", user.id);
    if (error) toast({ variant: "destructive", title: "Save failed", description: error.message });
    else { toast({ title: "Profile saved 🐝" }); setProfileOpen(false); }
    setSavingProfile(false);
  };

  const createChannel = async () => {
    if (!newChName.trim()) return;
    const slug = newChName.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
    const { error, data } = await supabase.from("channels").insert({
      name: slug, description: newChDesc || null, icon: "hash",
      position: channels.length,
    } as any).select().single();
    if (error) toast({ variant: "destructive", title: "Couldn't create", description: error.message });
    else {
      toast({ title: `# ${slug} created` });
      setNewChOpen(false); setNewChName(""); setNewChDesc("");
      if (data) setActiveId((data as any).id);
    }
  };

  // ----- Auth gate -----
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(220,60%,3%)]">
        <Loader2 className="w-6 h-6 animate-spin text-[hsl(50,100%,65%)]" />
      </div>
    );
  }


  // ----- Discord-style layout -----
  return (
    <div className="min-h-screen flex flex-col bg-[hsl(228,30%,5%)] text-white relative overflow-hidden">
      <SpaceBackground density={0.4} rocks={0} blackhole={false} planets />
      <TopBar />
      {/* back button removed */}

      <div className="relative z-10 flex flex-1 max-w-[1500px] w-full mx-auto px-2 sm:px-4 py-4 gap-2 sm:gap-3 min-h-[calc(100vh-72px)]">
        {/* Server rail (icons) */}
        <nav className="hidden md:flex w-[68px] flex-col items-center gap-3 py-3 rounded-2xl bg-[hsl(228,25%,7%)]/80 backdrop-blur-xl border border-white/5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, hsl(40 100% 55%))`,
              boxShadow: `0 0 20px -4px ${ACCENT}`,
            }}
          >
            <img src={beeLogo} alt="Planet Bee" className="w-9 h-9 object-contain" />
          </div>
          <div className="w-8 h-px bg-white/10" />
          <button title="Planet Bee Community" className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition border border-white/5 active:scale-95">
            <GraduationCap className="w-5 h-5 text-[hsl(50,100%,65%)]" />
          </button>
        </nav>

        {/* Channels sidebar */}
        <aside className={`${showSidebar ? "flex" : "hidden"} sm:flex w-full sm:w-[240px] flex-col rounded-2xl bg-[hsl(228,22%,9%)]/85 backdrop-blur-xl border border-white/5 overflow-hidden`}>
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40">Server</div>
              <div className="font-heading font-bold text-white">Planet Bee Community</div>
            </div>
            <ChevronDown className="w-4 h-4 text-white/40" />
          </div>

          <div className="px-3 py-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-white/40">
            <span>Text channels</span>
            {isAdmin && (
              <Dialog open={newChOpen} onOpenChange={setNewChOpen}>
                <DialogTrigger asChild>
                  <button className="hover:text-white transition"><Plus className="w-3.5 h-3.5" /></button>
                </DialogTrigger>
                <DialogContent className="bg-[hsl(228,22%,9%)] border-white/10 text-white">
                  <DialogHeader><DialogTitle>Create a channel</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-white/60">Name</label>
                      <Input value={newChName} onChange={(e) => setNewChName(e.target.value)} placeholder="new-channel" className="mt-1 bg-white/5 border-white/10" />
                    </div>
                    <div>
                      <label className="text-xs text-white/60">Description</label>
                      <Input value={newChDesc} onChange={(e) => setNewChDesc(e.target.value)} placeholder="What's it for?" className="mt-1 bg-white/5 border-white/10" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={createChannel} className="text-[hsl(220,60%,3%)]" style={{ background: `linear-gradient(135deg, ${ACCENT}, hsl(40 100% 55%))` }}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
            {channels.map((c) => {
              const active = c.id === activeId;
              return (
                <button
                  key={c.id}
                  onClick={() => { setActiveId(c.id); if (window.innerWidth < 640) setShowSidebar(false); }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition group ${
                    active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  <ChIcon name={c.icon} className={`w-4 h-4 ${active ? "text-[hsl(50,100%,65%)]" : ""}`} />
                  <span className="truncate">{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* User panel */}
          <div className="border-t border-white/5 p-2 flex items-center gap-2 bg-[hsl(228,25%,6%)]/70">
            {user ? (
              <>
                <Avatar className="w-8 h-8 border border-white/10">
                  {profiles.get(user.id)?.avatar_url && <AvatarImage src={profiles.get(user.id)!.avatar_url!} alt={profileName} />}
                  <AvatarFallback style={{ background: `hsl(${hueFor(user.id)} 70% 45%)` }} className="text-white text-xs font-bold">
                    {initials(profileName || user.email || "B")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{profileName || user.email?.split("@")[0]}</div>
                  <div className="text-[10px] text-white/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
                    {isAdmin && <span className="ml-1 px-1 rounded bg-[hsl(50,100%,65%)]/20 text-[hsl(50,100%,75%)]">admin</span>}
                  </div>
                </div>
                <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                  <DialogTrigger asChild>
                    <button className="p-2 rounded hover:bg-white/10 text-white/60"><Settings className="w-4 h-4" /></button>
                  </DialogTrigger>
                  <DialogContent className="bg-[hsl(228,22%,9%)] border-white/10 text-white">
                    <DialogHeader><DialogTitle>Edit profile</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-white/60">Display name</label>
                        <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="mt-1 bg-white/5 border-white/10" />
                      </div>
                      <div>
                        <label className="text-xs text-white/60">Bio</label>
                        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="mt-1 bg-white/5 border-white/10" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={saveProfile} disabled={savingProfile} className="text-[hsl(220,60%,3%)]"
                        style={{ background: `linear-gradient(135deg, ${ACCENT}, hsl(40 100% 55%))` }}>
                        {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <Button asChild size="sm" className="w-full text-[hsl(220,60%,3%)] border-0"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, hsl(40 100% 55%))` }}>
                <Link to="/login"><LogIn className="w-3.5 h-3.5 mr-2" />Sign in to chat</Link>
              </Button>
            )}
          </div>
        </aside>

        {/* Chat column */}
        <section className={`${showSidebar ? "hidden" : "flex"} sm:flex flex-1 flex-col rounded-2xl bg-[hsl(228,20%,7%)]/85 backdrop-blur-xl border border-white/5 overflow-hidden min-w-0`}>
          {/* Channel header */}
          <header className="h-14 px-4 flex items-center justify-between border-b border-white/5 bg-[hsl(228,22%,8%)]/70">
            <div className="flex items-center gap-2 min-w-0">
              <button onClick={() => setShowSidebar(true)} className="sm:hidden p-1.5 rounded hover:bg-white/10 text-white/60">
                <Hash className="w-4 h-4" />
              </button>
              {activeChannel && (
                <>
                  <ChIcon name={activeChannel.icon} className="w-5 h-5 text-white/40" />
                  <span className="font-semibold truncate">{activeChannel.name}</span>
                  {activeChannel.description && (
                    <>
                      <span className="hidden md:inline w-px h-5 bg-white/10 mx-2" />
                      <span className="hidden md:inline text-sm text-white/50 truncate">{activeChannel.description}</span>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded hover:bg-white/10 text-white/60 hidden sm:inline-flex"><Search className="w-4 h-4" /></button>
              <button onClick={() => setShowMembers((s) => !s)} className="p-2 rounded hover:bg-white/10 text-white/60">
                <Users className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-0.5">
            {activeChannel && (
              <div className="px-3 py-6 mb-2">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: `${ACCENT}20`, border: `1px solid ${ACCENT}40` }}>
                  <ChIcon name={activeChannel.icon} className="w-7 h-7" style={{ color: ACCENT }} />
                </div>
                <h2 className="text-2xl font-bold">Welcome to #{activeChannel.name}</h2>
                <p className="text-white/50 text-sm mt-1">
                  {activeChannel.description ?? "This is the start of the channel."}
                </p>
              </div>
            )}

            {messages.map((m, i) => {
              const prev = messages[i - 1];
              const grouped = prev && prev.user_id === m.user_id && !m.is_announcement && !prev.is_announcement &&
                (new Date(m.created_at).getTime() - new Date(prev.created_at).getTime()) < 5 * 60 * 1000;
              const prof = profiles.get(m.user_id);
              const name = prof?.display_name ?? "Bee";

              if (m.is_announcement) {
                return (
                  <div key={m.id} className="my-3 mx-2 rounded-xl border-l-4 px-4 py-3"
                    style={{ borderColor: ACCENT, background: `${ACCENT}12` }}>
                    <div className="flex items-center gap-2 mb-1 text-[10px] uppercase tracking-widest font-mono text-[hsl(50,100%,75%)]">
                      <Megaphone className="w-3 h-3" /> Announcement · {name} · {formatTime(m.created_at)}
                    </div>
                    <div className="text-sm text-white/90 whitespace-pre-wrap">{m.content}</div>
                  </div>
                );
              }

              return (
                <div key={m.id} className={`group flex gap-3 px-2 py-0.5 rounded hover:bg-white/[0.02] ${grouped ? "" : "mt-3"}`}>
                  <div className="w-10 flex-shrink-0">
                    {!grouped ? (
                      <Avatar className="w-10 h-10 mt-0.5 border border-white/10">
                        {prof?.avatar_url && <AvatarImage src={prof.avatar_url} alt={name} />}
                        <AvatarFallback style={{ background: `hsl(${hueFor(m.user_id)} 70% 45%)` }} className="text-white text-sm font-bold">
                          {initials(name)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <span className="text-[10px] text-white/0 group-hover:text-white/30 block text-center mt-1">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {!grouped && (
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-white" style={{ color: `hsl(${hueFor(m.user_id)} 80% 75%)` }}>{name}</span>
                        <span className="text-[10px] text-white/40">{formatTime(m.created_at)}</span>
                      </div>
                    )}
                    <div className="text-sm text-white/85 whitespace-pre-wrap break-words">{m.content}</div>
                  </div>
                </div>
              );
            })}
            {messages.length === 0 && activeChannel && (
              <p className="text-center text-sm text-white/40 py-8">No messages yet — say hi 👋</p>
            )}
          </div>

          {/* Composer */}
          {user ? (
            <form onSubmit={send} className="px-3 sm:px-4 pb-3">
              {isAdmin && (
                <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[hsl(50,100%,75%)] mb-1.5 ml-1">
                  <input type="checkbox" checked={announce} onChange={(e) => setAnnounce(e.target.checked)} className="accent-[hsl(50,100%,65%)]" />
                  Post as announcement
                </label>
              )}
              <div className="flex items-end gap-2 rounded-xl bg-[hsl(228,18%,12%)] border border-white/5 px-3 py-2 focus-within:border-[hsl(50,100%,65%)]/40 transition">
                <button type="button" className="text-white/40 hover:text-white/70 p-1"><Paperclip className="w-4 h-4" /></button>
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={activeChannel ? `Message #${activeChannel.name}` : "Message"}
                  rows={1}
                  className="flex-1 min-h-0 max-h-40 resize-none border-0 bg-transparent focus-visible:ring-0 px-0 py-1 text-sm text-white placeholder:text-white/40"
                />
                <button type="button" className="text-white/40 hover:text-white/70 p-1"><Smile className="w-4 h-4" /></button>
                <Button type="submit" disabled={sending || !input.trim()} size="sm" className="h-8 px-3 text-[hsl(220,60%,3%)] border-0"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, hsl(40 100% 55%))` }}>
                  {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </form>
          ) : (
            <div className="px-3 sm:px-4 pb-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-sm text-white/60">Sign in to join the conversation.</span>
                <Button asChild size="sm" className="h-8 px-3 text-[hsl(220,60%,3%)] border-0"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, hsl(40 100% 55%))` }}>
                  <Link to="/login"><LogIn className="w-3.5 h-3.5 mr-1.5" />Sign in</Link>
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Members panel */}
        {showMembers && (
          <aside className="hidden lg:flex w-[220px] flex-col rounded-2xl bg-[hsl(228,22%,9%)]/85 backdrop-blur-xl border border-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 text-[10px] font-mono uppercase tracking-widest text-white/40">
              Members — {members.length}
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
              {members.map((m) => (
                <div key={m.user_id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5">
                  <Avatar className="w-7 h-7">
                    {m.avatar_url && <AvatarImage src={m.avatar_url} alt={m.display_name} />}
                    <AvatarFallback style={{ background: `hsl(${hueFor(m.user_id)} 70% 45%)` }} className="text-white text-[10px] font-bold">
                      {initials(m.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white/70 truncate">{m.display_name}</span>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default StudyBee;
