import { Link } from "react-router-dom";
import { Orbit, Satellite, Rocket, Radio, Globe2, ArrowRight, ArrowLeft, CheckCircle2, Cpu, Telescope } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import SocialLinks from "@/components/SocialLinks";
import StarfieldNight from "@/components/StarfieldNight";

const ACCENT = "hsl(220,100%,72%)";

const SpaceBee = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-foreground relative overflow-hidden">
      <StarfieldNight density={0.7} />
      <TopBar />
      {/* back button removed */}

      <main className="relative z-10 px-6 py-20 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6"
          style={{ borderColor: `${ACCENT}55`, background: `${ACCENT}1a` }}>
          <Orbit className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
            Space Bee · Interplanetary AI
          </span>
        </div>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl leading-[1.05]">
          <span className="bg-gradient-to-br from-white via-[hsl(220,100%,85%)] to-[hsl(220,100%,70%)] bg-clip-text text-transparent">
            The AI Layer for
          </span>
          <br />
          <span className="bg-gradient-to-r from-[hsl(220,100%,75%)] to-[hsl(280,80%,75%)] bg-clip-text text-transparent">
            the Solar System
          </span>
        </h1>
        <p className="mt-7 max-w-2xl mx-auto text-foreground/70 leading-relaxed">
          Space Bee is the off-world arm of the swarm — autonomous AI for satellites, lunar relays and Mars-bound missions.
          Built for high-latency, high-stakes environments where humans can't stay in the loop.
        </p>
        <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-mono"
          style={{ borderColor: `${ACCENT}66`, background: `${ACCENT}15`, color: ACCENT }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: ACCENT }} />
          First mission · Q1 2027
        </div>
      </main>

      <section className="relative z-10 px-6 py-16 max-w-6xl mx-auto w-full">
        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-10 text-center" style={{ color: ACCENT }}>
          What Space Bee Powers
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Satellite, title: "Onboard Satellite Autonomy", desc: "Edge AI that lets satellites observe, decide and react without waiting on ground command." },
            { icon: Radio, title: "Quantum-Secured Comms", desc: "Post-quantum crypto and entanglement-ready protocols for tamper-proof deep-space links." },
            { icon: Rocket, title: "Mission Planning Copilot", desc: "Multi-agent simulation of trajectories, fuel and risk for crewed and uncrewed missions." },
            { icon: Telescope, title: "Space Telescope AI", desc: "Real-time anomaly detection across petabytes of telescope feeds — find what humans miss." },
            { icon: Globe2, title: "Mars Colony OS", desc: "Closed-loop life support, robotics and energy orchestration for the first Martian habitats." },
            { icon: Cpu, title: "Quantum Edge Compute", desc: "Cryo-stable quantum coprocessors designed for orbital and deep-space deployment." },
          ].map((p) => (
            <div key={p.title} className="rounded-2xl p-6 bg-[hsl(220,40%,8%)]/70 backdrop-blur-xl border border-[hsl(220,100%,70%)]/15 hover:border-[hsl(220,100%,70%)]/45 transition-all">
              <p.icon className="w-6 h-6 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-heading font-bold text-lg text-white">{p.title}</h3>
              <p className="text-sm text-foreground/65 mt-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto w-full">
        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8" style={{ color: ACCENT }}>Mission Roadmap</h2>
        <div className="space-y-3">
          {[
            { phase: "Phase 01", t: "LEO Pilot", desc: "Onboard autonomy stack tested on a low-earth-orbit cubesat partner." },
            { phase: "Phase 02", t: "Lunar Relay", desc: "Communication relay running quantum-secured handshake protocols." },
            { phase: "Phase 03", t: "Mars Sandbox", desc: "Simulated Mars habitat AI in collaboration with a major space agency." },
            { phase: "Phase 04", t: "Interplanetary Mesh", desc: "Permanent autonomous swarm spanning Earth, Moon and Mars." },
          ].map((r) => (
            <div key={r.phase} className="flex gap-4 rounded-xl p-5 bg-[hsl(220,40%,7%)]/70 border border-[hsl(220,100%,70%)]/15">
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: ACCENT }} />
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: ACCENT }}>{r.phase}</div>
                <div className="font-heading font-bold text-white mt-0.5">{r.t}</div>
                <p className="text-sm text-foreground/65 mt-1">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-20 text-center max-w-3xl mx-auto">
        <h3 className="font-heading font-bold text-3xl md:text-4xl text-white">Build the cosmos with us.</h3>
        <p className="text-foreground/65 mt-4 mb-8">Space agencies, telescope operators and mission planners — apply for early collaboration.</p>
        <Button asChild size="lg" className="h-12 px-8 text-white border-0"
          style={{ background: `linear-gradient(135deg, ${ACCENT}, hsl(280 80% 65%))` }}>
          <Link to="/signup">Apply to collaborate <ArrowRight className="w-4 h-4 ml-2" /></Link>
        </Button>
      </section>

      <footer className="relative z-10 px-6 py-10 border-t border-[hsl(200,100%,60%)]/10 text-center">
        <SocialLinks />
        <div className="text-xs text-foreground/50 mt-4">© {new Date().getFullYear()} Quantum Bee · Space Bee</div>
      </footer>
    </div>
  );
};

export default SpaceBee;
