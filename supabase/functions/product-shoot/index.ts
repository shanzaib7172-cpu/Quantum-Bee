import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, style } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!imageBase64) throw new Error("No image provided");

    const stylePrompts: Record<string, string> = {
      "studio": "Place this product in a professional studio setting with soft, even lighting, clean white/grey backdrop, subtle shadows, and a premium commercial photography look. Make it look like a high-end product catalog shoot.",
      "lifestyle": "Place this product in a beautiful lifestyle setting — a modern living room, stylish desk, or trendy café table. Add natural lighting, shallow depth of field, and warm tones. Make it look like an Instagram lifestyle brand photo.",
      "outdoor": "Place this product in a stunning outdoor setting with natural sunlight, greenery or urban backdrop. Use golden hour lighting and cinematic depth of field for a premium outdoor campaign look.",
      "model": "Show this product being held or worn by a professional model in a studio setting. Add fashion-forward lighting, clean background, and make it look like a high-fashion editorial product placement.",
      "flat-lay": "Create a top-down flat lay arrangement with this product as the hero. Add complementary props like flowers, fabric textures, or small accessories. Use soft even lighting and a clean marble or wooden surface.",
    };

    const prompt = stylePrompts[style] || stylePrompts["studio"];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI image generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const text = data.choices?.[0]?.message?.content || "";

    if (!generatedImage) {
      return new Response(JSON.stringify({ error: "No image was generated. Try a different photo or style." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ image: generatedImage, description: text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("product-shoot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
