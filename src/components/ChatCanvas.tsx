import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Send, Paperclip, Mic, MicOff, Volume2, Loader2, FileDown, AudioLines, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AnimatedBee from "./AnimatedBee";
import VoicePopup from "./VoicePopup";
import { ChartBlock, extractCharts, type ChartSpec } from "./ChartBlock";
import { generatePlanPdf } from "@/lib/pdfPlan";
import { useBeeCoins, COIN_COSTS } from "@/hooks/use-bee-coins";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const suggestions: { label: string; prompt: string }[] = [
  {
    label: "Analyze my website's UX",
    prompt:
      "Analyze my website's UX. Review navigation, hierarchy, readability, mobile responsiveness, and conversion flow. Give me a prioritized list of issues with concrete fixes.",
  },
  {
    label: "Generate a marketing plan",
    prompt:
      "Generate a 90-day marketing plan for my business. Include target audience, channels, content calendar, KPIs, and budget allocation.",
  },
  {
    label: "Show Q1 sales analytics",
    prompt:
      "Show me a Q1 sales analytics breakdown with revenue trends, top products, customer segments, and a chart of monthly performance.",
  },
  {
    label: "Design a brand identity",
    prompt:
      "Help me design a brand identity. Suggest a color palette, typography pairing, logo direction, tone of voice, and brand values.",
  },
];


const ChatCanvas = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const [voicePopupOpen, setVoicePopupOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const lockedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const { toast } = useToast();
  const { deduct } = useBeeCoins();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionIdRef = useRef<string | null>(null);
  const urlChatId = searchParams.get("chat");

  // Load an existing chat session when ?chat=<id> is present
  useEffect(() => {
    if (!user) {
      sessionIdRef.current = null;
      setMessages([]);
      return;
    }
    if (urlChatId) {
      sessionIdRef.current = urlChatId;
      supabase
        .from("chat_messages")
        .select("role, content")
        .eq("session_id", urlChatId)
        .order("created_at", { ascending: true })
        .then(({ data }) => {
          if (data) {
            setMessages(
              data
                .filter((m) => m.role === "user" || m.role === "assistant")
                .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
            );
          }
        });
    } else {
      sessionIdRef.current = null;
      setMessages([]);
    }
  }, [urlChatId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Lock a single female voice once available so the agent always sounds the same.
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const preferred =
        voices.find((v) => /samantha/i.test(v.name) && v.lang.startsWith("en")) ||
        voices.find((v) => /google uk english female/i.test(v.name)) ||
        voices.find((v) => /microsoft (aria|jenny|zira)/i.test(v.name)) ||
        voices.find((v) => /(karen|moira|fiona|tessa|ava)/i.test(v.name) && v.lang.startsWith("en")) ||
        voices.find((v) => /female|woman/i.test(v.name) && v.lang.startsWith("en")) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0];
      lockedVoiceRef.current = preferred || null;
      setVoicesReady(true);
    };
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/^PLAN:\s*.*$/m, "")
      .replace(/\[AGENT:[a-z]+\]/gi, "")
      .replace(/```chart[\s\S]*?```/g, " ")
      .replace(/```[\s\S]*?```/g, " code block ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      .replace(/#{1,6}\s/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "image")
      .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
      .replace(/[>\-•~|]/g, "")
      // Strip emoji & pictographs so the voice agent never reads them aloud
      .replace(/\p{Extended_Pictographic}/gu, "")
      .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "")
      .replace(/[\u200D\uFE0F\u20E3]/g, "")
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackIdRef = useRef(0);
  const ttsAbortRef = useRef<AbortController | null>(null);

  const fallbackBrowserSpeak = useCallback((cleaned: string, isUrdu: boolean) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    if (isUrdu) {
      const voices = window.speechSynthesis.getVoices();
      const urVoice =
        voices.find((v) => /^ur(-|_)/i.test(v.lang)) ||
        voices.find((v) => /urdu/i.test(v.name)) ||
        voices.find((v) => /^hi(-|_)/i.test(v.lang)) ||
        voices.find((v) => /^ar(-|_)/i.test(v.lang));
      if (urVoice) utterance.voice = urVoice;
      utterance.lang = urVoice?.lang || "ur-PK";
    } else if (lockedVoiceRef.current) {
      utterance.voice = lockedVoiceRef.current;
      utterance.lang = lockedVoiceRef.current.lang;
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const speakText = useCallback(
    async (text: string) => {
      const cleaned = cleanTextForSpeech(text);
      if (!cleaned) return;
      const isUrdu = /[\u0600-\u06FF]/.test(cleaned);

      // Stop any prior playback / in-flight request
      const myId = ++playbackIdRef.current;
      ttsAbortRef.current?.abort();
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();

      const ac = new AbortController();
      ttsAbortRef.current = ac;

      try {
        setIsSpeaking(true);
        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ text: cleaned, isUrdu }),
            signal: ac.signal,
          }
        );
        if (myId !== playbackIdRef.current) return;
        if (!resp.ok) throw new Error(`TTS ${resp.status}`);
        const blob = await resp.blob();
        if (myId !== playbackIdRef.current) return;
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          if (myId === playbackIdRef.current) setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          if (myId === playbackIdRef.current) setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };
        await audio.play();
      } catch (err: any) {
        if (err?.name === "AbortError" || myId !== playbackIdRef.current) return;
        console.error("ElevenLabs TTS failed, falling back:", err);
        setIsSpeaking(false);
        fallbackBrowserSpeak(cleaned, isUrdu);
      }
    },
    [fallbackBrowserSpeak]
  );

  const streamChat = useCallback(
    async (allMessages: Message[]) => {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({ error: "Request failed" }));
        const errorMsg = errorData.error || `Error ${resp.status}`;
        if (resp.status === 429 || resp.status === 402) {
          toast({ variant: "destructive", title: "AI Error", description: errorMsg });
        }
        throw new Error(errorMsg);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantSoFar = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantSoFar } : m,
                  );
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      return assistantSoFar;
    },
    [toast],
  );

  const handleSend = useCallback(
    async (text?: string) => {
      const msg = text || input;
      if (!msg.trim() || isLoading) return;

      // Deduct Bee Coins for the chat itself. If response routes to an agent,
      // the agent page will deduct its own additional cost on use.
      const ok = await deduct(COIN_COSTS.beeAiChat, "Bee AI chat", "bee-ai");
      if (!ok) return;

      const userMsg: Message = { role: "user", content: msg };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);

      // Ensure a session exists; create on first message
      let sid = sessionIdRef.current;
      if (!sid && user) {
        const title = msg.split(/\s+/).slice(0, 6).join(" ").slice(0, 60) || "New chat";
        const { data } = await supabase
          .from("chat_sessions")
          .insert({ user_id: user.id, title })
          .select("id")
          .single();
        if (data?.id) {
          sid = data.id;
          sessionIdRef.current = sid;
          setSearchParams({ chat: sid }, { replace: true });
        }
      }
      if (sid && user) {
        await supabase.from("chat_messages").insert({
          session_id: sid,
          user_id: user.id,
          role: "user",
          content: msg,
        });
      }

      try {
        const response = await streamChat(newMessages);
        if (response) {
          setTimeout(() => speakText(response), 300);
          if (sid && user) {
            await supabase.from("chat_messages").insert({
              session_id: sid,
              user_id: user.id,
              role: "assistant",
              content: response,
            });
            await supabase
              .from("chat_sessions")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", sid);
          }
        }
        return response;
      } catch (e) {
        console.error("Chat error:", e);
        toast({
          variant: "destructive",
          title: "Chat Error",
          description: e instanceof Error ? e.message : "Failed to get response",
        });
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && !last.content) {
            return prev.slice(0, -1);
          }
          return prev;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, streamChat, speakText, toast, deduct, user, setSearchParams],
  );

  const toggleListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Your browser doesn't support voice input. Try Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      if (event.results[0].isFinal) {
        setInput("");
        handleSend(transcript);
        setIsListening(false);
      } else {
        setInput(transcript);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, handleSend]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const isEmpty = messages.length === 0;

  const AGENT_ROUTES: Record<string, { name: string; path: string }> = {
    anna: { name: "Anna", path: "/leads-generator" },
    sophia: { name: "Sophia", path: "/product-shoot" },
    jack: { name: "Jack", path: "/jack" },
  };

  // Renders an assistant message: detects plan, extracts charts, color-codes markdown, splices charts in.
  const renderAssistant = (raw: string) => {
    let working = raw;
    let planTitle: string | null = null;
    const planMatch = working.match(/^PLAN:\s*(.+?)\s*\n/);
    if (planMatch) {
      planTitle = planMatch[1].trim();
      working = working.slice(planMatch[0].length);
    }

    let agent: { name: string; path: string } | null = null;
    const agentMatch = working.match(/\[AGENT:([a-z]+)\]/i);
    if (agentMatch) {
      const found = AGENT_ROUTES[agentMatch[1].toLowerCase()];
      if (found) agent = found;
      working = working.replace(/\[AGENT:[a-z]+\]/gi, "").trim();
    }

    const { cleaned, charts } = extractCharts(working);
    const segments = cleaned.split(/\{\{CHART:(\d+)\}\}/);

    return (
      <div className="space-y-2">
        {segments.map((seg, i) => {
          if (i % 2 === 1) {
            const idx = Number(seg);
            const spec = charts[idx];
            return spec ? <ChartBlock key={`c-${i}`} spec={spec} /> : null;
          }
          if (!seg.trim()) return null;
          return (
            <div
              key={`t-${i}`}
              className="prose prose-invert prose-sm max-w-none
                prose-headings:font-heading prose-headings:mt-4 prose-headings:mb-2
                prose-h1:text-bee-blue prose-h2:text-bee-blue prose-h3:text-bee-blue
                prose-h4:text-bee-blue prose-h5:text-bee-blue prose-h6:text-bee-blue
                prose-p:text-white prose-p:mb-3 prose-p:leading-relaxed
                prose-strong:text-bee
                prose-li:text-bee prose-li:marker:text-bee
                prose-ol:text-bee prose-ul:text-bee
                prose-blockquote:text-bee prose-blockquote:border-l-bee prose-blockquote:not-italic
                prose-code:text-bee-blue prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border/50
                prose-a:text-bee-blue"
            >
              <ReactMarkdown
                components={{
                  // Inside list items, keep the inner text white while the bullet/number stays yellow.
                  li: ({ children }) => (
                    <li>
                      <span className="text-white">{children}</span>
                    </li>
                  ),
                }}
              >
                {seg}
              </ReactMarkdown>
            </div>
          );
        })}

        {planTitle && (
          <button
            onClick={() => generatePlanPdf(planTitle!, working)}
            className="mt-2 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-bee-blue/15 text-bee-blue border border-bee-blue/30 hover:bg-bee-blue/25 transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            Download plan PDF
          </button>
        )}

        {agent && (
          <Link
            to={agent.path}
            className="mt-2 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-bee/15 text-bee border border-bee/30 hover:bg-bee/25 transition-all"
          >
            Launch {agent.name}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 md:px-0">
        <div className="max-w-2xl mx-auto py-8">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
              <AnimatedBee isSpeaking={isSpeaking} />
              <h1 className="mt-8 text-3xl font-heading font-semibold text-gradient">
                What will you create?
              </h1>
              <p className="mt-3 text-sm text-muted-foreground text-center max-w-md">
                Type or speak your vision — I'll bring it to life with AI-powered analysis, generation, and strategy.
              </p>

              <div className="flex flex-wrap gap-2 mt-8 justify-center">
                {suggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setInput(s.prompt)}
                    className="px-4 py-2 text-xs rounded-full glass glass-highlight text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-all"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <AnimatedBee isSpeaking={isSpeaking || isLoading} />
              </div>

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-bee/15 text-foreground border border-bee/20"
                        : "glass glass-highlight text-white"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <>
                        {renderAssistant(msg.content)}
                        <button
                          onClick={() => (isSpeaking ? stopSpeaking() : speakText(msg.content))}
                          className="mt-2 inline-flex p-1 rounded text-muted-foreground hover:text-bee transition-colors"
                          title={isSpeaking ? "Stop speaking" : "Read aloud"}
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "text-bee animate-pulse" : ""}`} />
                        </button>
                      </>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start animate-fade-in">
                  <div className="glass glass-highlight px-4 py-3 rounded-2xl text-sm text-muted-foreground flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Buzzing...
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border/50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-2xl flex items-center gap-2 px-4 py-2 glass-highlight">
            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Paperclip className="w-4 h-4" />
            </button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={isListening ? "Listening... 🐝" : "Describe your vision..."}
              disabled={isLoading}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-muted-foreground/50"
            />
            <button
              onClick={() => setVoicePopupOpen(true)}
              disabled={isLoading}
              className="p-2 rounded-xl text-bee-blue hover:bg-bee-blue/15 transition-all"
              title="Open voice chat"
            >
              <AudioLines className="w-4 h-4" />
            </button>
            <button
              onClick={toggleListening}
              disabled={isLoading}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? "bg-bee/20 text-bee"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-bee/15 text-bee hover:bg-bee/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
            Bee AI may produce inaccurate results. Verify important information.
          </p>
        </div>
      </div>
      <VoicePopup
        open={voicePopupOpen}
        onClose={() => setVoicePopupOpen(false)}
        messages={messages}
        onSendMessage={handleSend}
        speakText={speakText}
        stopSpeaking={stopSpeaking}
        isSpeaking={isSpeaking}
      />
    </div>
  );
};

export default ChatCanvas;
