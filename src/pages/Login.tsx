import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import beeLogo from "@/assets/bee-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden px-4">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, hsl(45, 100%, 50%, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, hsl(var(--accent) / 0.03) 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <img src={beeLogo} alt="Beee AI" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-heading font-semibold text-gradient">Welcome back</h1>
        </div>

        <form onSubmit={handleLogin} className="glass glass-highlight rounded-2xl p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-foreground/80">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/50 border-border/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-foreground/80">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary/50 border-border/50"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-bee/15 text-bee border border-bee/20 hover:bg-bee/25 hover:border-bee/40"
            variant="ghost"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
            Sign in
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-bee hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
