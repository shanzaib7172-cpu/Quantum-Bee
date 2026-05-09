import { useState, useRef, useCallback, useEffect } from "react";
import { Sparkles, X, Send, Mic, MicOff, Loader2, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const AdminBeeAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi 🐝 I'm Bee, your admin co-pilot. Ask me to send a notification, write a blog, check stats, or moderate a user." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const qc = useQueryClient();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const speak = useCallback(async (text: string) => {
    if (muted || !text) return;
    try {
      const r = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: text.slice(0, 800) }),
      });
      if (!r.ok) return;
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      audioRef.current?.pause();
      const a = new Audio(url);
      audioRef.current = a;
      a.play().catch(() => {});
    } catch {}
  }, [muted]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-bee", {
        body: { messages: next.map((m) => ({ role: m.role, content: m.content })) },
      });
      if (error) throw error;
      const reply = data?.reply || "(no reply)";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      speak(reply);
      // Refresh dashboard data after any action
      qc.invalidateQueries();
    } catch (e: any) {
      toast({ title: "Bee error", description: e.message || "Failed", variant: "destructive" });
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const rec = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm" });
      recRef.current = rec;
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (blob.size < 800) return;
        setLoading(true);
        try {
          const fd = new FormData();
          fd.append("audio", blob, "voice.webm");
          const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stt`, {
            method: "POST",
            headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
            body: fd,
          });
          const data = await resp.json();
          const txt = (data.text || "").trim();
          setLoading(false);
          if (txt) send(txt);
        } catch {
          setLoading(false);
        }
      };
      rec.start();
      setListening(true);
    } catch {
      toast({ title: "Microphone denied", variant: "destructive" });
    }
  };

  const stopVoice = () => {
    setListening(false);
    try { recRef.current?.stop(); } catch {}
  };

  return (
    <>
      {/* Floating trigger - top right */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed top-3 right-3 z-50 flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-bee/15 hover:bg-bee/25 border border-bee/40 text-bee font-medium text-xs sm:text-sm transition-all shadow-lg"
        style={{ boxShadow: "0 0 24px hsl(45 100% 55% / 0.35)" }}
      >
        <Sparkles className="w-4 h-4" />
        <span className="hidden sm:inline">Ask Bee</span>
      </button>

      {open && (
        <div className="fixed z-50 glass-strong border border-bee/30 shadow-2xl flex flex-col overflow-hidden animate-fade-in
          inset-x-2 bottom-2 top-16 rounded-2xl
          sm:inset-auto sm:top-20 sm:right-4 sm:bottom-auto sm:w-[420px] sm:h-[600px] sm:max-h-[calc(100vh-6rem)]"
          style={{ boxShadow: "0 0 40px -10px hsl(45 100% 55% / 0.4)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/40">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-bee" />
              <span className="font-heading font-semibold text-sm">Bee Admin Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setMuted((m) => !m)}>
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setOpen(false)}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${m.role === "user" ? "bg-bee/20 text-foreground border border-bee/30" : "bg-secondary/50 text-foreground border border-border/50"}`}>
                  <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 border border-border/50 rounded-2xl px-3.5 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-bee" />
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="p-3 border-t border-border/50 bg-background/40 flex items-center gap-2"
          >
            <Button
              type="button"
              size="icon"
              variant={listening ? "default" : "ghost"}
              className={`h-9 w-9 shrink-0 ${listening ? "bg-bee text-bee-foreground" : ""}`}
              onClick={listening ? stopVoice : startVoice}
            >
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Bee anything…"
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default AdminBeeAssistant;
