import { supabase } from "@/integrations/supabase/client";

export const STATIC_BLOGS: { slug: string; title: string }[] = [
  { slug: "/blogs/discovery-of-planet-bee", title: "The Discovery of Planet Bee" },
  { slug: "/blogs/bee-ai-engine", title: "Bee AI: The Engine of the New Business Era" },
  { slug: "/blogs/health-bee-quantum", title: "Health Bee: The Quantum Revolution in Molecular Discovery" },
  { slug: "/blogs/space-bee-quantum", title: "Space Bee — The Quantum Leap into the Black Hole and Beyond" },
  { slug: "/blogs/quantum-bee-city", title: "The Blueprint for Planet Bee: Building the First Quantum City on Earth" },
  { slug: "/blogs/study-bee-academy", title: "Study Bee: The Global Classroom for the Quantum Era" },
];

export async function trackBlogClick(slug: string) {
  try {
    const { data } = await supabase
      .from("blog_clicks")
      .select("clicks")
      .eq("slug", slug)
      .maybeSingle();
    if (data) {
      await supabase
        .from("blog_clicks")
        .update({ clicks: (data.clicks as number) + 1, updated_at: new Date().toISOString() })
        .eq("slug", slug);
    } else {
      await supabase.from("blog_clicks").insert({ slug, clicks: 1 });
    }
  } catch {
    /* silent */
  }
}
