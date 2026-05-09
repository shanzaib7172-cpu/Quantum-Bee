import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import {
  Sparkles,
  Search,
  Store,
  History,
  Plus,
  Link as LinkIcon,
  ChevronRight,
  X,
  Lock,
  Loader2,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AnalysisResult, type AnalysisData } from "@/components/AnalysisResult";
import { UnlockSoonDialog } from "@/components/UnlockSoonDialog";
import annaCharacter from "@/assets/anna-character.png";
import sophiaCharacter from "@/assets/sophia-character.png";
import jackCharacter from "@/assets/jack-character.png";
import davidCharacter from "@/assets/david-character.png";
import markCharacter from "@/assets/mark-character.png";
import peterCharacter from "@/assets/peter-character.png";

type AgentCard = {
  name: string;
  desc: string;
  avatar: string;
  link?: string;
  locked?: boolean;
};

const agentCards: AgentCard[] = [
  { name: "Anna", desc: "Leads Generator", avatar: annaCharacter, link: "/leads-generator" },
  { name: "Sophia", desc: "Product Model Shoot AI", avatar: sophiaCharacter, link: "/product-shoot" },
  { name: "Jack", desc: "WhatsApp Automation", avatar: jackCharacter, link: "/jack" },
  { name: "David", desc: "Web Developer Agent", avatar: davidCharacter, locked: true },
  { name: "Mark", desc: "Business Management", avatar: markCharacter, locked: true },
  { name: "Peter", desc: "Product image & UGC ads", avatar: peterCharacter, locked: true },
];

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

const DrawerMenu = ({ open, onClose }: DrawerMenuProps) => {
  const [analyzeUrl, setAnalyzeUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [unlockAgent, setUnlockAgent] = useState<AgentCard | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const [chats, setChats] = useState<{ id: string; title: string; updated_at: string }[]>([]);

  useEffect(() => {
    if (!open || !user) return;
    supabase
      .from("chat_sessions")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setChats(data || []));
  }, [open, user]);

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const runAnalyze = async () => {
    if (!analyzeUrl.trim() || analyzing) return;
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-website", {
        body: { url: analyzeUrl.trim() },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setAnalysis(data as AnalysisData);
    } catch (e) {
      toast({
        title: "Analysis failed",
        description: e instanceof Error ? e.message : "Could not analyze the site",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 z-50 glass-strong glass-highlight flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold font-heading text-gradient">Bee AI</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* New Vision */}
          <button
            onClick={() => { onClose(); navigate("/bee-ai"); }}
            className="w-full flex items-center gap-3 p-3 rounded-xl glass glass-highlight hover:bg-secondary/50 active:scale-[0.98] transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-bee/10 flex items-center justify-center group-hover:bg-bee/20 transition-colors">
              <Plus className="w-4 h-4 text-bee" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">New Vision</p>
              <p className="text-xs text-muted-foreground">Start a fresh conversation</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {isAdmin && (
            <button
              onClick={() => { onClose(); navigate("/admin"); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl glass glass-highlight hover:bg-secondary/50 active:scale-[0.98] transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-bee/10 flex items-center justify-center group-hover:bg-bee/20 transition-colors">
                <Shield className="w-4 h-4 text-bee" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Admin Panel</p>
                <p className="text-xs text-muted-foreground">Quantum Bee control</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}

          {/* Analyze & Suggest */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Search className="w-3.5 h-3.5 text-bee" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Analyze & Suggest
              </span>
            </div>
            <div className="glass rounded-xl p-3 space-y-2.5">
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Paste URL to analyze..."
                  value={analyzeUrl}
                  onChange={(e) => setAnalyzeUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runAnalyze()}
                  disabled={analyzing}
                  className="pl-9 bg-secondary/50 border-border/50 text-sm h-9 placeholder:text-muted-foreground/60"
                />
              </div>
              <Button
                size="sm"
                onClick={runAnalyze}
                disabled={analyzing || !analyzeUrl.trim()}
                className="w-full h-8 text-xs bg-bee/15 text-bee border border-bee/20 hover:bg-bee/25 hover:border-bee/40 transition-all"
                variant="ghost"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                    Scanning website...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            {analysis && <AnalysisResult data={analysis} onClose={() => setAnalysis(null)} />}
          </div>

          <Separator className="bg-border/50" />

          {/* AI Agent Marketplace */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Store className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                AI Agent Marketplace
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {agentCards.map((agent) => (
                <div
                  key={agent.name}
                  onClick={() => {
                    if (agent.locked) {
                      setUnlockAgent(agent);
                      return;
                    }
                    if (agent.link) {
                      onClose();
                      navigate(agent.link);
                    }
                  }}
                  className={`glass rounded-xl p-3 transition-all duration-200 group relative overflow-hidden ${
                    agent.locked
                      ? "cursor-not-allowed opacity-70"
                      : "hover:bg-secondary/40 hover:-translate-y-0.5 hover:shadow-[0_0_20px_-4px_hsl(45_100%_55%/0.5)] active:scale-[0.96] cursor-pointer"
                  }`}
                >
                  {agent.locked && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-mono font-medium text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-md">
                      <Lock className="w-2.5 h-2.5" />
                      Soon
                    </div>
                  )}
                  <div className="relative w-10 h-10 mb-2 rounded-full overflow-hidden border border-bee/20 bg-secondary/40">
                    <img
                      src={agent.avatar}
                      alt={`${agent.name} avatar`}
                      width={64}
                      height={64}
                      loading="lazy"
                      className={`w-full h-full object-cover ${agent.locked ? "grayscale" : ""}`}
                    />
                    {agent.locked && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-foreground leading-tight">{agent.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{agent.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* My Visions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <History className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                My Visions
              </span>
            </div>
            <div className="space-y-1">
              {chats.length === 0 && (
                <p className="text-[10px] text-muted-foreground/60 px-2.5 py-2">
                  {user ? "No chats yet — start your first vision." : "Sign in to save your chats."}
                </p>
              )}
              {chats.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onClose();
                    navigate(`/bee-ai?chat=${item.id}`);
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-secondary/40 transition-colors group"
                >
                  <p className="text-sm text-foreground/80 group-hover:text-foreground truncate transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{formatTime(item.updated_at)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <UnlockSoonDialog
        open={!!unlockAgent}
        onOpenChange={(o) => !o && setUnlockAgent(null)}
        agent={unlockAgent}
      />
    </>
  );
};

export { DrawerMenu };
