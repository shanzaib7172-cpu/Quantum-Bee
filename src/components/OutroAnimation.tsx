import { useEffect } from "react";
import cosmos from "@/assets/intro-cosmos.jpg";
import earth from "@/assets/intro-earth.jpg";

const TOTAL_MS = 5200;

interface Props {
  onDone: () => void;
}

const OutroAnimation = ({ onDone }: Props) => {
  useEffect(() => {
    const t = setTimeout(onDone, TOTAL_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  const stars = Array.from({ length: 140 }).map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    dur: 2 + Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black outro-fade-in" aria-hidden="true">
      <div className="intro-starfield">
        {stars.map((s) => (
          <span
            key={s.id}
            className="intro-star"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}
      </div>

      {/* ACT 1 (reverse): Earth — start huge & bright, shrink into singularity */}
      <div className="outro-act outro-act-earth">
        <img src={earth} alt="" className="outro-earth-img" />
        <div className="outro-earth-glow" />
        <div className="outro-tagline outro-tagline-1">
          <span className="outro-tagline-kicker">Boarding the signal</span>
          <span className="outro-tagline-line">Returning to the quantum core…</span>
        </div>
      </div>

      {/* Beam reversed */}
      <div className="outro-beam" />

      {/* ACT 2 (reverse): Cosmos vortex — appears as we plunge back in */}
      <div className="outro-act outro-act-cosmos">
        <img src={cosmos} alt="" className="outro-cosmos-img" />
        <div className="outro-vortex">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="outro-stream"
              style={{
                ["--angle" as any]: `${(i / 24) * 360}deg`,
                ["--delay" as any]: `${(i % 8) * 0.1}s`,
              } as React.CSSProperties}
            />
          ))}
          <div className="outro-singularity">
            <div className="outro-sing-halo" />
            <div className="outro-sing-ring" />
            <div className="outro-sing-core" />
          </div>
        </div>
        <div className="outro-tagline outro-tagline-2">
          <span className="outro-tagline-kicker">Welcome home</span>
          <span className="outro-tagline-line">Your hive awaits.</span>
        </div>
      </div>

      <div className="outro-light-flash" />

      <style>{`
        @keyframes outro-fade-in-kf { from { opacity: 0; } to { opacity: 1; } }
        .outro-fade-in { animation: outro-fade-in-kf 0.4s ease-out both; }

        .outro-act { position: absolute; inset: 0; opacity: 0; }

        /* ACT 1 — Earth shrinks from huge bright to small singularity */
        .outro-act-earth { z-index: 4; animation: outro-earth-life 3s ease-in 0s forwards; }
        @keyframes outro-earth-life {
          0%   { opacity: 0; transform: scale(8); filter: brightness(4); }
          12%  { opacity: 1; transform: scale(5); filter: brightness(2); }
          55%  { opacity: 1; transform: scale(0.6); filter: brightness(1); }
          100% { opacity: 0; transform: scale(0.25); filter: brightness(0.6); }
        }
        .outro-earth-img {
          position: absolute; top: 50%; left: 50%;
          width: min(70vmin, 700px); height: min(70vmin, 700px);
          object-fit: cover; border-radius: 50%;
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 0 60px hsl(200,100%,55%/0.7))
                  drop-shadow(0 0 120px hsl(220,80%,50%/0.5));
          animation: outro-earth-rotate 30s linear infinite reverse;
        }
        @keyframes outro-earth-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .outro-earth-glow {
          position: absolute; top: 50%; left: 50%;
          width: min(82vmin, 820px); height: min(82vmin, 820px);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle, transparent 40%, hsl(200,100%,60%/0.32) 50%, transparent 72%);
          animation: outro-earth-pulse 3s ease-in-out infinite;
        }
        @keyframes outro-earth-pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.05); }
        }

        /* Reversed beam: starts long, retracts to point */
        .outro-beam {
          position: absolute; top: 50%; left: 50%;
          width: 80vmax; height: 5px;
          transform-origin: 0 50%;
          transform: rotate(168deg);
          background: linear-gradient(90deg, hsl(200,100%,80%), hsl(220,100%,65%), hsl(190,100%,82%));
          box-shadow: 0 0 18px hsl(200,100%,70%), 0 0 50px hsl(220,100%,60%), 0 0 90px hsl(210,100%,65%);
          opacity: 0;
          animation: outro-beam-fire 1.3s cubic-bezier(0.7,0,0.3,1) 2.6s forwards;
          z-index: 3;
        }
        @keyframes outro-beam-fire {
          0%   { width: 80vmax; opacity: 0; }
          15%  { opacity: 1; }
          85%  { width: 0;     opacity: 1; }
          100% { width: 0;     opacity: 0; }
        }

        /* ACT 2 — Cosmos vortex emerges */
        .outro-act-cosmos { z-index: 2; animation: outro-cosmos-life 3s ease-out 2.4s forwards; }
        @keyframes outro-cosmos-life {
          0%   { opacity: 0; transform: scale(1.4); }
          25%  { opacity: 1; transform: scale(1.18); }
          88%  { opacity: 1; transform: scale(1.04); }
          100% { opacity: 0; transform: scale(1); }
        }
        .outro-cosmos-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.8) contrast(1.1) saturate(1.2);
        }
        .outro-vortex { position: absolute; left: 50%; top: 50%; width: 1px; height: 1px; }
        .outro-stream {
          position: absolute; top: 0; left: 0;
          width: 70vmax; height: 2px;
          transform-origin: 0 50%;
          transform: rotate(var(--angle));
          background: linear-gradient(90deg, transparent, hsl(200,100%,80%), hsl(220,100%,65%), transparent);
          opacity: 0; filter: blur(1px);
          animation: outro-stream-blow 2.4s ease-out var(--delay) infinite;
        }
        @keyframes outro-stream-blow {
          0%   { opacity: 0; transform: rotate(var(--angle)) scaleX(0.04); }
          25%  { opacity: 1; }
          100% { opacity: 0; transform: rotate(var(--angle)) scaleX(1); }
        }
        .outro-singularity {
          position: absolute; top: -110px; left: -110px;
          width: 220px; height: 220px;
        }
        .outro-sing-halo {
          position: absolute; inset: -40%; border-radius: 50%;
          background: radial-gradient(circle, transparent 30%, hsl(200,100%,55%/0.45) 45%, hsl(220,100%,50%/0.2) 60%, transparent 75%);
          filter: blur(10px);
          animation: outro-sing-pulse 2.4s ease-in-out infinite;
        }
        @keyframes outro-sing-pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50%      { transform: scale(1.12); opacity: 1; }
        }
        .outro-sing-ring {
          position: absolute; inset: 0; border-radius: 50%;
          background: conic-gradient(from 0deg, hsl(190,100%,80%), hsl(220,100%,55%), hsl(200,100%,70%), hsl(190,100%,80%));
          -webkit-mask: radial-gradient(circle, transparent 40%, #000 47%, #000 62%, transparent 72%);
                  mask: radial-gradient(circle, transparent 40%, #000 47%, #000 62%, transparent 72%);
          filter: blur(2px) brightness(1.4);
          animation: outro-sing-spin 4s linear infinite reverse;
        }
        .outro-sing-core {
          position: absolute; inset: 32%; border-radius: 50%;
          background: radial-gradient(circle, #fff 0%, hsl(195,100%,85%) 35%, hsl(210,100%,55%) 70%, hsl(230,80%,15%) 100%);
          box-shadow:
            0 0 60px hsl(200,100%,70%),
            0 0 140px hsl(220,100%,55%),
            inset 0 0 30px #fff;
          animation: outro-sing-pulse 1.6s ease-in-out infinite;
        }
        @keyframes outro-sing-spin { to { transform: rotate(360deg); } }

        /* Taglines */
        .outro-tagline {
          position: absolute; left: 50%; transform: translateX(-50%);
          text-align: center; font-family: 'Space Grotesk', sans-serif;
          color: white; opacity: 0; z-index: 6;
          padding: 0 1rem; width: min(92vw, 800px);
        }
        .outro-tagline-kicker {
          display: block; font-size: clamp(11px, 1.4vw, 14px);
          letter-spacing: 0.5em; text-transform: uppercase;
          color: hsl(200,100%,80%); margin-bottom: 0.6rem; opacity: 0.85;
        }
        .outro-tagline-line {
          display: block; font-size: clamp(22px, 4.2vw, 48px);
          font-weight: 300; letter-spacing: -0.01em; line-height: 1.15;
          background: linear-gradient(90deg, hsl(200,100%,82%), white 50%, hsl(220,100%,80%));
          -webkit-background-clip: text; background-clip: text;
          color: transparent;
          text-shadow: 0 0 40px hsl(210,80%,60%/0.6);
        }
        .outro-tagline-1 { top: 14%; animation: outro-tag-in 2.4s ease-out 0.2s forwards; }
        .outro-tagline-2 { top: 18%; animation: outro-tag-in 2.4s ease-out 2.6s forwards; }
        @keyframes outro-tag-in {
          0%   { opacity: 0; transform: translate(-50%, 20px); filter: blur(8px); }
          25%  { opacity: 1; transform: translate(-50%, 0);    filter: blur(0); }
          80%  { opacity: 1; }
          100% { opacity: 0; filter: blur(4px); }
        }

        .outro-light-flash {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 50%, white 0%, hsl(200,100%,85%) 25%, hsl(220,100%,55%) 55%, transparent 80%);
          opacity: 0;
          animation: outro-light-burst 1.2s ease-out 4s forwards;
          mix-blend-mode: screen;
        }
        @keyframes outro-light-burst {
          0%   { opacity: 0; transform: scale(2.4); }
          50%  { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(0.4); }
        }

        .intro-starfield { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .intro-star {
          position: absolute; background: white; border-radius: 50%;
          box-shadow: 0 0 6px white, 0 0 12px hsl(200,100%,80%);
          animation: outro-star-twinkle linear infinite; opacity: 0.85;
        }
        @keyframes outro-star-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default OutroAnimation;
