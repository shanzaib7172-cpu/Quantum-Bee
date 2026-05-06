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
  /** Show the central lightning singularity */
  blackhole?: boolean;
  /** Show small drifting solar-system planets */
  planets?: boolean;
}

const SpaceBackground = ({
  density = 1,
  nebula = true,
  warp = true,
  blackhole = true,
  planets = false,
}: Props) => {
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
        @keyframes qb-bh-spin { to { transform: rotate(360deg); } }
        @keyframes qb-bh-lens {
          0%,100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
          50%     { transform: scale(1.12) rotate(6deg); opacity: 1; }
        }
        @keyframes qb-bh-pulse {
          0%,100% { box-shadow: 0 0 60px hsl(200 100% 60% / 0.9), 0 0 140px hsl(220 100% 55% / 0.7), inset 0 0 40px hsl(200 100% 70% / 0.6); }
          50%     { box-shadow: 0 0 100px hsl(195 100% 70% / 1), 0 0 220px hsl(220 100% 60% / 0.85), inset 0 0 60px hsl(200 100% 80% / 0.85); }
        }
        @keyframes qb-bolt {
          0%   { opacity: 0; transform: rotate(var(--ang)) scaleX(0.2); filter: blur(2px); }
          10%  { opacity: 1; filter: blur(0); }
          22%  { opacity: 0.2; }
          30%  { opacity: 1; transform: rotate(calc(var(--ang) + 4deg)) scaleX(1.05); }
          55%  { opacity: 0; transform: rotate(var(--ang)) scaleX(1); }
          100% { opacity: 0; }
        }
        @keyframes qb-attract {
          0%   { transform: rotate(var(--ang)) translateX(60vmax) scaleX(1); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: rotate(var(--ang)) translateX(0) scaleX(0.05); opacity: 0; }
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

      {blackhole && (
      <>
      {/* ============ CENTRAL LIGHTNING SINGULARITY (blue) ============ */}
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          width: "min(46vmin, 520px)",
          height: "min(46vmin, 520px)",
          transform: "translate(-50%,-50%)",
          zIndex: 1,
        }}
      >
        {/* Outer electric halo */}
        <div
          className="absolute inset-[-50%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, transparent 30%, hsl(200 100% 55% / 0.35) 42%, hsl(220 100% 50% / 0.18) 55%, transparent 70%)",
            filter: "blur(14px)",
            animation: "qb-bh-lens 6s ease-in-out infinite",
          }}
        />
        {/* Spinning electric ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, hsl(200 100% 70%), hsl(220 100% 60%), hsl(190 100% 75%), hsl(210 100% 65%), hsl(200 100% 70%))",
            WebkitMask:
              "radial-gradient(circle, transparent 40%, #000 47%, #000 62%, transparent 72%)",
            mask:
              "radial-gradient(circle, transparent 40%, #000 47%, #000 62%, transparent 72%)",
            filter: "blur(2px) brightness(1.3)",
            animation: "qb-bh-spin 8s linear infinite",
          }}
        />
        {/* Lightning bolts radiating outward */}
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={`bolt-${i}`}
            className="absolute top-1/2 left-1/2 origin-left rounded-full"
            style={{
              width: "min(34vmin, 380px)",
              height: 1.5,
              background:
                "linear-gradient(90deg, hsl(190 100% 90%), hsl(210 100% 70%) 40%, hsl(220 100% 55% / 0.6) 70%, transparent)",
              boxShadow:
                "0 0 8px hsl(200 100% 80%), 0 0 18px hsl(210 100% 60%), 0 0 32px hsl(220 100% 50%)",
              // @ts-expect-error custom prop
              "--ang": `${(i / 14) * 360}deg`,
              animation: `qb-bolt ${1.4 + (i % 5) * 0.35}s ease-out ${(i % 7) * 0.2}s infinite`,
            }}
          />
        ))}
        {/* Glowing blue core */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "32%",
            background:
              "radial-gradient(circle, hsl(190 100% 92%) 0%, hsl(200 100% 70%) 30%, hsl(220 100% 45%) 65%, hsl(230 80% 12%) 95%)",
            animation: "qb-bh-pulse 2.4s ease-in-out infinite",
          }}
        />
        {/* Inner white-hot heart */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "42%",
            background:
              "radial-gradient(circle, #fff 0%, hsl(195 100% 85%) 40%, hsl(210 100% 60%) 80%, transparent)",
            filter: "blur(1px)",
          }}
        />
        {/* Inward energy streaks (attraction effect) */}
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={`atr-${i}`}
            className="absolute top-1/2 left-1/2 origin-left rounded-full"
            style={{
              width: 90,
              height: 1,
              background:
                "linear-gradient(90deg, hsl(200 100% 80% / 0.9), transparent)",
              boxShadow: "0 0 6px hsl(200 100% 70%)",
              // @ts-expect-error custom prop
              "--ang": `${(i / 10) * 360 + 18}deg`,
              animation: `qb-attract ${2.6 + (i % 4) * 0.4}s linear ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>

      </>
      )}

      {/* ============ SOLAR-SYSTEM PLANETS ============ */}
      {planets && (
        <div className="absolute inset-0 pointer-events-none">
          <style>{`
            @keyframes qb-planet-drift-a {
              0%   { transform: translate3d(0,0,0) rotate(0deg); }
              100% { transform: translate3d(40px,-30px,0) rotate(360deg); }
            }
            @keyframes qb-planet-drift-b {
              0%   { transform: translate3d(0,0,0) rotate(0deg); }
              100% { transform: translate3d(-50px,40px,0) rotate(-360deg); }
            }
            @keyframes qb-planet-spin { to { transform: rotate(360deg); } }
            @keyframes qb-moon-orbit  { to { transform: rotate(360deg); } }
          `}</style>

          {[
            // jupiter — banded gas giant
            {
              key: "jupiter", top: "12%", left: "8%", size: 70,
              bg: "radial-gradient(circle at 35% 35%, hsl(35 75% 80%) 0%, hsl(28 60% 55%) 35%, hsl(20 55% 35%) 70%, hsl(15 50% 18%) 100%)",
              bands: "repeating-linear-gradient(0deg, transparent 0 6px, hsl(25 50% 25% / 0.55) 6px 8px, transparent 8px 14px, hsl(35 70% 75% / 0.35) 14px 16px)",
              glow: "hsl(30 80% 60% / 0.45)",
              dur: 110, anim: "a",
            },
            // saturn — with ring
            {
              key: "saturn", top: "70%", left: "82%", size: 56,
              bg: "radial-gradient(circle at 35% 35%, hsl(45 80% 80%) 0%, hsl(40 65% 60%) 40%, hsl(35 55% 35%) 80%, hsl(30 50% 20%) 100%)",
              bands: "repeating-linear-gradient(0deg, transparent 0 4px, hsl(35 50% 30% / 0.5) 4px 6px)",
              glow: "hsl(45 80% 60% / 0.45)",
              ring: true,
              dur: 130, anim: "b",
            },
            // mars — red
            {
              key: "mars", top: "78%", left: "12%", size: 28,
              bg: "radial-gradient(circle at 32% 32%, hsl(15 80% 65%) 0%, hsl(8 70% 45%) 50%, hsl(0 60% 22%) 100%)",
              bands: "radial-gradient(circle at 70% 60%, hsl(0 60% 25% / 0.6) 8%, transparent 12%), radial-gradient(circle at 25% 70%, hsl(0 50% 20% / 0.55) 6%, transparent 10%)",
              glow: "hsl(10 80% 50% / 0.4)",
              dur: 95, anim: "a",
            },
            // mercury — small grey
            {
              key: "mercury", top: "22%", left: "88%", size: 18,
              bg: "radial-gradient(circle at 35% 30%, hsl(30 10% 70%) 0%, hsl(25 8% 45%) 60%, hsl(20 8% 22%) 100%)",
              bands: "radial-gradient(circle at 60% 70%, hsl(0 0% 15% / 0.55) 8%, transparent 12%)",
              glow: "hsl(30 10% 60% / 0.3)",
              dur: 80, anim: "b",
            },
            // venus — pale gold
            {
              key: "venus", top: "55%", left: "4%", size: 36,
              bg: "radial-gradient(circle at 35% 35%, hsl(45 90% 85%) 0%, hsl(38 70% 65%) 50%, hsl(30 55% 35%) 100%)",
              bands: "repeating-linear-gradient(15deg, transparent 0 5px, hsl(40 60% 55% / 0.4) 5px 7px)",
              glow: "hsl(45 90% 65% / 0.5)",
              dur: 105, anim: "a",
            },
            // moon — small with crater texture, has its own orbit dot? keep simple
            {
              key: "moon", top: "30%", left: "62%", size: 22,
              bg: "radial-gradient(circle at 35% 30%, hsl(0 0% 92%) 0%, hsl(0 0% 70%) 55%, hsl(220 10% 35%) 100%)",
              bands: "radial-gradient(circle at 60% 65%, hsl(0 0% 30% / 0.55) 10%, transparent 14%), radial-gradient(circle at 30% 75%, hsl(0 0% 25% / 0.5) 7%, transparent 10%), radial-gradient(circle at 70% 30%, hsl(0 0% 30% / 0.45) 6%, transparent 9%)",
              glow: "hsl(220 30% 80% / 0.45)",
              dur: 90, anim: "b",
            },
          ].map((p) => (
            <div
              key={p.key}
              className="absolute"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                animation: `qb-planet-drift-${p.anim} ${p.dur}s linear infinite alternate`,
              }}
            >
              {/* Saturn ring (behind) */}
              {p.ring && (
                <div
                  className="absolute left-1/2 top-1/2 rounded-full"
                  style={{
                    width: p.size * 2.2,
                    height: p.size * 0.55,
                    transform: "translate(-50%,-50%) rotate(-22deg)",
                    background:
                      "radial-gradient(ellipse, transparent 35%, hsl(40 60% 70% / 0.85) 42%, hsl(35 55% 50% / 0.5) 55%, transparent 62%)",
                    filter: "blur(0.4px)",
                  }}
                />
              )}
              {/* Planet body */}
              <div
                className="relative w-full h-full rounded-full overflow-hidden"
                style={{
                  background: p.bg,
                  boxShadow: `0 0 ${p.size * 0.45}px ${p.glow}, inset -${p.size * 0.18}px -${p.size * 0.18}px ${p.size * 0.4}px rgba(0,0,0,0.7), inset ${p.size * 0.08}px ${p.size * 0.08}px ${p.size * 0.2}px rgba(255,255,255,0.18)`,
                  animation: `qb-planet-spin ${p.dur * 0.6}s linear infinite`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundImage: p.bands, mixBlendMode: "overlay", opacity: 0.85 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

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
