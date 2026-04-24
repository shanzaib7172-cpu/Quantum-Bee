import { useEffect, useState } from "react";
import beeLogo from "@/assets/bee-logo.png";

const STORAGE_KEY = "beee_intro_played_v2";

const IntroAnimation = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(STORAGE_KEY);
  });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!show) return;
    const fadeTimer = setTimeout(() => setFadeOut(true), 8200);
    const endTimer = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setShow(false);
    }, 9000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden bg-[hsl(240,60%,3%)] ${
        fadeOut ? "intro-fade-out" : ""
      }`}
      aria-hidden="true"
    >
      {/* Skip button */}
      <button
        onClick={() => {
          sessionStorage.setItem(STORAGE_KEY, "1");
          setShow(false);
        }}
        className="absolute top-4 right-4 z-[10000] px-3 py-1.5 text-xs rounded-full bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-md border border-white/20"
      >
        Skip intro →
      </button>

      {/* Starfield */}
      <div className="absolute inset-0">
        {Array.from({ length: 90 }).map((_, i) => {
          const top = (i * 37 + 7) % 100;
          const left = (i * 53 + 13) % 100;
          const size = ((i * 7) % 3) + 1;
          return (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: size,
                height: size,
                opacity: 0.6,
                animation: `twinkle ${2 + (i % 4)}s ease-in-out ${(i % 5) * 0.3}s infinite`,
              }}
            />
          );
        })}
      </div>

      {/* ============ SCENE 1: Pink + Blue energy swirling into black hole (0-3s) ============ */}
      <div className="intro-scene intro-scene-1">
        {/* Energy streams */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * 360;
          const isPink = i % 2 === 0;
          return (
            <span
              key={i}
              className="intro-energy-stream"
              style={
                {
                  ["--angle" as any]: `${angle}deg`,
                  ["--delay" as any]: `${(i % 6) * 0.1}s`,
                  background: `linear-gradient(90deg, transparent, ${
                    isPink ? "hsl(330,100%,75%)" : "hsl(200,100%,70%)"
                  }, transparent)`,
                } as React.CSSProperties
              }
            />
          );
        })}

        {/* Black hole */}
        <div className="intro-blackhole">
          <div className="intro-bh-core" />
          <div className="intro-bh-disk" />
          <div className="intro-bh-disk intro-bh-disk-2" />
          <div className="intro-bh-glow" />
        </div>
      </div>

      {/* ============ SCENE 2: Beam shoots out (2.6-3.6s) ============ */}
      <div className="intro-beam-out" />
      <div className="intro-beam-flash" />

      {/* ============ SCENE 3: World map (3.2-6s) ============ */}
      <div className="intro-world-wrap">
        <svg
          className="intro-world"
          viewBox="0 0 1000 500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="worldGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(200,100%,70%)" stopOpacity="0.9" />
              <stop offset="60%" stopColor="hsl(260,80%,55%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(330,80%,40%)" stopOpacity="0.2" />
            </radialGradient>
            <filter id="worldGlow">
              <feGaussianBlur stdDeviation="3" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Globe sphere */}
          <circle cx="500" cy="250" r="220" fill="url(#worldGrad)" opacity="0.3" />
          {/* Latitude lines */}
          {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
            <ellipse
              key={`lat-${i}`}
              cx="500"
              cy="250"
              rx="220"
              ry={220 * p}
              fill="none"
              stroke="hsl(200,100%,70%)"
              strokeWidth="0.6"
              opacity="0.5"
            />
          ))}
          {/* Longitude lines */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((p, i) => (
            <ellipse
              key={`lon-${i}`}
              cx="500"
              cy="250"
              rx={220 * p}
              ry="220"
              fill="none"
              stroke="hsl(330,100%,75%)"
              strokeWidth="0.6"
              opacity="0.4"
            />
          ))}
          {/* Continent dots */}
          {Array.from({ length: 220 }).map((_, i) => {
            const a = (i * 137.5) % 360;
            const r = Math.sqrt((i * 11) % 220 / 220) * 215;
            const x = 500 + Math.cos((a * Math.PI) / 180) * r;
            const y = 250 + Math.sin((a * Math.PI) / 180) * r * 0.85;
            return (
              <circle
                key={`d-${i}`}
                cx={x}
                cy={y}
                r={1.4}
                fill={i % 3 === 0 ? "hsl(330,100%,80%)" : "hsl(200,100%,75%)"}
                filter="url(#worldGlow)"
              />
            );
          })}
        </svg>
      </div>

      {/* ============ SCENE 4: HQ Building rises with logo (5-7s) ============ */}
      <div className="intro-hq-wrap">
        <div className="intro-hq-glow" />
        <div className="intro-hq-building">
          {/* Windows */}
          <div className="intro-hq-windows">
            {Array.from({ length: 32 }).map((_, i) => (
              <span key={i} style={{ animationDelay: `${(i % 8) * 0.08}s` }} />
            ))}
          </div>

          {/* Big logo on top */}
          <div className="intro-hq-logo">
            <img src={beeLogo} alt="" className="w-full h-full object-contain" />
          </div>
          <div className="intro-hq-logo-text">QUANTUM BEE</div>

          {/* Gate at the bottom */}
          <div className="intro-hq-gate">
            <div className="intro-hq-gate-light" />
          </div>
        </div>
      </div>

      {/* ============ SCENE 5: Push through gate — final white burst (7-8.2s) ============ */}
      <div className="intro-push-burst" />

      <style>{`
        @keyframes intro-fade {
          to { opacity: 0; }
        }
        .intro-fade-out {
          animation: intro-fade 0.8s ease-out forwards;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50%      { opacity: 1; }
        }

        /* ===== Scene 1: Black hole + energy ===== */
        .intro-scene-1 {
          position: absolute;
          inset: 0;
          opacity: 0;
          animation: scene1-life 3.4s ease-out 0s forwards;
        }
        @keyframes scene1-life {
          0%   { opacity: 0; }
          15%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: scale(1.4); }
        }

        .intro-blackhole {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 260px;
          height: 260px;
          transform: translate(-50%, -50%);
        }
        .intro-bh-core {
          position: absolute;
          inset: 30%;
          border-radius: 50%;
          background: radial-gradient(circle, #000 50%, hsl(260,80%,12%) 80%, transparent 100%);
          box-shadow:
            inset 0 0 30px #000,
            0 0 50px hsl(330,90%,45%),
            0 0 110px hsl(200,90%,55%);
        }
        .intro-bh-disk {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(from 0deg,
            hsl(330,100%,70%),
            hsl(280,90%,65%),
            hsl(200,100%,70%),
            hsl(330,100%,70%));
          -webkit-mask: radial-gradient(circle, transparent 50%, #000 56%, #000 72%, transparent 78%);
                  mask: radial-gradient(circle, transparent 50%, #000 56%, #000 72%, transparent 78%);
          filter: blur(2px);
          animation: bh-spin 3s linear infinite;
        }
        .intro-bh-disk-2 {
          transform: scale(1.25) rotate(30deg);
          animation-duration: 5s;
          animation-direction: reverse;
          opacity: 0.6;
        }
        .intro-bh-glow {
          position: absolute;
          inset: -80%;
          border-radius: 50%;
          background: radial-gradient(circle, hsl(280,80%,50%/0.25) 0%, transparent 60%);
          animation: bh-glow-pulse 2.4s ease-in-out infinite;
        }
        @keyframes bh-spin { to { transform: rotate(360deg); } }
        @keyframes bh-glow-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.1); }
        }

        /* Energy streams sucking into the hole */
        .intro-energy-stream {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60vmax;
          height: 3px;
          transform-origin: 0 50%;
          transform: translate(0, -50%) rotate(var(--angle));
          opacity: 0;
          filter: blur(1px);
          animation: energy-suck 2.4s ease-in var(--delay) infinite;
        }
        @keyframes energy-suck {
          0%   { opacity: 0; transform: translate(0, -50%) rotate(var(--angle)) scaleX(1); }
          25%  { opacity: 1; }
          100% { opacity: 0; transform: translate(0, -50%) rotate(var(--angle)) scaleX(0.05); }
        }

        /* ===== Beam ===== */
        .intro-beam-out {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 6px;
          transform-origin: 0 50%;
          transform: translate(0, -50%);
          background: linear-gradient(90deg,
            hsl(330,100%,80%) 0%,
            hsl(280,100%,75%) 50%,
            hsl(200,100%,80%) 100%);
          box-shadow:
            0 0 20px hsl(330,100%,70%),
            0 0 50px hsl(200,100%,65%);
          opacity: 0;
          animation: beam-out 1.2s cubic-bezier(0.7,0,0.3,1) 2.6s forwards;
        }
        @keyframes beam-out {
          0%   { width: 0;     opacity: 0; }
          15%  {                opacity: 1; }
          100% { width: 70vmax; opacity: 0; }
        }
        .intro-beam-flash {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, hsl(280,100%,85%) 0%, hsl(330,100%,70%) 20%, transparent 60%);
          opacity: 0;
          animation: beam-flash 0.5s ease-out 3.4s forwards;
        }
        @keyframes beam-flash {
          0%   { opacity: 0; }
          50%  { opacity: 0.9; }
          100% { opacity: 0; }
        }

        /* ===== World map ===== */
        .intro-world-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(90vw, 700px);
          height: min(90vw, 700px);
          transform: translate(-50%, -50%) scale(0.4);
          opacity: 0;
          animation: world-life 3s cubic-bezier(0.22,1,0.36,1) 3.4s forwards;
        }
        @keyframes world-life {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.4) rotateY(40deg); }
          25%  { opacity: 1; transform: translate(-50%, -50%) scale(1)   rotateY(0deg); }
          80%  { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.6); }
        }
        .intro-world {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 30px hsl(200,100%,60%/0.6))
                  drop-shadow(0 0 60px hsl(330,100%,60%/0.4));
          animation: world-spin 8s linear infinite;
        }
        @keyframes world-spin {
          to { transform: rotate(360deg); }
        }

        /* ===== HQ Building ===== */
        .intro-hq-wrap {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) translateY(100%);
          width: min(80vw, 380px);
          height: min(85vh, 560px);
          opacity: 0;
          animation: hq-life 3.5s cubic-bezier(0.22,1,0.36,1) 5s forwards;
        }
        @keyframes hq-life {
          0%   { opacity: 0; transform: translateX(-50%) translateY(100%); }
          25%  { opacity: 1; transform: translateX(-50%) translateY(0%); }
          70%  { opacity: 1; transform: translateX(-50%) translateY(0%) scale(1); }
          100% { opacity: 1; transform: translateX(-50%) translateY(-10%) scale(2.2); }
        }
        .intro-hq-glow {
          position: absolute;
          inset: -50% -50% 0 -50%;
          background: radial-gradient(ellipse at center bottom, hsl(280,100%,55%/0.4) 0%, transparent 60%);
          pointer-events: none;
        }
        .intro-hq-building {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 100%;
          background:
            linear-gradient(180deg, hsl(240,40%,14%) 0%, hsl(240,50%,6%) 100%);
          border: 1px solid hsl(200,60%,30%);
          border-bottom: none;
          clip-path: polygon(15% 0, 85% 0, 100% 8%, 100% 100%, 0 100%, 0 8%);
          box-shadow:
            inset 0 0 60px hsl(240,60%,3%),
            0 0 60px hsl(330,80%,50%/0.4),
            0 0 120px hsl(200,90%,55%/0.3);
        }
        .intro-hq-windows {
          position: absolute;
          left: 8%;
          right: 8%;
          top: 38%;
          bottom: 28%;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: 1fr;
          gap: 6px;
        }
        .intro-hq-windows span {
          background: hsl(45,90%,60%);
          opacity: 0.25;
          border-radius: 1px;
          box-shadow: 0 0 6px hsl(45,100%,65%);
          animation: window-flicker 2.4s ease-in-out infinite;
        }
        @keyframes window-flicker {
          0%, 100% { opacity: 0.25; }
          50%      { opacity: 0.9; }
        }
        .intro-hq-logo {
          position: absolute;
          top: 6%;
          left: 50%;
          transform: translateX(-50%) scale(0);
          width: 38%;
          aspect-ratio: 1;
          opacity: 0;
          filter: drop-shadow(0 0 20px hsl(45,100%,55%))
                  drop-shadow(0 0 50px hsl(330,100%,60%));
          animation: hq-logo-pop 1s cubic-bezier(0.34,1.56,0.64,1) 5.6s forwards,
                     hq-logo-pulse 2s ease-in-out 6.6s infinite;
        }
        @keyframes hq-logo-pop {
          0%   { opacity: 0; transform: translateX(-50%) scale(0) rotate(-90deg); }
          70%  { opacity: 1; transform: translateX(-50%) scale(1.2) rotate(10deg); }
          100% { opacity: 1; transform: translateX(-50%) scale(1) rotate(0deg); }
        }
        @keyframes hq-logo-pulse {
          0%, 100% { filter: drop-shadow(0 0 20px hsl(45,100%,55%)) drop-shadow(0 0 50px hsl(330,100%,60%)); }
          50%      { filter: drop-shadow(0 0 35px hsl(45,100%,75%)) drop-shadow(0 0 70px hsl(200,100%,65%)); }
        }
        .intro-hq-logo-text {
          position: absolute;
          top: 30%;
          left: 0;
          right: 0;
          text-align: center;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(14px, 2.6vw, 22px);
          letter-spacing: 0.3em;
          background: linear-gradient(90deg, hsl(330,100%,75%), hsl(200,100%,75%));
          -webkit-background-clip: text;
                  background-clip: text;
          color: transparent;
          opacity: 0;
          animation: hq-text-in 0.8s ease-out 6s forwards;
        }
        @keyframes hq-text-in {
          from { opacity: 0; letter-spacing: 0.6em; }
          to   { opacity: 1; letter-spacing: 0.3em; }
        }
        .intro-hq-gate {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 28%;
          height: 22%;
          background: linear-gradient(180deg, hsl(240,40%,8%), #000);
          border: 2px solid hsl(200,80%,55%);
          border-bottom: none;
          border-radius: 50% 50% 0 0 / 30% 30% 0 0;
          box-shadow:
            0 0 30px hsl(200,100%,60%),
            inset 0 -10px 40px hsl(330,100%,60%/0.6);
          overflow: hidden;
        }
        .intro-hq-gate-light {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 80%, hsl(45,100%,80%) 0%, hsl(330,100%,65%) 30%, transparent 70%);
          opacity: 0;
          animation: gate-light 1.6s ease-in 6.8s forwards;
        }
        @keyframes gate-light {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }

        /* ===== Final push-through burst ===== */
        .intro-push-burst {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 70%,
            hsl(45,100%,90%) 0%,
            hsl(330,100%,75%) 25%,
            hsl(200,100%,70%) 55%,
            transparent 80%);
          opacity: 0;
          transform: scale(0.2);
          animation: push-burst 1.4s cubic-bezier(0.4,0,0.2,1) 7s forwards;
        }
        @keyframes push-burst {
          0%   { opacity: 0; transform: scale(0.2); }
          50%  { opacity: 1; transform: scale(1.4); }
          100% { opacity: 1; transform: scale(3); }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;
