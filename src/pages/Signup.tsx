import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthScene from "@/components/AuthScene";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords don't match" });
      return;
    }
    if (password.length < 6) {
      toast({ variant: "destructive", title: "Password must be at least 6 characters" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      toast({ variant: "destructive", title: "Sign up failed", description: error.message });
    } else {
      toast({ title: "Check your email 📧", description: "We sent you a confirmation link." });
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <AuthScene
      title="Join Beee AI"
      subtitle="Launch your AI agent crew in seconds"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-bee-blue hover:underline">Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs uppercase tracking-wider text-white/60">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              id="email"
              type="email"
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
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-bee-blue/40 focus-visible:border-bee-blue/40"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wider text-white/60">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-bee-blue/40 focus-visible:border-bee-blue/40"
              required
            />
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
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
          Create account
        </Button>
      </form>
    </AuthScene>
  );
};

export default Signup;
