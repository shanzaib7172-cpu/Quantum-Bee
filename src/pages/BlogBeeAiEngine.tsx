import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import SpaceBackground from "@/components/SpaceBackground";
import TopBar from "@/components/TopBar";
import SocialLinks from "@/components/SocialLinks";
import { useReveal } from "@/hooks/use-reveal";
import heroImg from "@/assets/blog-bee-ai-engine.png";

const BlogBeeAiEngine = () => {
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

        <div data-reveal className="flex flex-wrap items-center gap-3 mb-6 font-mono text-[10px] tracking-widest uppercase text-[hsl(195,100%,75%)]">
          <span className="px-2.5 py-1 rounded-md bg-[hsl(40,100%,55%)]/15 border border-[hsl(40,100%,55%)]/30 text-[hsl(40,100%,70%)] inline-flex items-center gap-1.5">
            <Tag className="w-3 h-3" /> Vision · Strategy
          </span>
          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Apr 2026</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 7 min read</span>
        </div>

        <h1 data-reveal className="font-heading font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight bg-gradient-to-br from-white via-[hsl(40,100%,75%)] to-[hsl(195,100%,75%)] bg-clip-text text-transparent">
          Bee AI: The Engine of the New Business Era
        </h1>

        <p data-reveal className="mt-5 text-lg text-foreground/70 leading-relaxed">
          A revolutionary business operating system designed to eliminate the "Physical Lag" of the modern world — and shift entire companies into Quantum Speed.
        </p>

        <div data-reveal="scale" className="mt-10 relative rounded-2xl overflow-hidden border border-[hsl(40,100%,55%)]/25 shadow-[0_0_80px_-20px_hsl(40,100%,55%,0.45)]">
          <img src={heroImg} alt="Bee AI quantum business dashboard in a futuristic city" className="w-full h-auto block" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[hsl(220,60%,3%)]/70 via-transparent to-transparent" />
        </div>

        <div className="mt-12 space-y-10 text-foreground/80 leading-[1.85] text-[1.05rem]">
          <section data-reveal>
            <p>
              At its core, <span className="text-[hsl(40,100%,70%)] font-semibold">Bee AI</span> is a revolutionary business operating system designed to eliminate the <em className="not-italic text-[hsl(195,100%,80%)] font-medium">"Physical Lag"</em> of the modern world. While traditional businesses move at the speed of human emails, meetings, and manual data entry, Bee AI shifts the entire structure into <span className="text-[hsl(195,100%,80%)] font-semibold">Quantum Speed</span>.
            </p>
            <p className="mt-4">
              Here is an in-depth yet simple breakdown of how the system works without the need for manual intervention:
            </p>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(40,100%,65%)] mb-4">1. The Power of Quantum Logic</h2>
            <p>
              Standard business software works like a calculator — it follows one step at a time (1+1=2). Bee AI uses <span className="text-[hsl(195,100%,80%)] font-semibold">Quantum-Inspired Logic</span>, which works more like a high-speed spiderweb. It doesn't just look at one task; it analyzes every possible way to complete a business goal simultaneously to find the <span className="text-[hsl(40,100%,70%)] font-semibold">"Perfect Path"</span> with zero waste.
            </p>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(40,100%,65%)] mb-4">2. The "Self-Driving" Business Model</h2>
            <p>
              Think of Bee AI as a self-driving car for your company. Instead of you steering every small administrative task, you simply provide the <span className="text-[hsl(40,100%,70%)] font-semibold">"Destination"</span> (your business goal). The system then:
            </p>
            <ul className="space-y-4 mt-5">
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(40,100%,60%)] shadow-[0_0_10px_hsl(40,100%,60%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Orchestrates Workflows:</span> It automatically connects your data (like your database or website) to the actions that need to take place.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(195,100%,75%)] shadow-[0_0_10px_hsl(195,100%,75%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Eliminates Friction:</span> It removes the need for human "middlemen" who usually slow down the process of hiring, marketing, or operations.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(40,100%,60%)] shadow-[0_0_10px_hsl(40,100%,60%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Optimizes in Real-Time:</span> As the market changes, the system adjusts its own logic to ensure your business remains profitable and efficient.</span>
              </li>
            </ul>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(40,100%,65%)] mb-4">3. Turning Complexity into Beauty</h2>
            <p>
              The ultimate philosophy behind Bee AI is that <span className="text-[hsl(40,100%,70%)] font-semibold">Efficiency equals Beauty</span>. When a business runs perfectly — without errors, delays, or wasted resources — it becomes a <span className="text-[hsl(195,100%,80%)] font-semibold">"Quantum Ecosystem"</span>. This allows the founders and leaders to focus on high-level vision while the "Slow Earth" tasks are handled by the digital infrastructure.
            </p>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(40,100%,65%)] mb-4">Why This Matters</h2>
            <p>
              Bee AI is built for the entrepreneur who wants to scale globally without the heavy burden of traditional management. It is a bridge between the chaotic, slow business methods of the past and the clean, futuristic, and <em className="not-italic text-[hsl(195,100%,80%)] font-medium">"vibe-driven"</em> world of tomorrow.
            </p>
            <blockquote className="my-6 relative pl-6 border-l-2 border-[hsl(40,100%,55%)]/60 italic text-base md:text-lg font-heading text-white/90 leading-snug">
              Authorized by Shanzaib Asghar | Quantum Bee Strategic Plan 2026
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

export default BlogBeeAiEngine;
