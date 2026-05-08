import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import beeLogo from "@/assets/bee-logo.png";
import SpaceBackground from "@/components/SpaceBackground";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

/**
 * Cinematic Planet Bee auth shell — deep space backdrop, Planet Bee orbiting Earth,
 * quantum particles, glassy registration card.
 */
const AuthScene = ({ title, subtitle, children, footer }: Props) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[hsl(228,40%,3%)] flex items-center justify-center px-4 py-10">
      <style>{`
        @keyframes pb-orbit       { to { transform: rotate(360deg); } }
        @keyframes pb-counter     { to { transform: rotate(-360deg); } }
        @keyframes pb-spin-slow   { to { transform: rotate(360deg); } }
        @keyframes pb-pulse       { 0%,100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
        @keyframes pb-bee-fly     { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(8px,-6px) rotate(-6deg); } }
        @keyframes q-float        { 0%,100% { transform: translateY(0) translateX(0); opacity: 0.4; } 50% { transform: translateY(-30px) translateX(10px); opacity: 1; } }
        @keyframes q-wave         { 0% { transform: scale(0.6); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes auth-card-in {
          0% { opacity: 0; transform: perspective(1200px) rotateX(14deg) translateY(40px); }
          100% { opacity: 1; transform: perspective(1200px) rotateX(0deg) translateY(0); }
        }
        @keyframes auth-float-bee { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
        @keyframes auth-shine     { 0% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(220%) skewX(-20deg); } }
        .auth-card { animation: auth-card-in 0.9s cubic-bezier(.2,.9,.3,1) forwards; transform-style: preserve-3d; }
      `}</style>

      {/* Deep space stars */}
      <SpaceBackground density={0.5} rocks={0} blackhole={false} planets={false} />

      {/* Planet Bee + Earth orbital system (background, behind card) */}
      <div
        className="absolute pointer-events-none opacity-70"
        style={{
          top: "50%",
          left: "50%",
          width: "min(900px, 110vw)",
          aspectRatio: "1 / 1",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* halo */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(45 100% 60% / 0.18) 0%, hsl(200 100% 55% / 0.12) 40%, transparent 72%)",
            filter: "blur(30px)",
            animation: "pb-pulse 6s ease-in-out infinite",
          }}
        />
        {/* orbit ring */}
        <div className="absolute rounded-full border" style={{ inset: "18%", borderColor: "hsl(45 100% 65% / 0.25)", borderStyle: "dashed" }} />
        <div className="absolute rounded-full border" style={{ inset: "4%", borderColor: "hsl(200 100% 70% / 0.2)", borderStyle: "dashed" }} />

        {/* Planet Bee — center */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: "30%",
            aspectRatio: "1 / 1",
            transform: "translate(-50%, -50%)",
            animation: "pb-spin-slow 90s linear infinite",
          }}
        >
          <div
            className="absolute -inset-6 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(45 100% 60% / 0.55), transparent 70%)",
              filter: "blur(22px)",
            }}
          />
          <div
            className="relative w-full h-full rounded-full overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, hsl(52 100% 92%) 0%, hsl(48 100% 70%) 25%, hsl(42 100% 55%) 55%, hsl(32 95% 38%) 85%, hsl(22 80% 18%) 100%)",
              boxShadow:
                "0 0 70px hsl(45 100% 60% / 0.7), inset -20px -22px 60px rgba(0,0,0,0.7), inset 12px 12px 30px hsl(0 0% 100% / 0.25)",
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0 18px, hsl(0 0% 4% / 0.88) 18px 32px, transparent 32px 46px)",
                mixBlendMode: "overlay",
                opacity: 0.92,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                inset: "8% 55% 60% 12%",
                background: "radial-gradient(ellipse, hsl(0 0% 100% / 0.55), transparent 75%)",
              }}
            />
          </div>
        </div>

        {/* Earth orbiting */}
        <div className="absolute inset-0" style={{ animation: "pb-orbit 30s linear infinite" }}>
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "92%",
              width: 70,
              height: 70,
              transform: "translate(-50%, -50%)",
              animation: "pb-counter 30s linear infinite",
            }}
          >
            <div
              className="absolute -inset-4 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(200 100% 60% / 0.55), transparent 70%)",
                filter: "blur(10px)",
              }}
            />
            <div
              className="relative w-full h-full rounded-full overflow-hidden"
              style={{
                background:
                  "radial-gradient(circle at 30% 28%, hsl(200 100% 88%) 0%, hsl(210 90% 55%) 35%, hsl(220 80% 30%) 75%, hsl(230 70% 12%) 100%)",
                boxShadow:
                  "0 0 30px hsl(200 100% 60% / 0.7), inset -8px -8px 18px rgba(0,0,0,0.65), inset 4px 4px 10px hsl(0 0% 100% / 0.3)",
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse at 30% 40%, hsl(120 50% 35% / 0.85) 0 8px, transparent 11px), radial-gradient(ellipse at 65% 30%, hsl(120 50% 35% / 0.85) 0 6px, transparent 9px), radial-gradient(ellipse at 55% 70%, hsl(120 50% 35% / 0.85) 0 7px, transparent 10px)",
                }}
              />
            </div>
          </div>
        </div>

        {/* tiny bees along link */}
        <div className="absolute inset-0" style={{ animation: "pb-orbit 30s linear infinite" }}>
          {[0.15, 0.4, 0.65].map((t, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: "50%",
                left: `${50 + t * 42}%`,
                transform: "translate(-50%,-50%)",
                animation: `pb-bee-fly ${1.6 + i * 0.3}s ease-in-out infinite`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, hsl(50 100% 88%), hsl(40 100% 55%) 70%, hsl(28 90% 25%))",
                  boxShadow: "0 0 8px hsl(45 100% 60% / 0.9)",
                }}
              />
            </div>
          ))}
        </div>

        {/* energy ribbon */}
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            width: "42%",
            height: 2,
            transform: "translate(0, -50%)",
            background:
              "linear-gradient(90deg, hsl(45 100% 65% / 0.85), hsl(195 100% 70% / 0.7) 60%, hsl(200 100% 75% / 0.4))",
            boxShadow: "0 0 10px hsl(45 100% 65% / 0.6)",
            transformOrigin: "0% 50%",
            animation: "pb-orbit 30s linear infinite",
          }}
        />
      </div>

      {/* Quantum particles */}
      {Array.from({ length: 18 }).map((_, i) => {
        const left = (i * 53) % 100;
        const top = (i * 37) % 100;
        const dur = 4 + ((i * 7) % 6);
        const delay = (i % 5) * 0.6;
        const hue = i % 2 === 0 ? 200 : 45;
        return (
          <span
            key={i}
            className="absolute pointer-events-none rounded-full"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: 4,
              height: 4,
              background: `hsl(${hue} 100% 75%)`,
              boxShadow: `0 0 10px hsl(${hue} 100% 70%), 0 0 20px hsl(${hue} 100% 60% / 0.6)`,
              animation: `q-float ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}

      {/* Quantum wave rings */}
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={`w-${i}`}
          className="absolute pointer-events-none rounded-full border"
          style={{
            top: "50%",
            left: "50%",
            width: 200,
            height: 200,
            transform: "translate(-50%,-50%)",
            borderColor: "hsl(200 100% 70% / 0.25)",
            animation: `q-wave 4s ease-out ${i * 1.3}s infinite`,
          }}
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, hsl(228 70% 2% / 0.85) 100%)",
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
                  "radial-gradient(circle, hsl(45 100% 60% / 0.55), transparent 70%)",
                filter: "blur(10px)",
              }}
            />
            <img
              src={beeLogo}
              alt="Planet Bee"
              className="relative w-full h-full object-contain drop-shadow-[0_0_22px_hsl(45_100%_60%/0.8)]"
            />
          </div>
          <p className="font-mono text-[10px] tracking-[0.32em] text-[hsl(45,100%,75%)] uppercase mb-2">
            Register on Planet Bee
          </p>
          <h1 className="text-3xl font-heading font-semibold text-white text-center tracking-tight bg-gradient-to-r from-[hsl(45,100%,70%)] via-white to-[hsl(195,100%,75%)] bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-sm text-white/65 mt-1 text-center">{subtitle}</p>
        </div>

        <div
          className="relative rounded-2xl p-6 sm:p-7 overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, hsl(228 50% 10% / 0.7), hsl(230 70% 5% / 0.88))",
            border: "1px solid hsl(45 100% 65% / 0.22)",
            boxShadow:
              "0 20px 60px hsl(220 100% 20% / 0.5), inset 0 1px 0 hsl(45 100% 80% / 0.15), 0 0 80px hsl(45 100% 55% / 0.18)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <span
            className="absolute top-0 left-0 h-full w-1/3 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, hsl(45 100% 90% / 0.12), transparent)",
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
