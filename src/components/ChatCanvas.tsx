import { useState, useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import GlassOrb from "./GlassOrb";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Analyze my website's UX",
  "Generate a marketing plan",
  "Build a data pipeline",
  "Design a brand identity",
];

const ChatCanvas = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "assistant", content: "I'm processing your request. This is a demo response — connect me to Lovable Cloud to enable real AI capabilities." },
    ]);
    setInput("");
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-0">
        <div className="max-w-2xl mx-auto py-8">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
              <GlassOrb />
              <h1 className="mt-8 text-3xl font-heading font-semibold text-gradient">
                What will you create?
              </h1>
              <p className="mt-3 text-sm text-muted-foreground text-center max-w-md">
                Describe your vision and I'll bring it to life with AI-powered analysis, generation, and strategy.
              </p>

              {/* Suggestion chips */}
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
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary/15 text-foreground border border-primary/20"
                        : "glass glass-highlight text-foreground/90"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
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
              placeholder="Describe your vision..."
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-muted-foreground/50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-primary/15 text-primary hover:bg-primary/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
            NexusAI may produce inaccurate results. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatCanvas;
