import { useEffect, useState } from "react";
import { Menu, ArrowLeft, Loader2 } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { DrawerMenu } from "@/components/DrawerMenu";
import ChatCanvas from "@/components/ChatCanvas";
import TopBar from "@/components/TopBar";
import StarfieldNight from "@/components/StarfieldNight";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    document.title = "Bee AI · Quantum Bee";
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[hsl(220,60%,3%)]">
        <Loader2 className="w-6 h-6 animate-spin text-[hsl(45,100%,55%)]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent("/bee-ai")}`} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white relative overflow-hidden">
      <StarfieldNight density={0.7} />

      <div className="relative z-30">
        <TopBar />
      </div>

      {/* Sub-header with drawer + back */}
      <div className="relative z-20 flex items-center gap-2 px-4 sm:px-6 pt-1 pb-2 animate-fade-in">
        <Link
          to="/"
          aria-label="Back to home"
          className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="sm:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all active:scale-95"
        >
          <Menu className="w-4 h-4" />
        </button>
        <span className="ml-1 text-[10px] font-mono uppercase tracking-[0.25em] text-white/40">
          Bee AI · CEO Channel
        </span>
      </div>

      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main className="relative z-10 flex-1 flex">
        <ChatCanvas />
      </main>
    </div>
  );
};

export default Index;
