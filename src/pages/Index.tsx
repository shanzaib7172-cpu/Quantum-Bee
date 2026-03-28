import { useState } from "react";
import { Menu, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DrawerMenu } from "@/components/DrawerMenu";
import ChatCanvas from "@/components/ChatCanvas";

const Index = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Ambient background effects */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, hsl(var(--primary) / 0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, hsl(var(--accent) / 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, hsl(var(--primary) / 0.02) 0%, transparent 40%)
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
          <span className="text-base font-heading font-semibold text-gradient">NexusAI</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            Login
          </Button>
          <Button
            size="sm"
            className="text-xs bg-primary/15 text-primary border border-primary/20 hover:bg-primary/25 hover:border-primary/40 gap-1.5"
            variant="ghost"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Sign up
          </Button>
        </div>
      </header>

      {/* Drawer */}
      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Main chat area */}
      <main className="relative z-10 flex-1 flex">
        <ChatCanvas />
      </main>
    </div>
  );
};

export default Index;
