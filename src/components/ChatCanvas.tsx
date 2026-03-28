import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, Mic, MicOff, Volume2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import AnimatedBee from "./AnimatedBee";

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  const handleSend = useCallback((text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const assistantReply = "I'm buzzing with ideas! 🐝 This is a demo response — connect me to Lovable Cloud to enable real AI capabilities with voice and text.";

    setMessages((prev) => [
      ...prev,
      { role: "user", content: msg },
      { role: "assistant", content: assistantReply },
    ]);
    setInput("");

    // Speak the response
    setTimeout(() => speakText(assistantReply), 300);
  }, [input, speakText]);

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

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
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
              {/* Small bee avatar floating when there are messages */}
              <div className="flex justify-center mb-4">
                <AnimatedBee isSpeaking={isSpeaking} />
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
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-muted-foreground/50"
            />
            {/* Voice button */}
            <button
              onClick={toggleListening}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? "bg-bee/20 text-bee glow-bee"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-bee/15 text-bee hover:bg-bee/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
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
