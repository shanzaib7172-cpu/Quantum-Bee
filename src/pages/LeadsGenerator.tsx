import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, Loader2, Bot, Save, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import beeLogo from "@/assets/bee-logo.png";

const STORAGE_KEY = "beee_n8n_webhook_url";

const LeadsGenerator = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [audience, setAudience] = useState("");
  const [location, setLocation] = useState("");
  const [count, setCount] = useState("10");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setWebhookUrl(saved);
  }, []);

  const handleSaveWebhook = () => {
    localStorage.setItem(STORAGE_KEY, webhookUrl);
    toast({ title: "Webhook saved", description: "Your n8n webhook URL is stored locally." });
  };

  const handleGenerate = async () => {
    if (!webhookUrl) {
      toast({ variant: "destructive", title: "Missing webhook", description: "Paste your n8n webhook URL first." });
      return;
    }
    if (!industry && !audience) {
      toast({ variant: "destructive", title: "Missing input", description: "Add at least industry or target audience." });
      return;
    }

    setIsLoading(true);
    setResult(null);

    const payload = {
      industry,
      target_audience: audience,
      location,
      count: parseInt(count) || 10,
      notes,
      timestamp: new Date().toISOString(),
      source: "Beee AI - Anna Leads Generator",
    };

    try {
      const resp = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify(payload),
      });

      const text = await resp.text();
      let data: any;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }

      if (!resp.ok) {
        toast({ variant: "destructive", title: `Workflow error (${resp.status})`, description: text.slice(0, 200) || "n8n returned an error" });
        return;
      }

      setResult(data);
      toast({ title: "Leads generated! 🎯", description: "Anna delivered fresh leads from your n8n workflow." });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Could not reach n8n. Check the webhook URL and CORS settings on your n8n instance.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `beee-leads-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse at 20% 50%, hsl(45, 100%, 50%, 0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, hsl(var(--accent) / 0.03) 0%, transparent 50%)
        `,
      }} />

      <header className="relative z-30 flex items-center gap-3 px-5 py-3 border-b border-border/50">
        <Link to="/" className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <img src={beeLogo} alt="Beee AI" className="w-7 h-7 object-contain" />
        <div>
          <h1 className="text-base font-heading font-semibold text-gradient">Anna — Leads Generator</h1>
          <p className="text-[10px] text-muted-foreground">Powered by your n8n workflow</p>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-6">

          {/* Webhook Setup */}
          <div className="glass glass-highlight rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-bee" />
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                n8n Webhook URL
              </Label>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="https://your-n8n.app/webhook/leads..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="bg-secondary/50 border-border/50 text-sm h-10 flex-1"
              />
              <Button
                onClick={handleSaveWebhook}
                size="sm"
                variant="ghost"
                className="bg-bee/10 text-bee hover:bg-bee/20 border border-bee/20 h-10"
              >
                <Save className="w-3.5 h-3.5" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              In n8n: add a <strong>Webhook</strong> trigger node (POST), copy the production URL, paste it here.
            </p>
          </div>

          {/* Lead Criteria */}
          <div className="glass glass-highlight rounded-2xl p-5 space-y-4">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-bee" /> Lead Criteria
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground/70">Industry</Label>
                <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. SaaS, e-commerce" className="bg-secondary/50 border-border/50 text-sm h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground/70">Target Audience</Label>
                <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. CTOs, marketing managers" className="bg-secondary/50 border-border/50 text-sm h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground/70">Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. United States, Europe" className="bg-secondary/50 border-border/50 text-sm h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground/70">Number of leads</Label>
                <Input type="number" value={count} onChange={(e) => setCount(e.target.value)} min="1" max="500" className="bg-secondary/50 border-border/50 text-sm h-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/70">Extra notes (optional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything specific you want Anna to know..." className="bg-secondary/50 border-border/50 text-sm min-h-[70px]" />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full h-12 bg-bee/15 text-bee border border-bee/20 hover:bg-bee/25 hover:border-bee/40 transition-all text-sm font-medium"
              variant="ghost"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Anna is generating leads...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Generate Leads</>
              )}
            </Button>
          </div>

          {/* Result */}
          {result && (
            <div className="glass glass-highlight rounded-2xl p-5 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Leads Returned
                </Label>
                <Button onClick={handleDownload} size="sm" variant="ghost" className="text-xs text-bee hover:bg-bee/10 gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Download JSON
                </Button>
              </div>
              <pre className="text-xs bg-secondary/40 rounded-xl p-4 overflow-auto max-h-[400px] text-foreground/80 font-mono">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LeadsGenerator;
