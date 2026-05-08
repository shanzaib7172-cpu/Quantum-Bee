import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import SpaceBackground from "@/components/SpaceBackground";
import TopBar from "@/components/TopBar";
import SocialLinks from "@/components/SocialLinks";
import { useReveal } from "@/hooks/use-reveal";
import heroImg from "@/assets/blog-space-bee-quantum.png";

const BlogSpaceBeeQuantum = () => {
  useReveal();

  return (
    <div className="min-h-screen bg-[hsl(220,60%,3%)] text-foreground relative overflow-hidden">
      <SpaceBackground density={1.2} rocks={14} blackhole planets />
      <TopBar />

      <article className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-24">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-[hsl(40,100%,70%)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all posts
        </Link>

        <div data-reveal className="flex flex-wrap items-center gap-3 mb-6 font-mono text-[10px] tracking-widest uppercase text-[hsl(195,100%,75%)]">
          <span className="px-2.5 py-1 rounded-md bg-[hsl(230,100%,65%)]/15 border border-[hsl(230,100%,65%)]/30 text-[hsl(230,100%,80%)] inline-flex items-center gap-1.5">
            <Tag className="w-3 h-3" /> Space · Quantum
          </span>
          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Feb 2026</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 9 min read</span>
        </div>

        <h1 data-reveal className="font-heading font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight bg-gradient-to-br from-white via-[hsl(195,100%,80%)] to-[hsl(230,100%,80%)] bg-clip-text text-transparent">
          Space Bee — The Quantum Leap into the Black Hole and Beyond
        </h1>

        <p data-reveal className="mt-5 text-lg text-foreground/70 leading-relaxed">
          While agencies like NASA and private firms like SpaceX are mastering rocket boosters and satellite deployment, Space Bee is targeting the final intellectual frontier: the merger of general relativity and quantum mechanics in the extreme environment of Space.
        </p>

        <div data-reveal="scale" className="mt-10 relative rounded-2xl overflow-hidden border border-[hsl(230,100%,65%)]/25 shadow-[0_0_80px_-20px_hsl(230,100%,65%,0.45)]">
          <img src={heroImg} alt="Space Bee quantum exploration command" className="w-full h-auto block" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[hsl(220,60%,3%)]/70 via-transparent to-transparent" />
        </div>

        <div className="mt-12 space-y-10 text-foreground/80 leading-[1.85] text-[1.05rem]">
          <section data-reveal>
            <p>
              Authorized by Shahzaib Asghar, <span className="text-[hsl(230,100%,80%)] font-semibold">Space Bee</span> is not just a launch provider; we are a <span className="text-[hsl(40,100%,70%)] font-semibold">quantum intelligence agency</span> engineering the future of human exploration.
            </p>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(195,100%,75%)] mb-4">The Problem: Classical Constraints</h2>
            <p>
              SpaceX (with Starship) and NASA (with Artemis) are pushing the boundaries of how much mass we can lift. However, they are still limited by classical physics for navigation, life support simulation, and understanding the core physics of the universe. A mission to Mars requires processing computational variables — radiation shielding optimization, trajectory correction, resource synthesis — that classical supercomputers struggle to resolve efficiently.
            </p>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(195,100%,75%)] mb-4">The Solution: Space Bee's Quantum Core</h2>
            <p>
              Space Bee bridges this gap. While others focus on the hardware of the mission, we provide the <span className="text-[hsl(40,100%,70%)] font-semibold">Quantum Intelligence</span> that ensures its success. We are developing algorithms that move beyond the limitations of classical optimization.
            </p>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(40,100%,70%)] mb-4">1. Black Hole Simulation & the Quantum World</h2>
            <p>
              The ultimate limit of human knowledge exists at the center of a black hole, where gravity and quantum mechanics clash. Classical physics fails here. Space Bee utilizes <span className="text-[hsl(195,100%,80%)] font-semibold">Quantum Machine Learning (QML)</span> models — like the Quantum Variational Solvers used in Health Bee — to simulate these extreme conditions. By modeling how information is preserved (or lost) on a black hole's event horizon, we gain insights into the very architecture of the quantum universe. These "black hole simulations" provide breakthroughs in new materials, propulsion concepts, and navigating space-time.
            </p>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(40,100%,70%)] mb-4">2. Optimization Beyond SpaceX and NASA</h2>
            <ul className="space-y-4 mt-3">
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(195,100%,75%)] shadow-[0_0_10px_hsl(195,100%,75%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Mars Trajectory & Navigation:</span> NASA and SpaceX use classical computational methods for orbital mechanics. Space Bee is developing hybrid quantum-classical algorithms that optimize entire Mars mission architectures — factoring in fuel use, cargo mass, radiation windows, and engine performance — all simultaneously. This isn't just calculation; it is non-linear Quantum Optimization.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(40,100%,60%)] shadow-[0_0_10px_hsl(40,100%,60%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Life Support Simulation:</span> In space, every resource is critical. We use Quantum ML to simulate complex ecological life support systems, ensuring zero waste by modeling molecular interactions within a closed ecosystem at quantum precision.</span>
              </li>
            </ul>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(195,100%,75%)] mb-4">The Double Vision: Expanding the Universe, Growing Earth</h2>
            <p>Space Bee operates on a dual mandate:</p>
            <ul className="space-y-4 mt-5">
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(230,100%,75%)] shadow-[0_0_10px_hsl(230,100%,75%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Expanding Humanity:</span> We are the quantum brain for Mars missions and deep-space habitation, analyzing space data at the source using specialized space-hardened quantum sensors.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(40,100%,60%)] shadow-[0_0_10px_hsl(40,100%,60%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Growing Earth:</span> Everything we learn about surviving in the extreme environments of space is applied directly back to Earth. The sustainability logic used for Mars is re-engineered to "grow" Earth into a more beautiful, self-sustaining planet.</span>
              </li>
            </ul>
            <blockquote className="my-8 relative pl-6 border-l-2 border-[hsl(230,100%,65%)]/60 italic text-base md:text-lg font-heading text-white/90 leading-snug">
              Space Bee is not just traveling to the stars; we are bringing the perfection of Planet Bee to the stars, and the wisdom of the stars back to Earth.
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

export default BlogSpaceBeeQuantum;
