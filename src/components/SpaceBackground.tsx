import { useMemo } from "react";

interface Props {
  /** density multiplier 0.5 - 2 */
  density?: number;
  /** rock count */
  rocks?: number;
  /** show animated nebula gradients */
  nebula?: boolean;
}

/**
 * Cinematic 3D-feel star/rock background.
 * - 3 parallax star layers (near/mid/far) with twinkle + drift
 * - floating asteroid rocks with rotation + drift
 * - optional nebula gradient
 *
 * Pure CSS animations defined inline via <style> so it works without tailwind config edits.
 */
const SpaceBackground = ({ density = 1, rocks = 14, nebula = true }: Props) => {
  const layers = useMemo(() => {
    const make = (count: number, sizeMin: number, sizeMax: number) =>
      Array.from({ length: count }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: sizeMin + Math.random() * (sizeMax - sizeMin),
        delay: Math.random() * 6,
        dur: 2 + Math.random() * 5,
        color:
          Math.random() > 0.7
            ? "hsl(40,100%,75%)"
            : Math.random() > 0.5
            ? "hsl(200,100%,85%)"
            : "hsl(220,100%,90%)",
      }));
    return {
      far: make(Math.round(120 * density), 0.4, 1.2),
      mid: make(Math.round(70 * density), 1, 2),
      near: make(Math.round(30 * density), 1.8, 3.2),
    };
  }, [density]);

  const rockList = useMemo(
    () =>
      Array.from({ length: rocks }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 14 + Math.random() * 38,
        delay: Math.random() * 12,
        dur: 18 + Math.random() * 22,
        rotDur: 14 + Math.random() * 24,
        opacity: 0.18 + Math.random() * 0.35,
        path: Math.floor(Math.random() * 3),
      })),
    [rocks]
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      <style>{`
        @keyframes qb-twinkle { 0%,100%{opacity:.15}50%{opacity:1} }
        @keyframes qb-drift-far { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-30px,-10px,0)} }
        @keyframes qb-drift-mid { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-60px,-25px,0)} }
        @keyframes qb-drift-near { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-110px,-50px,0)} }
        @keyframes qb-rock-float {
          0%   { transform: translate3d(0,0,0) rotate(0deg); }
          50%  { transform: translate3d(40px,-30px,0) rotate(180deg); }
          100% { transform: translate3d(0,0,0) rotate(360deg); }
        }
        @keyframes qb-rock-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes qb-nebula {
          0%,100% { transform: translate3d(0,0,0) scale(1); opacity:.55 }
          50%     { transform: translate3d(20px,-15px,0) scale(1.08); opacity:.85 }
        }
      `}</style>

      {nebula && (
        <>
          <div
            className="absolute -top-40 -left-40 w-[60vw] h-[60vw] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, hsl(200 100% 55% / 0.28), transparent 65%)",
              animation: "qb-nebula 18s ease-in-out infinite",
            }}
          />
          <div
            className="absolute top-1/3 -right-40 w-[55vw] h-[55vw] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, hsl(260 80% 60% / 0.22), transparent 65%)",
              animation: "qb-nebula 24s ease-in-out infinite reverse",
            }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-[50vw] h-[50vw] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, hsl(40 100% 55% / 0.14), transparent 65%)",
              animation: "qb-nebula 28s ease-in-out infinite",
            }}
          />
        </>
      )}

      {/* Far stars */}
      <div
        className="absolute inset-0"
        style={{ animation: "qb-drift-far 60s linear infinite alternate" }}
      >
        {layers.far.map((s, i) => (
          <span
            key={`f${i}`}
            className="absolute rounded-full"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              background: s.color,
              boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
              animation: `qb-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Mid stars */}
      <div
        className="absolute inset-0"
        style={{ animation: "qb-drift-mid 45s linear infinite alternate" }}
      >
        {layers.mid.map((s, i) => (
          <span
            key={`m${i}`}
            className="absolute rounded-full"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              background: s.color,
              boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
              animation: `qb-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Near stars - bigger, brighter */}
      <div
        className="absolute inset-0"
        style={{ animation: "qb-drift-near 30s linear infinite alternate" }}
      >
        {layers.near.map((s, i) => (
          <span
            key={`n${i}`}
            className="absolute rounded-full"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              background: s.color,
              boxShadow: `0 0 ${s.size * 4}px ${s.color}, 0 0 ${s.size * 8}px ${s.color}`,
              animation: `qb-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Floating rocks / asteroids */}
      {rockList.map((r, i) => (
        <div
          key={`r${i}`}
          className="absolute"
          style={{
            top: `${r.top}%`,
            left: `${r.left}%`,
            width: r.size,
            height: r.size,
            opacity: r.opacity,
            animation: `qb-rock-float ${r.dur}s ease-in-out ${r.delay}s infinite`,
          }}
        >
          <div
            className="w-full h-full"
            style={{ animation: `qb-rock-spin ${r.rotDur}s linear infinite` }}
          >
            <svg viewBox="0 0 64 64" className="w-full h-full">
              <defs>
                <radialGradient id={`rg${i}`} cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="hsl(220,15%,55%)" />
                  <stop offset="60%" stopColor="hsl(220,20%,28%)" />
                  <stop offset="100%" stopColor="hsl(220,30%,10%)" />
                </radialGradient>
              </defs>
              {r.path === 0 && (
                <polygon
                  points="32,4 54,18 60,40 44,58 18,56 6,36 12,14"
                  fill={`url(#rg${i})`}
                  stroke="hsl(200,40%,60% / 0.4)"
                  strokeWidth="0.6"
                />
              )}
              {r.path === 1 && (
                <polygon
                  points="32,6 50,12 58,30 50,52 28,60 8,46 4,24 16,10"
                  fill={`url(#rg${i})`}
                  stroke="hsl(40,80%,60% / 0.3)"
                  strokeWidth="0.6"
                />
              )}
              {r.path === 2 && (
                <polygon
                  points="30,2 52,16 56,38 38,56 14,52 4,32 12,12"
                  fill={`url(#rg${i})`}
                  stroke="hsl(260,40%,60% / 0.35)"
                  strokeWidth="0.6"
                />
              )}
            </svg>
          </div>
        </div>
      ))}

      {/* subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, hsl(220 60% 3% / 0.7) 100%)",
        }}
      />
    </div>
  );
};

export default SpaceBackground;
