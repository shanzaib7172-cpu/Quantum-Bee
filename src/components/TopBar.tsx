import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogIn, UserPlus, Info, BookOpen, Home as HomeIcon, Cpu,
  Users, Menu, X, User as UserIcon,
} from "lucide-react";
import beeLogo from "@/assets/bee-logo.png";
import { useAuth } from "@/hooks/use-auth";

const NAV = [
  { to: "/", label: "Home", icon: HomeIcon, color: "hsl(195,100%,70%)" },
  { to: "/about", label: "About", icon: Info, color: "hsl(40,100%,65%)" },
  { to: "/blogs", label: "Blogs", icon: BookOpen, color: "hsl(280,80%,75%)" },
  { to: "/bee-ai", label: "Bee AI", icon: Cpu, color: "hsl(170,100%,60%)" },
  { to: "/study-bee", label: "Community", icon: Users, color: "hsl(50,100%,65%)" },
];

const Icon3D = ({
  Icon, label, color, active,
}: { Icon: any; label: string; color: string; active: boolean }) => (
  <span
    className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-150
      border overflow-hidden isolate select-none
      hover:-translate-y-[1px] active:translate-y-[2px] active:scale-95
      ${active ? "text-white" : "text-white/75 hover:text-white"}`}
    style={{
      background: active
        ? `linear-gradient(180deg, ${color}28, ${color}08 55%, hsl(0 0% 100% / 0.04))`
        : "linear-gradient(180deg, hsl(0 0% 100% / 0.10), hsl(0 0% 100% / 0.02) 55%, hsl(0 0% 100% / 0.04))",
      borderColor: active ? `${color}60` : "hsl(0 0% 100% / 0.14)",
      backdropFilter: "blur(22px) saturate(180%)",
      WebkitBackdropFilter: "blur(22px) saturate(180%)",
      boxShadow: active
        ? `inset 0 1px 0 hsl(0 0% 100% / 0.35), inset 0 -1px 0 hsl(0 0% 0% / 0.25), 0 6px 18px -8px ${color}`
        : "inset 0 1px 0 hsl(0 0% 100% / 0.22), inset 0 -1px 0 hsl(0 0% 0% / 0.25), 0 4px 14px -6px hsl(0 0% 0% / 0.45)",
    }}
  >
    {/* Specular highlight */}
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full opacity-70"
      style={{ background: "linear-gradient(180deg, hsl(0 0% 100% / 0.35), transparent)" }}
    />
    {/* Soft inner refraction tint */}
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-full opacity-60"
      style={{ background: `radial-gradient(120% 80% at 50% 120%, ${color}22, transparent 60%)` }}
    />
    <Icon className="w-3.5 h-3.5 relative z-10" style={{ color, filter: `drop-shadow(0 0 4px ${color}88)` }} />
    <span className="relative z-10 whitespace-nowrap">{label}</span>
  </span>
);

const TopBar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header
      className="sticky top-0 z-40"
      style={{ background: "transparent" }}
    >
      <div className="flex items-center justify-between gap-2 px-3 sm:px-5 py-2.5">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[hsl(195,100%,60%)]/30 blur-xl animate-pulse" />
            <img
              src={beeLogo}
              alt="Quantum Bee"
              className="relative w-full h-full object-contain z-10"
              style={{ filter: "drop-shadow(0 0 8px hsl(195 100% 60% / 0.7))" }}
            />
          </div>
          <span className="hidden sm:inline text-base font-heading font-bold tracking-tight bg-gradient-to-r from-[hsl(40,100%,65%)] via-[hsl(195,100%,75%)] to-[hsl(230,100%,75%)] bg-clip-text text-transparent">
            Quantum Bee
          </span>
        </Link>

        {/* Desktop nav (visible md+) */}
        <nav className="hidden md:flex items-center gap-1 flex-wrap justify-end">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to}>
              <Icon3D Icon={n.icon} label={n.label} color={n.color} active={pathname === n.to} />
            </Link>
          ))}
          <Link to="/login" className="ml-1">
            <Icon3D Icon={LogIn} label="Login" color="hsl(200,100%,70%)" active={pathname === "/login"} />
          </Link>
          <Link to="/signup">
            <Icon3D Icon={UserPlus} label="Sign up" color="hsl(45,100%,65%)" active={pathname === "/signup"} />
          </Link>
          {user && (
            <Link to="/profile">
              <Icon3D Icon={UserIcon} label="Profile" color="hsl(140,100%,65%)" active={pathname === "/profile"} />
            </Link>
          )}
        </nav>

        {/* Mobile toggle (only below md) */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((s) => !s)}
          className="md:hidden relative w-10 h-10 grid place-items-center rounded-full text-white overflow-hidden"
          style={{
            background: "linear-gradient(180deg, hsl(0 0% 100% / 0.14), hsl(0 0% 100% / 0.04))",
            border: "1px solid hsl(0 0% 100% / 0.18)",
            backdropFilter: "blur(22px) saturate(180%)",
            WebkitBackdropFilter: "blur(22px) saturate(180%)",
            boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.35), inset 0 -1px 0 hsl(0 0% 0% / 0.25), 0 6px 18px -6px hsl(0 0% 0% / 0.5)",
          }}
        >
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full"
            style={{ background: "linear-gradient(180deg, hsl(0 0% 100% / 0.35), transparent)" }} />
          {open ? <X className="w-5 h-5 relative z-10" /> : <Menu className="w-5 h-5 relative z-10" />}
        </button>
      </div>



      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 animate-fade-in">
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-3xl relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, hsl(0 0% 100% / 0.10), hsl(0 0% 100% / 0.02))",
              border: "1px solid hsl(0 0% 100% / 0.16)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.25), 0 20px 50px -10px hsl(0 0% 0% / 0.6)",
            }}
          >
            {NAV.concat(
              user
                ? [{ to: "/profile", label: "Profile", icon: UserIcon, color: "hsl(140,100%,65%)" }]
                : [
                    { to: "/login", label: "Login", icon: LogIn, color: "hsl(200,100%,70%)" },
                    { to: "/signup", label: "Sign up", icon: UserPlus, color: "hsl(45,100%,65%)" },
                  ],
            ).map((n) => (
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
