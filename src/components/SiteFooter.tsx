import { Link } from "react-router-dom";
import SocialLinks from "./SocialLinks";

const LINKS = [
  { to: "/", label: "Home", color: "hsl(195,100%,70%)" },
  { to: "/blogs", label: "Blogs", color: "hsl(280,80%,75%)" },
  { to: "/bee-ai", label: "Bee AI", color: "hsl(170,100%,60%)" },
  { to: "/health-bee", label: "Health Bee", color: "hsl(0,80%,70%)" },
  { to: "/space-bee", label: "Space Bee", color: "hsl(230,100%,75%)" },
  { to: "/study-bee", label: "Study Bee", color: "hsl(50,100%,65%)" },
  { to: "/study-bee#community", label: "Community", color: "hsl(140,80%,65%)" },
  { to: "/terms", label: "Terms of Service", color: "hsl(40,100%,65%)" },
  { to: "/privacy", label: "Privacy Policy", color: "hsl(200,100%,70%)" },
];

const SiteFooter = () => (
  <footer className="relative z-10 px-6 py-12 border-t border-[hsl(200,100%,60%)]/10">
    <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
      <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase">— Connect with the Swarm</p>
      <SocialLinks />
      <div className="flex flex-wrap justify-center gap-2.5 text-xs">
        {LINKS.map((l) => (
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
);

export default SiteFooter;
