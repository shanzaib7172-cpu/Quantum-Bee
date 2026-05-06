import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogIn, UserPlus, Info, BookOpen, Home as HomeIcon, Cpu,
  HeartPulse, Orbit, GraduationCap, Menu, X,
} from "lucide-react";
import beeLogo from "@/assets/bee-logo.png";

const NAV = [
  { to: "/", label: "Home", icon: HomeIcon, color: "hsl(195,100%,70%)" },
  { to: "/about", label: "About", icon: Info, color: "hsl(40,100%,65%)" },
  { to: "/blogs", label: "Blogs", icon: BookOpen, color: "hsl(280,80%,75%)" },
  { to: "/bee-ai", label: "Bee AI", icon: Cpu, color: "hsl(170,100%,60%)" },
  { to: "/health-bee", label: "Health Bee", icon: HeartPulse, color: "hsl(345,90%,70%)" },
  { to: "/space-bee", label: "Space Bee", icon: Orbit, color: "hsl(220,100%,75%)" },
  { to: "/study-bee", label: "Study Bee", icon: GraduationCap, color: "hsl(50,100%,65%)" },
];

const Icon3D = ({
  Icon, label, color, active,
}: { Icon: any; label: string; color: string; active: boolean }) => (
  <span
    className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all
      border backdrop-blur-md overflow-hidden
      ${active ? "text-white" : "text-foreground/80 hover:text-white"}`}
    style={{
      background: active
        ? `linear-gradient(145deg, ${color}40, ${color}10)`
        : "linear-gradient(145deg, hsl(220 40% 10% / 0.6), hsl(220 40% 6% / 0.6))",
      borderColor: active ? `${color}80` : "hsl(200 100% 60% / 0.2)",
      boxShadow: active
        ? `0 6px 20px -8px ${color}, inset 0 1px 0 ${color}55, inset 0 -2px 6px ${color}20`
        : "inset 0 1px 0 hsl(200 100% 80% / 0.06), 0 2px 8px hsl(220 100% 10% / 0.4)",
    }}
  >
    <Icon className="w-3.5 h-3.5 relative z-10" style={{ color, filter: `drop-shadow(0 0 6px ${color})` }} />
    <span className="relative z-10 whitespace-nowrap">{label}</span>
    <span
      aria-hidden
      className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
      style={{ background: `radial-gradient(120% 60% at 50% 0%, ${color}30, transparent 70%)` }}
    />
  </span>
);

const TopBar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[hsl(220,60%,3%)]/70 border-b border-[hsl(200,100%,60%)]/15">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[hsl(195,100%,60%)]/30 blur-xl animate-pulse" />
            <img
              src={beeLogo}
              alt="Quantum Bee"
              className="relative w-full h-full object-contain z-10"
              style={{ filter: "drop-shadow(0 0 8px hsl(195 100% 60% / 0.7))" }}
            />
          </div>
          <span className="text-base sm:text-lg font-heading font-bold tracking-tight bg-gradient-to-r from-[hsl(40,100%,65%)] via-[hsl(195,100%,75%)] to-[hsl(230,100%,75%)] bg-clip-text text-transparent">
            Quantum Bee
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to}>
              <Icon3D Icon={n.icon} label={n.label} color={n.color} active={pathname === n.to} />
            </Link>
          ))}
          <Link to="/login" className="ml-2">
            <Icon3D Icon={LogIn} label="Login" color="hsl(200,100%,70%)" active={pathname === "/login"} />
          </Link>
          <Link to="/signup">
            <Icon3D Icon={UserPlus} label="Sign up" color="hsl(45,100%,65%)" active={pathname === "/signup"} />
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((s) => !s)}
          className="lg:hidden relative w-10 h-10 grid place-items-center rounded-xl border border-[hsl(200,100%,60%)]/30 bg-[hsl(220,40%,8%)]/70 text-white"
          style={{ boxShadow: "inset 0 1px 0 hsl(200 100% 80% / 0.15), 0 4px 14px hsl(200 100% 40% / 0.25)" }}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden px-4 pb-4 animate-fade-in">
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-2xl"
            style={{
              background: "linear-gradient(180deg, hsl(220 40% 9% / 0.85), hsl(220 60% 4% / 0.95))",
              border: "1px solid hsl(200 100% 60% / 0.18)",
              boxShadow: "0 16px 40px hsl(220 100% 20% / 0.5)",
            }}
          >
            {NAV.concat([
              { to: "/login", label: "Login", icon: LogIn, color: "hsl(200,100%,70%)" },
              { to: "/signup", label: "Sign up", icon: UserPlus, color: "hsl(45,100%,65%)" },
            ]).map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block">
                <Icon3D Icon={n.icon} label={n.label} color={n.color} active={pathname === n.to} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
