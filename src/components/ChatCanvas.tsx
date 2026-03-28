import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, Mic, MicOff, Volume2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AnimatedBee from "./AnimatedBee";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const suggestions = [
  "Analyze my website's UX",
  "Generate a marketing plan",
  "Build a data pipeline",
  "Design a brand identity",
];

const ChatCanvas = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1.1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const streamChat = useCallback(async (allMessages: Message[]) => {
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
        if (jsonStr === "[DONE]") { streamDone = true; break; }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantSoFar += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
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
  }, [toast]);

  const handleSend = useCallback(async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await streamChat(newMessages);
      // Speak the final response
      if (response) {
        setTimeout(() => speakText(response), 300);
      }
    } catch (e) {
      console.error("Chat error:", e);
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: e instanceof Error ? e.message : "Failed to get response",
      });
      // Remove the failed assistant message if any partial was added
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
  }, [input, isLoading, messages, streamChat, speakText, toast]);

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

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
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
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const isEmpty = messages.length === 0;

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
                    key={s}
                    onClick={() => setInput(s)}
                    className="px-4 py-2 text-xs rounded-full glass glass-highlight text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-all"
                  >
                    {s}
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
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-bee/15 text-foreground border border-bee/20"
                        : "glass glass-highlight text-foreground/90"
                    }`}
                  >
                    {msg.content}
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.content)}
                        className="ml-2 inline-flex p-1 rounded text-muted-foreground hover:text-primary transition-colors"
                        title={isSpeaking ? "Stop speaking" : "Read aloud"}
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "text-bee animate-pulse" : ""}`} />
                      </button>
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
            Beee AI may produce inaccurate results. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatCanvas;
