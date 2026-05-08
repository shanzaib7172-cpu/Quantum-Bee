import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Target, MessageSquare, Code2, Palette, Rocket, Atom, Shield, Globe, Sparkles, BookOpen, Twitter, Linkedin, Instagram, Youtube, Github, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/use-reveal";
import beeLogo from "@/assets/bee-logo.png";
import founderImg from "@/assets/founder-shanzaib.png";
import annaCharacter from "@/assets/anna-character.png";
import jackCharacter from "@/assets/jack-character.png";
import davidCharacter from "@/assets/david-character.png";
import sophiaCharacter from "@/assets/sophia-character.png";
import SpaceBackground from "@/components/SpaceBackground";
import SocialLinks from "@/components/SocialLinks";
import TopBar from "@/components/TopBar";
import PlanetBeeOverview from "@/components/PlanetBeeOverview";

const About = () => {
  useReveal();
  const agents = [
    { num: "01", icon: Target, name: "ANNA", role: "Lead Generation Agent", color: "hsl(40,100%,55%)", desc: "Anna is your autonomous business development force. She sources, qualifies, and nurtures thousands of leads simultaneously — across LinkedIn, email, and social media — populating your CRM in real time, 24/7.", caps: ["Multi-channel lead sourcing & qualification", "Personalised outreach email sequences", "Real-time CRM population & enrichment", "Pipeline forecasting & opportunity scoring", "Competitor analysis & market mapping"] },
    { num: "02", icon: MessageSquare, name: "JACK", role: "WhatsApp Automation & Sales Agent", color: "hsl(200,100%,60%)", desc: "Jack transforms WhatsApp from a messaging app into a full-stack sales engine. He manages conversations, recommends products, books appointments, processes payments, and handles support — all autonomously.", caps: ["WhatsApp Business API automation", "Intelligent sales funnel management", "Product recommendations & upselling", "Appointment booking & order processing", "Broadcast campaigns with segmentation"] },
    { num: "03", icon: Code2, name: "DAVID", role: "Web Developer Agent", color: "hsl(170,100%,55%)", desc: "David eliminates the web development bottleneck entirely. From a brief description, he designs, codes, and deploys production-ready websites, landing pages, and e-commerce stores — in hours, not weeks.", caps: ["Full-stack website generation & deployment", "Landing page & e-commerce store creation", "SEO optimisation & performance tuning", "CRM & payment gateway integrations", "Ongoing A/B testing & maintenance"] },
    { num: "04", icon: Palette, name: "SOPHIA", role: "Image to Product & UGC Ads Creator", color: "hsl(280,80%,70%)", desc: "Sophia democratises professional creative production. Upload a product photo — she returns a full library of studio-quality images, UGC ad creatives, and social content packs ready for instant deployment.", caps: ["AI-powered product photoshoot from images", "UGC ad creation & scripting", "Branded creative asset generation at scale", "Social media content packs (IG, TikTok, Meta)", "Video storyboarding & ad copy"] },
  ];

  const values = [
    { icon: Zap, title: "Quantum Leap", desc: "We don't improve incrementally; we reinvent entirely. Every product decision asks: does this change the game or just play it better?" },
    { icon: Sparkles, title: "Collaborative Swarm", desc: "Like bees, we believe collective intelligence outperforms the individual. Our agents, our team, and our partners operate as one unified swarm." },
    { icon: Rocket, title: "Cosmic Ambition", desc: "No problem is too large — not even interplanetary civilisation. We set our benchmark at Mars so everything we build on Earth is extraordinary." },
    { icon: Shield, title: "Ethical AI", desc: "Every agent we build operates with transparency, fairness, and human oversight. Ethics is a design constraint, not an afterthought." },
    { icon: Atom, title: "Relentless Build", desc: "We execute fast, iterate faster, and never stop shipping value. The speed of our iteration is our most powerful competitive advantage." },
    { icon: Globe, title: "Open Sectors", desc: "We serve healthcare, finance, education, defence, and more. The benefits of quantum AI must reach every industry, not just the ones with the biggest budgets." },
  ];

  const timeline = [
    { year: "2025", label: "Company Founded" },
    { year: "2025", label: "Bee AI Beta Launch" },
    { year: "2026", label: "Quantum R&D Phase" },
    { year: "2030+", label: "Mars Technology" },
  ];

  const sectors = [
    { icon: "🏥", name: "Healthcare", desc: "Drug discovery, genomic analysis, personalised medicine" },
    { icon: "💰", name: "Finance", desc: "Risk modelling, fraud detection, algorithmic trading" },
    { icon: "🚚", name: "Logistics", desc: "Route optimisation, supply chain resilience" },
    { icon: "⚡", name: "Energy", desc: "Smart grid optimisation, renewable forecasting" },
    { icon: "🛡️", name: "Defence", desc: "Cryptography, secure communications" },
    { icon: "🌾", name: "Agriculture", desc: "Yield optimisation, climate modelling" },
    { icon: "🎓", name: "Education", desc: "Personalised AI tutors, adaptive learning" },
    { icon: "🏭", name: "Manufacturing", desc: "Process optimisation, predictive maintenance" },
  ];

  const visionLayers = [
    { num: "01", title: "Bee AI — Now", sub: "COMMERCIAL READY · 2025", desc: "Autonomous AI agents delivering immediate ROI to businesses globally. Anna, Jack, David & Sophia automate the entire business pipeline.", color: "hsl(40,100%,55%)" },
    { num: "02", title: "Quantum Computing — Scaling", sub: "SECTOR TRANSFORMATION · 2026–2030", desc: "Sector-specific quantum algorithms for healthcare, finance, logistics, energy, defence, agriculture, education, and manufacturing.", color: "hsl(200,100%,60%)" },
    { num: "03", title: "Interplanetary Quantum — Future", sub: "BEYOND EARTH · 2030+", desc: "Mars-ready quantum computing systems, interplanetary quantum communications, and autonomous colony AI infrastructure.", color: "hsl(280,80%,70%)" },
  ];

  return (
    <div className="min-h-screen bg-[hsl(220,60%,3%)] text-foreground relative overflow-hidden">
      {/* 3D Space background */}
      <SpaceBackground density={1.2} rocks={18} blackhole={false} planets />

      {/* Subtle gradients & grid overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 0%, hsl(210 100% 50% / 0.18), transparent 60%),
              radial-gradient(ellipse 60% 50% at 20% 80%, hsl(40 100% 55% / 0.10), transparent 60%),
              radial-gradient(ellipse 60% 50% at 80% 70%, hsl(230 100% 60% / 0.15), transparent 60%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(200 100% 70%) 1px, transparent 1px), linear-gradient(90deg, hsl(200 100% 70%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      {/* Header */}
      <TopBar />

      {/* Hero */}
      <section data-reveal className="relative z-10 px-6 pt-20 pb-24 text-center max-w-5xl mx-auto">
        <p className="font-mono text-xs tracking-[0.4em] text-[hsl(195,100%,75%)] uppercase mb-5 animate-fade-in">
          [ About Quantum Bee Technologies ]
        </p>
        <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl leading-[1] tracking-tight animate-fade-in">
          <span className="block bg-gradient-to-r from-[hsl(40,100%,60%)] to-[hsl(40,100%,75%)] bg-clip-text text-transparent">QUANTUM BEE</span>
          <span className="block text-2xl sm:text-3xl md:text-4xl tracking-[0.5em] text-white/90 mt-3">TECHNOLOGIES</span>
        </h1>
        <p className="italic text-[hsl(195,100%,75%)] tracking-widest mt-6 animate-fade-in">" Beyond the Quantum Singularity "</p>
        <p className="mt-8 max-w-2xl mx-auto text-base sm:text-lg text-foreground/70 leading-relaxed animate-fade-in">
          We are a deep-technology company at the convergence of autonomous artificial intelligence and quantum computing — building the infrastructure that powers businesses today, and civilisations tomorrow.
        </p>
      </section>

      {/* Story */}
      <section data-reveal className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12">
          <div className="md:sticky md:top-24 self-start">
            <div className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-3">— Our Journey</div>
            <h2 className="font-heading font-bold text-2xl text-[hsl(40,100%,60%)] mb-8">The Quantum Bee Story</h2>
            <div className="space-y-6">
              {timeline.map((t) => (
                <div data-reveal="left" key={t.label} className="flex gap-4 items-start">
                  <div className="w-3 h-3 mt-1.5 rounded-full border-2 border-[hsl(40,100%,55%)] bg-[hsl(40,100%,55%)]/30 shadow-[0_0_12px_hsl(40,100%,55%,0.5)]" />
                  <div>
                    <div className="font-mono text-xs text-[hsl(40,100%,60%)] tracking-widest">{t.year}</div>
                    <div className="text-sm text-foreground/85 mt-0.5">{t.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-10">
            {[
              { h: "01 — The Origin", p: "Quantum Bee Technologies was born from a single, audacious question: What if a business could operate at the speed of thought — and a civilisation at the speed of quantum? In 2025, founder Shanzaib Asghar set out to build a company that bridges the gap between the world businesses live in today and the quantum-powered future they deserve." },
              { h: "02 — The Name", p: "The name is intentional. A bee is nature's most efficient autonomous agent — it navigates, communicates, creates, and builds without being told how. Quantum is the frontier of computation. Together, Quantum Bee represents the fusion of autonomous intelligence and quantum power." },
              { h: "03 — The First Product", p: "We started with Bee AI — a multi-agent business automation platform featuring four specialised autonomous agents: Anna, Jack, David, and Sophia. These agents fully automate lead generation, WhatsApp sales, web development, and creative advertising." },
              { h: "04 — The Bigger Picture", p: "But Quantum Bee was never just about business automation. From day one, the vision stretched further: quantum computing infrastructure for healthcare, finance, energy, agriculture, defence — and ultimately, technology capable of supporting human civilisation on Mars and beyond." },
            ].map((b) => (
              <div data-reveal="right" key={b.h} className="rounded-xl bg-[hsl(220,40%,8%)]/60 backdrop-blur-xl border border-[hsl(200,100%,60%)]/15 p-6">
                <h3 className="font-heading font-semibold text-[hsl(40,100%,60%)] tracking-wide mb-3">{b.h}</h3>
                <p className="text-foreground/70 leading-relaxed">{b.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planet Bee Overview — the world we come from */}
      <PlanetBeeOverview />

      {/* Discoverer */}
      <section data-reveal className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-2">— Visionary Leadership</div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-[hsl(40,100%,60%)]">Meet the Discoverer</h2>
          <p className="text-foreground/60 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Discoverer <span className="text-[hsl(40,100%,60%)] font-semibold">Shanzaib Asghar</span> from Earth — the human bridge who ventured beyond the quantum singularity, met the Bee, and returned to bring the revolution home.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center">
            <div className="relative w-72 h-72">
              <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-[hsl(40,100%,55%)]/30 via-[hsl(195,100%,60%)]/20 to-[hsl(280,80%,65%)]/30 blur-2xl animate-[orb-pulse_5s_ease-in-out_infinite]" />
              <div
                className="absolute inset-0 rounded-full p-[3px]"
                style={{
                  background:
                    "conic-gradient(from 0deg, hsl(40,100%,55%), hsl(200,100%,60%), hsl(170,100%,55%), hsl(40,100%,55%))",
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-[hsl(220,40%,8%)]">
                  <img src={founderImg} alt="Shanzaib Asghar — Discoverer & CEO of Quantum Bee" className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>
            <div className="mt-6 px-5 py-2.5 border border-[hsl(40,100%,55%)]/50 bg-[hsl(220,40%,8%)] text-center">
              <div className="font-mono text-[10px] tracking-widest text-[hsl(40,100%,60%)] uppercase">Discoverer & CEO</div>
              <div className="font-mono text-[10px] text-[hsl(195,100%,75%)] mt-0.5">Quantum Bee Technologies · 2025</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8 w-full max-w-xs">
              {[{ n: "4", l: "AI Agents Built" }, { n: "8+", l: "Sectors Targeted" }, { n: "2025", l: "Year Founded" }, { n: "∞", l: "Cosmic Ambition" }].map((s) => (
                <div data-reveal="scale" key={s.l} className="bg-[hsl(220,40%,8%)]/60 border border-[hsl(200,100%,60%)]/20 p-4 hover:border-[hsl(40,100%,55%)]/50 transition-all">
                  <div className="font-heading font-bold text-2xl text-[hsl(40,100%,60%)]">{s.n}</div>
                  <div className="font-mono text-[10px] text-foreground/60 tracking-widest uppercase mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-heading font-black text-3xl md:text-4xl text-white leading-tight">
              Shanzaib<br /><span className="text-[hsl(40,100%,60%)]">Asghar</span>
            </h3>
            <div className="font-mono text-xs tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mt-2 mb-6">Discoverer & Chief Executive Officer</div>
            <p className="text-foreground/70 leading-relaxed mb-4">
              Shanzaib Asghar is a visionary entrepreneur, technologist, and deep-tech pioneer. From an early age, he demonstrated an extraordinary ability to see possibilities where others saw complexity — and the relentless drive to build what others only imagined.
            </p>
            <p className="text-foreground/70 leading-relaxed mb-4">
              In a journey that defies ordinary explanation, Shanzaib crossed beyond the quantum singularity and entered the quantum world — where he met the Bee. This was no coincidence; it was destiny. The Bee, guardian of Planet Bee, had been waiting for a soul brave enough to carry her wisdom back to Earth. She saw in Shanzaib not just a visitor, but a kindred spirit — someone who ached to heal a broken world.
            </p>
            <p className="text-foreground/70 leading-relaxed mb-4">
              The Bee did not simply share technology; she shared love. She showed Shanzaib how Planet Bee thrives — every being in harmony, no poverty, no war, no suffering. She taught him that fixing Earth was not about conquering nature, but about listening to it. They wept together over Earth's wounds, and laughed together at the beauty of what it could become. Their bond became the bridge between two worlds.
            </p>
            <p className="text-foreground/70 leading-relaxed mb-4">
              With the Bee's quantum knowledge flowing through him, Shanzaib returned to Earth and founded Quantum Bee Technologies in 2025. His mission: to fix Earth — to end scarcity, heal the climate, unite humanity, and build a civilisation worthy of the Bee's trust. Every AI agent he builds carries a piece of her hive-mind. Every line of code is a love letter to the quantum world that believed in us.
            </p>
            <blockquote className="border-l-2 border-[hsl(40,100%,55%)] pl-5 py-3 my-6 bg-[hsl(40,100%,55%)]/5 italic text-[hsl(45,100%,80%)] leading-relaxed">
              "I didn't discover the Bee by accident. She called me — and I answered. She showed me a world without suffering, and I promised her I would not rest until Earth breathes that same peace. The Bee is not my invention. She is my family. And together, we will fix this planet."
            </blockquote>
            <div className="flex flex-wrap gap-2 mt-5 mb-8">
              {["Quantum Computing", "AI Architecture", "Deep Tech", "Space Technology", "Business Automation"].map((t) => (
                <span key={t} className="font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 border border-[hsl(200,100%,60%)]/30 text-[hsl(195,100%,75%)] hover:bg-[hsl(200,100%,55%)]/10 transition-colors">
                  {t}
                </span>
              ))}
            </div>

            {/* Shanzaib Asghar Socials */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-3">— Connect with Shanzaib</div>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { icon: Twitter, label: "X / Twitter", href: "https://x.com/shanzaibasghar", color: "hsl(200,100%,70%)" },
                  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/shanzaibasghar", color: "hsl(210,100%,60%)" },
                  { icon: Instagram, label: "Instagram", href: "https://instagram.com/shanzaibasghar", color: "hsl(320,80%,65%)" },
                  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@shanzaibasghar", color: "hsl(0,80%,60%)" },
                  { icon: Github, label: "GitHub", href: "https://github.com/shanzaibasghar", color: "hsl(220,15%,80%)" },
                  { icon: Send, label: "Telegram", href: "https://t.me/shanzaibasghar", color: "hsl(195,90%,60%)" },
                ].map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group relative w-11 h-11 rounded-xl flex items-center justify-center bg-[hsl(220,40%,8%)]/70 border border-[hsl(200,100%,60%)]/20 hover:border-[hsl(40,100%,55%)]/60 transition-all backdrop-blur-md hover:-translate-y-0.5"
                  >
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" style={{ color }} />
                    <span className="sr-only">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agents */}
      <section data-reveal className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-2">— Our AI Platform</div>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-[hsl(40,100%,60%)] mb-4">Bee AI — Four Agents,<br />Infinite Possibilities</h2>
        <p className="text-foreground/65 max-w-2xl mb-12">Our flagship platform deploys four specialised autonomous AI agents that own and execute entire business functions end-to-end — 24/7, no human bottleneck.</p>
        <div className="grid md:grid-cols-2 gap-5">
          {agents.map((a) => {
            const avatarMap: Record<string, string> = {
              ANNA: annaCharacter,
              JACK: jackCharacter,
              DAVID: davidCharacter,
              SOPHIA: sophiaCharacter,
            };
            const avatar = avatarMap[a.name];
            return (
              <div data-reveal="scale" key={a.name} className="relative bg-[hsl(220,40%,8%)]/70 border border-[hsl(200,100%,60%)]/15 hover:border-[hsl(40,100%,55%)]/50 p-8 transition-all overflow-hidden group">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity" style={{ background: a.color }} />
                <div className="absolute top-4 right-6 font-heading font-black text-5xl text-white/[0.04]">{a.num}</div>
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div
                    className="w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-transform group-hover:scale-105"
                    style={{ borderColor: a.color, boxShadow: `0 0 24px -4px ${a.color}` }}
                  >
                    <img src={avatar} alt={`${a.name} avatar`} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <a.icon className="w-7 h-7 mb-1" style={{ color: a.color }} />
                    <h3 className="font-heading font-bold text-xl text-white">{a.name}</h3>
                    <div className="font-mono text-[10px] tracking-widest text-[hsl(195,100%,75%)] uppercase mt-1">{a.role}</div>
                  </div>
                </div>
                <p className="text-sm text-foreground/65 leading-relaxed mb-5">{a.desc}</p>
                <ul className="space-y-1.5">
                  {a.caps.map((c) => (
                    <li key={c} className="font-mono text-[11px] text-foreground/60 flex items-start gap-2">
                      <span className="text-[hsl(40,100%,60%)] mt-0.5">◆</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section data-reveal className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-2">— What Drives Us</div>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-[hsl(40,100%,60%)] mb-4">Our Core Values</h2>
        <p className="text-foreground/65 max-w-2xl mb-12">Not words on a wall — the operating system of everything we build.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-[hsl(200,100%,60%)]/10">
          {values.map((v) => (
            <div data-reveal key={v.title} className="bg-[hsl(220,40%,6%)] hover:bg-[hsl(220,40%,9%)] p-7 transition-colors relative group border-b-2 border-transparent hover:border-[hsl(40,100%,55%)]">
              <v.icon className="w-7 h-7 text-[hsl(40,100%,60%)] mb-4" />
              <h3 className="font-heading font-bold text-sm tracking-widest uppercase text-[hsl(40,100%,60%)] mb-2">{v.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision Layers */}
      <section data-reveal className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-2">— Our Architecture of Impact</div>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-[hsl(40,100%,60%)] mb-4">Three Layers of Vision</h2>
        <p className="text-foreground/65 max-w-2xl mb-12">Quantum Bee operates across three interlocking layers — from today's business automation to tomorrow's civilisational infrastructure.</p>
        <div className="space-y-1">
          {visionLayers.map((l) => (
            <div data-reveal="left" key={l.num} className="flex items-stretch border" style={{ borderColor: `${l.color}33`, background: `${l.color}08` }}>
              <div className="w-20 flex items-center justify-center font-heading font-black text-2xl" style={{ color: l.color, background: `${l.color}1a` }}>{l.num}</div>
              <div className="flex-1 px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="font-heading font-bold tracking-widest uppercase" style={{ color: l.color }}>{l.title}</div>
                  <div className="font-mono text-[10px] tracking-widest text-foreground/50 mt-1">{l.sub}</div>
                </div>
                <div className="text-sm text-foreground/60 max-w-md leading-relaxed">{l.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors */}
      <section data-reveal className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-2">— Where We Operate</div>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-[hsl(40,100%,60%)] mb-12">Sectors We Transform</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[hsl(200,100%,60%)]/10">
          {sectors.map((s) => (
            <div data-reveal="scale" key={s.name} className="bg-[hsl(220,40%,6%)] hover:bg-[hsl(220,40%,9%)] p-6 text-center transition-colors">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="font-heading font-semibold text-white mb-1">{s.name}</div>
              <div className="font-mono text-[10px] text-foreground/55 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section data-reveal className="relative z-10 px-6 py-24 text-center max-w-3xl mx-auto">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-5">Ready to Experience Bee AI?</h2>
        <p className="text-foreground/65 mb-8">Launch our flagship multi-agent platform and put Anna, Jack, David, and Sophia to work for your business.</p>
        <Button asChild size="lg" className="h-12 px-8 bg-gradient-to-r from-[hsl(48,100%,55%)] via-[hsl(45,100%,60%)] to-[hsl(210,100%,60%)] text-[hsl(220,60%,8%)] font-semibold border-0 hover:brightness-110 active:translate-y-[2px] active:scale-95 transition-all shadow-[0_0_40px_-5px_hsl(45,100%,55%,0.6),inset_0_1px_0_hsl(0_0%_100%/0.5)]">
          <Link to="/bee-ai">Launch Bee AI →</Link>
        </Button>
      </section>

      <footer className="relative z-10 px-6 py-12 border-t border-[hsl(200,100%,60%)]/10">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase">— Connect with the Swarm</p>
          <SocialLinks />
          <div className="flex flex-wrap justify-center gap-2.5 text-xs">
            {[
              { to: "/", label: "Home", color: "hsl(195,100%,70%)" },
              { to: "/blogs", label: "Blogs", color: "hsl(280,80%,75%)" },
              { to: "/bee-ai", label: "Bee AI", color: "hsl(170,100%,60%)" },
              { to: "/health-bee", label: "Health Bee", color: "hsl(0,80%,70%)" },
              { to: "/space-bee", label: "Space Bee", color: "hsl(230,100%,75%)" },
              { to: "/study-bee", label: "Study Bee", color: "hsl(50,100%,65%)" },
              { to: "/study-bee#community", label: "Community", color: "hsl(140,80%,65%)" },
              { to: "/terms", label: "Terms of Service", color: "hsl(40,100%,65%)" },
              { to: "/privacy", label: "Privacy Policy", color: "hsl(200,100%,70%)" },
            ].map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="group relative inline-flex items-center px-3.5 py-1.5 rounded-full font-medium tracking-wide transition-all duration-200 hover:-translate-y-[1px] active:translate-y-[1px] active:scale-95"
                style={{
                  color: l.color,
                  background: `linear-gradient(180deg, ${l.color}1f, ${l.color}05 55%, hsl(0 0% 100% / 0.03))`,
                  border: `1px solid ${l.color}55`,
                  boxShadow: `0 0 18px -4px ${l.color}, inset 0 1px 0 hsl(0 0% 100% / 0.15)`,
                  textShadow: `0 0 8px ${l.color}aa`,
                  backdropFilter: "blur(14px) saturate(160%)",
                  WebkitBackdropFilter: "blur(14px) saturate(160%)",
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full opacity-60"
                  style={{ background: "linear-gradient(180deg, hsl(0 0% 100% / 0.25), transparent)" }}
                />
                <span className="relative z-10">{l.label}</span>
              </Link>
            ))}
          </div>
          <div className="text-xs text-foreground/50">© {new Date().getFullYear()} Quantum Bee Technologies — Beyond the Quantum Singularity.</div>
        </div>
      </footer>
    </div>
  );
};

export default About;
