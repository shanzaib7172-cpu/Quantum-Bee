import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, X, Volume2 } from "lucide-react";
import AnimatedBee from "./AnimatedBee";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface VoicePopupProps {
  open: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (msg: string) => Promise<string | null | void>;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const VoicePopup = ({
  open,
  onClose,
  messages,
  onSendMessage,
  speakText,
  stopSpeaking,
  isSpeaking,
}: VoicePopupProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [thinking, setThinking] = useState(false);
  const [lastAssistant, setLastAssistant] = useState<string>("");
  const [lang, setLang] = useState<"en-US" | "ur-PK">("en-US");
  const recognitionRef = useRef<any>(null);

  // Greet on open
  useEffect(() => {
    if (!open) return;
    const greeting =
      messages.length === 0
        ? "Hi, I'm Bee. Tap the microphone and tell me what you'd like to create."
        : "I'm listening. What's on your mind?";
    setLastAssistant(greeting);
    const t = setTimeout(() => speakText(greeting), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Cleanup on close
  useEffect(() => {
    if (!open) {
      recognitionRef.current?.stop?.();
      setIsListening(false);
      setTranscript("");
      stopSpeaking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const startListening = useCallback(() => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Your browser doesn't support voice input. Try Chrome.");
      return;
    }
    if (isSpeaking) stopSpeaking();
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = async (event: any) => {
      const text = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setTranscript(text);
      if (event.results[0].isFinal) {
        setIsListening(false);
        setThinking(true);
        try {
          const prompt =
            lang === "ur-PK"
              ? `${text}\n\n(Reply in Urdu using Urdu script.)`
              : text;
          const reply = await onSendMessage(prompt);
          if (typeof reply === "string" && reply) {
            setLastAssistant(reply);
          }
        } finally {
          setThinking(false);
          setTranscript("");
        }
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isSpeaking, stopSpeaking, onSendMessage, lang]);

  const toggle = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      startListening();
    }
  };

  if (!open) return null;

  const status = thinking
    ? "Thinking..."
    : isListening
    ? "Listening..."
    : isSpeaking
    ? "Speaking..."
    : "Tap the mic to talk";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      style={{
        background:
          "radial-gradient(ellipse at center, hsl(220 30% 6% / 0.85), hsl(220 30% 2% / 0.95))",
        backdropFilter: "blur(18px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative glass-strong rounded-3xl px-8 py-10 max-w-md w-full flex flex-col items-center gap-6 border border-bee/20"
        style={{
          boxShadow:
            "0 0 60px -10px hsl(45 100% 55% / 0.35), 0 0 120px -20px hsl(195 100% 55% / 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          aria-label="Close voice chat"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="absolute top-3 left-3 flex items-center gap-1 p-1 rounded-full border border-bee/20 bg-background/40 backdrop-blur">
          {(["en-US", "ur-PK"] as const).map((code) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-colors ${
                lang === code
                  ? "bg-bee/30 text-bee"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {code === "en-US" ? "EN" : "اُردُو"}
            </button>
          ))}
        </div>

        {/* Glowing bee with rings */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-72 h-72 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, hsl(45 100% 55% / 0.25) 0%, hsl(195 100% 55% / 0.12) 40%, transparent 70%)",
              animation: "orb-pulse 2.4s ease-in-out infinite",
            }}
          />
          {(isListening || isSpeaking || thinking) && (
            <>
              <div
                className="absolute w-56 h-56 rounded-full border-2 pointer-events-none"
                style={{
                  borderColor: "hsl(45 100% 55% / 0.45)",
                  animation: "sound-ring 1.6s ease-out infinite",
                }}
              />
              <div
                className="absolute w-64 h-64 rounded-full border pointer-events-none"
                style={{
                  borderColor: "hsl(195 100% 55% / 0.35)",
                  animation: "sound-ring 1.6s ease-out 0.5s infinite",
                }}
              />
            </>
          )}
          <AnimatedBee isSpeaking={isSpeaking || isListening || thinking} />
        </div>

        <div className="text-center min-h-[3rem]">
          <p className="text-xs uppercase tracking-widest text-bee/80 font-mono">
            {status}
          </p>
          <p className="mt-2 text-sm text-foreground/90 leading-relaxed line-clamp-3">
            {transcript || lastAssistant}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className={`relative p-5 rounded-full transition-all ${
              isListening
                ? "bg-bee/25 text-bee border border-bee/50"
                : "bg-bee/15 text-bee border border-bee/30 hover:bg-bee/25"
            }`}
            style={{
              boxShadow: isListening
                ? "0 0 30px hsl(45 100% 55% / 0.6)"
                : "0 0 18px hsl(45 100% 55% / 0.3)",
            }}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 animate-pulse" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-3 rounded-full bg-secondary/60 text-foreground/80 hover:text-foreground border border-border"
              title="Stop speaking"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoicePopup;
