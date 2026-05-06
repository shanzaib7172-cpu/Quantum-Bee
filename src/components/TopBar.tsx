import { Link, useLocation } from "react-router-dom";
import { LogIn, UserPlus, Info, BookOpen, Home as HomeIcon, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import beeLogo from "@/assets/bee-logo.png";

/**
 * Unified top navigation used across marketing pages so every page
 * shares the same brand bar with the same links.
 */
const TopBar = () => {
  const { pathname } = useLocation();

  const navItem = (to: string, label: string, Icon: any, accent = false) => {
    const active = pathname === to;
    return (
      <Button
        key={to}
        asChild
        variant="ghost"
        size="sm"
        className={`text-xs gap-1.5 border ${
          accent
            ? "bg-[hsl(200,100%,55%)]/15 text-[hsl(195,100%,75%)] border-[hsl(200,100%,60%)]/30 hover:bg-[hsl(200,100%,55%)]/25 hover:border-[hsl(200,100%,60%)]/60"
            : active
            ? "text-[hsl(45,100%,80%)] border-[hsl(40,100%,55%)]/50 bg-[hsl(40,100%,55%)]/10"
            : "text-foreground/70 hover:text-foreground border-[hsl(200,100%,60%)]/20 hover:border-[hsl(200,100%,60%)]/40 hover:bg-[hsl(200,100%,55%)]/10"
        }`}
      >
        <Link to={to}>
          <Icon className="w-3.5 h-3.5" />
          {label}
        </Link>
      </Button>
    );
  };

  return (
    <header className="relative z-30 flex items-center justify-between px-6 py-4 border-b border-[hsl(200,100%,60%)]/10 backdrop-blur-md bg-[hsl(220,60%,3%)]/60">
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
        <span className="text-lg font-heading font-bold tracking-tight bg-gradient-to-r from-[hsl(40,100%,65%)] via-[hsl(195,100%,75%)] to-[hsl(230,100%,75%)] bg-clip-text text-transparent">
          Quantum Bee
        </span>
      </Link>

      <nav className="flex items-center gap-2 flex-wrap justify-end">
        {navItem("/", "Home", HomeIcon)}
        {navItem("/about", "About", Info)}
        {navItem("/blogs", "Blogs", BookOpen)}
        {navItem("/bee-ai", "Bee AI", Cpu)}
        {navItem("/login", "Login", LogIn)}
        {navItem("/signup", "Sign up", UserPlus, true)}
      </nav>
    </header>
  );
};

export default TopBar;
