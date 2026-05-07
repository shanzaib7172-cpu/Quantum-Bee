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

      {/* ============ QUANTUM BEE WORLDS — diverse planets, slow orbital revolve ============ */}
      {planets && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ animation: "qb-world-revolve 360s linear infinite", transformOrigin: "50% 50%" }}
        >
          <style>{`
            @keyframes qb-world-revolve { to { transform: rotate(360deg); } }
            @keyframes qb-planet-drift-a {
              0%   { transform: translate3d(0,0,0); }
              100% { transform: translate3d(30px,-22px,0); }
            }
            @keyframes qb-planet-drift-b {
              0%   { transform: translate3d(0,0,0); }
              100% { transform: translate3d(-35px,28px,0); }
            }
            @keyframes qb-planet-spin { to { transform: rotate(360deg); } }
            @keyframes qb-ring-tilt   { 0%,100% { transform: translate(-50%,-50%) rotate(var(--rot)) scaleY(0.28); } 50% { transform: translate(-50%,-50%) rotate(calc(var(--rot) + 6deg)) scaleY(0.32); } }
            @keyframes qb-wing-flutter { 0%,100% { transform: var(--base) scaleY(1); } 50% { transform: var(--base) scaleY(0.92); } }
          `}</style>

          {[
            // 1 ── QUEEN BEE — gas-giant, bold black bands, atmospheric glow + 2 wings
            {
              key: "queen-bee", top: "10%", left: "6%", size: 110, kind: "queen",
              bg: "radial-gradient(circle at 30% 28%, hsl(52 100% 92%) 0%, hsl(48 100% 70%) 25%, hsl(42 100% 55%) 55%, hsl(32 95% 38%) 85%, hsl(22 80% 18%) 100%)",
              bands: "repeating-linear-gradient(0deg, transparent 0 11px, hsl(0 0% 4% / 0.88) 11px 19px, transparent 19px 26px)",
              glow: "hsl(45 100% 60% / 0.7)", dur: 140, anim: "a",
            },
            // 2 ── HONEYCOMB WORLD — hex-pattern surface, orange/amber
            {
              key: "honeycomb", top: "22%", left: "78%", size: 70, kind: "hex",
              bg: "radial-gradient(circle at 35% 30%, hsl(40 100% 78%) 0%, hsl(32 100% 55%) 50%, hsl(20 90% 28%) 100%)",
              bands: "", glow: "hsl(35 100% 55% / 0.6)", dur: 120, anim: "b",
              ring: { rot: -22, hue: 35, w: 2.0, color: "hsl(45 100% 65% / 0.55)" },
            },
            // 3 ── QUANTUM BLUE — icy water-world with cyan polar caps + ring
            {
              key: "quantum-blue", top: "62%", left: "85%", size: 86, kind: "ringed",
              bg: "radial-gradient(circle at 32% 28%, hsl(195 100% 92%) 0%, hsl(205 100% 60%) 35%, hsl(220 90% 35%) 75%, hsl(230 80% 12%) 100%)",
              bands: "repeating-linear-gradient(0deg, transparent 0 14px, hsl(200 100% 80% / 0.18) 14px 18px, transparent 18px 26px)",
              glow: "hsl(200 100% 60% / 0.65)", dur: 180, anim: "a",
              ring: { rot: 18, hue: 200, w: 2.4, color: "hsl(200 100% 75% / 0.55)" },
            },
            // 4 ── SINGULARITY MOON — cratered grey-violet rocky world
            {
              key: "crater-moon", top: "76%", left: "18%", size: 54, kind: "cratered",
              bg: "radial-gradient(circle at 30% 28%, hsl(260 25% 78%) 0%, hsl(255 18% 55%) 45%, hsl(248 20% 22%) 100%)",
              bands: "", glow: "hsl(260 60% 55% / 0.45)", dur: 160, anim: "b",
            },
            // 5 ── POLLEN STAR — soft luminous pale-gold dwarf, bee-wings
            {
              key: "pollen-star", top: "48%", left: "3%", size: 64, kind: "winged",
              bg: "radial-gradient(circle at 35% 32%, hsl(54 100% 96%) 0%, hsl(48 100% 75%) 45%, hsl(40 90% 45%) 100%)",
              bands: "", glow: "hsl(48 100% 70% / 0.75)", dur: 130, anim: "a",
            },
            // 6 ── HONEY DROP — small glassy amber gem
            {
              key: "honey-drop", top: "30%", left: "44%", size: 26, kind: "glass",
              bg: "radial-gradient(circle at 35% 28%, hsl(50 100% 92%) 0%, hsl(42 100% 60%) 55%, hsl(28 95% 30%) 100%)",
              bands: "radial-gradient(circle at 60% 70%, hsl(30 90% 22% / 0.55) 8%, transparent 16%)",
              glow: "hsl(45 100% 65% / 0.5)", dur: 110, anim: "b",
            },
            // 7 ── SCOUT BEE — tiny striped wanderer
            {
              key: "scout-bee", top: "8%", left: "55%", size: 30, kind: "striped",
              bg: "radial-gradient(circle at 35% 30%, hsl(50 100% 88%) 0%, hsl(45 100% 60%) 55%, hsl(32 85% 28%) 100%)",
              bands: "repeating-linear-gradient(0deg, transparent 0 4px, hsl(0 0% 5% / 0.85) 4px 7px, transparent 7px 10px)",
              glow: "hsl(45 100% 60% / 0.55)", dur: 100, anim: "a",
            },
            // 8 ── NECTAR NEBULA — pinkish dwarf
            {
              key: "nectar-dwarf", top: "85%", left: "60%", size: 38, kind: "smooth",
              bg: "radial-gradient(circle at 35% 30%, hsl(330 100% 88%) 0%, hsl(310 80% 60%) 50%, hsl(290 60% 25%) 100%)",
              bands: "", glow: "hsl(320 80% 60% / 0.55)", dur: 145, anim: "b",
            },
          ].map((p: any) => {
            const s = p.size;
            return (
              <div
                key={p.key}
                className="absolute"
                style={{
                  top: p.top, left: p.left, width: s, height: s,
                  animation: `qb-planet-drift-${p.anim} ${p.dur}s ease-in-out infinite alternate`,
                }}
              >
                {/* Atmospheric halo */}
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    inset: -s * 0.25,
                    background: `radial-gradient(circle, ${p.glow} 0%, transparent 65%)`,
                    filter: "blur(6px)", opacity: 0.7,
                  }}
                />

                {/* Bee wings — centered behind body, fluttering */}
                {(p.kind === "queen" || p.kind === "winged") && (
                  <>
                    {[-28, 28].map((rot, i) => (
                      <div
                        key={i}
                        className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
                        style={{
                          width: s * 0.95,
                          height: s * 0.6,
                          transformOrigin: i === 0 ? "100% 50%" : "0% 50%",
                          transform: `translate(${i === 0 ? "-100%" : "0%"}, -85%) rotate(${rot}deg)`,
                          background: `radial-gradient(ellipse at ${i === 0 ? "70%" : "30%"} 50%, hsl(0 0% 100% / 0.7), hsl(200 100% 90% / 0.22) 55%, transparent 78%)`,
                          border: "1px solid hsl(0 0% 100% / 0.45)",
                          boxShadow: "0 0 12px hsl(200 100% 80% / 0.3)",
                          animation: `qb-wing-flutter${i} ${1.6 + i * 0.2}s ease-in-out infinite`,
                          zIndex: 0,
                        }}
                      />
                    ))}
                    <style>{`
                      @keyframes qb-wing-flutter0 {
                        0%,100% { transform: translate(-100%,-85%) rotate(-28deg) scaleY(1); }
                        50%     { transform: translate(-100%,-85%) rotate(-22deg) scaleY(0.7); }
                      }
                      @keyframes qb-wing-flutter1 {
                        0%,100% { transform: translate(0%,-85%) rotate(28deg) scaleY(1); }
                        50%     { transform: translate(0%,-85%) rotate(22deg) scaleY(0.7); }
                      }
                    `}</style>
                  </>
                )}

                {/* Planet body */}
                <div
                  className="relative w-full h-full rounded-full overflow-hidden"
                  style={{
                    background: p.bg,
                    boxShadow: `0 0 ${s * 0.5}px ${p.glow}, inset -${s * 0.2}px -${s * 0.22}px ${s * 0.45}px rgba(0,0,0,0.78), inset ${s * 0.09}px ${s * 0.09}px ${s * 0.22}px rgba(255,255,255,0.25)`,
                    animation: `qb-planet-spin ${p.dur * 0.7}s linear infinite`,
                  }}
                >
                  {/* Bands / stripes */}
                  {p.bands && (
                    <div className="absolute inset-0 rounded-full"
                      style={{ backgroundImage: p.bands, mixBlendMode: "overlay", opacity: 0.9 }} />
                  )}

                  {/* Honeycomb hexagon overlay */}
                  {p.kind === "hex" && (
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 50% 50%, hsl(20 90% 18% / 0.55) 1.5px, transparent 2px), radial-gradient(circle at 0% 0%, hsl(20 90% 18% / 0.55) 1.5px, transparent 2px), radial-gradient(circle at 100% 100%, hsl(20 90% 18% / 0.55) 1.5px, transparent 2px)",
                        backgroundSize: "14px 16px",
                        mixBlendMode: "multiply", opacity: 0.85,
                      }}
                    />
                  )}

                  {/* Craters (rocky worlds) */}
                  {p.kind === "cratered" && (
                    <div className="absolute inset-0 rounded-full"
                      style={{
                        backgroundImage: [
                          "radial-gradient(circle at 30% 35%, hsl(248 20% 14% / 0.85) 0 4px, transparent 5px)",
                          "radial-gradient(circle at 65% 55%, hsl(248 20% 14% / 0.85) 0 6px, transparent 7px)",
                          "radial-gradient(circle at 50% 75%, hsl(248 20% 14% / 0.85) 0 3px, transparent 4px)",
                          "radial-gradient(circle at 75% 28%, hsl(248 20% 14% / 0.85) 0 2.5px, transparent 3.5px)",
                          "radial-gradient(circle at 20% 60%, hsl(248 20% 14% / 0.85) 0 2px, transparent 3px)",
                        ].join(","),
                        mixBlendMode: "multiply",
                      }}
                    />
                  )}

                  {/* Glassy highlight */}
                  {p.kind === "glass" && (
                    <div className="absolute rounded-full"
                      style={{ inset: "10% 50% 55% 15%", background: "radial-gradient(ellipse, hsl(0 0% 100% / 0.7), transparent 70%)", filter: "blur(1px)" }} />
                  )}

                  {/* Polar caps for the icy water-world */}
                  {p.key === "quantum-blue" && (
                    <>
                      <div className="absolute left-1/2 -translate-x-1/2 rounded-full"
                        style={{ top: "-6%", width: "60%", height: "22%", background: "radial-gradient(ellipse, hsl(0 0% 100% / 0.85), transparent 70%)", filter: "blur(1px)" }} />
                      <div className="absolute left-1/2 -translate-x-1/2 rounded-full"
                        style={{ bottom: "-6%", width: "55%", height: "20%", background: "radial-gradient(ellipse, hsl(190 100% 90% / 0.8), transparent 70%)", filter: "blur(1px)" }} />
                    </>
                  )}

                  {/* Spec highlight */}
                  <div className="absolute rounded-full pointer-events-none"
                    style={{ inset: "8% 55% 60% 12%", background: "radial-gradient(ellipse, hsl(0 0% 100% / 0.55), transparent 75%)" }} />
                </div>

                {/* Saturn-style ring */}
                {p.ring && (
                  <div
                    className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
                    style={{
                      width: s * p.ring.w, height: s * p.ring.w,
                      // @ts-expect-error css var
                      "--rot": `${p.ring.rot}deg`,
                      transform: `translate(-50%,-50%) rotate(${p.ring.rot}deg) scaleY(0.28)`,
                      border: `2px solid ${p.ring.color}`,
                      boxShadow: `0 0 18px ${p.ring.color}, inset 0 0 12px ${p.ring.color}`,
                      animation: "qb-ring-tilt 14s ease-in-out infinite",
                    }}
                  />
                )}
              </div>
            );
          })}
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
