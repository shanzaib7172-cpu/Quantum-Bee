import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Default warm female voice (Sarah). Caller can override with voiceId.
const DEFAULT_VOICE = "EXAVITQu4vr4xnSDxMaL";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, voiceId, isUrdu } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "text required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY not configured");

    const voice = voiceId || DEFAULT_VOICE;
    const trimmed = text.slice(0, 4500);

    const r = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: trimmed,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: isUrdu ? 0.65 : 0.5,
            similarity_boost: 0.8,
            style: isUrdu ? 0.45 : 0.35,
            use_speaker_boost: true,
            speed: 1.0,
          },
        }),
      }
    );

    if (!r.ok) {
      const t = await r.text();
      console.error("ElevenLabs error:", r.status, t);
      return new Response(JSON.stringify({ error: "TTS failed", detail: t }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(r.body, {
      headers: { ...corsHeaders, "Content-Type": "audio/mpeg" },
    });
  } catch (e) {
    console.error("tts error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
