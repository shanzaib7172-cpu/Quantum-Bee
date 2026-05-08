import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Lock, Database, Eye, Cookie, Mail } from "lucide-react";
import SpaceBackground from "@/components/SpaceBackground";
import TopBar from "@/components/TopBar";
import SiteFooter from "@/components/SiteFooter";
import { useReveal } from "@/hooks/use-reveal";

const sections = [
  {
    icon: Database,
    title: "1. Data We Collect",
    body: "Quantum Bee only collects what is needed to deliver intelligence at quantum speed: your account details (name, email), the prompts and instructions you give our agents (Anna, Jack, David, Sophia), files you upload to Bee AI, and standard technical signals (device, browser, IP) used to keep the swarm secure.",
  },
  {
    icon: Eye,
    title: "2. How We Use It",
    body: "Your data powers your hive — never anyone else's. We use it to operate Bee AI, train your private agents on your context, generate Health Bee, Space Bee and Study Bee outputs you request, prevent abuse, and improve the platform. We do not sell your data. We do not use your private prompts to train public foundation models.",
  },
  {
    icon: Lock,
    title: "3. How We Protect It",
    body: "All traffic is encrypted in transit (TLS 1.2+) and at rest. Secrets, API keys and credentials are stored in isolated vaults. Access is gated by least-privilege roles and audited continuously. As we scale into the quantum era, we are actively engineering post-quantum cryptography for long-term resilience.",
  },
  {
    icon: ShieldCheck,
    title: "4. Your Rights",
    body: "You own your data. At any time you can export it, request a full deletion, correct what's inaccurate, or revoke a connected service. Reach out and the swarm responds — typically within 7 days.",
  },
  {
    icon: Cookie,
    title: "5. Cookies & Analytics",
    body: "We use a minimal set of cookies to keep you signed in and to understand which parts of Planet Bee, Quantum Bee City and Study Bee are most useful. You can disable non-essential cookies in your browser without losing core functionality.",
  },
  {
    icon: Mail,
    title: "6. Contact",
    body: "Questions, requests, or concerns? Write to privacy@quantumbee.ai and a human (not just a bee) will reply.",
  },
];

const Privacy = () => {
  useReveal();
  return (
    <div className="min-h-screen bg-[hsl(220,60%,3%)] text-foreground relative overflow-hidden flex flex-col">
      <SpaceBackground density={1.0} rocks={10} planets />
      <TopBar />

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-24 w-full flex-1">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-[hsl(40,100%,70%)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div data-reveal className="text-center mb-14">
          <p className="font-mono text-[10px] tracking-[0.4em] text-[hsl(195,100%,75%)] uppercase mb-4">[ Trust at Quantum Speed ]</p>
          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight bg-gradient-to-br from-white via-[hsl(195,100%,80%)] to-[hsl(40,100%,70%)] bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="mt-5 text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            At Quantum Bee, privacy is not a feature — it is the foundation. To turn Earth as beautiful and efficient as Planet Bee, every citizen of the hive must trust that their data is sacred. This policy explains exactly how we honor that trust.
          </p>
          <p className="mt-3 text-xs font-mono text-foreground/45">Last updated: May 2026</p>
        </div>

        <div className="space-y-4">
          {sections.map(({ icon: Icon, title, body }) => (
            <article
              data-reveal="scale"
              key={title}
              className="relative rounded-2xl p-6 bg-[hsl(220,40%,8%)]/70 backdrop-blur-xl border border-[hsl(200,100%,60%)]/15 hover:border-[hsl(40,100%,55%)]/45 transition-all overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[hsl(195,100%,55%)]/15 blur-2xl" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 rounded-xl grid place-items-center border border-[hsl(195,100%,70%)]/30 bg-[hsl(195,100%,55%)]/10 text-[hsl(195,100%,75%)] shadow-[0_0_18px_-4px_hsl(195,100%,55%)]">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg text-white">{title}</h2>
                  <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div data-reveal className="mt-14 rounded-2xl p-6 border border-[hsl(40,100%,55%)]/30 bg-gradient-to-br from-[hsl(40,100%,55%)]/10 to-[hsl(195,100%,55%)]/5 text-center">
          <p className="font-heading text-xl text-white">A pledge from the swarm.</p>
          <p className="mt-2 text-sm text-foreground/75 max-w-xl mx-auto leading-relaxed">
            Authorized by Shanzaib Asghar — every line of this policy is written so the future we build together is as safe as it is beautiful.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Privacy;
