import { useMemo } from "react";

interface Props {
  density?: number;
  rocks?: number;
  nebula?: boolean;
  /** number of shooting stars streaking across screen */
  shootingStars?: number;
}

/**
 * Cinematic 3D-feel star/rock background.
 * - 3 parallax star layers (twinkle + drift)
 * - shooting / lighting stars streaking across
 * - 3D-looking asteroid rocks (multi-stop radial shading + crater highlights)
 *   tumbling on multiple axes for a true 3D feel
 * - optional animated nebula gradients
 */
const SpaceBackground = ({
  density = 1,
  rocks = 14,
  nebula = true,
  shootingStars = 5,
}: Props) => {
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
      Array.from({ length: rocks }).map((_, i) => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 22 + Math.random() * 56,
        delay: Math.random() * 12,
        dur: 18 + Math.random() * 22,
        rotDur: 14 + Math.random() * 24,
        rotDir: Math.random() > 0.5 ? 1 : -1,
        tumbleDur: 9 + Math.random() * 14,
        opacity: 0.35 + Math.random() * 0.45,
        seed: i,
        hue: [25, 220, 30, 200, 35][i % 5],
      })),
    [rocks]
  );

  const shooters = useMemo(
    () =>
      Array.from({ length: shootingStars }).map(() => ({
        top: Math.random() * 60,
        delay: Math.random() * 14,
        dur: 1 + Math.random() * 1.6,
        cycle: 8 + Math.random() * 14,
        angle: -15 - Math.random() * 20,
        len: 180 + Math.random() * 220,
      })),
    [shootingStars]
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      <style>{`
        @keyframes qb-twinkle { 0%,100%{opacity:.15}50%{opacity:1} }
        @keyframes qb-drift-far { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-30px,-10px,0)} }
        @keyframes qb-drift-mid { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-60px,-25px,0)} }
        @keyframes qb-drift-near { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-110px,-50px,0)} }
        @keyframes qb-rock-float {
          0%   { transform: translate3d(0,0,0); }
          50%  { transform: translate3d(40px,-30px,0); }
          100% { transform: translate3d(0,0,0); }
        }
        @keyframes qb-rock-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes qb-rock-spin-rev { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
        /* tumble on Y/X for 3D illusion */
        @keyframes qb-rock-tumble {
          0%   { transform: rotateX(0deg) rotateY(0deg); }
          50%  { transform: rotateX(180deg) rotateY(180deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        @keyframes qb-nebula {
          0%,100% { transform: translate3d(0,0,0) scale(1); opacity:.55 }
          50%     { transform: translate3d(20px,-15px,0) scale(1.08); opacity:.85 }
        }
        /* Shooting / lighting star */
        @keyframes qb-shoot {
          0%   { transform: translate3d(-20vw, 0, 0) rotate(var(--ang)); opacity: 0; }
          5%   { opacity: 1; }
          60%  { opacity: 1; }
          100% { transform: translate3d(120vw, 60vh, 0) rotate(var(--ang)); opacity: 0; }
        }
      `}</style>

      {nebula && (
        <>
          <div
            className="absolute -top-40 -left-40 w-[60vw] h-[60vw] rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, hsl(200 100% 55% / 0.28), transparent 65%)",
              animation: "qb-nebula 18s ease-in-out infinite",
            }}
          />
          <div
            className="absolute top-1/3 -right-40 w-[55vw] h-[55vw] rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, hsl(260 80% 60% / 0.22), transparent 65%)",
              animation: "qb-nebula 24s ease-in-out infinite reverse",
            }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-[50vw] h-[50vw] rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, hsl(40 100% 55% / 0.14), transparent 65%)",
              animation: "qb-nebula 28s ease-in-out infinite",
            }}
          />
        </>
      )}

      {/* Far stars */}
      <div className="absolute inset-0" style={{ animation: "qb-drift-far 60s linear infinite alternate" }}>
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
      <div className="absolute inset-0" style={{ animation: "qb-drift-mid 45s linear infinite alternate" }}>
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
      <div className="absolute inset-0" style={{ animation: "qb-drift-near 30s linear infinite alternate" }}>
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

      {/* Shooting / lighting stars */}
      {shooters.map((s, i) => (
        <span
          key={`sh${i}`}
          className="absolute"
          style={{
            top: `${s.top}%`,
            left: 0,
            width: s.len,
            height: 2,
            background: `linear-gradient(90deg, transparent, hsl(200,100%,85%), white)`,
            boxShadow: `0 0 12px white, 0 0 24px hsl(200,100%,75%), 0 0 40px hsl(200,100%,65%)`,
            borderRadius: 2,
            opacity: 0,
            // @ts-expect-error custom prop
            "--ang": `${s.angle}deg`,
            animation: `qb-shoot ${s.dur}s ease-out ${s.delay}s infinite`,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
            animationIterationCount: "infinite",
            animationName: "qb-shoot",
            animationTimingFunction: "ease-out",
          }}
        />
      ))}

      {/* 3D-looking floating rocks / asteroids */}
      {rockList.map((r, i) => {
        const hue = r.hue;
        // Build a slightly irregular polygon for asteroid silhouette
        const points = Array.from({ length: 12 })
          .map((_, k) => {
            const ang = (k / 12) * Math.PI * 2;
            const rad = 26 + Math.sin(k * 1.7 + r.seed) * 5 + Math.cos(k * 0.9 + r.seed) * 3;
            const x = 32 + Math.cos(ang) * rad;
            const y = 32 + Math.sin(ang) * rad;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(" ");
        return (
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
              perspective: "200px",
            }}
          >
            {/* tumble wrapper for 3D feel */}
            <div
              className="w-full h-full"
              style={{
                animation: `qb-rock-tumble ${r.tumbleDur}s linear infinite`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* spin layer */}
              <div
                className="w-full h-full"
                style={{
                  animation: `${r.rotDir > 0 ? "qb-rock-spin" : "qb-rock-spin-rev"} ${r.rotDur}s linear infinite`,
                }}
              >
                <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
                  <defs>
                    <radialGradient id={`rg${i}`} cx="32%" cy="28%" r="78%">
                      <stop offset="0%" stopColor={`hsl(${hue},35%,72%)`} />
                      <stop offset="35%" stopColor={`hsl(${hue},30%,48%)`} />
                      <stop offset="70%" stopColor={`hsl(${hue},35%,22%)`} />
                      <stop offset="100%" stopColor={`hsl(${hue},45%,6%)`} />
                    </radialGradient>
                    <radialGradient id={`rim${i}`} cx="50%" cy="50%" r="50%">
                      <stop offset="60%" stopColor="transparent" />
                      <stop offset="92%" stopColor={`hsl(${hue},80%,60% / 0.35)`} />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    <filter id={`shadow${i}`} x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#000" floodOpacity="0.55" />
                    </filter>
                  </defs>

                  {/* rim lighting halo */}
                  <circle cx="32" cy="32" r="30" fill={`url(#rim${i})`} />

                  {/* main body */}
                  <polygon
                    points={points}
                    fill={`url(#rg${i})`}
                    stroke={`hsl(${hue},25%,15%)`}
                    strokeWidth="0.6"
                    filter={`url(#shadow${i})`}
                  />

                  {/* craters */}
                  <ellipse cx="24" cy="26" rx="4" ry="2.6" fill={`hsl(${hue},25%,18%)`} opacity="0.7" />
                  <ellipse cx="24" cy="25.4" rx="3.5" ry="1.6" fill={`hsl(${hue},35%,55%)`} opacity="0.35" />

                  <ellipse cx="40" cy="38" rx="5" ry="3.4" fill={`hsl(${hue},25%,16%)`} opacity="0.7" />
                  <ellipse cx="40" cy="37" rx="4.4" ry="2.2" fill={`hsl(${hue},35%,55%)`} opacity="0.3" />

                  <ellipse cx="36" cy="20" rx="2.4" ry="1.6" fill={`hsl(${hue},25%,15%)`} opacity="0.6" />

                  {/* specular highlight */}
                  <ellipse cx="22" cy="20" rx="6" ry="3.2" fill={`hsl(${hue},80%,90%)`} opacity="0.18" />
                </svg>
              </div>
            </div>
          </div>
        );
      })}

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
