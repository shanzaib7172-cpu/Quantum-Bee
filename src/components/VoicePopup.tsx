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
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalizedRef = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const vadRafRef = useRef<number | null>(null);

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
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (vadRafRef.current) {
        cancelAnimationFrame(vadRafRef.current);
        vadRafRef.current = null;
      }
      finalizedRef.current = true;
      try { mediaRecorderRef.current?.stop(); } catch {}
      mediaRecorderRef.current = null;
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
      setIsListening(false);
      setTranscript("");
      stopSpeaking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const cleanupRecording = useCallback(() => {
    if (vadRafRef.current) {
      cancelAnimationFrame(vadRafRef.current);
      vadRafRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    try { mediaRecorderRef.current?.stop(); } catch {}
    mediaRecorderRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
  }, []);

  const startListening = useCallback(async () => {
    if (isSpeaking) stopSpeaking();
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      alert("Your browser doesn't support voice input. Try Chrome.");
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch {
      alert("Microphone access denied.");
      return;
    }

    mediaStreamRef.current = stream;
    finalizedRef.current = false;
    const chunks: Blob[] = [];

    const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "";
    const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    const finalize = async () => {
      if (finalizedRef.current) return;
      finalizedRef.current = true;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (vadRafRef.current) {
        cancelAnimationFrame(vadRafRef.current);
        vadRafRef.current = null;
      }

      // Wait for recorder to flush, then transcribe
      await new Promise<void>((resolve) => {
        if (recorder.state === "inactive") return resolve();
        recorder.onstop = () => resolve();
        try { recorder.stop(); } catch { resolve(); }
      });
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;

      setIsListening(false);
      const blob = new Blob(chunks, { type: mime || "audio/webm" });
      if (blob.size < 1200) return; // basically silent

      setThinking(true);
      try {
        const fd = new FormData();
        fd.append("audio", blob, "voice.webm");
        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stt`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: fd,
          }
        );
        if (!resp.ok) throw new Error(`STT ${resp.status}`);
        const data = await resp.json();
        const text: string = (data.text || "").trim();
        if (!text) return;
        setTranscript(text);
        const isUrdu = /[\u0600-\u06FF]/.test(text);
        const prompt = isUrdu
          ? `${text}\n\n(The user spoke in Urdu. Reply ONLY in Urdu using Urdu script.)`
          : text;
        const reply = await onSendMessage(prompt);
        if (typeof reply === "string" && reply) setLastAssistant(reply);
      } catch (err) {
        console.error("STT failed:", err);
      } finally {
        setThinking(false);
        setTranscript("");
      }
    };

    recorder.start(100);
    setIsListening(true);

    // VAD: stop ~900ms after silence; hard cap 15s
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    const buf = new Uint8Array(analyser.fftSize);
    const startedAt = Date.now();
    let hasSpoken = false;

    const tick = () => {
      analyser.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        const v = (buf[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / buf.length);
      const speaking = rms > 0.02;

      if (speaking) {
        hasSpoken = true;
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      } else if (hasSpoken && !silenceTimerRef.current) {
        silenceTimerRef.current = setTimeout(finalize, 900);
      }

      if (Date.now() - startedAt > 15000) {
        finalize();
        return;
      }
      vadRafRef.current = requestAnimationFrame(tick);
    };
    vadRafRef.current = requestAnimationFrame(tick);
  }, [isSpeaking, stopSpeaking, onSendMessage]);

  const toggle = () => {
    if (isListening) {
      // Manual stop → finalize whatever we have
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        // trigger finalize via VAD path
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
        if (vadRafRef.current) cancelAnimationFrame(vadRafRef.current);
        vadRafRef.current = null;
        try { recorder.requestData?.(); } catch {}
        try { recorder.stop(); } catch {}
      }
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
