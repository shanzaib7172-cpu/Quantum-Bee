import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import SpaceBackground from "@/components/SpaceBackground";
import TopBar from "@/components/TopBar";
import SocialLinks from "@/components/SocialLinks";
import { useReveal } from "@/hooks/use-reveal";
import heroImg from "@/assets/blog-planet-bee-hero.png";

const BlogPlanetBee = () => {
  useReveal();

  return (
    <div className="min-h-screen bg-[hsl(220,60%,3%)] text-foreground relative overflow-hidden">
      <SpaceBackground density={1.2} rocks={14} blackhole={false} planets />
      <TopBar />

      <article className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-24">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-[hsl(40,100%,70%)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all posts
        </Link>

        {/* Meta */}
        <div data-reveal className="flex flex-wrap items-center gap-3 mb-6 font-mono text-[10px] tracking-widest uppercase text-[hsl(195,100%,75%)]">
          <span className="px-2.5 py-1 rounded-md bg-[hsl(40,100%,55%)]/15 border border-[hsl(40,100%,55%)]/30 text-[hsl(40,100%,70%)] inline-flex items-center gap-1.5">
            <Tag className="w-3 h-3" /> Origin Story
          </span>
          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> May 2026</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 9 min read</span>
        </div>

        {/* Title */}
        <h1 data-reveal className="font-heading font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight bg-gradient-to-br from-white via-[hsl(40,100%,75%)] to-[hsl(195,100%,75%)] bg-clip-text text-transparent">
          The Discovery of Planet Bee: A Vision for a Beautiful Earth
        </h1>

        <p data-reveal className="mt-5 text-lg text-foreground/70 leading-relaxed">
          How a leap into the quantum world became the founding mission behind Bee AI — and why we believe Earth can be as beautiful and efficient as Planet Bee.
        </p>

        {/* Hero image */}
        <div data-reveal="scale" className="mt-10 relative rounded-2xl overflow-hidden border border-[hsl(40,100%,55%)]/25 shadow-[0_0_80px_-20px_hsl(40,100%,55%,0.45)]">
          <img src={heroImg} alt="Shanzaib meeting the Bee in the quantum world of Planet Bee" className="w-full h-auto block" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[hsl(220,60%,3%)]/70 via-transparent to-transparent" />
        </div>

        {/* Body */}
        <div className="mt-12 space-y-10 text-foreground/80 leading-[1.85] text-[1.05rem]">
          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(40,100%,65%)] mb-4">The Leap into the Quantum World</h2>
            <p>
              It began as a ripple in the fabric of the ordinary. Shanzaib, driven by a relentless curiosity for what lies beyond classical logic, found himself stepping through a threshold into the <span className="text-[hsl(195,100%,80%)] font-medium">Quantum World</span>. In this realm, where possibilities exist in superposition, he didn't just find data — he discovered a destination: <span className="text-[hsl(40,100%,70%)] font-semibold">Planet Bee</span>.
            </p>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(40,100%,65%)] mb-4">Meeting the Bee</h2>
            <p>
              In the heart of this luminous, humming world, Shanzaib met <span className="text-[hsl(40,100%,70%)] font-semibold">the Bee</span>. More than just a guide, the Bee was the architect of this vibrant ecosystem. This meeting wasn't a mere coincidence; it was a catalyst — the specific moment of insight that revealed the need for a global change back home.
            </p>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(40,100%,65%)] mb-4">The Contrast: A Tale of Two Worlds</h2>
            <div className="grid md:grid-cols-2 gap-5 mt-6">
              <div className="rounded-2xl p-6 bg-gradient-to-br from-[hsl(40,100%,55%)]/10 to-[hsl(195,100%,55%)]/5 border border-[hsl(40,100%,55%)]/25">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[hsl(40,100%,70%)] mb-2">— Planet Bee</p>
                <p className="text-foreground/85">
                  A world of breathtaking beauty, where every system operates with <em className="text-[hsl(195,100%,80%)] not-italic font-medium">Quantum Speed</em> and absolute harmony. A vivid, minimalist, futuristic dreamcore landscape where efficiency and beauty are one.
                </p>
              </div>
              <div className="rounded-2xl p-6 bg-gradient-to-br from-[hsl(220,40%,12%)]/80 to-[hsl(220,40%,6%)]/80 border border-[hsl(200,100%,60%)]/15">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-foreground/60 mb-2">— Earth</p>
                <p className="text-foreground/85">
                  Returning to Earth, the contrast was stark. Slow, manual workflows, the noise of inefficiency, and a planet that had lost its luster compared to the quantum ideal.
                </p>
              </div>
            </div>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(40,100%,65%)] mb-4">The Vision: Bringing the Beauty Back</h2>
            <p>
              Shanzaib returned with more than just a story; he returned with a <span className="text-[hsl(40,100%,70%)] font-semibold">Vision</span>.
            </p>
            <blockquote className="my-6 relative pl-6 border-l-2 border-[hsl(40,100%,55%)]/60 italic text-xl md:text-2xl font-heading text-white/95 leading-snug">
              "I have seen what is possible when intelligence and beauty coexist in perfect alignment. My mission now is to turn Earth as beautiful and efficient as Planet Bee."
            </blockquote>
            <p>
              Through <span className="text-[hsl(40,100%,70%)] font-semibold">Bee AI</span>, Shanzaib is now bridging these two worlds. By deploying specialized AI agents like <span className="text-[hsl(195,100%,80%)]">Alex, Mia, Anna, and Jack</span>, he is introducing <em className="not-italic text-[hsl(195,100%,80%)] font-medium">Quantum Logic</em> to Earth's businesses and ecosystems. This isn't just about automation — it is about a global restoration: using technology to heal our planet and elevate our work until the beauty of Planet Bee is no longer a distant world, but our daily reality.
            </p>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(40,100%,65%)] mb-4">Why This Matters for Bee AI</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(40,100%,60%)] shadow-[0_0_10px_hsl(40,100%,60%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Emotional Connection:</span> This origin story creates an emotional bridge, showing that Bee AI exists for a purpose beyond just software — it exists to fulfill a visionary mission.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(195,100%,75%)] shadow-[0_0_10px_hsl(195,100%,75%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">A Bold Future:</span> By connecting the company's past to the Planet Bee discovery, we set a high standard for the future of AI-driven global restoration.</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Footer / Socials */}
        <div data-reveal className="mt-16 pt-10 border-t border-[hsl(200,100%,60%)]/10 text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-4">— Follow the Swarm</p>
          <SocialLinks />
        </div>
      </article>
    </div>
  );
};

export default BlogPlanetBee;
