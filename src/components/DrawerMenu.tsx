import { useState } from "react";
import {
  Sparkles,
  Search,
  Store,
  History,
  Plus,
  Link as LinkIcon,
  ChevronRight,
  X,
  Bot,
  Zap,
  Brain,
  Eye,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const agentCards = [
  { name: "Mike", desc: "Marketing Expert", icon: Zap, price: "$20" },
  { name: "Peter", desc: "Product image & UGC ads video", icon: Eye, price: "$20" },
  { name: "Mark", desc: "Business Management", icon: Brain, price: "$20" },
  { name: "Anna", desc: "Leads Generator", icon: Bot, price: "$20", link: "/leads-generator" },
  { name: "Sofia", desc: "Product Model Shoot AI", icon: Camera, price: "$20", link: "/product-shoot" },
];

const visionHistory = [
  { title: "Marketing strategy analysis", time: "2 hours ago" },
  { title: "Product redesign concepts", time: "Yesterday" },
  { title: "Competitor landscape map", time: "3 days ago" },
  { title: "Q1 revenue forecast", time: "1 week ago" },
];

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

const DrawerMenu = ({ open, onClose }: DrawerMenuProps) => {
  const [analyzeUrl, setAnalyzeUrl] = useState("");
  const navigate = useNavigate();

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
          <button className="w-full flex items-center gap-3 p-3 rounded-xl glass glass-highlight hover:bg-secondary/50 transition-all group">
            <div className="w-9 h-9 rounded-lg bg-bee/10 flex items-center justify-center group-hover:bg-bee/20 transition-colors">
              <Plus className="w-4 h-4 text-bee" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">New Vision</p>
              <p className="text-xs text-muted-foreground">Start a fresh conversation</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

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
                  className="pl-9 bg-secondary/50 border-border/50 text-sm h-9 placeholder:text-muted-foreground/60"
                />
              </div>
              <Button
                size="sm"
                className="w-full h-8 text-xs bg-bee/15 text-bee border border-bee/20 hover:bg-bee/25 hover:border-bee/40 transition-all"
                variant="ghost"
              >
                <Sparkles className="w-3 h-3 mr-1.5" />
                Analyze
              </Button>
            </div>
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
                    if ((agent as any).link) {
                      onClose();
                      navigate((agent as any).link);
                    }
                  }}
                  className="glass rounded-xl p-3 hover:bg-secondary/40 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 text-[10px] font-mono font-medium text-bee bg-bee/10 px-1.5 py-0.5 rounded-md">
                    {agent.price}
                  </div>
                  <agent.icon className="w-5 h-5 text-accent mb-2 group-hover:text-bee transition-colors" />
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
              {visionHistory.map((item, i) => (
                <button
                  key={i}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-secondary/40 transition-colors group"
                >
                  <p className="text-sm text-foreground/80 group-hover:text-foreground truncate transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { DrawerMenu };
