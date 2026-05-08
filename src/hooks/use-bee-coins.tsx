import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

export const COIN_COSTS = {
  beeAiChat: 0.3,
  sophiaImage: 1,
  annaLeads1k: 10,
} as const;

export function useBeeCoins() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setBalance(0); setLoading(false); return; }
    const { data } = await supabase
      .from("bee_coin_balances")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle();
    setBalance(Number(data?.balance ?? 0));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
    if (!user) return;
    const ch = supabase
      .channel(`bee_coin_balance:${user.id}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bee_coin_balances", filter: `user_id=eq.${user.id}` },
        (payload: any) => {
          if (payload.new?.balance != null) setBalance(Number(payload.new.balance));
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, refresh]);

  /** Returns true on success, false if insufficient or unauthenticated. */
  const deduct = useCallback(
    async (amount: number, reason: string, agent?: string) => {
      if (!user) {
        toast({ variant: "destructive", title: "Sign in required", description: "Log in to use this agent." });
        return false;
      }
      if (balance < amount) {
        toast({
          variant: "destructive",
          title: "Not enough Bee Coins 🐝",
          description: `This costs ${amount} coins. Recharge to continue.`,
        });
        return false;
      }
      const { data, error } = await supabase.rpc("deduct_bee_coins", {
        _amount: amount,
        _reason: reason,
        _agent: agent ?? null,
      });
      if (error || data === false) {
        toast({ variant: "destructive", title: "Coin deduction failed", description: error?.message ?? "Insufficient balance." });
        return false;
      }
      return true;
    },
    [user, balance],
  );

  return { balance, loading, refresh, deduct };
}
