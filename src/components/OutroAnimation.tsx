import { useEffect, useMemo } from "react";
import cosmos from "@/assets/intro-cosmos.jpg";
import earth from "@/assets/intro-earth.jpg";

const TOTAL_MS = 6200;

interface Props {
  onDone: () => void;
}

const OutroAnimation = ({ onDone }: Props) => {
  useEffect(() => {
    const t = setTimeout(onDone, TOTAL_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  const stars = useMemo(
    () =>
      Array.from({ length: 180 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 4,
        dur: 2 + Math.random() * 3,
      })),
    []
  );

  // Warp-speed star streaks
  const streaks = useMemo(
    () =>
      Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: 50 + (Math.random() - 0.5) * 80,
        len: 60 + Math.random() * 240,
        delay: Math.random() * 1.4,
        dur: 0.6 + Math.random() * 0.9,
        rot: -10 + Math.random() * 20,
      })),
    []
  );

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black outro-fade-in" aria-hidden="true">
      {/* Static starfield */}
      <div className="outro-starfield">
        {stars.map((s) => (
          <span
            key={s.id}
            className="outro-star"
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

      {/* ACT 1 — Leaving the hive: cosmos zooms past us */}
      <div className="outro-act outro-act-cosmos">
        <img src={cosmos} alt="" className="outro-cosmos-img" />
        <div className="outro-cosmos-veil" />
        <div className="outro-tagline outro-tagline-1">
          <span className="outro-tagline-kicker">Leaving the hive</span>
          <span className="outro-tagline-line">Catching the beam home…</span>
        </div>
      </div>

      {/* ACT 2 — Hyperspace warp tunnel */}
      <div className="outro-warp">
        {streaks.map((s) => (
          <span
            key={s.id}
            className="outro-streak"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.len}px`,
              transform: `rotate(${s.rot}deg)`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}
        <div className="outro-warp-tunnel" />
      </div>

      {/* Beam — fires from center outward toward Earth */}
      <div className="outro-beam outro-beam-a" />
      <div className="outro-beam outro-beam-b" />

      {/* ACT 3 — Earth approach: grows from dot to full glow */}
      <div className="outro-act outro-act-earth">
        <div className="outro-earth-atmo" />
        <img src={earth} alt="" className="outro-earth-img" />
        <div className="outro-earth-glow" />
        <div className="outro-tagline outro-tagline-2">
          <span className="outro-tagline-kicker">Welcome home</span>
          <span className="outro-tagline-line">Earth · System restored.</span>
        </div>
      </div>

      {/* Final white burst as we touch down */}
      <div className="outro-light-flash" />

      <style>{`
        @keyframes outro-fade-in-kf { from { opacity: 0; } to { opacity: 1; } }
        .outro-fade-in { animation: outro-fade-in-kf 0.35s ease-out both; }

        .outro-act { position: absolute; inset: 0; opacity: 0; }

        /* ── ACT 1 — cosmos retreats ───────────────────────────────────── */
        .outro-act-cosmos { z-index: 3; animation: outro-cosmos-life 2.2s ease-in 0s forwards; }
        @keyframes outro-cosmos-life {
          0%   { opacity: 0; transform: scale(1); filter: brightness(1); }
          12%  { opacity: 1; transform: scale(1.04); filter: brightness(1.1); }
          70%  { opacity: 0.95; transform: scale(1.6); filter: brightness(1.3); }
          100% { opacity: 0; transform: scale(2.4); filter: brightness(1.8) blur(6px); }
        }
        .outro-cosmos-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.85) contrast(1.15) saturate(1.25);
        }
        .outro-cosmos-veil {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 50%, transparent 0%, transparent 35%, hsl(220 60% 4% / 0.85) 90%);
        }

        /* ── ACT 2 — warp tunnel ──────────────────────────────────────── */
        .outro-warp {
          position: absolute; inset: 0; z-index: 4;
          opacity: 0;
          animation: outro-warp-life 2.4s ease-in-out 1.6s forwards;
          perspective: 800px;
        }
        @keyframes outro-warp-life {
          0%   { opacity: 0; }
          25%  { opacity: 1; }
          75%  { opacity: 1; }
          100% { opacity: 0; }
        }
        .outro-warp-tunnel {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 50%,
            hsl(200 100% 80% / 0.5) 0%,
            hsl(220 100% 55% / 0.25) 18%,
            hsl(260 80% 35% / 0.15) 45%,
            transparent 75%);
          mix-blend-mode: screen;
          animation: outro-tunnel-pulse 1.4s ease-in-out infinite;
        }
        @keyframes outro-tunnel-pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50%      { transform: scale(1.08); opacity: 1; }
        }
        .outro-streak {
          position: absolute; height: 2px;
          background: linear-gradient(90deg, transparent, hsl(200 100% 90%) 35%, hsl(220 100% 70%) 70%, transparent);
          box-shadow: 0 0 10px hsl(200 100% 75% / 0.9);
          opacity: 0; transform-origin: 0 50%;
          animation: outro-streak-fly linear infinite;
          filter: blur(0.4px);
        }
        @keyframes outro-streak-fly {
          0%   { opacity: 0; transform: translateX(-30%) scaleX(0.2) rotate(var(--rot, 0deg)); }
          15%  { opacity: 1; }
          100% { opacity: 0; transform: translateX(140vw) scaleX(1.4) rotate(var(--rot, 0deg)); }
        }

        /* Beam — quick double-pulse "lock-on" before Earth */
        .outro-beam {
          position: absolute; top: 50%; left: 50%;
          height: 4px; transform-origin: 0 50%;
          background: linear-gradient(90deg, transparent, hsl(200 100% 90%), hsl(220 100% 65%), hsl(195 100% 90%), transparent);
          box-shadow: 0 0 18px hsl(200 100% 75%), 0 0 50px hsl(220 100% 60%), 0 0 100px hsl(210 100% 65%);
          opacity: 0; z-index: 5;
        }
        .outro-beam-a {
          width: 0; transform: rotate(195deg);
          animation: outro-beam-fire 0.9s cubic-bezier(0.7,0,0.3,1) 3.4s forwards;
        }
        .outro-beam-b {
          width: 0; transform: rotate(15deg);
          animation: outro-beam-fire 0.9s cubic-bezier(0.7,0,0.3,1) 3.55s forwards;
        }
        @keyframes outro-beam-fire {
          0%   { width: 0;        opacity: 0; }
          25%  { width: 60vmax;   opacity: 1; }
          75%  { width: 90vmax;   opacity: 1; }
          100% { width: 100vmax;  opacity: 0; }
        }

        /* ── ACT 3 — Earth arrival ────────────────────────────────────── */
        .outro-act-earth { z-index: 6; animation: outro-earth-life 2.6s cubic-bezier(0.2,0.8,0.2,1) 3.6s forwards; }
        @keyframes outro-earth-life {
          0%   { opacity: 0; transform: scale(0.05); filter: brightness(2.4) blur(4px); }
          25%  { opacity: 1; transform: scale(0.55); filter: brightness(1.6) blur(0.5px); }
          70%  { opacity: 1; transform: scale(1);    filter: brightness(1.15); }
          100% { opacity: 1; transform: scale(1.05); filter: brightness(1.05); }
        }
        .outro-earth-img {
          position: absolute; top: 50%; left: 50%;
          width: min(70vmin, 720px); height: min(70vmin, 720px);
          object-fit: cover; border-radius: 50%;
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 0 60px hsl(200 100% 55% / 0.75))
                  drop-shadow(0 0 140px hsl(220 80% 50% / 0.55));
          animation: outro-earth-rotate 40s linear infinite;
        }
        @keyframes outro-earth-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .outro-earth-glow {
          position: absolute; top: 50%; left: 50%;
          width: min(86vmin, 860px); height: min(86vmin, 860px);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle, transparent 42%, hsl(200 100% 60% / 0.38) 50%, hsl(220 100% 55% / 0.18) 62%, transparent 75%);
          animation: outro-earth-pulse 2.4s ease-in-out infinite;
          filter: blur(2px);
        }
        @keyframes outro-earth-pulse {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.06); }
        }
        .outro-earth-atmo {
          position: absolute; top: 50%; left: 50%;
          width: min(96vmin, 960px); height: min(96vmin, 960px);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle, transparent 48%, hsl(190 100% 70% / 0.18) 52%, transparent 60%);
          mix-blend-mode: screen;
          animation: outro-earth-pulse 3.2s ease-in-out infinite;
        }

        /* Taglines */
        .outro-tagline {
          position: absolute; left: 50%; transform: translateX(-50%);
          text-align: center; font-family: 'Space Grotesk', sans-serif;
          color: white; opacity: 0; z-index: 8;
          padding: 0 1rem; width: min(92vw, 820px);
          pointer-events: none;
        }
        .outro-tagline-kicker {
          display: block; font-size: clamp(11px, 1.4vw, 14px);
          letter-spacing: 0.5em; text-transform: uppercase;
          color: hsl(200 100% 82%); margin-bottom: 0.6rem; opacity: 0.9;
        }
        .outro-tagline-line {
          display: block; font-size: clamp(22px, 4.4vw, 52px);
          font-weight: 300; letter-spacing: -0.01em; line-height: 1.15;
          background: linear-gradient(90deg, hsl(200 100% 85%), white 50%, hsl(220 100% 82%));
          -webkit-background-clip: text; background-clip: text;
          color: transparent;
          text-shadow: 0 0 40px hsl(210 80% 60% / 0.6);
        }
        .outro-tagline-1 { top: 16%; animation: outro-tag-in 2.0s ease-out 0.25s forwards; }
        .outro-tagline-2 { top: 14%; animation: outro-tag-in 2.2s ease-out 4.1s forwards; }
        @keyframes outro-tag-in {
          0%   { opacity: 0; transform: translate(-50%, 18px); filter: blur(8px); }
          25%  { opacity: 1; transform: translate(-50%, 0);    filter: blur(0); }
          82%  { opacity: 1; }
          100% { opacity: 0; filter: blur(4px); }
        }

        /* Touchdown burst */
        .outro-light-flash {
          position: absolute; inset: 0; z-index: 7;
          background: radial-gradient(circle at 50% 50%, white 0%, hsl(200 100% 88%) 22%, hsl(220 100% 60%) 50%, transparent 78%);
          opacity: 0;
          animation: outro-light-burst 0.9s ease-out 3.5s forwards;
          mix-blend-mode: screen;
        }
        @keyframes outro-light-burst {
          0%   { opacity: 0; transform: scale(0.2); }
          40%  { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(2.4); }
        }

        .outro-starfield { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .outro-star {
          position: absolute; background: white; border-radius: 50%;
          box-shadow: 0 0 6px white, 0 0 12px hsl(200 100% 80%);
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
