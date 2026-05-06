import { useEffect, useMemo, useState } from "react";
import beeLogo from "@/assets/bee-logo.png";
import cosmos from "@/assets/intro-cosmos.jpg";
import earth from "@/assets/intro-earth.jpg";

const STORAGE_KEY = "beee_intro_played_v7";
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
            <div className="intro-sing-disk" />
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
        <img src={city} alt="" className="intro-city-img" />

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

        {/* HQ holographic logo lock */}
        <div className="intro-hq-wrap">
          <div className="intro-hq-beam" />
          <div className="intro-hq-logo">
            <div className="intro-logo-pulse" />
            <img src={beeLogo} alt="" className="w-full h-full object-contain relative z-10" />
          </div>
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
        .intro-city-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.72) contrast(1.25) saturate(0.95) hue-rotate(-6deg);
          transform-origin: 52% 60%;
          animation: city-pan 5.5s cubic-bezier(0.22,1,0.36,1) 7.5s forwards;
        }
        @keyframes city-pan {
          0%   { transform: scale(1.22) translate(2%, 3%); }
          100% { transform: scale(1.06) translate(-1%, 0); }
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
      `}</style>
    </div>
  );
};

export default IntroAnimation;
