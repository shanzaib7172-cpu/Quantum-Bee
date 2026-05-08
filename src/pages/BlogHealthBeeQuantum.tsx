import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import SpaceBackground from "@/components/SpaceBackground";
import TopBar from "@/components/TopBar";
import SocialLinks from "@/components/SocialLinks";
import { useReveal } from "@/hooks/use-reveal";
import heroImg from "@/assets/blog-health-bee-quantum.png";

const BlogHealthBeeQuantum = () => {
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
          <span className="px-2.5 py-1 rounded-md bg-[hsl(195,100%,55%)]/15 border border-[hsl(195,100%,55%)]/30 text-[hsl(195,100%,80%)] inline-flex items-center gap-1.5">
            <Tag className="w-3 h-3" /> Health · Quantum
          </span>
          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Mar 2026</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 8 min read</span>
        </div>

        <h1 data-reveal className="font-heading font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight bg-gradient-to-br from-white via-[hsl(195,100%,80%)] to-[hsl(40,100%,75%)] bg-clip-text text-transparent">
          Health Bee: The Quantum Revolution in Molecular Discovery
        </h1>

        <p data-reveal className="mt-5 text-lg text-foreground/70 leading-relaxed">
          Moving beyond classical trial-and-error medicine and entering the era of Quantum Molecular Synthesis — a Quantum Shield for humanity, starting with the chemistry of life itself.
        </p>

        <div data-reveal="scale" className="mt-10 relative rounded-2xl overflow-hidden border border-[hsl(195,100%,55%)]/25 shadow-[0_0_80px_-20px_hsl(195,100%,55%,0.45)]">
          <img src={heroImg} alt="Health Bee quantum molecular discovery in a futuristic biomedical city" className="w-full h-auto block" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[hsl(220,60%,3%)]/70 via-transparent to-transparent" />
        </div>

        <div className="mt-12 space-y-10 text-foreground/80 leading-[1.85] text-[1.05rem]">
          <section data-reveal>
            <p>
              In the traditional medical world, discovering a new drug is like searching for a single needle in a billion haystacks. It usually takes over a decade and billions of dollars to bring a single cure to life. <span className="text-[hsl(195,100%,80%)] font-semibold">Health Bee</span> is changing this narrative by moving away from classical trial-and-error and entering the era of <span className="text-[hsl(40,100%,70%)] font-semibold">Quantum Molecular Synthesis</span>.
            </p>
            <p className="mt-4">
              Authorized by Shanzaib Asghar, Health Bee is a mission to build a <em className="not-italic text-[hsl(40,100%,70%)] font-medium">"Quantum Shield"</em> for humanity, starting with the very chemistry of life itself.
            </p>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(195,100%,75%)] mb-4">How We Discover Compounds Using Quantum Technology</h2>
            <p>
              The secret to Health Bee's success lies in how we handle the "invisible" world of atoms. Classical computers struggle with chemistry because they can't truly simulate how subatomic particles interact. Health Bee uses <span className="text-[hsl(40,100%,70%)] font-semibold">Quantum Machine Learning (QML)</span> to solve this.
            </p>
            <ul className="space-y-4 mt-5">
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(195,100%,75%)] shadow-[0_0_10px_hsl(195,100%,75%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Mapping the Pathogen (The Lock):</span> When a virus like COVID-19 or a future threat emerges, our AI first maps the virus's protein structure in 3D.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(40,100%,60%)] shadow-[0_0_10px_hsl(40,100%,60%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">VQE Simulations (The Key):</span> We use Variational Quantum Eigensolvers (VQE) to simulate millions of potential chemical compounds. This allows us to calculate the "Ground State Energy" of molecules — essentially finding the exact chemical "key" that perfectly fits into the virus's "lock" to neutralize it.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(195,100%,75%)] shadow-[0_0_10px_hsl(195,100%,75%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Predictive Synthesis:</span> Instead of testing chemicals in a physical lab for years, our quantum algorithms predict which compounds will be non-toxic and most effective before a single drop of liquid is ever touched.</span>
              </li>
            </ul>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(195,100%,75%)] mb-4">Fighting Today's Viruses and Preventing Tomorrow's</h2>
            <p>
              Health Bee was built to be a proactive force. By utilizing <span className="text-[hsl(40,100%,70%)] font-semibold">AI × Quantum Technology</span>, we aren't just fighting known enemies like the Coronavirus; we are simulating <em className="not-italic text-[hsl(195,100%,80%)] font-medium">"Future Viruses"</em> that haven't even evolved yet.
            </p>
            <p className="mt-4">
              Our system builds a library of <span className="text-[hsl(40,100%,70%)] font-semibold">Antidote Blueprints</span>. This means that when a new outbreak happens, the world won't have to wait for months of research — the blueprint for the cure will already be in our quantum database, ready for growth and distribution.
            </p>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(195,100%,75%)] mb-4">The Vision: A Well-Grown World</h2>
            <p>
              Health Bee believes that <span className="text-[hsl(40,100%,70%)] font-semibold">health is the foundation of beauty</span>. By perfecting the chemistry of our bodies and our environment, we are helping to "grow" the world into a healthier state. We are replacing the slow, broken medical systems of the past with a high-speed, quantum-accurate shield that protects every person on Earth.
            </p>
            <blockquote className="my-6 relative pl-6 border-l-2 border-[hsl(195,100%,55%)]/60 italic text-base md:text-lg font-heading text-white/90 leading-snug">
              Authorized by Shanzaib Asghar | Health Bee — A Quantum Shield for Humanity
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

export default BlogHealthBeeQuantum;
