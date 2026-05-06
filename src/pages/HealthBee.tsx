import { Link } from "react-router-dom";
import { HeartPulse, Activity, Microscope, Shield, ArrowRight, ArrowLeft, CheckCircle2, Stethoscope, Brain, Dna } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import SocialLinks from "@/components/SocialLinks";
import SpaceBackground from "@/components/SpaceBackground";

const ACCENT = "hsl(345,90%,65%)";

const HealthBee = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[hsl(220,60%,3%)] text-foreground relative overflow-hidden">
      <SpaceBackground density={0.8} rocks={0} blackhole={false} />
      <TopBar />
      <div className="relative z-30 px-5 pt-3">
        <Link to="/" aria-label="Back to home" className="glass-icon glass-icon-sm w-9 h-9 inline-flex items-center justify-center rounded-full text-white active:scale-95 active:translate-y-[1px] transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Hero */}
      <main className="relative z-10 px-6 py-20 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-[hsl(345,90%,65%)]/10 mb-6"
          style={{ borderColor: `${ACCENT}55` }}>
          <HeartPulse className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
            Health Bee · Quantum Healthcare AI
          </span>
        </div>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl leading-[1.05]">
          <span className="bg-gradient-to-br from-white via-[hsl(345,90%,85%)] to-[hsl(345,90%,65%)] bg-clip-text text-transparent">
            Healing at the
          </span>
          <br />
          <span className="bg-gradient-to-r from-[hsl(345,90%,65%)] to-[hsl(195,100%,70%)] bg-clip-text text-transparent">
            Quantum Frequency
          </span>
        </h1>
        <p className="mt-7 max-w-2xl mx-auto text-foreground/70 leading-relaxed">
          Health Bee is our autonomous medical intelligence layer — combining quantum-trained models, multimodal
          diagnostic agents, and a privacy-first patient data fabric to give every clinic, hospital and lab the
          ability to diagnose faster, treat smarter and discover drugs in months, not years.
        </p>

        <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[hsl(345,90%,65%)]/40 bg-[hsl(345,90%,65%)]/10 text-sm font-mono">
          <span className="w-2 h-2 rounded-full bg-[hsl(345,90%,65%)] animate-pulse" />
          Pilot launch · Q3 2026
        </div>
      </main>

      {/* Pillars */}
      <section className="relative z-10 px-6 py-16 max-w-6xl mx-auto w-full">
        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-10 text-center" style={{ color: ACCENT }}>
          What Health Bee Does
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Stethoscope, title: "Multimodal Diagnostics", desc: "Vision + lab + history fused agents that surface differential diagnoses with explainable reasoning." },
            { icon: Dna, title: "Quantum Genomics", desc: "Genome-scale variant search and disease-risk modeling using quantum-accelerated embeddings." },
            { icon: Microscope, title: "Drug Discovery", desc: "Molecule generation and binding-affinity simulation, compressing R&D from years to months." },
            { icon: Brain, title: "Clinical Copilot", desc: "An AI doctor in every browser — for triage, second opinion, and continuous patient education." },
            { icon: Activity, title: "Hospital Workflow", desc: "Autonomous scheduling, medical coding, and discharge summaries that free up 10+ hours/week per clinician." },
            { icon: Shield, title: "Privacy by Default", desc: "Zero-knowledge patient vault, HIPAA-grade RLS, and on-prem inference for sensitive workloads." },
          ].map((p) => (
            <div key={p.title} className="rounded-2xl p-6 bg-[hsl(220,40%,8%)]/70 backdrop-blur-xl border border-[hsl(345,90%,65%)]/15 hover:border-[hsl(345,90%,65%)]/40 transition-all">
              <p.icon className="w-6 h-6 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-heading font-bold text-lg text-white">{p.title}</h3>
              <p className="text-sm text-foreground/65 mt-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto w-full">
        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8" style={{ color: ACCENT }}>Roadmap</h2>
        <div className="space-y-3">
          {[
            { phase: "Phase 01", t: "Diagnostic Beta", desc: "Closed beta with three partner clinics — symptom triage + radiology copilot." },
            { phase: "Phase 02", t: "Hospital Integrations", desc: "FHIR/HL7 ingestion, EMR sync, automated coding & billing." },
            { phase: "Phase 03", t: "Quantum Drug Lab", desc: "Quantum-assisted molecule discovery for partnered pharma research." },
            { phase: "Phase 04", t: "Global Launch", desc: "Health Bee available to every clinic, anywhere, in every language." },
          ].map((r) => (
            <div key={r.phase} className="flex gap-4 rounded-xl p-5 bg-[hsl(220,40%,7%)]/70 border border-[hsl(345,90%,65%)]/15">
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

      {/* CTA */}
      <section className="relative z-10 px-6 py-20 text-center max-w-3xl mx-auto">
        <h3 className="font-heading font-bold text-3xl md:text-4xl text-white">Want early access?</h3>
        <p className="text-foreground/65 mt-4 mb-8">Join the Health Bee waitlist — clinics, labs and researchers go first.</p>
        <Button asChild size="lg" className="h-12 px-8 text-white border-0"
          style={{ background: `linear-gradient(135deg, ${ACCENT}, hsl(195 100% 55%))` }}>
          <Link to="/signup">Join waitlist <ArrowRight className="w-4 h-4 ml-2" /></Link>
        </Button>
      </section>

      <footer className="relative z-10 px-6 py-10 border-t border-[hsl(200,100%,60%)]/10 text-center">
        <SocialLinks />
        <div className="text-xs text-foreground/50 mt-4">© {new Date().getFullYear()} Quantum Bee · Health Bee</div>
      </footer>
    </div>
  );
};

export default HealthBee;
