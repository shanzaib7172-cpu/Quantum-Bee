import { useState } from "react";
import { Loader2 } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const GoogleSignInButton = ({ label = "Continue with Google" }: { label?: string }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onClick = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast({ variant: "destructive", title: "Google sign-in failed", description: String((result.error as any).message ?? result.error) });
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    toast({ title: "Welcome! 🐝" });
    navigate("/");
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full h-11 rounded-md flex items-center justify-center gap-2.5 text-sm font-medium text-white/90 transition-all"
      style={{
        background: "linear-gradient(180deg, hsl(220 30% 14%), hsl(220 40% 8%))",
        border: "1px solid hsl(200 100% 70% / 0.2)",
        boxShadow: "inset 0 1px 0 hsl(200 100% 80% / 0.1), 0 6px 18px hsl(220 100% 20% / 0.4)",
      }}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.1 14.7 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c6.9 0 9.5-4.8 9.5-7.3 0-.5-.05-.9-.13-1.3H12z" />
        </svg>
      )}
      {label}
    </button>
  );
};

export default GoogleSignInButton;
