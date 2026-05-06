import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, Loader2, Bot, Save, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import TopBar from "@/components/TopBar";
import SpaceBackground from "@/components/SpaceBackground";
import beeLogo from "@/assets/bee-logo.png";
import annaCharacter from "@/assets/anna-character.png";

const STORAGE_KEY = "beee_n8n_webhook_url";

const SENIORITY_OPTIONS = [
  "Founder",
  "Owner",
  "Director",
  "Partner",
  "Head",
  "Manager",
  "Senior",
  "Trainee",
];

const COMPANY_SIZE_OPTIONS = [
  "1-10",
  "11-20",
  "21-50",
  "51-100",
  "101-200",
  "201-500",
  "501-1000",
  "1001-2000",
];

const LeadsGenerator = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [seniority, setSeniority] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
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
    if (!seniority || !companySize || !industry || !country || !count) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please fill in all required fields." });
      return;
    }

    setIsLoading(true);
    setResult(null);

    const payload = {
      seniority_level: seniority,
      company_size: companySize,
      industry,
      country,
      count: parseInt(count) || 10,
      notes,
      timestamp: new Date().toISOString(),
      source: "Bee AI - Anna Leads Generator",
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
    a.download = `bee-leads-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(220,60%,3%)] text-foreground relative overflow-hidden">
      <SpaceBackground density={0.9} rocks={0} blackhole={false} planets />
      <TopBar />
      <div className="relative z-30 flex items-center gap-3 px-5 py-2 border-b border-border/50 bg-[hsl(220,60%,3%)]/60">
        <Link to="/bee-ai" aria-label="Back to agents" className="glass-icon glass-icon-sm w-9 h-9 flex items-center justify-center rounded-full text-white active:scale-95 active:translate-y-[1px] transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <img src={beeLogo} alt="Bee AI" className="w-6 h-6 object-contain" />
        <div>
          <h1 className="text-sm font-heading font-semibold text-gradient">Anna — Leads Generator</h1>
          <p className="text-[10px] text-muted-foreground">Powered by Bee AI</p>
        </div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-6">

          {/* Anna Character — futuristic animated avatar */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Outer aura */}
              <div
                className="absolute inset-0 rounded-full opacity-40"
                style={{
                  background: "radial-gradient(circle, hsl(45, 100%, 50%, 0.35) 0%, transparent 70%)",
                  animation: "orb-pulse 3s ease-in-out infinite",
                }}
              />
              {/* Rotating futuristic ring */}
              <div
                className="absolute w-40 h-40 rounded-full border border-bee/30"
                style={{
                  borderTopColor: "hsl(45, 100%, 60%)",
                  borderRightColor: "transparent",
                  animation: "spin 6s linear infinite",
                }}
              />
              <div
                className="absolute w-44 h-44 rounded-full border border-bee/15"
                style={{
                  borderBottomColor: "hsl(45, 100%, 60%, 0.5)",
                  borderLeftColor: "transparent",
                  animation: "spin 9s linear infinite reverse",
                }}
              />
              {/* Pulsing ring */}
              <div
                className="absolute w-36 h-36 rounded-full border border-bee/20"
                style={{ animation: "sound-ring 2.4s ease-out infinite" }}
              />
              {/* Anna image */}
              <img
                src={annaCharacter}
                alt="Anna AI Leads Agent"
                width={512}
                height={512}
                className="relative w-32 h-32 rounded-full object-cover z-10 border-2 border-bee/30"
                style={{
                  animation: "orb-float 4s ease-in-out infinite",
                  filter: "drop-shadow(0 0 18px hsl(45, 100%, 50%, 0.45))",
                }}
              />
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground">Anna Leads Agent</h2>
              <p className="text-xs text-muted-foreground mt-1">Fill the form to generate authentic leads...</p>
            </div>

            {/* Pricing tiers */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              {[
                { leads: "5,000 leads", price: "$50" },
                { leads: "20,000 leads", price: "$150" },
                { leads: "50,000 leads", price: "$300" },
              ].map((tier) => (
                <div
                  key={tier.leads}
                  className="glass glass-highlight rounded-xl p-3 text-center border border-bee/20"
                >
                  <p className="text-xs text-muted-foreground">{tier.leads}</p>
                  <p className="text-lg font-heading font-semibold text-bee mt-0.5">{tier.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Criteria */}
          <div className="glass glass-highlight rounded-2xl p-5 space-y-4">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-bee" /> Lead Criteria
            </Label>

            {/* Seniority */}
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/70">
                Seniority level <span className="text-bee">*</span>
              </Label>
              <Select value={seniority} onValueChange={setSeniority}>
                <SelectTrigger className="bg-secondary/50 border-border/50 text-sm h-10">
                  <SelectValue placeholder="Select an option ..." />
                </SelectTrigger>
                <SelectContent>
                  {SENIORITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Size */}
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/70">
                Company Size <span className="text-bee">*</span>
              </Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger className="bg-secondary/50 border-border/50 text-sm h-10">
                  <SelectValue placeholder="Select an option ..." />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Industry */}
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/70">
                Industry <span className="text-bee">*</span>
              </Label>
              <Input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. SaaS, e-commerce, fintech"
                className="bg-secondary/50 border-border/50 text-sm h-10"
              />
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/70">
                Country <span className="text-bee">*</span>
              </Label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. United States, Germany, India"
                className="bg-secondary/50 border-border/50 text-sm h-10"
              />
            </div>

            {/* Number of Leads */}
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/70">
                Number of Leads <span className="text-bee">*</span>
              </Label>
              <Input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                min="1"
                max="500"
                className="bg-secondary/50 border-border/50 text-sm h-10"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/70">Extra notes (optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything specific you want Anna to know..."
                className="bg-secondary/50 border-border/50 text-sm min-h-[70px]"
              />
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
