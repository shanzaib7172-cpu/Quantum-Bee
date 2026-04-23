import { useState, useRef } from "react";
import { ArrowLeft, Upload, Camera, Sparkles, Download, Loader2, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import beeLogo from "@/assets/bee-logo.png";
import sophiaCharacter from "@/assets/sophia-character.png";

const PRODUCT_SHOOT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/product-shoot`;

const styles = [
  { id: "studio", label: "Studio", emoji: "📸" },
  { id: "lifestyle", label: "Lifestyle", emoji: "🏡" },
  { id: "outdoor", label: "Outdoor", emoji: "🌿" },
  { id: "model", label: "Model", emoji: "👤" },
  { id: "flat-lay", label: "Flat Lay", emoji: "🎨" },
];

const ProductShoot = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("studio");
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ variant: "destructive", title: "Invalid file", description: "Please upload an image file." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File too large", description: "Max 10MB allowed." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
    setGeneratedImage(null);
  };

  const handleGenerate = async () => {
    if (!uploadedImage) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const resp = await fetch(PRODUCT_SHOOT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ imageBase64: uploadedImage, style: selectedStyle }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        toast({ variant: "destructive", title: "Generation Failed", description: data.error || "Something went wrong" });
        return;
      }

      setGeneratedImage(data.image);
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to connect to AI. Try again." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = `beee-product-shoot-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse at 20% 50%, hsl(45, 100%, 50%, 0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, hsl(var(--accent) / 0.03) 0%, transparent 50%)
        `,
      }} />

      {/* Header */}
      <header className="relative z-30 flex items-center gap-3 px-5 py-3 border-b border-border/50">
        <Link to="/" className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <img src={beeLogo} alt="Beee AI" className="w-7 h-7 object-contain" />
        <div>
          <h1 className="text-base font-heading font-semibold text-gradient">Sophia — Product Shoot AI</h1>
          <p className="text-[10px] text-muted-foreground">Transform product images into pro model shoots</p>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-3xl space-y-6">

          {/* Sophia Character — futuristic animated avatar */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full opacity-40"
                style={{
                  background: "radial-gradient(circle, hsl(45, 100%, 50%, 0.35) 0%, transparent 70%)",
                  animation: "orb-pulse 3s ease-in-out infinite",
                }}
              />
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
              <img
                src={sophiaCharacter}
                alt="Sophia AI Product Shoot Agent"
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
              <h2 className="text-xl font-heading font-semibold text-foreground">Sophia Product Shoot Agent</h2>
              <p className="text-xs text-muted-foreground mt-1">Upload your product below — Sophia turns it into a pro shoot.</p>
              <p className="text-[11px] text-bee mt-1 font-medium">$20 / month · Unlimited shoots</p>
            </div>
          </div>

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="glass glass-highlight rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/30 transition-all border-2 border-dashed border-border/50 hover:border-bee/30 min-h-[200px]"
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            {uploadedImage ? (
              <img src={uploadedImage} alt="Uploaded product" className="max-h-[250px] rounded-xl object-contain" />
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-bee/10 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-bee" />
                </div>
                <p className="text-sm font-medium text-foreground">Upload your product image</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB — click or drag</p>
              </>
            )}
          </div>

          {/* Style Selector */}
          {uploadedImage && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-bee" /> Choose Shoot Style
              </p>
              <div className="flex flex-wrap gap-2">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`px-4 py-2 rounded-xl text-sm transition-all ${
                      selectedStyle === s.id
                        ? "bg-bee/20 text-bee border border-bee/30 font-medium"
                        : "glass text-foreground/70 hover:bg-secondary/50"
                    }`}
                  >
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-12 bg-bee/15 text-bee border border-bee/20 hover:bg-bee/25 hover:border-bee/40 transition-all text-sm font-medium"
                variant="ghost"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating shoot... this may take a moment
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Product Shoot
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Result */}
          {generatedImage && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-bee" /> Generated Shoot
                </p>
                <Button onClick={handleDownload} size="sm" variant="ghost" className="text-xs text-bee hover:bg-bee/10 gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
              </div>
              <div className="glass glass-highlight rounded-2xl p-4">
                <img src={generatedImage} alt="AI product shoot" className="w-full rounded-xl object-contain max-h-[500px]" />
              </div>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="flex flex-col items-center py-8 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-bee/10 flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-bee" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Sophia is working her magic... 🐝✨</p>
              <p className="text-xs text-muted-foreground/50 mt-1">This usually takes 10-30 seconds</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductShoot;
