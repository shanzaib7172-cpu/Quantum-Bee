import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import beeLogo from "@/assets/bee-logo.png";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

/**
 * Cinematic 3D auth shell — animated grid floor, glowing orb, parallax cards,
 * floating bee logo. Wraps any auth form (login / signup / reset).
 */
const AuthScene = ({ title, subtitle, children, footer }: Props) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[hsl(230_60%_4%)] flex items-center justify-center px-4 py-10">
      <style>{`
        @keyframes auth-orb {
          0%,100% { transform: translate(-50%,-50%) scale(1); filter: blur(40px) brightness(1); }
          50%     { transform: translate(-50%,-50%) scale(1.12); filter: blur(50px) brightness(1.25); }
        }
        @keyframes auth-bolt {
          0%   { opacity: 0; transform: rotate(var(--ang)) scaleX(0.2); }
          15%  { opacity: 1; }
          55%  { opacity: 0; transform: rotate(var(--ang)) scaleX(1); }
          100% { opacity: 0; }
        }
        @keyframes auth-grid {
          0% { background-position: 0 0; }
          100% { background-position: 0 80px; }
        }
        @keyframes auth-card-in {
          0% { opacity: 0; transform: perspective(1200px) rotateX(18deg) translateY(40px); }
          100% { opacity: 1; transform: perspective(1200px) rotateX(0deg) translateY(0); }
        }
        @keyframes auth-float-bee {
          0%,100% { transform: translateY(0) rotate(-3deg); }
          50%     { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes auth-shine {
          0%   { transform: translateX(-120%) skewX(-20deg); }
          100% { transform: translateX(220%)  skewX(-20deg); }
        }
        .auth-card {
          animation: auth-card-in 0.9s cubic-bezier(.2,.9,.3,1) forwards;
          transform-style: preserve-3d;
        }
      `}</style>

      {/* Perspective grid floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55vh] pointer-events-none"
        style={{
          transform: "perspective(900px) rotateX(68deg)",
          transformOrigin: "50% 0",
          backgroundImage:
            "linear-gradient(to right, hsl(200 100% 65% / 0.35) 1px, transparent 1px), linear-gradient(to bottom, hsl(220 100% 65% / 0.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "linear-gradient(to bottom, transparent 0%, #000 35%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 35%, transparent 100%)",
          animation: "auth-grid 6s linear infinite",
        }}
      />

      {/* Glowing blue orb */}
      <div
        className="absolute top-[38%] left-1/2 w-[55vmin] h-[55vmin] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(200 100% 70%) 0%, hsl(220 100% 50% / 0.55) 35%, transparent 70%)",
          animation: "auth-orb 5s ease-in-out infinite",
        }}
      />

      {/* Lightning bolts */}
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="absolute top-[38%] left-1/2 origin-left rounded-full pointer-events-none"
          style={{
            width: "min(40vmin,460px)",
            height: 1.5,
            background:
              "linear-gradient(90deg, hsl(190 100% 90%), hsl(220 100% 60% / 0.6) 60%, transparent)",
            boxShadow:
              "0 0 8px hsl(200 100% 80%), 0 0 18px hsl(220 100% 55%)",
            // @ts-expect-error css var
            "--ang": `${(i / 10) * 360}deg`,
            animation: `auth-bolt ${1.6 + (i % 4) * 0.4}s ease-out ${(i % 5) * 0.25}s infinite`,
          }}
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, hsl(230 70% 2% / 0.85) 100%)",
        }}
      />

      {/* Top back link */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md auth-card">
        <div className="flex flex-col items-center mb-6">
          <div
            className="relative w-16 h-16 mb-4"
            style={{ animation: "auth-float-bee 4s ease-in-out infinite" }}
          >
            <div
              className="absolute inset-[-30%] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, hsl(45 100% 60% / 0.45), transparent 70%)",
                filter: "blur(8px)",
              }}
            />
            <img src={beeLogo} alt="Bee AI" className="relative w-full h-full object-contain drop-shadow-[0_0_20px_hsl(45_100%_60%/0.7)]" />
          </div>
          <h1 className="text-3xl font-heading font-semibold text-white text-center tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-white/60 mt-1 text-center">{subtitle}</p>
        </div>

        <div
          className="relative rounded-2xl p-6 sm:p-7 overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, hsl(220 60% 12% / 0.65), hsl(230 70% 6% / 0.85))",
            border: "1px solid hsl(200 100% 70% / 0.18)",
            boxShadow:
              "0 20px 60px hsl(220 100% 30% / 0.35), inset 0 1px 0 hsl(200 100% 80% / 0.12), 0 0 60px hsl(200 100% 55% / 0.18)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          {/* shine sweep */}
          <span
            className="absolute top-0 left-0 h-full w-1/3 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, hsl(200 100% 90% / 0.12), transparent)",
              animation: "auth-shine 6s ease-in-out infinite",
            }}
          />
          {children}
        </div>

        <div className="mt-6 text-center text-sm text-white/60">{footer}</div>
      </div>
    </div>
  );
};

export default AuthScene;
