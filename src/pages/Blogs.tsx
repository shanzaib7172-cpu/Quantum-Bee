import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/use-reveal";
import beeLogo from "@/assets/bee-logo.png";
import SpaceBackground from "@/components/SpaceBackground";
import SocialLinks from "@/components/SocialLinks";
import TopBar from "@/components/TopBar";
import blogCover from "@/assets/blog-planet-bee-cover.png";

const posts = [
  {
    id: "quantum-singularity",
    tag: "Vision",
    date: "May 2026",
    read: "8 min",
    title: "Beyond the Quantum Singularity",
    excerpt:
      "Why the next century of computing will not be measured in transistors, but in entangled qubits — and what that means for the businesses building today.",
    color: "hsl(40,100%,60%)",
  },
  {
    id: "swarm-intelligence",
    tag: "AI Agents",
    date: "Apr 2026",
    read: "6 min",
    title: "Swarm Intelligence: How Anna, Jack, David & Sophia Work as One",
    excerpt:
      "An inside look at the multi-agent architecture that lets four autonomous AIs share memory, hand off tasks, and operate a full business pipeline 24/7.",
    color: "hsl(200,100%,65%)",
  },
  {
    id: "mars-stack",
    tag: "Space Tech",
    date: "Mar 2026",
    read: "10 min",
    title: "Designing the Mars Quantum Stack",
    excerpt:
      "The infrastructure problem nobody talks about: how do you run a civilisation on a planet with 14-minute light-speed lag? Quantum entanglement.",
    color: "hsl(280,80%,70%)",
  },
  {
    id: "ethical-ai",
    tag: "Ethics",
    date: "Feb 2026",
    read: "5 min",
    title: "Ethical AI by Design, Not by Apology",
    excerpt:
      "Transparency, fairness and human oversight aren't features we bolt on — they're the constraints we design every Bee AI agent inside of.",
    color: "hsl(170,100%,55%)",
  },
  {
    id: "whatsapp-revolution",
    tag: "Product",
    date: "Jan 2026",
    read: "7 min",
    title: "How Jack Turned WhatsApp into a Sales Engine",
    excerpt:
      "From simple messages to autonomous funnels, payment processing and segmented broadcasts — the case study behind our WhatsApp automation agent.",
    color: "hsl(140,70%,55%)",
  },
  {
    id: "quantum-healthcare",
    tag: "Sectors",
    date: "Jan 2026",
    read: "9 min",
    title: "Quantum Computing Will Rewrite Healthcare First",
    excerpt:
      "Drug discovery, genomic analysis, personalised medicine — why healthcare is the first sector ready to absorb quantum-scale acceleration.",
    color: "hsl(0,70%,65%)",
  },
];

const Blogs = () => {
  useReveal();

  return (
    <div className="min-h-screen bg-[hsl(220,60%,3%)] text-foreground relative overflow-hidden">
      <SpaceBackground density={1.2} rocks={18} blackhole={false} planets />

      {/* Header */}
      <TopBar />

      {/* Hero */}
      <section data-reveal className="relative z-10 px-6 pt-20 pb-12 text-center max-w-4xl mx-auto">
        <p className="font-mono text-xs tracking-[0.4em] text-[hsl(195,100%,75%)] uppercase mb-5">
          [ Field Notes from the Quantum Frontier ]
        </p>
        <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight">
          <span className="bg-gradient-to-r from-[hsl(40,100%,60%)] via-[hsl(195,100%,75%)] to-[hsl(230,100%,75%)] bg-clip-text text-transparent">
            The Quantum Bee Blog
          </span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-foreground/70 leading-relaxed">
          Deep dives, product stories and unfiltered thinking on autonomous AI, quantum computing, and the future of civilisation-scale technology.
        </p>
      </section>

      {/* Featured */}
      <section data-reveal className="relative z-10 px-6 max-w-6xl mx-auto w-full">
        <Link to="/blogs/discovery-of-planet-bee" className="block group">
          <div className="relative rounded-2xl overflow-hidden border border-[hsl(40,100%,55%)]/30 bg-gradient-to-br from-[hsl(220,40%,8%)]/80 via-[hsl(220,40%,6%)]/80 to-[hsl(220,40%,4%)]/80 backdrop-blur-xl grid md:grid-cols-2 gap-0 transition-all hover:border-[hsl(40,100%,55%)]/60 hover:shadow-[0_0_60px_-10px_hsl(40,100%,55%,0.5)]">
            <div className="relative h-64 md:h-full min-h-[320px] overflow-hidden">
              <img src={blogCover} alt="The Discovery of Planet Bee" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[hsl(220,40%,6%)]/80 md:to-[hsl(220,40%,6%)]" />
            </div>
            <div className="relative p-8 md:p-10 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-[10px] tracking-widest uppercase text-[hsl(195,100%,75%)]">
                <span className="px-2.5 py-1 rounded-md bg-[hsl(40,100%,55%)]/15 border border-[hsl(40,100%,55%)]/30 text-[hsl(40,100%,70%)]">Featured · Origin Story</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />May 2026</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />9 min</span>
              </div>
              <h2 className="font-heading font-black text-2xl md:text-4xl leading-tight bg-gradient-to-br from-white via-[hsl(40,100%,75%)] to-[hsl(195,100%,75%)] bg-clip-text text-transparent">
                The Discovery of Planet Bee: A Vision for a Beautiful Earth
              </h2>
              <p className="mt-4 text-foreground/70 leading-relaxed">
                Shanzaib's leap into the quantum world, the meeting with the Bee, and the founding mission to make Earth as beautiful and efficient as Planet Bee.
              </p>
              <Button size="lg" className="mt-6 h-12 px-7 self-start bg-gradient-to-r from-[hsl(40,100%,55%)] to-[hsl(195,100%,55%)] font-semibold border-0 hover:opacity-95 shadow-[0_0_40px_-5px_hsl(40,100%,55%,0.5)] text-slate-100">
                Read full essay <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Link>
      </section>

      {/* Grid */}
      <section className="relative z-10 px-6 py-16 max-w-6xl mx-auto w-full">
        <div data-reveal className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-2">— All Posts</p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-[hsl(40,100%,60%)]">Recent transmissions</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.slice(1).map((p) => (
            <article
              data-reveal="scale"
              key={p.id}
              className="group relative rounded-2xl overflow-hidden bg-[hsl(220,40%,8%)]/70 backdrop-blur-xl border border-[hsl(200,100%,60%)]/15 hover:border-[hsl(40,100%,55%)]/50 transition-all"
            >
              <div className="h-36 relative overflow-hidden" style={{ background: `radial-gradient(circle at 30% 30%, ${p.color}55, transparent 70%), linear-gradient(135deg, hsl(220,40%,10%), hsl(220,60%,4%))` }}>
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: "linear-gradient(hsl(200 100% 70%) 1px, transparent 1px), linear-gradient(90deg, hsl(200 100% 70%) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full blur-2xl group-hover:blur-3xl transition-all" style={{ background: p.color }} />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: p.color }}>
                  <Tag className="w-3 h-3" /> {p.tag}
                  <span className="text-foreground/40">·</span>
                  <span className="text-foreground/55">{p.date}</span>
                  <span className="text-foreground/40">·</span>
                  <span className="text-foreground/55">{p.read}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white leading-snug group-hover:text-[hsl(40,100%,75%)] transition-colors">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm text-foreground/65 leading-relaxed line-clamp-3">{p.excerpt}</p>
                <button className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[hsl(195,100%,75%)] hover:text-[hsl(40,100%,70%)] transition-colors">
                  Read more <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter + Socials */}
      <section data-reveal className="relative z-10 px-6 py-20 max-w-4xl mx-auto text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white">Subscribe to the swarm</h2>
        <p className="text-foreground/65 mt-4 mb-8 max-w-xl mx-auto">
          New essays drop monthly. No fluff, no spam — just signal from the edge of autonomous & quantum tech.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="you@future.com"
            className="flex-1 h-12 px-4 rounded-xl bg-[hsl(220,40%,8%)]/70 border border-[hsl(200,100%,60%)]/20 focus:border-[hsl(40,100%,55%)]/60 outline-none text-sm placeholder:text-foreground/40"
          />
          <Button type="submit" size="lg" className="h-12 px-6 bg-gradient-to-r from-[hsl(40,100%,55%)] to-[hsl(195,100%,55%)] text-[hsl(220,60%,3%)] font-semibold border-0">
            Subscribe
          </Button>
        </form>
        <div className="mt-12">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-4">— Follow the Swarm</p>
          <SocialLinks />
        </div>
      </section>

      <footer className="relative z-10 px-6 py-6 text-center text-xs text-foreground/50 border-t border-[hsl(200,100%,60%)]/10">
        © {new Date().getFullYear()} Quantum Bee Technologies — Beyond the Quantum Singularity.
      </footer>
    </div>
  );
};

export default Blogs;
