import { Link } from "react-router-dom";
import { LogIn, UserPlus, ArrowRight, Atom, Sparkles, Cpu, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import beeLogo from "@/assets/bee-logo.png";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[hsl(220,60%,3%)] text-foreground relative overflow-hidden">
      {/* Animated blue wave background */}
      <div className="absolute inset-0 pointer-events-none">
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

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-6 py-4 border-b border-[hsl(200,100%,60%)]/10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[hsl(195,100%,60%)]/30 blur-xl animate-[orb-pulse_3s_ease-in-out_infinite]" />
            <img
              src={beeLogo}
              alt="Quantum Bee"
              className="relative w-10 h-10 object-contain z-10"
              style={{
                animation: "bee-fly 6s ease-in-out infinite",
                filter: "drop-shadow(0 0 8px hsl(195 100% 60% / 0.6))",
              }}
            />
          </div>
          <span className="text-lg font-heading font-bold tracking-tight bg-gradient-to-r from-[hsl(195,100%,70%)] via-[hsl(210,100%,75%)] to-[hsl(230,100%,75%)] bg-clip-text text-transparent">
            Quantum Bee
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1.5 text-[hsl(45,100%,75%)] hover:text-[hsl(45,100%,85%)] border border-[hsl(40,100%,55%)]/30 hover:border-[hsl(40,100%,55%)]/60 hover:bg-[hsl(40,100%,55%)]/10"
            asChild
          >
            <Link to="/about">
              <Info className="w-3.5 h-3.5" />
              About
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-foreground/70 hover:text-foreground gap-1.5" asChild>
            <Link to="/login">
              <LogIn className="w-3.5 h-3.5" />
              Login
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs gap-1.5 bg-[hsl(200,100%,55%)]/15 text-[hsl(195,100%,75%)] border border-[hsl(200,100%,60%)]/30 hover:bg-[hsl(200,100%,55%)]/25 hover:border-[hsl(200,100%,60%)]/60"
            asChild
          >
            <Link to="/signup">
              <UserPlus className="w-3.5 h-3.5" />
              Sign up
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[hsl(200,100%,60%)]/30 bg-[hsl(200,100%,55%)]/10 backdrop-blur-md mb-8 animate-fade-in">
          <Sparkles className="w-3 h-3 text-[hsl(195,100%,75%)]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[hsl(195,100%,80%)]">
            Quantum × AI
          </span>
        </div>

        <h1 className="font-heading font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight max-w-5xl animate-fade-in">
          <span className="bg-gradient-to-br from-white via-[hsl(200,100%,85%)] to-[hsl(220,100%,70%)] bg-clip-text text-transparent">
            Beyond the
          </span>
          <br />
          <span className="bg-gradient-to-r from-[hsl(195,100%,65%)] via-[hsl(210,100%,70%)] to-[hsl(230,100%,75%)] bg-clip-text text-transparent">
            Quantum Singularity
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-base sm:text-lg text-foreground/70 leading-relaxed animate-fade-in">
          Quantum Bee fuses <span className="text-[hsl(195,100%,75%)] font-medium">Quantum Computing</span> with{" "}
          <span className="text-[hsl(210,100%,80%)] font-medium">Artificial Intelligence</span> to spark a new
          revolution — solving the unsolvable, thinking beyond classical limits, and building the future of
          intelligence for the world.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 animate-fade-in">
          <Button
            asChild
            size="lg"
            className="group relative h-12 px-7 bg-gradient-to-r from-[hsl(200,100%,50%)] to-[hsl(220,100%,55%)] text-white border-0 hover:opacity-95 shadow-[0_0_40px_-5px_hsl(200,100%,55%,0.6)]"
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
        <section id="about" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl w-full">
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
            <div
              key={title}
              className="group relative rounded-2xl p-6 text-left bg-[hsl(220,40%,8%)]/60 backdrop-blur-xl border border-[hsl(200,100%,60%)]/15 hover:border-[hsl(200,100%,60%)]/40 transition-all overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[hsl(200,100%,55%)]/20 blur-2xl group-hover:bg-[hsl(200,100%,55%)]/40 transition-all" />
              <Icon className="w-7 h-7 text-[hsl(195,100%,70%)] mb-4 relative z-10" />
              <h3 className="font-heading font-semibold text-lg text-white relative z-10">{title}</h3>
              <p className="mt-2 text-sm text-foreground/65 leading-relaxed relative z-10">{desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="relative z-10 px-6 py-6 text-center text-xs text-foreground/50 border-t border-[hsl(200,100%,60%)]/10">
        © {new Date().getFullYear()} Quantum Bee — Beyond the Quantum Singularity.
      </footer>
    </div>
  );
};

export default Home;
