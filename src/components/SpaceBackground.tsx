import { useMemo } from "react";

interface Props {
  density?: number;
  /** kept for API compatibility — ignored */
  rocks?: number;
  nebula?: boolean;
  /** kept for API compatibility — ignored */
  shootingStars?: number;
  /** Enable warp/hyperspace streaks for a 3D space-travel feel */
  warp?: boolean;
}

/**
 * Cinematic 3D galaxy-travel background.
 * - Deep layered nebulae (slow drift + breathing)
 * - 3 parallax star fields with twinkle + drift
 * - Volumetric light beams sweeping slowly
 * - Hyperspace warp streaks radiating from center (3D space travel feel)
 * - Subtle dust/grain and vignette for depth
 */
const SpaceBackground = ({ density = 1, nebula = true, warp = true }: Props) => {
  const layers = useMemo(() => {
    const make = (count: number, sizeMin: number, sizeMax: number) =>
      Array.from({ length: count }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: sizeMin + Math.random() * (sizeMax - sizeMin),
        delay: Math.random() * 6,
        dur: 2.5 + Math.random() * 5,
        color:
          Math.random() > 0.75
            ? "hsl(40,100%,80%)"
            : Math.random() > 0.5
            ? "hsl(200,100%,88%)"
            : "hsl(220,100%,92%)",
      }));
    return {
      far: make(Math.round(160 * density), 0.4, 1.1),
      mid: make(Math.round(80 * density), 0.9, 1.9),
      near: make(Math.round(28 * density), 1.6, 2.8),
    };
  }, [density]);

  // Warp streaks — radiate outward from center, varied length/speed for true 3D travel
  const warpStreaks = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => ({
        id: i,
        angle: Math.random() * 360,
        delay: Math.random() * 6,
        dur: 2.2 + Math.random() * 4.5,
        len: 60 + Math.random() * 240,
        thick: 0.6 + Math.random() * 1.6,
        hue:
          Math.random() > 0.7
            ? 40
            : Math.random() > 0.5
            ? 200
            : 220,
      })),
    []
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, hsl(230 50% 8%) 0%, hsl(230 60% 4%) 55%, hsl(230 70% 2%) 100%)",
      }}
    >
      <style>{`
        @keyframes qb-twinkle { 0%,100%{opacity:.15}50%{opacity:1} }
        @keyframes qb-drift-far { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-30px,-10px,0)} }
        @keyframes qb-drift-mid { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-60px,-25px,0)} }
        @keyframes qb-drift-near { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-110px,-50px,0)} }
        @keyframes qb-nebula-a {
          0%,100% { transform: translate3d(0,0,0) scale(1); opacity:.65 }
          50%     { transform: translate3d(30px,-20px,0) scale(1.12); opacity:.95 }
        }
        @keyframes qb-nebula-b {
          0%,100% { transform: translate3d(0,0,0) scale(1.05); opacity:.55 }
          50%     { transform: translate3d(-25px,18px,0) scale(0.95); opacity:.85 }
        }
        @keyframes qb-beam {
          0%,100% { opacity: 0.0; transform: translateX(-10%) rotate(var(--ang)); }
          40%     { opacity: 0.35; }
          60%     { opacity: 0.35; }
          100%    { opacity: 0.0; transform: translateX(110%) rotate(var(--ang)); }
        }
        @keyframes qb-galaxy-rotate {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes qb-warp {
          0%   { transform: rotate(var(--ang)) translateX(0) scaleX(0.2); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: rotate(var(--ang)) translateX(60vmax) scaleX(1); opacity: 0; }
        }
        @keyframes qb-zoom {
          0%   { transform: translate(-50%,-50%) scale(1); }
          100% { transform: translate(-50%,-50%) scale(1.06); }
        }
      `}</style>

      {/* Slow rotating galactic core */}
      <div
        className="absolute top-1/2 left-1/2 w-[140vmax] h-[140vmax] rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, hsl(220 80% 50% / 0.06), hsl(260 70% 55% / 0.10), hsl(190 90% 55% / 0.06), hsl(40 100% 60% / 0.05), hsl(220 80% 50% / 0.06))",
          filter: "blur(60px)",
          animation: "qb-galaxy-rotate 240s linear infinite",
          opacity: 0.7,
        }}
      />

      {/* ============ CENTRAL BLACKHOLE ============ */}
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          width: "min(46vmin, 520px)",
          height: "min(46vmin, 520px)",
          transform: "translate(-50%,-50%)",
          zIndex: 1,
        }}
      >
        {/* Gravitational lens halo */}
        <div
          className="absolute inset-[-40%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, transparent 36%, hsl(220 80% 8% / 0.55) 44%, transparent 60%)",
            filter: "blur(8px)",
            animation: "qb-bh-lens 9s ease-in-out infinite",
          }}
        />
        {/* Outer accretion disk */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, hsl(330 100% 70%), hsl(280 90% 65%), hsl(200 100% 72%), hsl(45 100% 70%), hsl(330 100% 70%))",
            WebkitMask:
              "radial-gradient(circle, transparent 38%, #000 46%, #000 70%, transparent 78%)",
            mask: "radial-gradient(circle, transparent 38%, #000 46%, #000 70%, transparent 78%)",
            filter: "blur(3px)",
            animation: "qb-bh-spin 14s linear infinite",
          }}
        />
        {/* Inner tilted disk */}
        <div
          className="absolute inset-[8%] rounded-full"
          style={{
            background:
              "conic-gradient(from 90deg, hsl(45 100% 75%), hsl(330 100% 65%), hsl(200 100% 70%), hsl(45 100% 75%))",
            WebkitMask:
              "radial-gradient(circle, transparent 40%, #000 48%, #000 68%, transparent 78%)",
            mask: "radial-gradient(circle, transparent 40%, #000 48%, #000 68%, transparent 78%)",
            filter: "blur(2px)",
            opacity: 0.75,
            transform: "rotateX(72deg)",
            animation: "qb-bh-spin 9s linear reverse infinite",
          }}
        />
        {/* Event horizon (pure black core) */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "30%",
            background:
              "radial-gradient(circle, #000 55%, hsl(260 80% 10%) 82%, transparent)",
            boxShadow:
              "inset 0 0 28px #000, 0 0 50px hsl(330 90% 50% / 0.55), 0 0 110px hsl(200 90% 55% / 0.55)",
          }}
        />
        {/* Polar relativistic jets */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: 4,
            height: "min(60vmin, 520px)",
            transform: "translate(-50%,-50%)",
            background:
              "linear-gradient(to bottom, transparent, hsl(200 100% 85%) 30%, hsl(280 100% 70% / 0.6) 60%, transparent)",
            filter: "blur(2px)",
            boxShadow:
              "0 0 18px hsl(200 100% 70%), 0 0 40px hsl(280 100% 60%)",
            opacity: 0.7,
            animation: "qb-bh-jet 1.6s ease-in-out infinite",
          }}
        />
      </div>

      {nebula && (
        <>
          <div
            className="absolute -top-40 -left-40 w-[70vw] h-[70vw] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, hsl(200 100% 55% / 0.32), hsl(220 80% 40% / 0.12) 40%, transparent 70%)",
              animation: "qb-nebula-a 22s ease-in-out infinite",
            }}
          />
          <div
            className="absolute top-1/4 -right-40 w-[65vw] h-[65vw] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, hsl(280 80% 60% / 0.30), hsl(260 70% 45% / 0.10) 40%, transparent 70%)",
              animation: "qb-nebula-b 28s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-[-20%] left-1/4 w-[60vw] h-[60vw] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, hsl(190 100% 60% / 0.22), hsl(220 80% 40% / 0.08) 40%, transparent 70%)",
              animation: "qb-nebula-a 32s ease-in-out infinite",
            }}
          />
          <div
            className="absolute top-[10%] left-[35%] w-[40vw] h-[40vw] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, hsl(330 80% 65% / 0.16), transparent 65%)",
              animation: "qb-nebula-b 36s ease-in-out infinite",
            }}
          />
        </>
      )}

      {/* Volumetric light beams */}
      <div
        className="absolute -inset-1/4"
        style={{
          // @ts-expect-error custom prop
          "--ang": "-12deg",
          background:
            "linear-gradient(90deg, transparent 30%, hsl(200 100% 80% / 0.06) 50%, transparent 70%)",
          filter: "blur(20px)",
          animation: "qb-beam 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -inset-1/4"
        style={{
          // @ts-expect-error custom prop
          "--ang": "8deg",
          background:
            "linear-gradient(90deg, transparent 30%, hsl(260 90% 75% / 0.05) 50%, transparent 70%)",
          filter: "blur(24px)",
          animation: "qb-beam 40s ease-in-out infinite 6s",
        }}
      />

      {/* Hyperspace / warp streaks — true 3D space-travel sensation */}
      {warp && (
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 1,
            height: 1,
            animation: "qb-zoom 18s ease-in-out infinite alternate",
          }}
        >
          {warpStreaks.map((s) => (
            <span
              key={`w${s.id}`}
              className="absolute top-0 left-0 origin-left rounded-full"
              style={{
                width: s.len,
                height: s.thick,
                background: `linear-gradient(90deg, transparent, hsl(${s.hue} 100% 80% / 0.85), transparent)`,
                boxShadow: `0 0 ${s.thick * 6}px hsl(${s.hue} 100% 70% / 0.8)`,
                // @ts-expect-error custom prop
                "--ang": `${s.angle}deg`,
                animation: `qb-warp ${s.dur}s linear ${s.delay}s infinite`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Far stars */}
      <div className="absolute inset-0" style={{ animation: "qb-drift-far 80s linear infinite alternate" }}>
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
      <div className="absolute inset-0" style={{ animation: "qb-drift-mid 55s linear infinite alternate" }}>
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

      {/* Near stars */}
      <div className="absolute inset-0" style={{ animation: "qb-drift-near 38s linear infinite alternate" }}>
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

      {/* Subtle film grain */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>\")",
        }}
      />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, hsl(230 70% 2% / 0.85) 100%)",
        }}
      />
    </div>
  );
};

export default SpaceBackground;
