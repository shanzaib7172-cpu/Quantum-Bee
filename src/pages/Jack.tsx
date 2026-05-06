import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, Loader2, Save, MessageCircle, Zap, Clock, Users, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import beeLogo from "@/assets/bee-logo.png";
import jackCharacter from "@/assets/jack-character.png";
import TopBar from "@/components/TopBar";
import SpaceBackground from "@/components/SpaceBackground";

const STORAGE_KEY = "beee_jack_webhook_url";

const Jack = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setWebhookUrl(saved);
  }, []);

  const handleSaveWebhook = () => {
    localStorage.setItem(STORAGE_KEY, webhookUrl);
    toast({ title: "Webhook saved", description: "Your WhatsApp automation webhook is stored locally." });
  };

  const handleSend = async () => {
    if (!webhookUrl) {
      toast({ variant: "destructive", title: "Missing webhook", description: "Paste your automation webhook URL first." });
      return;
    }
    if (!phone || !message) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please add a phone number and a message." });
      return;
    }
    setIsLoading(true);
    try {
      const resp = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify({
          phone,
          message,
          timestamp: new Date().toISOString(),
          source: "Bee AI - Jack WhatsApp Automation",
        }),
      });
      if (!resp.ok) {
        const t = await resp.text();
        toast({ variant: "destructive", title: `Workflow error (${resp.status})`, description: t.slice(0, 200) || "Webhook returned an error" });
        return;
      }
      toast({ title: "Message dispatched 📲", description: "Jack handed your message off to WhatsApp." });
      setMessage("");
    } catch (e) {
      toast({ variant: "destructive", title: "Connection failed", description: "Could not reach the automation. Check your webhook URL." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(220,60%,3%)] text-foreground relative overflow-hidden">
      <SpaceBackground density={0.9} rocks={0} blackhole={false} planets />
      <TopBar />
      <div className="relative z-30 flex items-center gap-3 px-5 py-2 border-b border-border/50 bg-[hsl(220,60%,3%)]/60">
        <Link to="/#agents" aria-label="Back to agents" className="glass-icon glass-icon-sm w-9 h-9 flex items-center justify-center rounded-full text-white active:scale-95 active:translate-y-[1px] transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <img src={beeLogo} alt="Bee AI" className="w-6 h-6 object-contain" />
        <div>
          <h1 className="text-sm font-heading font-semibold text-gradient">Jack — WhatsApp Automation</h1>
          <p className="text-[10px] text-muted-foreground">Auto-replies, broadcasts & smart follow-ups</p>
        </div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-6">

          {/* Jack Character */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full opacity-40"
                style={{
                  background: "radial-gradient(circle, hsl(142, 70%, 45%, 0.35) 0%, transparent 70%)",
                  animation: "orb-pulse 3s ease-in-out infinite",
                }}
              />
              <div
                className="absolute w-40 h-40 rounded-full border border-bee/30"
                style={{
                  borderTopColor: "hsl(142, 70%, 50%)",
                  borderRightColor: "transparent",
                  animation: "spin 6s linear infinite",
                }}
              />
              <div
                className="absolute w-44 h-44 rounded-full border border-bee/15"
                style={{
                  borderBottomColor: "hsl(142, 70%, 50%, 0.5)",
                  borderLeftColor: "transparent",
                  animation: "spin 9s linear infinite reverse",
                }}
              />
              <img
                src={jackCharacter}
                alt="Jack WhatsApp Automation Agent"
                width={512}
                height={512}
                className="relative w-32 h-32 rounded-full object-cover z-10 border-2 border-bee/30"
                style={{
                  animation: "orb-float 4s ease-in-out infinite",
                  filter: "drop-shadow(0 0 18px hsl(142, 70%, 45%, 0.5))",
                }}
              />
              {/* WhatsApp badge */}
              <div className="absolute bottom-1 right-1 z-20 w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center border-2 border-background shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" fill="white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground flex items-center justify-center gap-2">
                Jack
                <BadgeCheck className="w-4 h-4 text-[#25D366]" />
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Your always-on WhatsApp ops agent.</p>
              <p className="text-[11px] text-bee mt-1 font-medium">$25 / month · Unlimited automation</p>
            </div>
          </div>

          {/* What Jack does */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { icon: Zap, title: "Instant Replies", desc: "Smart 24/7 auto-responders." },
              { icon: Users, title: "Broadcasts", desc: "Targeted bulk campaigns." },
              { icon: Clock, title: "Follow-ups", desc: "Sequences that close deals." },
            ].map((f) => (
              <div key={f.title} className="glass glass-highlight rounded-xl p-3 text-center border border-bee/15">
                <f.icon className="w-4 h-4 text-bee mx-auto mb-1" />
                <p className="text-xs font-medium text-foreground">{f.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Webhook */}
          <div className="glass glass-highlight rounded-2xl p-5 space-y-3">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Automation Webhook
            </Label>
            <div className="flex gap-2">
              <Input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-n8n.com/webhook/whatsapp..."
                className="bg-secondary/50 border-border/50 text-sm h-10 flex-1"
              />
              <Button onClick={handleSaveWebhook} variant="ghost" className="h-10 bg-bee/15 text-bee border border-bee/20 hover:bg-bee/25">
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Send a test */}
          <div className="glass glass-highlight rounded-2xl p-5 space-y-4">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> Send via Jack
            </Label>

            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/70">Phone number <span className="text-bee">*</span></Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 0100"
                className="bg-secondary/50 border-border/50 text-sm h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/70">Message <span className="text-bee">*</span></Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hey! Thanks for reaching out — Jack here from Beee AI..."
                className="bg-secondary/50 border-border/50 text-sm min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleSend}
              disabled={isLoading}
              className="w-full h-12 bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/25 hover:border-[#25D366]/50 transition-all text-sm font-medium"
              variant="ghost"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Jack is sending...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Send via WhatsApp</>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Jack;
