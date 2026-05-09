import { useState } from "react";
import { Link } from "react-router-dom";
import { Bitcoin, CreditCard, Sparkles, Check, ArrowLeft } from "lucide-react";
import TopBar from "@/components/TopBar";
import SpaceBackground from "@/components/SpaceBackground";
import { useAuth } from "@/hooks/use-auth";
import { useBeeCoins, COIN_COSTS } from "@/hooks/use-bee-coins";
import { toast } from "@/hooks/use-toast";

const PACKS = [
  { coins: 100, price: 15, label: "Starter", perk: "Try every agent" },
  { coins: 200, price: 25, label: "Buzzing", perk: "Save 17%", highlight: false },
  { coins: 500, price: 50, label: "Hive Power", perk: "Save 33%", highlight: true },
];

const Recharge = () => {
  const { user } = useAuth();
  const { balance } = useBeeCoins();
  const [selected, setSelected] = useState<number>(500);

  const handleBuy = (method: "stripe" | "crypto") => {
    if (!user) {
      toast({ variant: "destructive", title: "Sign in required", description: "Please log in to buy Bee Coins." });
      return;
    }
    toast({
      title: `${method === "stripe" ? "Card" : "Crypto"} checkout coming soon 🐝`,
      description: `You selected the ${selected} Bee Coins pack. Real payments will be wired up next.`,
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />
      <div className="relative z-10">
        <TopBar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <Link to="/bee-ai" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <header className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bee/15 text-bee border border-bee/30 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Bee Coins Wallet
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold bg-gradient-to-r from-[hsl(40,100%,65%)] via-[hsl(195,100%,75%)] to-[hsl(230,100%,75%)] bg-clip-text text-transparent">
              Recharge your hive
            </h1>
            <p className="mt-3 text-white/70 max-w-xl mx-auto">
              Bee Coins fuel every agent on Quantum Bee. Top up once, spend across Bee AI, Sophia, Anna, Jack and more.
            </p>
            {user && (
              <p className="mt-4 text-sm">
                <span className="text-white/60">Current balance:</span>{" "}
                <span className="text-bee font-bold text-lg">🐝 {balance.toFixed(balance % 1 === 0 ? 0 : 2)} coins</span>
              </p>
            )}
          </header>

          {/* Packs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {PACKS.map((p) => {
              const active = selected === p.coins;
              return (
                <button
                  key={p.coins}
                  onClick={() => setSelected(p.coins)}
                  className={`relative text-left p-5 rounded-2xl border transition-all overflow-hidden ${
                    active
                      ? "border-bee bg-bee/10 -translate-y-1"
                      : "border-white/15 bg-white/5 hover:border-white/30 hover:-translate-y-0.5"
                  }`}
                  style={{ backdropFilter: "blur(20px)" }}
                >
                  {p.highlight && (
                    <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-bee to-bee-blue text-slate-900 font-bold">
                      MOST POPULAR
                    </span>
                  )}
                  <p className="text-xs text-white/60 uppercase tracking-wider">{p.label}</p>
                  <p className="mt-2 text-3xl font-heading font-bold text-white flex items-baseline gap-1">
                    🐝 {p.coins}
                  </p>
                  <p className="text-xs text-white/50 mt-1">Bee Coins</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-2xl font-bold text-bee">${p.price}</p>
                    <p className="text-xs text-bee-blue font-semibold">{p.perk}</p>
                  </div>
                  {active && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-bee text-slate-900 grid place-items-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Payment methods */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => handleBuy("stripe")}
              className="group flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[hsl(210,100%,60%)] to-[hsl(230,100%,65%)] text-white font-semibold hover:brightness-110 transition-all active:scale-95 shadow-[0_0_30px_-5px_hsl(210,100%,60%,0.6)]"
            >
              <CreditCard className="w-5 h-5" />
              Pay with Card (Stripe)
            </button>
            <button
              onClick={() => handleBuy("crypto")}
              className="group flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[hsl(35,100%,55%)] to-[hsl(45,100%,60%)] text-slate-900 font-semibold hover:brightness-110 transition-all active:scale-95 shadow-[0_0_30px_-5px_hsl(45,100%,55%,0.7)]"
            >
              <Bitcoin className="w-5 h-5" />
              Pay with Crypto
            </button>
          </div>

          {/* Cost guide */}
          <section className="mt-12 p-6 rounded-2xl border border-white/10 bg-white/5 max-w-2xl mx-auto" style={{ backdropFilter: "blur(20px)" }}>
            <h3 className="font-heading text-lg text-bee-blue mb-3">How coins are spent</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex justify-between"><span>Bee AI chat (no agent)</span><span className="text-bee font-semibold">{COIN_COSTS.beeAiChat} 🐝 / message</span></li>
              <li className="flex justify-between"><span>Sophia — image generation</span><span className="text-bee font-semibold">{COIN_COSTS.sophiaImage} 🐝 / image</span></li>
              <li className="flex justify-between"><span>Anna — leads (per 1,000)</span><span className="text-bee font-semibold">{COIN_COSTS.annaLeads1k} 🐝 / 1000 leads</span></li>
              <li className="flex justify-between text-white/50 italic"><span>More agents</span><span>coming soon</span></li>
            </ul>
            <p className="mt-4 text-xs text-white/50">🎁 New users get <span className="text-bee font-bold">50 free Bee Coins</span> on signup.</p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Recharge;
