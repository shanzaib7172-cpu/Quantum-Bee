import { useState } from "react";
import { Lock, Bell, Sparkles, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "beee_unlock_subscriptions";

interface UnlockSoonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: { name: string; desc: string; avatar: string } | null;
}

export const UnlockSoonDialog = ({ open, onOpenChange, agent }: UnlockSoonDialogProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? (JSON.parse(raw) as Array<{ agent: string; email: string; at: string }>) : [];
      list.push({ agent: agent.name, email: value, at: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* ignore storage errors */
    }

    setSubmitted(true);
    toast({
      title: `You're on the list 🐝`,
      description: `We'll email you the moment ${agent.name} is ready.`,
    });
  };

  const handleClose = (next: boolean) => {
    if (!next) {
      // reset on close
      setEmail("");
      setSubmitted(false);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass glass-highlight border-bee/20 sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {agent && (
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-bee/30 bg-secondary/40">
                <img
                  src={agent.avatar}
                  alt={`${agent.name} avatar`}
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
              </div>
            )}
            <div>
              <DialogTitle className="font-heading text-gradient">
                {agent?.name} is launching soon
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {agent?.desc}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {submitted ? (
          <div className="py-4 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-bee/15 mx-auto flex items-center justify-center">
              <Check className="w-7 h-7 text-bee" />
            </div>
            <p className="text-sm font-medium text-foreground">You're subscribed!</p>
            <p className="text-xs text-muted-foreground">
              We'll buzz you the moment <span className="text-bee">{agent?.name}</span> is unlocked.
            </p>
            <Button
              onClick={() => handleClose(false)}
              variant="ghost"
              className="mt-2 bg-bee/15 text-bee border border-bee/20 hover:bg-bee/25"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Drop your email and we'll send you an exclusive invite the day{" "}
              <span className="text-bee font-medium">{agent?.name}</span> goes live —
              plus an early-adopter discount.
            </p>

            <div className="space-y-1.5">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoFocus
                required
                className="bg-secondary/50 border-border/50 text-sm h-10"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-bee/15 text-bee border border-bee/20 hover:bg-bee/25 hover:border-bee/40 transition-all text-sm font-medium"
              variant="ghost"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notify me when {agent?.name} unlocks
            </Button>

            <p className="text-[10px] text-muted-foreground/70 text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-bee" />
              Early subscribers get launch-week pricing.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
