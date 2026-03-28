import { useState } from "react";
import { Menu, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DrawerMenu } from "@/components/DrawerMenu";
import ChatCanvas from "@/components/ChatCanvas";
import beeLogo from "@/assets/bee-logo.png";

const Index = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, hsl(45, 100%, 50%, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, hsl(var(--accent) / 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, hsl(45, 100%, 50%, 0.02) 0%, transparent 40%)
          `,
        }}
      />

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-5 py-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src={beeLogo} alt="Beee AI" className="w-7 h-7 object-contain" />
            <span className="text-base font-heading font-semibold text-gradient">Beee AI</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
            asChild
          >
            <Link to="/login">
              <LogIn className="w-3.5 h-3.5" />
              Login
            </Link>
          </Button>
          <Button
            size="sm"
            className="text-xs bg-bee/15 text-bee border border-bee/20 hover:bg-bee/25 hover:border-bee/40 gap-1.5"
            variant="ghost"
            asChild
          >
            <Link to="/signup">
              <UserPlus className="w-3.5 h-3.5" />
              Sign up
            </Link>
          </Button>
        </div>
      </header>

      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main className="relative z-10 flex-1 flex">
        <ChatCanvas />
      </main>
    </div>
  );
};

export default Index;
