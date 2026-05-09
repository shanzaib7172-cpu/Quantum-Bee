import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LogIn, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthScene from "@/components/AuthScene";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    // Special admin username login
    const trimmed = email.trim().toLowerCase();
    if (trimmed === "beemanshanzaib") {
      const { data, error: fnErr } = await supabase.functions.invoke("ensure-admin", {
        body: { username: "beemanshanzaib", password },
      });
      if (fnErr || !data?.ok) {
        toast({ variant: "destructive", title: "Login failed", description: (data as any)?.error ?? fnErr?.message ?? "Invalid credentials" });
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email: data.email, password });
      if (error) {
        toast({ variant: "destructive", title: "Login failed", description: error.message });
      } else {
        toast({ title: "Welcome back, Admin 🐝" });
        navigate("/");
      }
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ variant: "destructive", title: "Login failed", description: error.message });
    } else {
      toast({ title: "Welcome back! 🐝" });
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <AuthScene
      title="Re-enter Planet Bee"
      subtitle="Sign in to your hive command center"
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" className="text-bee-blue hover:underline">Sign up</Link>
        </>
      }
    >
      <div className="space-y-4">
        <GoogleSignInButton />
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/40">
          <span className="flex-1 h-px bg-white/10" /> or <span className="flex-1 h-px bg-white/10" />
        </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs uppercase tracking-wider text-white/60">Email or username</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              id="email"
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-bee-blue/40 focus-visible:border-bee-blue/40"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs uppercase tracking-wider text-white/60">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-bee-blue/40 focus-visible:border-bee-blue/40"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-2 text-sm font-semibold border-0 text-white relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, hsl(200 100% 55%), hsl(220 100% 50%) 60%, hsl(260 90% 55%))",
            boxShadow:
              "0 10px 30px hsl(220 100% 40% / 0.5), inset 0 1px 0 hsl(200 100% 90% / 0.4)",
          }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
          Sign in
        </Button>
      </form>
      </div>
    </AuthScene>
  );
};

export default Login;
