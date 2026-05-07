import { Link } from "react-router-dom";
import { useBeeCoins } from "@/hooks/use-bee-coins";
import { useAuth } from "@/hooks/use-auth";

const BeeCoinBadge = () => {
  const { user } = useAuth();
  const { balance } = useBeeCoins();
  if (!user) return null;

  return (
    <Link
      to="/recharge"
      title="Bee Coins balance — click to recharge"
      className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white overflow-hidden isolate transition-all hover:-translate-y-[1px] active:translate-y-[2px] active:scale-95"
      style={{
        background: "linear-gradient(180deg, hsl(45,100%,55%,0.35), hsl(45,100%,40%,0.10) 55%, hsl(0 0% 100% / 0.04))",
        border: "1px solid hsl(45,100%,65%,0.55)",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.35), inset 0 -1px 0 hsl(0 0% 0% / 0.25), 0 6px 18px -8px hsl(45,100%,55%,0.7)",
      }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full opacity-70"
        style={{ background: "linear-gradient(180deg, hsl(0 0% 100% / 0.35), transparent)" }} />
      <span className="relative z-10 text-base leading-none">🐝</span>
      <span className="relative z-10 tabular-nums">{balance.toFixed(balance % 1 === 0 ? 0 : 2)}</span>
      <span className="relative z-10 hidden sm:inline opacity-80">coins</span>
    </Link>
  );
};

export default BeeCoinBadge;
