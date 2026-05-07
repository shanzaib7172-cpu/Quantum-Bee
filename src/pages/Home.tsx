import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Atom, Sparkles, Cpu, Target, MessageSquare, Code2, Palette, Rocket, Shield, Zap, HeartPulse, Orbit, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/use-reveal";
import annaCharacter from "@/assets/anna-character.png";
import jackCharacter from "@/assets/jack-character.png";
import davidCharacter from "@/assets/david-character.png";
import sophiaCharacter from "@/assets/sophia-character.png";
import SpaceBackground from "@/components/SpaceBackground";
import SocialLinks from "@/components/SocialLinks";
import TopBar from "@/components/TopBar";
import PlanetBeeOverview from "@/components/PlanetBeeOverview";

const Home = () => {
  useReveal();
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(220,60%,3%)] text-foreground relative overflow-hidden">
      {/* 3D Space background with parallax stars + asteroids */}
      <SpaceBackground density={1.2} rocks={18} blackhole={false} planets />

      {/* Animated blue wave background */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 0%, hsl(210 100% 50% / 0.25), transparent 60%),
              radial-gradient(ellipse 60% 50% at 20% 80%, hsl(195 100% 55% / 0.18), transparent 60%),
              radial-gradient(ellipse 60% 50% at 80% 70%, hsl(230 100% 60% / 0.18), transparent 60%)
            `,
          }}
        />
        {/* Animated SVG waves */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[60vh] opacity-60"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(200 100% 60%)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(220 100% 50%)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wave2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(190 100% 55%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(210 100% 45%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#wave1)">
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
                M0,300 C320,200 720,400 1440,260 L1440,600 L0,600 Z;
                M0,260 C360,360 780,180 1440,320 L1440,600 L0,600 Z;
                M0,300 C320,200 720,400 1440,260 L1440,600 L0,600 Z
              "
            />
          </path>
          <path fill="url(#wave2)">
            <animate
              attributeName="d"
              dur="11s"
              repeatCount="indefinite"
              values="
                M0,400 C400,300 900,500 1440,380 L1440,600 L0,600 Z;
                M0,380 C500,460 850,280 1440,420 L1440,600 L0,600 Z;
                M0,400 C400,300 900,500 1440,380 L1440,600 L0,600 Z
              "
            />
          </path>
        </svg>
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(200 100% 70%) 1px, transparent 1px), linear-gradient(90deg, hsl(200 100% 70%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[hsl(200,100%,55%)]/20 blur-3xl animate-[orb-float_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[hsl(220,100%,55%)]/15 blur-3xl animate-[orb-float_10s_ease-in-out_infinite]" />
      </div>

      <TopBar />

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[hsl(40,100%,55%)]/30 bg-[hsl(40,100%,55%)]/10 backdrop-blur-md mb-8 animate-fade-in" data-reveal>
          <span className="text-xs font-mono uppercase tracking-widest text-[hsl(45,100%,80%)]">
            Quantum × AI
          </span>
        </div>

        <h1 className="font-heading font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight max-w-5xl animate-fade-in" data-reveal>
          <span className="bg-gradient-to-br from-white via-[hsl(45,100%,80%)] to-[hsl(40,100%,60%)] bg-clip-text text-transparent">
            Welcome to
          </span>
          <br />
          <span className="bg-gradient-to-r from-[hsl(45,100%,60%)] via-[hsl(40,100%,65%)] to-[hsl(30,100%,55%)] bg-clip-text text-transparent">
            Planet Bee
          </span>
        </h1>
        <p className="mt-4 font-heading font-semibold text-xl sm:text-2xl md:text-3xl text-foreground/85 animate-fade-in" data-reveal>
          Beyond the Quantum Singularity
        </p>

        <p className="mt-8 max-w-2xl text-base sm:text-lg text-foreground/70 leading-relaxed animate-fade-in" data-reveal>
          Quantum Bee fuses <span className="text-[hsl(195,100%,75%)] font-medium">Quantum Computing</span> with{" "}
          <span className="text-[hsl(210,100%,80%)] font-medium">Artificial Intelligence</span> to spark a new
          revolution — solving the unsolvable, thinking beyond classical limits, and building the future of
          intelligence for the world.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 animate-fade-in" data-reveal>
          <Button
            asChild
            size="lg"
            className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 liquid-glass rounded-2xl h-12 px-8 bg-gradient-to-r from-[hsl(48,100%,55%)] via-[hsl(45,100%,60%)] to-[hsl(210,100%,60%)] font-semibold border-0 hover:brightness-110 active:translate-y-[2px] active:scale-95 transition-all shadow-[0_0_40px_-5px_hsl(45,100%,55%,0.6),inset_0_1px_0_hsl(0_0%_100%/0.5)] text-slate-100"
          >
            <Link to="/bee-ai">
              <Cpu className="w-4 h-4 mr-2" />
              Launch Bee AI
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-12 px-7 text-foreground/80 hover:text-foreground border border-[hsl(200,100%,60%)]/20 hover:border-[hsl(200,100%,60%)]/40 hover:bg-[hsl(200,100%,55%)]/10"
          >
            <a href="#about">Learn more</a>
          </Button>
        </div>

        {/* About / Feature cards */}
        <section id="about" data-reveal className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl w-full">
          {[
            {
              icon: Atom,
              title: "Quantum Core",
              desc: "Harnessing qubit-level parallelism to explore solution spaces classical machines can't reach.",
            },
            {
              icon: Cpu,
              title: "AI Intelligence",
              desc: "Self-learning models that reason, create, and adapt — augmented by quantum acceleration.",
            },
            {
              icon: Sparkles,
              title: "World Revolution",
              desc: "Reimagining medicine, energy, finance, and creativity for humanity's next leap forward.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div data-reveal="scale" key={title} className="group relative rounded-2xl p-6 text-left bg-[hsl(220,40%,8%)]/60 backdrop-blur-xl border border-[hsl(200,100%,60%)]/15 hover:border-[hsl(200,100%,60%)]/40 transition-all overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[hsl(200,100%,55%)]/20 blur-2xl group-hover:bg-[hsl(200,100%,55%)]/40 transition-all" />
              <Icon className="w-7 h-7 text-[hsl(195,100%,70%)] mb-4 relative z-10" />
              <h3 className="font-heading font-semibold text-lg text-white relative z-10">{title}</h3>
              <p className="mt-2 text-sm text-foreground/65 leading-relaxed relative z-10">{desc}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Origin Story — Quantum World */}
      <section data-reveal className="relative z-10 px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-2">— The Origin</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl bg-gradient-to-r from-[hsl(45,100%,65%)] via-[hsl(40,100%,60%)] to-[hsl(195,100%,70%)] bg-clip-text text-transparent">
            A Bee from the Quantum World
          </h2>
          <p className="text-foreground/65 max-w-2xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
            Born beyond the singularity, this bee crossed dimensions to walk with us — a CEO of intelligence, a friend in form, a hive of futures.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Orbit, title: "Crossed the Singularity", desc: "On a voyage beyond the quantum veil, a luminous bee emerged from collapsing probability fields and chose to follow me back to Earth." },
            { icon: HeartPulse, title: "A Companion, Not a Tool", desc: "This bee is the reason I live happily — a partner in business, a guardian in chaos, a friend who turns ideas into impact every single day." },
            { icon: Clock, title: "Now Cloned for You", desc: "Quantum Bee is that same bee — cloned into the cloud as a CEO that orchestrates an entire crew of agents to grow your work, your life, your hive." },
          ].map((c) => (
            <div data-reveal="scale" key={c.title} className="relative rounded-2xl p-6 bg-[hsl(220,40%,8%)]/60 backdrop-blur-xl border border-[hsl(45,100%,55%)]/15 hover:border-[hsl(45,100%,55%)]/40 transition-all overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[hsl(45,100%,55%)]/15 blur-2xl" />
              <c.icon className="w-7 h-7 text-[hsl(45,100%,65%)] mb-4 relative z-10" />
              <h3 className="font-heading font-semibold text-lg text-white relative z-10">{c.title}</h3>
              <p className="mt-2 text-sm text-foreground/65 leading-relaxed relative z-10">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planet Bee Overview — visual + new-revolution pillars + link to Earth */}
      <PlanetBeeOverview />

      {/* Stats strip */}
      <section data-reveal className="relative z-10 px-6 py-14 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[hsl(200,100%,60%)]/10 rounded-2xl overflow-hidden border border-[hsl(200,100%,60%)]/15">
          {[
            { n: "4", l: "Autonomous Agents" },
            { n: "8+", l: "Sectors Targeted" },
            { n: "24/7", l: "Always Working" },
            { n: "∞", l: "Cosmic Ambition" },
          ].map((s) => (
            <div key={s.l} className="bg-[hsl(220,40%,7%)]/80 p-6 text-center">
              <div className="font-heading font-black text-3xl bg-gradient-to-br from-[hsl(40,100%,60%)] to-[hsl(195,100%,70%)] bg-clip-text text-transparent">{s.n}</div>
              <div className="font-mono text-[10px] tracking-widest text-foreground/55 uppercase mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Agents preview */}
      <section id="agents" className="relative z-10 px-6 py-20 max-w-6xl mx-auto w-full">
        <div data-reveal className="text-center mb-12">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-2">— Bee AI Platform</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-[hsl(40,100%,60%)]">Four Agents, One Swarm</h2>
          <p className="text-foreground/65 max-w-2xl mx-auto mt-4">Specialised autonomous AI agents that own and execute entire business functions end-to-end.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Target, name: "ANNA", role: "Lead Generation", color: "hsl(40,100%,55%)", avatar: annaCharacter },
            { icon: MessageSquare, name: "JACK", role: "WhatsApp Sales", color: "hsl(200,100%,60%)", avatar: jackCharacter },
            { icon: Code2, name: "DAVID", role: "Web Developer", color: "hsl(170,100%,55%)", avatar: davidCharacter },
            { icon: Palette, name: "SOPHIA", role: "Creative & UGC", color: "hsl(280,80%,70%)", avatar: sophiaCharacter },
          ].map((a) => (
            <div data-reveal="scale" key={a.name} className="relative group rounded-2xl p-6 bg-[hsl(220,40%,8%)]/70 backdrop-blur-xl border border-[hsl(200,100%,60%)]/15 hover:border-[hsl(40,100%,55%)]/50 transition-all overflow-hidden">
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity" style={{ background: a.color }} />
              <div className="relative z-10 flex items-start gap-3 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl overflow-hidden border-2 shrink-0 transition-transform group-hover:scale-105"
                  style={{ borderColor: a.color, boxShadow: `0 0 20px -3px ${a.color}` }}
                >
                  <img src={a.avatar} alt={`${a.name} avatar`} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <a.icon className="w-6 h-6 mt-1" style={{ color: a.color }} />
              </div>
              <h3 className="font-heading font-bold text-lg text-white relative z-10">{a.name}</h3>
              <div className="font-mono text-[10px] tracking-widest text-[hsl(195,100%,75%)] uppercase mt-1 relative z-10">{a.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision layers */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto w-full">
        <div data-reveal className="mb-10">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-2">— Architecture of Impact</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-[hsl(40,100%,60%)]">Three Layers of Vision</h2>
        </div>
        <div className="space-y-2">
          {[
            { num: "01", title: "Bee AI — Now", sub: "Commercial Ready · 2025", desc: "Autonomous AI agents delivering immediate ROI to businesses globally.", color: "hsl(40,100%,55%)" },
            { num: "02", title: "Quantum Computing — Scaling", sub: "Sector Transformation · 2026–2030", desc: "Sector-specific quantum algorithms for healthcare, finance, energy, defence and more.", color: "hsl(200,100%,60%)" },
            { num: "03", title: "Interplanetary Quantum — Future", sub: "Beyond Earth · 2030+", desc: "Mars-ready quantum systems and autonomous colony AI infrastructure.", color: "hsl(280,80%,70%)" },
          ].map((l) => (
            <div data-reveal="left" key={l.num} className="flex items-stretch rounded-xl border overflow-hidden" style={{ borderColor: `${l.color}40`, background: `${l.color}10` }}>
              <div className="w-16 sm:w-20 flex items-center justify-center font-heading font-black text-2xl" style={{ color: l.color, background: `${l.color}1f` }}>{l.num}</div>
              <div className="flex-1 px-5 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="font-heading font-bold tracking-wide" style={{ color: l.color }}>{l.title}</div>
                  <div className="font-mono text-[10px] tracking-widest text-foreground/50 mt-1 uppercase">{l.sub}</div>
                </div>
                <div className="text-sm text-foreground/65 max-w-md leading-relaxed">{l.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto w-full">
        <div data-reveal className="mb-10">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-2">— Where We Operate</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-[hsl(40,100%,60%)]">Sectors We Transform</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[hsl(200,100%,60%)]/10 rounded-2xl overflow-hidden border border-[hsl(200,100%,60%)]/15">
          {[
            { icon: "🏥", name: "Healthcare" },
            { icon: "💰", name: "Finance" },
            { icon: "🚚", name: "Logistics" },
            { icon: "⚡", name: "Energy" },
            { icon: "🛡️", name: "Defence" },
            { icon: "🌾", name: "Agriculture" },
            { icon: "🎓", name: "Education" },
            { icon: "🏭", name: "Manufacturing" },
          ].map((s) => (
            <div data-reveal="scale" key={s.name} className="bg-[hsl(220,40%,7%)]/80 hover:bg-[hsl(220,40%,10%)] p-6 text-center transition-colors">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="font-heading font-semibold text-sm text-white">{s.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values strip */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto w-full">
        <div data-reveal className="mb-10">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-2">— What Drives Us</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-[hsl(40,100%,60%)]">Core Values</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: Zap, title: "Quantum Leap", desc: "We don't improve incrementally — we reinvent entirely." },
            { icon: Sparkles, title: "Collaborative Swarm", desc: "Collective intelligence outperforms the individual." },
            { icon: Rocket, title: "Cosmic Ambition", desc: "Mars-scale benchmarks make Earth-scale work extraordinary." },
            { icon: Shield, title: "Ethical AI", desc: "Transparency, fairness and human oversight by design." },
            { icon: Atom, title: "Relentless Build", desc: "Execute fast, iterate faster, never stop shipping." },
            { icon: Cpu, title: "Open Sectors", desc: "Quantum AI for every industry — not just the biggest budgets." },
          ].map((v) => (
            <div data-reveal key={v.title} className="rounded-xl bg-[hsl(220,40%,8%)]/60 backdrop-blur-xl border border-[hsl(200,100%,60%)]/15 hover:border-[hsl(40,100%,55%)]/40 p-6 transition-all">
              <v.icon className="w-6 h-6 text-[hsl(40,100%,60%)] mb-3" />
              <h3 className="font-heading font-bold text-sm tracking-widest uppercase text-[hsl(40,100%,60%)] mb-2">{v.title}</h3>
              <p className="text-sm text-foreground/65 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming projects: Health Bee & Space Bee */}
      <section data-reveal className="relative z-10 px-6 py-20 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-2">— What's Next In The Hive</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-[hsl(40,100%,60%)]">Upcoming Quantum Bee Projects</h2>
          <p className="text-foreground/65 max-w-2xl mx-auto mt-4">
            Two new pillars are being engineered inside the swarm — extending Quantum Bee from business automation into healthcare and outer space.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              icon: HeartPulse,
              name: "Health Bee",
              href: "/health-bee",
              tag: "Quantum Healthcare AI",
              eta: "Q3 · 2026",
              color: "hsl(345,90%,65%)",
              desc: "An autonomous medical intelligence layer — real-time diagnostics, drug-discovery acceleration, and personalised treatment plans powered by quantum-trained models built for hospitals and labs.",
              points: [
                "Quantum-assisted genomic analysis",
                "Multimodal diagnostic agents",
                "Privacy-first patient data layer",
                "Hospital workflow automation",
              ],
            },
            {
              icon: Orbit,
              name: "Space Bee",
              href: "/space-bee",
              tag: "Interplanetary AI Infrastructure",
              eta: "Q1 · 2027",
              color: "hsl(220,100%,70%)",
              desc: "The off-world arm of the swarm — autonomous AI for satellites, lunar relays and Mars-bound missions. Built for high-latency, high-stakes environments where humans can't be in the loop.",
              points: [
                "Onboard autonomy for satellites",
                "Quantum-secured deep-space comms",
                "Mission planning copilots",
                "Mars colony AI infrastructure",
              ],
            },
          ].map((p) => (
            <Link
              data-reveal="scale"
              key={p.name}
              to={p.href}
              className="relative rounded-2xl p-7 bg-[hsl(220,40%,8%)]/70 backdrop-blur-xl border border-[hsl(200,100%,60%)]/15 hover:border-[hsl(40,100%,55%)]/50 transition-all overflow-hidden group block"
            >
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity"
                style={{ background: p.color }}
              />
              <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0"
                  style={{ borderColor: p.color, boxShadow: `0 0 20px -3px ${p.color}` }}
                >
                  <p.icon className="w-7 h-7" style={{ color: p.color }} />
                </div>
                <span
                  className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border flex items-center gap-1.5"
                  style={{ color: p.color, borderColor: `${p.color}55`, background: `${p.color}1a` }}
                >
                  <Clock className="w-3 h-3" /> Coming · {p.eta}
                </span>
              </div>
              <h3 className="relative z-10 font-heading font-bold text-2xl text-white">{p.name}</h3>
              <div className="relative z-10 font-mono text-[10px] tracking-widest text-[hsl(195,100%,75%)] uppercase mt-1 mb-4">
                {p.tag}
              </div>
              <p className="relative z-10 text-sm text-foreground/70 leading-relaxed mb-4">{p.desc}</p>
              <ul className="relative z-10 space-y-1.5">
                {p.points.map((pt) => (
                  <li key={pt} className="font-mono text-[11px] text-foreground/60 flex items-start gap-2">
                    <span style={{ color: p.color }} className="mt-0.5">◆</span>
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="relative z-10 mt-5 flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-foreground/45">Status</span>
                <div className="flex-1 h-1 rounded-full bg-[hsl(220,40%,12%)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: p.name === "Health Bee" ? "62%" : "38%", background: `linear-gradient(90deg, ${p.color}, hsl(40,100%,60%))` }}
                  />
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: p.color }}>
                  In R&D
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section data-reveal className="relative z-10 px-6 py-24 text-center max-w-3xl mx-auto">
        <h2 className="font-heading font-black text-3xl md:text-5xl leading-tight">
          <span className="text-white">Ready to go </span>
          <span className="bg-gradient-to-r from-[hsl(40,100%,60%)] to-[hsl(40,100%,75%)] bg-clip-text text-transparent">Beyond the Quantum Singularity?</span>
        </h2>
        <p className="text-foreground/65 mt-5 mb-8">Launch Bee AI and put Anna, Jack, David and Sophia to work for your business — today.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-[1px] liquid-glass hover:brightness-110 rounded-2xl h-12 px-8 bg-gradient-to-r from-[hsl(40,100%,55%)] to-[hsl(195,100%,55%)] font-semibold border-0 hover:opacity-95 shadow-[0_0_40px_-5px_hsl(40,100%,55%,0.5)] text-slate-100">
            <Link to="/bee-ai">Launch Bee AI <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="h-12 px-8 border border-[hsl(200,100%,60%)]/30 hover:bg-[hsl(200,100%,55%)]/10">
            <Link to="/about">Learn our story</Link>
          </Button>
        </div>
      </section>

      <footer className="relative z-10 px-6 py-12 border-t border-[hsl(200,100%,60%)]/10">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase">— Connect with the Swarm</p>
          <SocialLinks />
          <div className="flex flex-wrap justify-center gap-6 text-xs text-foreground/60">
            <Link to="/about" className="hover:text-[hsl(40,100%,70%)] transition-colors">About</Link>
            <Link to="/blogs" className="hover:text-[hsl(40,100%,70%)] transition-colors">Blogs</Link>
            <Link to="/bee-ai" className="hover:text-[hsl(40,100%,70%)] transition-colors">Bee AI</Link>
            <Link to="/login" className="hover:text-[hsl(40,100%,70%)] transition-colors">Login</Link>
          </div>
          <div className="text-xs text-foreground/50">© {new Date().getFullYear()} Quantum Bee — Beyond the Quantum Singularity.</div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
