import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import SpaceBackground from "@/components/SpaceBackground";
import TopBar from "@/components/TopBar";
import SocialLinks from "@/components/SocialLinks";
import { useReveal } from "@/hooks/use-reveal";
import heroImg from "@/assets/blog-quantum-bee-city.png";

const BlogQuantumBeeCity = () => {
  useReveal();

  return (
    <div className="min-h-screen bg-[hsl(220,60%,3%)] text-foreground relative overflow-hidden">
      <SpaceBackground density={1.2} rocks={14} planets />
      <TopBar />

      <article className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-24">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-[hsl(40,100%,70%)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all posts
        </Link>

        <div data-reveal className="flex flex-wrap items-center gap-3 mb-6 font-mono text-[10px] tracking-widest uppercase text-[hsl(195,100%,75%)]">
          <span className="px-2.5 py-1 rounded-md bg-[hsl(40,100%,55%)]/15 border border-[hsl(40,100%,55%)]/30 text-[hsl(40,100%,70%)] inline-flex items-center gap-1.5">
            <Tag className="w-3 h-3" /> City · Blueprint
          </span>
          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Jan 2026</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 8 min read</span>
        </div>

        <h1 data-reveal className="font-heading font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight bg-gradient-to-br from-white via-[hsl(40,100%,75%)] to-[hsl(195,100%,80%)] bg-clip-text text-transparent">
          The Blueprint for Planet Bee: Building the First Quantum City on Earth
        </h1>

        <p data-reveal className="mt-5 text-lg text-foreground/70 leading-relaxed">
          Planet Bee is no longer just a vision found in the quantum realm; we are officially building its physical twin here on Earth: <span className="text-[hsl(40,100%,70%)] font-semibold">Quantum Bee City</span>. Authorized by Shanzaib Asghar, this city is the starting point of a global revolution — turning the slow and chaotic systems of our world into a beautiful, high-speed quantum ecosystem.
        </p>

        <div data-reveal="scale" className="mt-10 relative rounded-2xl overflow-hidden border border-[hsl(40,100%,55%)]/25 shadow-[0_0_80px_-20px_hsl(40,100%,55%,0.45)]">
          <img src={heroImg} alt="Quantum Bee City — futuristic Earth blueprint" className="w-full h-auto block" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[hsl(220,60%,3%)]/70 via-transparent to-transparent" />
        </div>

        <div className="mt-12 space-y-10 text-foreground/80 leading-[1.85] text-[1.05rem]">
          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(195,100%,75%)] mb-4">A City That Thinks at Quantum Speed</h2>
            <p>
              Current cities are burdened by <span className="text-[hsl(40,100%,70%)] font-semibold">"Physical Lag"</span> — traffic, pollution, and inefficient services. Quantum Bee City eliminates this by operating on a <span className="text-[hsl(195,100%,80%)] font-semibold">Hybrid Quantum-Classical Architecture</span>.
            </p>
            <ul className="space-y-4 mt-5">
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(40,100%,60%)] shadow-[0_0_10px_hsl(40,100%,60%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">The Bee Robot Workforce:</span> Instead of manual labor and traditional delivery, a synchronized network of specialized Bee Robots handles city logistics — managed by quantum light-paths, ensuring needs are met instantly and silently.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(195,100%,75%)] shadow-[0_0_10px_hsl(195,100%,75%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">The Urban Digital Twin:</span> The entire city exists as a real-time digital simulation. This Twin uses quantum sensors to predict potential issues before they happen — so water, transport, and safety run without a single error.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(140,70%,55%)] shadow-[0_0_10px_hsl(140,70%,55%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Zero-Carbon Quantum Grid:</span> Energy is managed by a quantum-optimized grid that perfectly predicts usage patterns across every home and hospital — 100% efficiency, zero-carbon footprint.</span>
              </li>
            </ul>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(40,100%,70%)] mb-4">The Philosophy: Efficiency is Beauty</h2>
            <p>
              The design of Quantum Bee City follows the minimalist and futuristic aesthetic discovered on Planet Bee. By removing the "noise" of traditional urban life, we create a space that is not only highly functional but breathtakingly beautiful.
            </p>
            <ul className="space-y-4 mt-5">
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(140,70%,55%)] shadow-[0_0_10px_hsl(140,70%,55%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Integrated Nature:</span> Advanced urban structures coexist with iridescent, bio-luminescent flora — a dreamcore landscape that heals the Earth while advancing technology.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(195,100%,75%)] shadow-[0_0_10px_hsl(195,100%,75%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Health Bee Integration:</span> At the heart of the city lies the Health Bee Complex, where quantum-designed chemical blueprints are synthesized to protect every citizen from diseases and viruses in real-time.</span>
              </li>
            </ul>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(195,100%,75%)] mb-4">The Revolution Starts Here</h2>
            <p>
              Quantum Bee City is more than a place to live; it is a proof of concept for the future of our planet. By bringing the logic and speed of the quantum world to our doorsteps, we are proving that Earth can be just as perfect as Planet Bee.
            </p>
            <blockquote className="my-8 relative pl-6 border-l-2 border-[hsl(40,100%,55%)]/60 italic text-base md:text-lg font-heading text-white/90 leading-snug">
              From this city, we start a revolution that will eventually transform the entire world into a high-speed, beautiful, and sustainable home for all.
            </blockquote>
          </section>
        </div>

        <div data-reveal className="mt-16 pt-10 border-t border-[hsl(200,100%,60%)]/10 text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-4">— Follow the Swarm</p>
          <SocialLinks />
        </div>
      </article>
    </div>
  );
};

export default BlogQuantumBeeCity;
