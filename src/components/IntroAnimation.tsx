import { useEffect, useMemo, useState } from "react";

import cosmos from "@/assets/intro-cosmos.jpg";
import earth from "@/assets/intro-earth.jpg";

const STORAGE_KEY = "beee_intro_played_v8";
const TOTAL_MS = 14500;

const IntroAnimation = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(STORAGE_KEY);
  });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!show) return;
    const fadeTimer = setTimeout(() => setFadeOut(true), TOTAL_MS - 900);
    const endTimer = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setShow(false);
    }, TOTAL_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [show]);

  if (!show) return null;

  const skip = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  };

  // pre-compute random stars + asteroids
  const stars = Array.from({ length: 120 }).map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    dur: 2 + Math.random() * 3,
  }));
  const asteroids = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    top: 10 + Math.random() * 70,
    left: Math.random() * 100,
    size: 6 + Math.random() * 14,
    delay: Math.random() * 6,
    dur: 14 + Math.random() * 10,
    rot: Math.random() * 360,
  }));

  // 3D Quantum City buildings — pseudo-isometric skyline
  const buildings = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => {
        const depth = Math.random(); // 0 (near) -> 1 (far)
        return {
          id: i,
          left: (i / 26) * 100 + (Math.random() * 3 - 1.5),
          width: 3 + Math.random() * 5,
          height: 18 + Math.random() * 42 * (1 - depth * 0.55),
          depth,
          tone: 200 + Math.round(Math.random() * 80) - 40,
          accent: Math.random() > 0.5 ? "hsl(200,100%,60%)" : "hsl(330,100%,65%)",
          windowSeed: Math.random(),
          // z-translate to push back/forward in 3D
          z: -depth * 400,
          // sway delay
          delay: Math.random() * 4,
        };
      }),
    []
  );

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden bg-black ${
        fadeOut ? "intro-fade-out" : ""
      }`}
      aria-hidden="true"
    >
      <button
        onClick={skip}
        className="absolute top-4 right-4 z-[10000] px-3 py-1.5 text-xs rounded-full bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-md border border-white/20"
      >
        Skip intro →
      </button>

      {/* ============ PERSISTENT STARFIELD (entire intro) ============ */}
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
        {asteroids.map((a) => (
          <span
            key={a.id}
            className="intro-asteroid"
            style={{
              top: `${a.top}%`,
              left: `${a.left}%`,
              width: `${a.size}px`,
              height: `${a.size * 0.7}px`,
              animationDelay: `${a.delay}s`,
              animationDuration: `${a.dur}s`,
              transform: `rotate(${a.rot}deg)`,
            }}
          />
        ))}
      </div>

      {/* ============ ACT 1: Cosmic black hole (0 - 4.5s) ============ */}
      <div className="intro-act intro-act-1">
        <img src={cosmos} alt="" className="intro-cosmos-img" />
        <div className="intro-vortex">
          {Array.from({ length: 32 }).map((_, i) => {
            const angle = (i / 32) * 360;
            const isPink = i % 2 === 0;
            return (
              <span
                key={i}
                className="intro-stream"
                style={
                  {
                    ["--angle" as any]: `${angle}deg`,
                    ["--delay" as any]: `${(i % 8) * 0.12}s`,
                    background: `linear-gradient(90deg, transparent, ${
                      isPink ? "hsl(330,100%,72%)" : "hsl(200,100%,68%)"
                    }, transparent)`,
                  } as React.CSSProperties
                }
              />
            );
          })}
          <div className="intro-singularity">
            <div className="intro-sing-lens" />
            <div className="intro-sing-disk" />
            <div className="intro-sing-disk intro-sing-disk-2" />
            <div className="intro-sing-jet intro-sing-jet-top" />
            <div className="intro-sing-jet intro-sing-jet-bot" />
            <div className="intro-sing-core" />
          </div>
        </div>

        <div className="intro-tagline intro-tagline-1">
          <span className="intro-tagline-kicker">In a universe of noise</span>
          <span className="intro-tagline-line">one signal cuts through.</span>
        </div>
      </div>

      {/* ============ ACT 2: Beam fires from black hole (3.8 - 5.2s) ============ */}
      <div className="intro-beam" />

      {/* ============ ACT 3: Earth materializes & beam impacts (4.8 - 8s) ============ */}
      <div className="intro-act intro-act-earth">
        <img src={earth} alt="" className="intro-earth-img" />
        <div className="intro-earth-impact" />
        <div className="intro-earth-glow" />
        <div className="intro-tagline intro-tagline-2">
          <span className="intro-tagline-kicker">A signal reaches earth</span>
          <span className="intro-tagline-line">igniting a new world.</span>
        </div>
      </div>

      {/* ============ ACT 4: Quantum City — cinematic cyberpunk (7.5 - 12.5s) ============ */}
      <div className="intro-act intro-act-city">
        {/* 3D Quantum City — pure CSS, no image */}
        <div className="intro-city-3d-stage">
          {/* gradient sky / horizon */}
          <div className="intro-city-sky" />
          {/* sun / moon glow */}
          <div className="intro-city-sun" />
          {/* horizon perspective grid (the "ground") */}
          <div className="intro-city-ground">
            <div className="intro-city-grid" />
          </div>
          {/* skyline far layer — hyper glass towers */}
          <div className="intro-city-skyline intro-city-skyline-far">
            {buildings
              .filter((b) => b.depth > 0.55)
              .map((b) => (
                <div
                  key={`bf-${b.id}`}
                  className="intro-bldg intro-bldg-glass"
                  style={{
                    left: `${b.left}%`,
                    width: `${b.width}vw`,
                    height: `${b.height}vh`,
                    background: `linear-gradient(180deg, hsl(${b.tone},90%,70%/0.18) 0%, hsl(${b.tone},80%,55%/0.10) 40%, hsl(${b.tone},70%,30%/0.18) 100%)`,
                    boxShadow: `0 0 30px ${b.accent}66, inset 0 0 24px hsl(${b.tone},100%,80%/0.18), inset 0 0 1px hsl(${b.tone},100%,90%/0.6)`,
                    transform: `translateZ(${b.z}px)`,
                    animationDelay: `${b.delay}s`,
                    backdropFilter: "blur(2px)",
                    WebkitBackdropFilter: "blur(2px)",
                    border: `1px solid hsl(${b.tone},100%,85%/0.25)`,
                  }}
                >
                  <div
                    className="intro-bldg-windows"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent 0 6px, ${b.accent}aa 6px 8px), repeating-linear-gradient(90deg, transparent 0 6px, ${b.accent}55 6px 7px)`,
                    }}
                  />
                  <div className="intro-bldg-shine" />
                  <div className="intro-bldg-tip" style={{ background: b.accent, boxShadow: `0 0 10px ${b.accent}` }} />
                </div>
              ))}
          </div>
          {/* skyline near layer — hyper glass towers */}
          <div className="intro-city-skyline intro-city-skyline-near">
            {buildings
              .filter((b) => b.depth <= 0.55)
              .map((b) => (
                <div
                  key={`bn-${b.id}`}
                  className="intro-bldg intro-bldg-glass"
                  style={{
                    left: `${b.left}%`,
                    width: `${b.width * 1.15}vw`,
                    height: `${b.height * 1.25}vh`,
                    background: `linear-gradient(180deg, hsl(${b.tone},95%,75%/0.22) 0%, hsl(${b.tone},85%,55%/0.12) 45%, hsl(${b.tone},70%,25%/0.22) 100%)`,
                    boxShadow: `0 0 38px ${b.accent}99, inset 0 0 28px hsl(${b.tone},100%,80%/0.22), inset 0 0 1px hsl(${b.tone},100%,95%/0.7)`,
                    transform: `translateZ(${b.z * 0.4}px)`,
                    animationDelay: `${b.delay}s`,
                    backdropFilter: "blur(3px)",
                    WebkitBackdropFilter: "blur(3px)",
                    border: `1px solid hsl(${b.tone},100%,90%/0.32)`,
                  }}
                >
                  <div
                    className="intro-bldg-windows"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent 0 8px, ${b.accent}cc 8px 10px), repeating-linear-gradient(90deg, transparent 0 8px, ${b.accent}77 8px 9px)`,
                    }}
                  />
                  <div className="intro-bldg-shine" />
                  {/* corporate logo plate */}
                  <div
                    className="intro-bldg-logo"
                    style={{
                      color: b.accent,
                      borderColor: `${b.accent}aa`,
                      textShadow: `0 0 8px ${b.accent}`,
                    }}
                  >
                    {["QB", "NEXA", "AXION", "OMNI", "VEX", "HELIOS", "KOR"][b.id % 7]}
                  </div>
                  <div className="intro-bldg-tip" style={{ background: b.accent, boxShadow: `0 0 14px ${b.accent}, 0 0 28px ${b.accent}` }} />
                  {/* antenna */}
                  {b.windowSeed > 0.6 && (
                    <div className="intro-bldg-antenna" style={{ background: b.accent, boxShadow: `0 0 8px ${b.accent}` }} />
                  )}
                </div>
              ))}
          </div>
          {/* central hero tower (Quantum Bee HQ) */}
          <div className="intro-city-hero">
            <div className="intro-hero-tower">
              <div className="intro-hero-windows" />
              <div className="intro-hero-spire" />
              <div className="intro-hero-ring" />
              <div className="intro-hero-ring intro-hero-ring-2" />
            </div>
          </div>
        </div>

        {/* Atmospheric fog layers (parallax) */}
        <div className="intro-city-fog intro-city-fog-1" />
        <div className="intro-city-fog intro-city-fog-2" />

        {/* Rain streaks */}
        <div className="intro-city-rain" />

        {/* Flying cars streaking across skyline */}
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={`fc-${i}`}
            className="intro-flycar"
            style={{
              top: `${15 + i * 9}%`,
              animationDelay: `${8 + i * 0.45}s`,
              animationDuration: `${2.4 + (i % 3) * 0.6}s`,
              ["--hue" as any]: i % 2 === 0 ? "200" : "330",
            } as React.CSSProperties}
          />
        ))}

        {/* Neon window flicker overlay */}
        <div className="intro-city-flicker" />

        {/* HUD scan line sweeping the city */}
        <div className="intro-city-scan" />

        {/* HUD targeting brackets */}
        <div className="intro-city-hud">
          <span className="intro-hud-corner intro-hud-tl" />
          <span className="intro-hud-corner intro-hud-tr" />
          <span className="intro-hud-corner intro-hud-bl" />
          <span className="intro-hud-corner intro-hud-br" />
          <span className="intro-hud-readout">42.7°N · 74.0°W // QNTM-CITY · NODE 001</span>
        </div>

        <div className="intro-city-vignette" />
        <div className="intro-city-chroma" />

        {/* Holographic drones / orbs hovering above the city */}
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={`drone-${i}`}
            className="intro-drone"
            style={{
              left: `${15 + i * 16}%`,
              top: `${42 + (i % 2) * 6}%`,
              animationDelay: `${8.4 + i * 0.3}s, ${9 + i * 0.2}s`,
              ["--hue" as any]: i % 2 === 0 ? "200" : "330",
            } as React.CSSProperties}
          />
        ))}

        {/* Giant holographic robot silhouette behind the hero tower */}
        <div className="intro-robot">
          <div className="intro-robot-head" />
          <div className="intro-robot-eye intro-robot-eye-l" />
          <div className="intro-robot-eye intro-robot-eye-r" />
          <div className="intro-robot-body" />
          <div className="intro-robot-scan" />
        </div>

        {/* Side patrol robots — multiple smaller mech silhouettes */}
        {[
          { left: "8%",  bottom: "14%", scale: 0.42, hue: 200, delay: 9.2 },
          { left: "18%", bottom: "12%", scale: 0.34, hue: 330, delay: 9.5 },
          { left: "78%", bottom: "13%", scale: 0.4,  hue: 200, delay: 9.4 },
          { left: "88%", bottom: "15%", scale: 0.32, hue: 45,  delay: 9.7 },
        ].map((r, i) => (
          <div
            key={`mech-${i}`}
            className="intro-mech"
            style={{
              left: r.left,
              bottom: r.bottom,
              transform: `scale(${r.scale})`,
              ["--hue" as any]: r.hue,
              animationDelay: `${r.delay}s, ${r.delay + 1.2}s`,
            } as React.CSSProperties}
          >
            <div className="intro-mech-head" />
            <div className="intro-mech-eye" />
            <div className="intro-mech-body" />
            <div className="intro-mech-arm intro-mech-arm-l" />
            <div className="intro-mech-arm intro-mech-arm-r" />
            <div className="intro-mech-leg intro-mech-leg-l" />
            <div className="intro-mech-leg intro-mech-leg-r" />
          </div>
        ))}

        {/* Floating data/code stream hologram */}
        <div className="intro-datastream">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={`ds-${i}`}
              className="intro-data-line"
              style={{
                left: `${(i * 7) % 100}%`,
                animationDelay: `${8.6 + (i % 6) * 0.25}s`,
                animationDuration: `${3 + (i % 4) * 0.6}s`,
              }}
            />
          ))}
        </div>

        {/* City label */}
        <div className="intro-city-label">
          <span className="intro-city-kicker">// Welcome to</span>
          <span className="intro-city-name">QUANTUM&nbsp;CITY</span>
          <span className="intro-city-tag">Home of Quantum Bee</span>
        </div>
      </div>

      {/* ============ ACT 5: Final burst through the gate (12.5 - 14s) ============ */}
      <div className="intro-gate-burst" />

      <style>{`
        @keyframes intro-fade { to { opacity: 0; } }
        .intro-fade-out { animation: intro-fade 0.9s ease-out forwards; }

        .intro-act { position: absolute; inset: 0; opacity: 0; }

        /* ============== STARFIELD ============== */
        .intro-starfield {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }
        .intro-star {
          position: absolute;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 6px white, 0 0 12px hsl(200,100%,80%);
          animation: star-twinkle linear infinite;
          opacity: 0.85;
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }
        .intro-asteroid {
          position: absolute;
          background: linear-gradient(135deg, hsl(30,15%,55%), hsl(20,10%,25%));
          border-radius: 40% 60% 55% 45% / 50% 45% 55% 50%;
          box-shadow: inset -2px -1px 2px rgba(0,0,0,0.6), 0 0 6px rgba(255,200,150,0.2);
          animation: asteroid-drift linear infinite;
          opacity: 0.6;
        }
        @keyframes asteroid-drift {
          0%   { transform: translateX(-20vw) rotate(0deg); }
          100% { transform: translateX(120vw) rotate(360deg); }
        }

        /* ============== ACT 1 ============== */
        .intro-act-1 { animation: act1-life 4.8s ease-out 0s forwards; z-index: 2; }
        @keyframes act1-life {
          0%   { opacity: 0; transform: scale(1.08); }
          10%  { opacity: 1; }
          75%  { opacity: 1; transform: scale(1.18); }
          100% { opacity: 0; transform: scale(1.35); }
        }
        .intro-cosmos-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.85) contrast(1.1) saturate(1.2);
          animation: cosmos-drift 12s ease-in-out infinite alternate;
        }
        @keyframes cosmos-drift {
          from { transform: scale(1) translateX(0); }
          to   { transform: scale(1.06) translateX(-2%); }
        }
        .intro-vortex { position: absolute; left: 32%; top: 62%; width: 1px; height: 1px; }
        .intro-stream {
          position: absolute; top: 0; left: 0;
          width: 70vmax; height: 2.5px;
          transform-origin: 0 50%;
          transform: rotate(var(--angle));
          opacity: 0; filter: blur(1px);
          animation: stream-suck 2.6s ease-in var(--delay) infinite;
        }
        @keyframes stream-suck {
          0%   { opacity: 0; transform: rotate(var(--angle)) scaleX(1); }
          25%  { opacity: 1; }
          100% { opacity: 0; transform: rotate(var(--angle)) scaleX(0.04); }
        }
        .intro-singularity {
          position: absolute; top: -80px; left: -80px;
          width: 160px; height: 160px;
        }
        .intro-sing-disk {
          position: absolute; inset: 0; border-radius: 50%;
          background: conic-gradient(from 0deg,
            hsl(330,100%,70%), hsl(280,90%,65%),
            hsl(200,100%,72%), hsl(330,100%,70%));
          -webkit-mask: radial-gradient(circle, transparent 38%, #000 46%, #000 70%, transparent 78%);
                  mask: radial-gradient(circle, transparent 38%, #000 46%, #000 70%, transparent 78%);
          filter: blur(2px);
          animation: sing-spin 3s linear infinite;
        }
        .intro-sing-core {
          position: absolute; inset: 32%; border-radius: 50%;
          background: radial-gradient(circle, #000 55%, hsl(260,80%,12%) 85%, transparent);
          box-shadow:
            inset 0 0 25px #000,
            0 0 40px hsl(330,90%,50%),
            0 0 100px hsl(200,90%,55%);
        }
        @keyframes sing-spin { to { transform: rotate(360deg); } }

        /* ============== Taglines ============== */
        .intro-tagline {
          position: absolute; left: 50%; transform: translateX(-50%);
          text-align: center; font-family: 'Space Grotesk', sans-serif;
          color: white; opacity: 0; z-index: 6;
          padding: 0 1rem; width: min(92vw, 800px);
        }
        .intro-tagline-kicker {
          display: block; font-size: clamp(11px, 1.4vw, 14px);
          letter-spacing: 0.5em; text-transform: uppercase;
          color: hsl(200,100%,80%); margin-bottom: 0.6rem; opacity: 0.85;
        }
        .intro-tagline-line {
          display: block; font-size: clamp(22px, 4.2vw, 48px);
          font-weight: 300; letter-spacing: -0.01em; line-height: 1.15;
          background: linear-gradient(90deg, hsl(330,100%,82%), white 50%, hsl(200,100%,82%));
          -webkit-background-clip: text; background-clip: text;
          color: transparent;
          text-shadow: 0 0 40px hsl(280,80%,60%/0.6);
        }
        .intro-tagline-1 { top: 18%; animation: tag-in 3.2s ease-out 0.6s forwards; }
        .intro-tagline-2 { top: 14%; animation: tag-in 2.8s ease-out 5.6s forwards; }
        @keyframes tag-in {
          0%   { opacity: 0; transform: translate(-50%, 20px); filter: blur(8px); }
          25%  { opacity: 1; transform: translate(-50%, 0);    filter: blur(0); }
          80%  { opacity: 1; }
          100% { opacity: 0; filter: blur(4px); }
        }

        /* ============== ACT 2: Beam ============== */
        .intro-beam {
          position: absolute; top: 62%; left: 32%;
          width: 0; height: 5px;
          transform-origin: 0 50%;
          background: linear-gradient(90deg,
            hsl(280,100%,80%), hsl(330,100%,75%), hsl(200,100%,82%));
          box-shadow:
            0 0 18px hsl(330,100%,70%),
            0 0 50px hsl(200,100%,65%),
            0 0 90px hsl(280,100%,70%);
          opacity: 0;
          transform: rotate(-12deg);
          animation: beam-fire 1.4s cubic-bezier(0.7,0,0.3,1) 3.8s forwards;
          z-index: 3;
        }
        @keyframes beam-fire {
          0%   { width: 0;     opacity: 0; }
          15%  {                opacity: 1; }
          85%  { width: 80vmax; opacity: 1; }
          100% { width: 80vmax; opacity: 0; }
        }

        /* ============== ACT 3: Earth ============== */
        .intro-act-earth {
          z-index: 4;
          animation: act-earth-life 3.5s ease-out 4.8s forwards;
        }
        @keyframes act-earth-life {
          0%   { opacity: 0; transform: scale(0.6); }
          25%  { opacity: 1; transform: scale(1); }
          75%  { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(2.2); }
        }
        .intro-earth-img {
          position: absolute;
          top: 50%; left: 50%;
          width: min(70vmin, 700px);
          height: min(70vmin, 700px);
          object-fit: cover; border-radius: 50%;
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 0 60px hsl(200,100%,55%/0.7))
                  drop-shadow(0 0 120px hsl(220,80%,50%/0.5));
          animation: earth-rotate 30s linear infinite;
        }
        @keyframes earth-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .intro-earth-glow {
          position: absolute; top: 50%; left: 50%;
          width: min(80vmin, 800px); height: min(80vmin, 800px);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle, transparent 40%, hsl(200,100%,60%/0.25) 50%, transparent 70%);
          animation: earth-pulse 3s ease-in-out infinite;
        }
        @keyframes earth-pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.05); }
        }
        .intro-earth-impact {
          position: absolute;
          top: 50%; left: 50%;
          width: 30vmax; height: 30vmax;
          border-radius: 50%;
          background: radial-gradient(circle, white 0%, hsl(200,100%,75%) 25%, hsl(330,100%,60%) 50%, transparent 75%);
          opacity: 0;
          transform: translate(-50%, -50%);
          animation: impact 1s ease-out 0.4s forwards;
        }
        @keyframes impact {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
          40%  { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.8); }
        }

        /* ============== ACT 4: Quantum City ============== */
        .intro-act-city {
          z-index: 5;
          animation: act-city-life 5.5s ease-out 7.5s forwards;
        }
        @keyframes act-city-life {
          0%   { opacity: 0; transform: scale(1.25); filter: blur(10px); }
          18%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: scale(1.04); filter: blur(0); }
        }
        /* === 3D City stage === */
        .intro-city-3d-stage {
          position: absolute; inset: 0;
          perspective: 1200px;
          perspective-origin: 50% 65%;
          transform-style: preserve-3d;
          background:
            linear-gradient(to bottom,
              hsl(245,60%,4%) 0%,
              hsl(260,55%,8%) 35%,
              hsl(285,55%,12%) 60%,
              hsl(330,50%,10%) 80%,
              hsl(220,60%,3%) 100%);
          overflow: hidden;
          animation: city-cam 5.5s cubic-bezier(0.22,1,0.36,1) 7.5s forwards;
        }
        @keyframes city-cam {
          0%   { transform: scale(1.15) translateY(2%); }
          100% { transform: scale(1) translateY(0); }
        }
        .intro-city-sky {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 40% at 50% 35%, hsl(280,90%,40%/0.55), transparent 70%),
            radial-gradient(ellipse 60% 30% at 25% 45%, hsl(200,100%,50%/0.35), transparent 70%),
            radial-gradient(ellipse 60% 30% at 75% 50%, hsl(330,100%,55%/0.35), transparent 70%);
          mix-blend-mode: screen;
          opacity: 0.9;
        }
        .intro-city-sun {
          position: absolute;
          left: 50%; top: 38%;
          width: 220px; height: 220px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle,
            hsl(45,100%,75%) 0%,
            hsl(40,100%,60%/0.7) 22%,
            hsl(330,100%,55%/0.35) 50%,
            transparent 75%);
          filter: blur(2px);
          box-shadow: 0 0 80px hsl(45,100%,60%/0.7), 0 0 160px hsl(330,100%,55%/0.4);
        }
        .intro-city-ground {
          position: absolute; left: 0; right: 0; bottom: 0;
          height: 55%;
          transform-style: preserve-3d;
          transform: rotateX(72deg);
          transform-origin: 50% 0;
          background: linear-gradient(to bottom,
            hsl(280,60%,12%) 0%,
            hsl(220,60%,4%) 100%);
        }
        .intro-city-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(to right, hsl(200,100%,65%/0.55) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(330,100%,65%/0.45) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: linear-gradient(to bottom, transparent 0%, #000 30%, #000 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 30%, #000 100%);
          animation: grid-flow 6s linear infinite;
        }
        @keyframes grid-flow {
          0%   { background-position: 0 0, 0 0; }
          100% { background-position: 0 80px, 80px 0; }
        }
        .intro-city-skyline {
          position: absolute; left: 0; right: 0;
          bottom: 38%;
          height: 50vh;
          transform-style: preserve-3d;
        }
        .intro-city-skyline-far {
          bottom: 42%;
          opacity: 0.7;
          filter: blur(0.5px) saturate(0.85);
        }
        .intro-city-skyline-near {
          bottom: 36%;
          z-index: 2;
        }
        .intro-bldg {
          position: absolute;
          bottom: 0;
          border: 1px solid hsl(220,60%,3%);
          border-radius: 2px 2px 0 0;
          transform-origin: 50% 100%;
          animation: bldg-flicker 6s ease-in-out infinite;
          overflow: hidden;
        }
        @keyframes bldg-flicker {
          0%, 100% { filter: brightness(1); }
          47%      { filter: brightness(1.05); }
          50%      { filter: brightness(0.85); }
          53%      { filter: brightness(1.1); }
        }
        .intro-bldg-windows {
          position: absolute; inset: 6% 8% 6% 8%;
          background-size: 8px 10px, 7px 8px;
          opacity: 0.85;
          mix-blend-mode: screen;
          animation: window-twinkle 3s steps(8) infinite;
        }
        @keyframes window-twinkle {
          0%, 100% { opacity: 0.85; }
          50%      { opacity: 0.55; }
        }
        .intro-bldg-tip {
          position: absolute; left: 50%; top: -3px;
          width: 4px; height: 4px;
          transform: translateX(-50%);
          border-radius: 50%;
          animation: tip-blink 1.6s ease-in-out infinite;
        }
        @keyframes tip-blink {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) scale(0.8); }
          50%      { opacity: 1;   transform: translateX(-50%) scale(1.4); }
        }
        .intro-bldg-antenna {
          position: absolute; left: 50%; top: -16px;
          width: 1px; height: 16px;
          transform: translateX(-50%);
        }

        /* Hero tower (Quantum Bee HQ) */
        .intro-city-hero {
          position: absolute;
          left: 50%; bottom: 36%;
          transform: translateX(-50%);
          z-index: 3;
        }
        .intro-hero-tower {
          position: relative;
          width: 110px;
          height: 64vh;
          background: linear-gradient(180deg,
            hsl(45,100%,55%) 0%,
            hsl(40,100%,38%) 30%,
            hsl(220,60%,8%) 100%);
          border-radius: 6px 6px 0 0;
          box-shadow:
            0 0 60px hsl(45,100%,55%/0.7),
            0 0 120px hsl(330,100%,55%/0.4),
            inset 0 0 24px hsl(220,60%,3%);
          transform-origin: 50% 100%;
          animation: hero-tower-rise 1.6s cubic-bezier(0.22,1,0.36,1) 8s backwards;
        }
        @keyframes hero-tower-rise {
          0%   { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        .intro-hero-windows {
          position: absolute; inset: 6% 12% 6% 12%;
          background-image:
            repeating-linear-gradient(0deg, transparent 0 8px, hsl(45,100%,75%/0.85) 8px 10px),
            repeating-linear-gradient(90deg, transparent 0 10px, hsl(45,100%,70%/0.5) 10px 11px);
          mix-blend-mode: screen;
          animation: window-twinkle 2.4s steps(6) infinite;
        }
        .intro-hero-spire {
          position: absolute; left: 50%; top: -42px;
          width: 4px; height: 42px;
          transform: translateX(-50%);
          background: linear-gradient(to top, hsl(45,100%,55%), white);
          box-shadow: 0 0 16px hsl(45,100%,60%);
        }
        .intro-hero-ring {
          position: absolute; left: 50%; top: 18%;
          width: 220px; height: 60px;
          transform: translate(-50%, -50%) rotateX(72deg);
          border: 2px solid hsl(200,100%,70%);
          border-radius: 50%;
          box-shadow: 0 0 18px hsl(200,100%,60%), inset 0 0 18px hsl(200,100%,60%);
          opacity: 0.85;
          animation: ring-spin 6s linear infinite;
        }
        .intro-hero-ring-2 {
          top: 35%;
          width: 280px; height: 80px;
          border-color: hsl(330,100%,70%);
          box-shadow: 0 0 18px hsl(330,100%,60%), inset 0 0 18px hsl(330,100%,60%);
          animation-duration: 9s;
          animation-direction: reverse;
        }
        @keyframes ring-spin {
          0%   { transform: translate(-50%, -50%) rotateX(72deg) rotateZ(0deg); }
          100% { transform: translate(-50%, -50%) rotateX(72deg) rotateZ(360deg); }
        }
        .intro-city-vignette {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 50% 65%, transparent 25%, rgba(0,0,0,0.7) 100%),
            linear-gradient(to bottom, hsl(200,90%,40%/0.12), transparent 35%, hsl(220,80%,4%/0.55));
          pointer-events: none;
        }
        .intro-city-chroma {
          position: absolute; inset: 0;
          mix-blend-mode: screen;
          background:
            radial-gradient(circle at 22% 70%, hsl(200,100%,55%/0.25), transparent 35%),
            radial-gradient(circle at 78% 65%, hsl(330,100%,55%/0.22), transparent 38%);
          opacity: 0;
          animation: chroma-in 1.4s ease-out 7.8s forwards;
          pointer-events: none;
        }
        @keyframes chroma-in { to { opacity: 1; } }

        /* ====== Fog drift ====== */
        .intro-city-fog {
          position: absolute; inset: -10% -20%;
          background: radial-gradient(ellipse at 30% 60%, hsl(210,30%,75%/0.18), transparent 55%),
                      radial-gradient(ellipse at 70% 70%, hsl(200,40%,80%/0.14), transparent 60%);
          mix-blend-mode: screen;
          opacity: 0;
          pointer-events: none;
        }
        .intro-city-fog-1 { animation: fog-in 2s ease-out 7.8s forwards, fog-drift-a 14s linear 8s infinite; }
        .intro-city-fog-2 {
          background: radial-gradient(ellipse at 60% 50%, hsl(330,40%,70%/0.12), transparent 60%),
                      radial-gradient(ellipse at 20% 75%, hsl(200,50%,75%/0.16), transparent 55%);
          animation: fog-in 2s ease-out 8.4s forwards, fog-drift-b 18s linear 8s infinite;
        }
        @keyframes fog-in { to { opacity: 1; } }
        @keyframes fog-drift-a {
          0% { transform: translateX(-3%); }
          100% { transform: translateX(3%); }
        }
        @keyframes fog-drift-b {
          0% { transform: translateX(2%) translateY(-1%); }
          100% { transform: translateX(-2%) translateY(1%); }
        }

        /* ====== Rain ====== */
        .intro-city-rain {
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            105deg,
            transparent 0 3px,
            hsl(200,80%,85%/0.18) 3px 4px,
            transparent 4px 9px
          );
          opacity: 0;
          mix-blend-mode: screen;
          animation: rain-in 1s ease-out 8s forwards, rain-fall 0.6s linear 8s infinite;
          pointer-events: none;
        }
        @keyframes rain-in { to { opacity: 0.55; } }
        @keyframes rain-fall {
          0%   { background-position: 0 0; }
          100% { background-position: -60px 200px; }
        }

        /* ====== Flying cars ====== */
        .intro-flycar {
          position: absolute; left: -10%;
          width: 60px; height: 2px;
          background: linear-gradient(90deg, transparent, hsl(var(--hue),100%,70%), white);
          box-shadow: 0 0 8px hsl(var(--hue),100%,65%),
                      0 0 18px hsl(var(--hue),100%,60%);
          border-radius: 2px;
          opacity: 0;
          animation: flycar-streak linear forwards;
          pointer-events: none;
          filter: blur(0.4px);
        }
        @keyframes flycar-streak {
          0%   { left: -10%;  opacity: 0; }
          15%  {              opacity: 1; }
          85%  {              opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }

        /* ====== Neon flicker overlay ====== */
        .intro-city-flicker {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 25% 55%, hsl(45,100%,60%/0.15), transparent 12%),
                      radial-gradient(circle at 70% 50%, hsl(330,100%,60%/0.18), transparent 14%),
                      radial-gradient(circle at 55% 70%, hsl(200,100%,60%/0.18), transparent 16%);
          mix-blend-mode: screen;
          opacity: 0;
          animation: flicker-in 0.4s ease-out 8s forwards, neon-flicker 2.4s steps(8) 8.4s infinite;
          pointer-events: none;
        }
        @keyframes flicker-in { to { opacity: 1; } }
        @keyframes neon-flicker {
          0%, 100% { opacity: 1; }
          25%      { opacity: 0.75; }
          27%      { opacity: 1; }
          50%      { opacity: 0.85; }
          53%      { opacity: 1; }
          78%      { opacity: 0.7; }
          80%      { opacity: 1; }
        }

        /* ====== HUD scan ====== */
        .intro-city-scan {
          position: absolute; left: 0; right: 0; top: 0;
          height: 140px;
          background: linear-gradient(to bottom,
            transparent,
            hsl(200,100%,70%/0.18) 45%,
            hsl(200,100%,80%/0.35) 50%,
            hsl(200,100%,70%/0.18) 55%,
            transparent);
          mix-blend-mode: screen;
          opacity: 0;
          animation: scan-in 0.4s ease-out 8.2s forwards, scan-sweep 3.2s ease-in-out 8.6s infinite;
          pointer-events: none;
        }
        @keyframes scan-in { to { opacity: 1; } }
        @keyframes scan-sweep {
          0%   { transform: translateY(-20%); }
          100% { transform: translateY(120vh); }
        }

        /* ====== HUD frame ====== */
        .intro-city-hud {
          position: absolute; inset: 8% 6%;
          opacity: 0;
          animation: hud-in 0.6s ease-out 8.4s forwards;
          pointer-events: none;
          z-index: 6;
        }
        @keyframes hud-in { to { opacity: 1; } }
        .intro-hud-corner {
          position: absolute; width: 38px; height: 38px;
          border: 1.5px solid hsl(200,100%,75%);
          box-shadow: 0 0 10px hsl(200,100%,60%/0.6);
        }
        .intro-hud-tl { top: 0; left: 0; border-right: none; border-bottom: none; }
        .intro-hud-tr { top: 0; right: 0; border-left: none; border-bottom: none; }
        .intro-hud-bl { bottom: 0; left: 0; border-right: none; border-top: none; }
        .intro-hud-br { bottom: 0; right: 0; border-left: none; border-top: none; }
        .intro-hud-readout {
          position: absolute; bottom: -28px; left: 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.25em;
          color: hsl(200,100%,80%);
          text-shadow: 0 0 8px hsl(200,100%,55%);
          opacity: 0.85;
        }

        /* ====== HQ holographic logo lock ====== */
        .intro-hq-wrap {
          position: absolute;
          left: 50%; bottom: 22%;
          width: min(28vw, 240px);
          aspect-ratio: 1;
          transform: translateX(-50%);
          opacity: 0;
          animation: hq-in 1.2s cubic-bezier(0.22,1,0.36,1) 9s forwards;
          z-index: 6;
        }
        @keyframes hq-in {
          0%   { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.85); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1); }
        }
        .intro-hq-beam {
          position: absolute; left: 50%; top: 50%;
          width: 2px; height: 60vh;
          transform: translate(-50%, -10%);
          background: linear-gradient(to top,
            hsl(45,100%,70%/0.7), hsl(200,100%,70%/0.3), transparent);
          box-shadow: 0 0 12px hsl(200,100%,65%/0.6);
          opacity: 0;
          animation: beam-in 0.6s ease-out 9.2s forwards, beam-flicker 0.18s steps(3) 9.8s infinite;
        }
        @keyframes beam-in { to { opacity: 0.9; } }
        @keyframes beam-flicker {
          0%, 100% { opacity: 0.9; }
          50%      { opacity: 0.65; }
        }
        .intro-hq-logo {
          position: absolute;
          inset: 0;
          transform: scale(0);
          opacity: 0;
          animation: logo-pop 1.1s cubic-bezier(0.34,1.56,0.64,1) 9.6s forwards;
        }
        @keyframes logo-pop {
          0%   { opacity: 0; transform: scale(0) rotate(-180deg); }
          70%  { opacity: 1; transform: scale(1.18) rotate(15deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .intro-logo-pulse {
          position: absolute; inset: -30%;
          border-radius: 50%;
          background: radial-gradient(circle, hsl(45,100%,70%/0.55) 0%, hsl(330,100%,60%/0.25) 40%, transparent 70%);
          animation: logo-pulse 2s ease-in-out 9.9s infinite;
        }
        @keyframes logo-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.8; }
          50%      { transform: scale(1.25); opacity: 1; }
        }

        /* City label */
        .intro-city-label {
          position: absolute;
          left: 50%; top: 14%;
          transform: translateX(-50%);
          text-align: center;
          font-family: 'Space Grotesk', sans-serif;
          color: white;
          opacity: 0;
          z-index: 6;
          animation: tag-in 3.5s ease-out 8.2s forwards;
        }
        .intro-city-kicker {
          display: block;
          font-size: clamp(10px, 1.2vw, 13px);
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: hsl(200,100%,80%);
          margin-bottom: 0.5rem;
        }
        .intro-city-name {
          display: block;
          font-size: clamp(28px, 5vw, 64px);
          font-weight: 700;
          letter-spacing: 0.2em;
          background: linear-gradient(90deg, hsl(45,100%,75%), white, hsl(200,100%,80%));
          -webkit-background-clip: text; background-clip: text;
          color: transparent;
          text-shadow: 0 0 40px hsl(200,100%,60%/0.6);
        }
        .intro-city-tag {
          display: block;
          font-size: clamp(11px, 1.3vw, 14px);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: hsl(200,100%,85%);
          margin-top: 0.5rem;
          opacity: 0.9;
        }

        /* ============== ACT 5: Final burst through gate ============== */
        .intro-gate-burst {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 70%,
            white 0%, hsl(45,100%,85%) 15%,
            hsl(330,100%,72%) 35%, hsl(200,100%,68%) 60%,
            transparent 85%);
          opacity: 0;
          transform: scale(0.15);
          z-index: 7;
          animation: gate-burst 1.8s cubic-bezier(0.4,0,0.2,1) 12.5s forwards;
        }
        @keyframes gate-burst {
          0%   { opacity: 0; transform: scale(0.15); }
          50%  { opacity: 1; transform: scale(1.5); }
          100% { opacity: 1; transform: scale(3.4); }
        }

        /* ============== BLACK HOLE 3D UPGRADES ============== */
        .intro-sing-lens {
          position: absolute; inset: -60%;
          border-radius: 50%;
          background: radial-gradient(circle, transparent 38%, hsl(220,80%,8%/0.6) 46%, transparent 60%);
          filter: blur(6px);
          animation: lens-warp 6s ease-in-out infinite;
        }
        @keyframes lens-warp {
          0%,100% { transform: scale(1) rotate(0deg); opacity: 0.85; }
          50%     { transform: scale(1.08) rotate(8deg); opacity: 1; }
        }
        .intro-sing-disk-2 {
          inset: -8%;
          filter: blur(4px);
          opacity: 0.7;
          transform: rotateX(75deg);
          animation: sing-spin 5s linear reverse infinite;
        }
        .intro-sing-jet {
          position: absolute; left: 50%; width: 6px; height: 240px;
          transform-origin: 50% 0;
          background: linear-gradient(to bottom,
            white, hsl(200,100%,75%) 25%,
            hsl(280,100%,65%/0.6) 65%, transparent);
          filter: blur(2px);
          box-shadow: 0 0 18px hsl(200,100%,70%), 0 0 40px hsl(280,100%,60%);
          opacity: 0.9;
          animation: jet-pulse 1.4s ease-in-out infinite;
        }
        .intro-sing-jet-top { top: -240px; transform: translateX(-50%) rotate(180deg); }
        .intro-sing-jet-bot { top: 100%;   transform: translateX(-50%); }
        @keyframes jet-pulse {
          0%,100% { transform: translateX(-50%) scaleY(1) rotate(var(--r,0deg)); opacity: 0.85; }
          50%     { transform: translateX(-50%) scaleY(1.15) rotate(var(--r,0deg)); opacity: 1; }
        }
        .intro-sing-jet-top { --r: 180deg; }

        /* ============== HOLOGRAPHIC DRONES ============== */
        .intro-drone {
          position: absolute;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: radial-gradient(circle,
            white 0%,
            hsl(var(--hue),100%,70%) 35%,
            hsl(var(--hue),100%,45%/0.5) 65%,
            transparent 80%);
          box-shadow:
            0 0 14px hsl(var(--hue),100%,65%),
            0 0 32px hsl(var(--hue),100%,55%);
          opacity: 0;
          z-index: 5;
          animation:
            drone-in 0.6s ease-out forwards,
            drone-hover 4.6s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes drone-in { to { opacity: 1; } }
        @keyframes drone-hover {
          0%,100% { transform: translate(0,0); }
          25%     { transform: translate(18px,-12px); }
          50%     { transform: translate(-10px,-22px); }
          75%     { transform: translate(-22px,-6px); }
        }

        /* ============== HOLOGRAPHIC ROBOT GUARDIAN ============== */
        .intro-robot {
          position: absolute;
          left: 50%; bottom: 18%;
          width: min(34vw, 320px);
          height: 56vh;
          transform: translateX(-50%);
          opacity: 0;
          z-index: 4;
          animation: robot-in 1.4s cubic-bezier(0.22,1,0.36,1) 9s forwards,
                     robot-float 6s ease-in-out 10.4s infinite;
          mix-blend-mode: screen;
          pointer-events: none;
        }
        @keyframes robot-in {
          0%   { opacity: 0; transform: translateX(-50%) translateY(40px) scale(0.94); filter: blur(10px); }
          100% { opacity: 0.85; transform: translateX(-50%) translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes robot-float {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%     { transform: translateX(-50%) translateY(-10px); }
        }
        .intro-robot-head {
          position: absolute; left: 50%; top: 8%;
          width: 38%; height: 22%;
          transform: translateX(-50%);
          background: linear-gradient(180deg,
            hsl(200,100%,70%/0.55), hsl(220,80%,40%/0.25));
          border: 1.5px solid hsl(200,100%,70%/0.7);
          border-radius: 22% 22% 16% 16% / 30% 30% 18% 18%;
          box-shadow:
            0 0 22px hsl(200,100%,60%/0.7),
            inset 0 0 18px hsl(200,100%,75%/0.5);
        }
        .intro-robot-eye {
          position: absolute; top: 16%;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: radial-gradient(circle, white, hsl(45,100%,60%) 60%, transparent);
          box-shadow: 0 0 12px hsl(45,100%,60%), 0 0 24px hsl(330,100%,55%);
          animation: robot-eye 2.4s ease-in-out infinite;
        }
        .intro-robot-eye-l { left: 38%; }
        .intro-robot-eye-r { right: 38%; }
        @keyframes robot-eye {
          0%,90%,100% { opacity: 1; transform: scale(1); }
          93%,97%     { opacity: 0.2; transform: scale(0.7); }
        }
        .intro-robot-body {
          position: absolute; left: 50%; top: 28%;
          width: 60%; height: 60%;
          transform: translateX(-50%);
          background:
            linear-gradient(180deg, hsl(200,90%,55%/0.35), hsl(280,80%,40%/0.2));
          border: 1.5px solid hsl(200,100%,70%/0.6);
          border-radius: 18% 18% 26% 26% / 14% 14% 18% 18%;
          box-shadow:
            0 0 28px hsl(200,100%,60%/0.6),
            inset 0 0 26px hsl(280,100%,60%/0.4);
          /* circuitry */
          background-image:
            repeating-linear-gradient(0deg, transparent 0 12px, hsl(200,100%,70%/0.18) 12px 13px),
            repeating-linear-gradient(90deg, transparent 0 14px, hsl(330,100%,70%/0.15) 14px 15px);
        }
        .intro-robot-scan {
          position: absolute; left: 50%; top: 28%;
          width: 60%; height: 4px;
          transform: translateX(-50%);
          background: linear-gradient(90deg, transparent, hsl(200,100%,80%), transparent);
          box-shadow: 0 0 10px hsl(200,100%,70%);
          animation: robot-scan 3.4s ease-in-out infinite;
        }
        @keyframes robot-scan {
          0%   { top: 28%; opacity: 0.2; }
          50%  { opacity: 1; }
          100% { top: 86%; opacity: 0.2; }
        }

        /* ============== HOLOGRAPHIC DATA STREAM ============== */
        .intro-datastream {
          position: absolute; inset: 0;
          z-index: 5;
          pointer-events: none;
          opacity: 0;
          animation: hud-in 0.6s ease-out 8.6s forwards;
        }
        .intro-data-line {
          position: absolute; top: -10%;
          width: 1px; height: 30vh;
          background: linear-gradient(to bottom,
            transparent,
            hsl(140,100%,70%/0.85) 50%,
            transparent);
          box-shadow: 0 0 6px hsl(140,100%,60%);
          animation: data-fall linear infinite;
          opacity: 0.7;
          mix-blend-mode: screen;
        }
        @keyframes data-fall {
          0%   { transform: translateY(-30vh); opacity: 0; }
          15%  { opacity: 0.85; }
          85%  { opacity: 0.85; }
          100% { transform: translateY(120vh); opacity: 0; }
        }

        /* ============== HYPER-GLASS BUILDING SHINE / LOGO ============== */
        .intro-bldg-glass { overflow: hidden; border-radius: 4px 4px 0 0; }
        .intro-bldg-shine {
          position: absolute; inset: 0;
          background: linear-gradient(115deg,
            transparent 35%,
            hsl(200,100%,95%/0.55) 48%,
            hsl(330,100%,90%/0.4) 52%,
            transparent 65%);
          mix-blend-mode: screen;
          transform: translateX(-120%);
          animation: bldg-shine 6s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes bldg-shine {
          0%, 60%  { transform: translateX(-120%); }
          80%      { transform: translateX(120%); }
          100%     { transform: translateX(120%); }
        }
        .intro-bldg-logo {
          position: absolute; left: 50%; bottom: 18%;
          transform: translateX(-50%);
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          padding: 2px 6px;
          border: 1px solid;
          border-radius: 2px;
          background: hsl(220,40%,5%/0.5);
          backdrop-filter: blur(2px);
          opacity: 0.9;
          white-space: nowrap;
        }

        /* ============== PATROL MECH ROBOTS ============== */
        .intro-mech {
          position: absolute;
          width: 120px; height: 220px;
          transform-origin: 50% 100%;
          opacity: 0;
          z-index: 4;
          mix-blend-mode: screen;
          pointer-events: none;
          animation: mech-in 0.8s ease-out forwards;
        }
        @keyframes mech-in {
          from { opacity: 0; }
          to   { opacity: 0.92; }
        }
        .intro-mech-head {
          position: absolute; left: 50%; top: 0;
          width: 46px; height: 38px;
          transform: translateX(-50%);
          background: linear-gradient(180deg,
            hsl(var(--hue),100%,75%/0.55), hsl(var(--hue),80%,40%/0.3));
          border: 1.5px solid hsl(var(--hue),100%,75%/0.8);
          border-radius: 30% 30% 18% 18%;
          box-shadow: 0 0 18px hsl(var(--hue),100%,60%/0.7),
                      inset 0 0 12px hsl(var(--hue),100%,80%/0.4);
        }
        .intro-mech-eye {
          position: absolute; left: 50%; top: 18px;
          width: 18px; height: 5px;
          transform: translateX(-50%);
          background: linear-gradient(90deg, transparent, hsl(45,100%,70%), transparent);
          box-shadow: 0 0 10px hsl(45,100%,60%), 0 0 18px hsl(330,100%,55%);
          animation: mech-eye 2.6s ease-in-out infinite;
        }
        @keyframes mech-eye {
          0%,90%,100% { opacity: 1; }
          93%,97%     { opacity: 0.2; }
        }
        .intro-mech-body {
          position: absolute; left: 50%; top: 40px;
          width: 70px; height: 90px;
          transform: translateX(-50%);
          background: linear-gradient(180deg,
            hsl(var(--hue),90%,55%/0.4), hsl(280,80%,40%/0.25));
          border: 1.5px solid hsl(var(--hue),100%,75%/0.7);
          border-radius: 14px 14px 18px 18px;
          box-shadow: 0 0 22px hsl(var(--hue),100%,60%/0.6),
                      inset 0 0 18px hsl(var(--hue),100%,75%/0.4);
          background-image:
            repeating-linear-gradient(0deg, transparent 0 9px, hsl(var(--hue),100%,75%/0.18) 9px 10px);
        }
        .intro-mech-arm {
          position: absolute; top: 46px;
          width: 12px; height: 70px;
          background: linear-gradient(180deg,
            hsl(var(--hue),90%,60%/0.5), hsl(var(--hue),80%,30%/0.3));
          border: 1px solid hsl(var(--hue),100%,75%/0.6);
          border-radius: 6px;
          box-shadow: 0 0 10px hsl(var(--hue),100%,55%/0.6);
          transform-origin: 50% 0;
          animation: mech-arm 1.6s ease-in-out infinite;
        }
        .intro-mech-arm-l { left: 12px; }
        .intro-mech-arm-r { right: 12px; animation-direction: reverse; }
        @keyframes mech-arm {
          0%,100% { transform: rotate(-8deg); }
          50%     { transform: rotate(10deg); }
        }
        .intro-mech-leg {
          position: absolute; top: 132px;
          width: 16px; height: 78px;
          background: linear-gradient(180deg,
            hsl(var(--hue),90%,55%/0.5), hsl(var(--hue),80%,25%/0.35));
          border: 1px solid hsl(var(--hue),100%,75%/0.6);
          border-radius: 6px;
          box-shadow: 0 0 10px hsl(var(--hue),100%,55%/0.6);
          transform-origin: 50% 0;
          animation: mech-leg 1.6s ease-in-out infinite;
        }
        .intro-mech-leg-l { left: 32px; }
        .intro-mech-leg-r { right: 32px; animation-direction: reverse; }
        @keyframes mech-leg {
          0%,100% { transform: rotate(6deg); }
          50%     { transform: rotate(-6deg); }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;
