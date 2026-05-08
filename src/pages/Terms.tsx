import { Link } from "react-router-dom";
import { ArrowLeft, ScrollText, Bot, CreditCard, Ban, Scale, AlertTriangle, RefreshCw, Mail } from "lucide-react";
import SpaceBackground from "@/components/SpaceBackground";
import TopBar from "@/components/TopBar";
import SiteFooter from "@/components/SiteFooter";
import { useReveal } from "@/hooks/use-reveal";

const sections = [
  {
    icon: ScrollText,
    title: "1. Acceptance of the Hive",
    body: "By creating a Quantum Bee account or using Bee AI, Health Bee, Space Bee, Study Bee or any service in the Quantum Bee ecosystem, you agree to these Terms. If you do not agree, please do not enter the hive.",
  },
  {
    icon: Bot,
    title: "2. Your Use of the Agents",
    body: "Our autonomous agents (Anna, Jack, David, Sophia and any future agents) are tools that act on your behalf. You are responsible for the instructions you give them, the content they produce under your direction, and ensuring that what you build with them is lawful and respects the rights of others.",
  },
  {
    icon: CreditCard,
    title: "3. Bee Coins, Plans & Billing",
    body: "Some features run on Bee Coins or paid plans. Charges are shown clearly before purchase. Coins are non-transferable and may expire if abused. We may adjust pricing as the platform evolves; existing paid cycles are honored at the price you signed up for.",
  },
  {
    icon: Ban,
    title: "4. Acceptable Use",
    body: "You may not use Quantum Bee to harm humans, generate disinformation at scale, build weapons, attack other systems, infringe intellectual property, or attempt to reverse-engineer our quantum core. Violations can result in immediate suspension.",
  },
  {
    icon: Scale,
    title: "5. Intellectual Property",
    body: "Quantum Bee, the Bee logo, Planet Bee, Quantum Bee City and the agent characters remain ours. Outputs you generate using your own prompts and inputs belong to you, subject to applicable model and content licenses.",
  },
  {
    icon: AlertTriangle,
    title: "6. Disclaimers & Limits",
    body: "The platform is provided \"as is.\" We work hard, but AI can be wrong. Do not rely on Bee AI alone for medical, legal, financial, or safety-critical decisions. To the maximum extent allowed by law, our liability is limited to the amount you paid us in the last 12 months.",
  },
  {
    icon: RefreshCw,
    title: "7. Changes to the Terms",
    body: "As the swarm grows, these Terms may evolve. Material changes will be announced on the platform. Continued use after changes means you accept the new version.",
  },
  {
    icon: Mail,
    title: "8. Contact",
    body: "Reach the swarm at legal@quantumbee.ai for any question about these Terms.",
  },
];

const Terms = () => {
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
          <p className="font-mono text-[10px] tracking-[0.4em] text-[hsl(195,100%,75%)] uppercase mb-4">[ The Pact of the Swarm ]</p>
          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight bg-gradient-to-br from-white via-[hsl(40,100%,75%)] to-[hsl(195,100%,80%)] bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="mt-5 text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            These Terms are the contract between you and Quantum Bee. They exist so the swarm can build at quantum speed without losing the trust, ethics and beauty that define Planet Bee.
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
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[hsl(40,100%,55%)]/15 blur-2xl" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 rounded-xl grid place-items-center border border-[hsl(40,100%,55%)]/30 bg-[hsl(40,100%,55%)]/10 text-[hsl(40,100%,70%)] shadow-[0_0_18px_-4px_hsl(40,100%,55%)]">
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

        <div data-reveal className="mt-14 rounded-2xl p-6 border border-[hsl(195,100%,60%)]/30 bg-gradient-to-br from-[hsl(195,100%,55%)]/10 to-[hsl(40,100%,55%)]/5 text-center">
          <p className="font-heading text-xl text-white">Build boldly. Build kindly.</p>
          <p className="mt-2 text-sm text-foreground/75 max-w-xl mx-auto leading-relaxed">
            Authorized by Shanzaib Asghar — these Terms are how we keep the swarm aligned with our mission to make Earth as beautiful and efficient as Planet Bee.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Terms;
