import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2, Send, Download, RefreshCw, Code2, Eye, ListChecks, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useBeeCoins } from "@/hooks/use-bee-coins";
import davidCharacter from "@/assets/david-character.png";
import beeLogo from "@/assets/bee-logo.png";

type ChatMsg = { role: "user" | "assistant"; content: string; tasks?: string[] };

const STORAGE_HTML = "david_current_html";
const STORAGE_CHAT = "david_chat";

const DEFAULT_HTML = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>David Preview</title><script src="https://cdn.tailwindcss.com"></script></head><body class="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-center p-8"><div class="text-center max-w-xl"><div class="text-6xl mb-4">🐝</div><h1 class="text-4xl font-bold mb-3">Hi, I'm David</h1><p class="text-white/70">Tell me what to build on the left — a landing page, a tool, a game, a dashboard. I'll build it here in seconds.</p></div></body></html>`;

const David = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { balance, refresh } = useBeeCoins();
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [chat, setChat] = useState<ChatMsg[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_CHAT) || "[]"); } catch { return []; }
  });
  const [html, setHtml] = useState<string>(() => localStorage.getItem(STORAGE_HTML) || DEFAULT_HTML);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [activeTasks, setActiveTasks] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Allow browsing without login; gate only the build action.

  useEffect(() => {
    const seeded = searchParams.get("prompt");
    if (seeded && !prompt) {
      setPrompt(seeded);
      const next = new URLSearchParams(searchParams);
      next.delete("prompt");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_HTML, html); }, [html]);
  useEffect(() => { localStorage.setItem(STORAGE_CHAT, JSON.stringify(chat.slice(-30))); }, [chat]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [chat, activeTasks]);

  const iframeSrc = useMemo(() => `data:text/html;charset=utf-8,${encodeURIComponent(html)}`, [html]);

  const send = async () => {
    const text = prompt.trim();
    if (!text || busy) return;
    if (!user) {
      toast({ title: "Sign in to build", description: "Log in or create an account to let David build for you." });
      navigate("/login");
      return;
    }
    if (balance < 1) {
      toast({ variant: "destructive", title: "Not enough Bee Coins 🐝", description: "Each build costs 1 coin. Recharge to continue." });
      return;
    }
    setPrompt("");
    const newChat = [...chat, { role: "user" as const, content: text }];
    setChat(newChat);
    setBusy(true);
    setActiveTasks(["Reading your prompt…", "Designing the UI…", "Writing code…"]);

    try {
      const { data, error } = await supabase.functions.invoke("david-build", {
        body: {
          messages: newChat.map(({ role, content }) => ({ role, content })),
          currentHtml: chat.length === 0 ? null : html,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).message || (data as any).error);
      const tasks: string[] = (data as any).tasks || [];
      const summary: string = (data as any).summary || "Done.";
      const newHtml: string = (data as any).html;
      const fallback = Boolean((data as any).fallback);
      setHtml(newHtml);
      setChat((c) => [...c, { role: "assistant", content: summary, tasks }]);
      setActiveTasks([]);
      if (!fallback) refresh();
      toast({
        variant: fallback ? "default" : undefined,
        title: fallback ? "David is temporarily busy" : "David shipped it ✨",
        description: fallback ? "A starter preview was created without charging Bee Coins." : `${tasks.length} steps completed.`,
      });
    } catch (e: any) {
      setActiveTasks([]);
      setChat((c) => [...c, { role: "assistant", content: `⚠️ ${e?.message || "Build failed"}` }]);
      toast({ variant: "destructive", title: "Build failed", description: e?.message || "Try again." });
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setChat([]);
    setHtml(DEFAULT_HTML);
    setActiveTasks([]);
    localStorage.removeItem(STORAGE_CHAT);
    localStorage.removeItem(STORAGE_HTML);
  };

  const download = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "david-app.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[hsl(220,40%,4%)] text-white flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-white/10 flex items-center px-3 sm:px-4 gap-2 shrink-0 bg-[hsl(220,40%,5%)]/80 backdrop-blur-xl">
        <Link to="/" className="p-2 rounded-lg hover:bg-white/5"><ArrowLeft className="w-4 h-4" /></Link>
        <img src={davidCharacter} alt="David" className="w-8 h-8 rounded-lg object-cover border border-[hsl(170,100%,55%)]/40" />
        <div className="min-w-0">
          <div className="font-semibold text-sm leading-tight truncate">David — Web Developer</div>
          <div className="text-[10px] text-white/50 leading-tight flex items-center gap-1">
            1 <img src={beeLogo} alt="bee coin" className="w-3 h-3 object-contain inline-block" /> / build · Balance: {balance.toFixed(1)}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={reset} className="text-xs"><RefreshCw className="w-3.5 h-3.5 mr-1" />New</Button>
          <Button size="sm" variant="ghost" onClick={download} className="text-xs"><Download className="w-3.5 h-3.5 mr-1" />Export</Button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* LEFT: chat + tasks */}
        <aside className="w-full lg:w-[380px] xl:w-[420px] border-r border-white/10 flex flex-col min-h-0 lg:h-[calc(100vh-3.5rem)]">
          <ScrollArea className="flex-1">
            <div ref={scrollRef} className="p-3 space-y-3">
              {chat.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 mb-2 text-[hsl(170,100%,65%)]">
                    <Sparkles className="w-4 h-4" /><span className="text-xs font-mono uppercase tracking-widest">Try a prompt</span>
                  </div>
                  <ul className="space-y-1.5 text-sm text-white/75">
                    {[
                      "A neon SaaS landing page for a bee-themed CRM",
                      "A working pomodoro timer with sounds",
                      "A 3D rotating product showcase with three.js",
                      "A markdown editor with live preview",
                    ].map((s) => (
                      <li key={s}>
                        <button onClick={() => setPrompt(s)} className="text-left w-full hover:text-[hsl(40,100%,65%)] transition-colors">→ {s}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {chat.map((m, i) => (
                <div key={i} className={`rounded-xl p-3 text-sm ${m.role === "user" ? "bg-[hsl(40,100%,55%)]/10 border border-[hsl(40,100%,55%)]/30 ml-6" : "bg-white/[0.03] border border-white/10 mr-6"}`}>
                  <div className={`text-[10px] uppercase tracking-widest mb-1 ${m.role === "user" ? "text-[hsl(40,100%,70%)]" : "text-[hsl(170,100%,65%)]"}`}>
                    {m.role === "user" ? "You" : "David"}
                  </div>
                  <div className="whitespace-pre-wrap text-white/90">{m.content}</div>
                  {m.tasks && m.tasks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/50 mb-1.5">
                        <ListChecks className="w-3 h-3" /> Tasks completed
                      </div>
                      <ul className="space-y-1">
                        {m.tasks.map((t, j) => (
                          <li key={j} className="text-xs text-white/70 flex gap-2">
                            <span className="text-[hsl(170,100%,65%)]">✓</span><span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              {busy && activeTasks.length > 0 && (
                <div className="rounded-xl p-3 bg-white/[0.03] border border-white/10 mr-6">
                  <div className="text-[10px] uppercase tracking-widest text-[hsl(170,100%,65%)] mb-2 flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" /> David is working
                  </div>
                  <ul className="space-y-1.5">
                    {activeTasks.map((t, i) => (
                      <li key={i} className="text-xs text-white/80 flex gap-2 items-center">
                        <span className="w-3 h-3 rounded-full border border-[hsl(170,100%,55%)] border-t-transparent animate-spin" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Composer */}
          <div className="p-3 border-t border-white/10 bg-[hsl(220,40%,5%)]/70 backdrop-blur-xl">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-[hsl(170,100%,55%)]/50 transition-colors">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }}
                placeholder={chat.length === 0 ? "Describe the web app you want…" : "Iterate: add a dark-mode toggle, change colors, add a chart…"}
                rows={3}
                className="bg-transparent border-0 resize-none focus-visible:ring-0 text-sm"
              />
              <div className="flex items-center justify-between p-2 border-t border-white/10">
                <span className="text-[10px] text-white/40 font-mono flex items-center gap-1">
                  ⌘↵ to send · 1 <img src={beeLogo} alt="bee coin" className="w-3 h-3 object-contain inline-block" />
                </span>
                <Button size="sm" onClick={send} disabled={busy || !prompt.trim()} className="bg-[hsl(170,100%,45%)] hover:bg-[hsl(170,100%,55%)] text-black font-semibold">
                  {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Send className="w-3.5 h-3.5 mr-1" />Build</>}
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT: preview */}
        <main className="flex-1 flex flex-col min-h-0 lg:h-[calc(100vh-3.5rem)] bg-[hsl(220,40%,3%)]">
          <div className="h-11 border-b border-white/10 flex items-center px-3 gap-1 shrink-0">
            <div className="flex rounded-lg border border-white/10 p-0.5">
              <button onClick={() => setView("preview")} className={`px-3 py-1 text-xs rounded flex items-center gap-1.5 ${view === "preview" ? "bg-white/10 text-white" : "text-white/50"}`}>
                <Eye className="w-3 h-3" />Preview
              </button>
              <button onClick={() => setView("code")} className={`px-3 py-1 text-xs rounded flex items-center gap-1.5 ${view === "code" ? "bg-white/10 text-white" : "text-white/50"}`}>
                <Code2 className="w-3 h-3" />Code
              </button>
            </div>
            <div className="ml-auto flex rounded-lg border border-white/10 p-0.5">
              <button onClick={() => setDevice("desktop")} className={`px-2 py-1 rounded ${device === "desktop" ? "bg-white/10" : ""}`}><Monitor className="w-3.5 h-3.5" /></button>
              <button onClick={() => setDevice("mobile")} className={`px-2 py-1 rounded ${device === "mobile" ? "bg-white/10" : ""}`}><Smartphone className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-auto p-3 sm:p-6 flex items-start justify-center">
            {view === "preview" ? (
              <div className={`bg-white rounded-xl shadow-2xl overflow-hidden border border-white/10 transition-all ${device === "mobile" ? "w-[390px] max-w-full h-[780px] max-h-[90vh]" : "w-full h-full min-h-[600px]"}`}>
                <iframe
                  key={iframeSrc.length}
                  src={iframeSrc}
                  title="David preview"
                  sandbox="allow-scripts allow-forms allow-pointer-lock allow-popups"
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <pre className="w-full h-full text-[11px] leading-relaxed text-white/80 font-mono whitespace-pre-wrap break-words bg-[hsl(220,40%,5%)] rounded-xl p-4 border border-white/10 overflow-auto">{html}</pre>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default David;
