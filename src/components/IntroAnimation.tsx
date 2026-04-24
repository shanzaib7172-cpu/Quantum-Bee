import { useEffect, useState } from "react";
import beeLogo from "@/assets/bee-logo.png";

const STORAGE_KEY = "beee_intro_played";

const IntroAnimation = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(STORAGE_KEY);
  });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!show) return;
    // Total animation ~4.5s, then fade out
    const fadeTimer = setTimeout(() => setFadeOut(true), 4200);
    const endTimer = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setShow(false);
    }, 5000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[hsl(220,60%,3%)] overflow-hidden ${
        fadeOut ? "intro-fade-out" : ""
      }`}
      aria-hidden="true"
    >
      {/* Starfield */}
      <div className="absolute inset-0">
        {Array.from({ length: 60 }).map((_, i) => {
          const top = (i * 37) % 100;
          const left = (i * 53) % 100;
          const size = ((i * 7) % 3) + 1;
          return (
            <span
              key={i}
              className="absolute rounded-full bg-white/70"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: size,
                height: size,
                animation: `twinkle ${2 + (i % 4)}s ease-in-out ${(i % 5) * 0.3}s infinite`,
              }}
            />
          );
        })}
      </div>

      {/* Black hole — top-left */}
      <div className="intro-blackhole">
        <div className="intro-blackhole-core" />
        <div className="intro-blackhole-ring" />
        <div className="intro-blackhole-ring intro-blackhole-ring-2" />
      </div>

      {/* Light beam from black hole to building */}
      <div className="intro-beam" />
      <div className="intro-beam-flash" />

      {/* World horizon + ground */}
      <div className="intro-ground" />
      <div className="intro-horizon-glow" />

      {/* Building with logo — bottom-right area */}
      <div className="intro-building-wrap">
        <div className="intro-building">
          {/* Building windows */}
          <div className="intro-windows">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} style={{ animationDelay: `${(i % 6) * 0.1}s` }} />
            ))}
          </div>
          {/* Logo on building */}
          <div className="intro-building-logo">
            <img src={beeLogo} alt="" className="w-full h-full object-contain" />
          </div>
          <div className="intro-building-logo-glow" />
        </div>
      </div>

      {/* Final white burst before reveal */}
      <div className="intro-burst" />

      <style>{`
        @keyframes intro-fade {
          to { opacity: 0; }
        }
        .intro-fade-out {
          animation: intro-fade 0.8s ease-out forwards;
        }

        /* Black hole */
        .intro-blackhole {
          position: absolute;
          top: 12%;
          left: 8%;
          width: 180px;
          height: 180px;
          transform: translate(-50%, -50%);
          opacity: 0;
          animation: bh-appear 0.8s ease-out 0.1s forwards;
        }
        @keyframes bh-appear {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .intro-blackhole-core {
          position: absolute;
          inset: 30%;
          background: radial-gradient(circle, #000 40%, hsl(260,80%,15%) 70%, transparent 100%);
          border-radius: 50%;
          box-shadow:
            inset 0 0 30px #000,
            0 0 60px hsl(260,90%,40%),
            0 0 120px hsl(190,90%,50%);
        }
        .intro-blackhole-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid transparent;
          background: conic-gradient(from 0deg, hsl(190,90%,55%), hsl(260,90%,60%), hsl(45,100%,55%), hsl(190,90%,55%));
          -webkit-mask: radial-gradient(circle, transparent 55%, #000 58%, #000 70%, transparent 73%);
                  mask: radial-gradient(circle, transparent 55%, #000 58%, #000 70%, transparent 73%);
          animation: bh-spin 3s linear infinite;
          filter: blur(2px);
        }
        .intro-blackhole-ring-2 {
          animation-duration: 5s;
          animation-direction: reverse;
          opacity: 0.6;
          transform: scale(1.2);
        }
        @keyframes bh-spin {
          to { transform: rotate(360deg); }
        }

        /* Beam */
        .intro-beam {
          position: absolute;
          top: 12%;
          left: 8%;
          width: 0;
          height: 4px;
          transform-origin: 0 50%;
          background: linear-gradient(90deg,
            hsl(190,100%,70%) 0%,
            hsl(45,100%,65%) 50%,
            hsl(45,100%,80%) 100%);
          box-shadow: 0 0 20px hsl(190,100%,70%), 0 0 40px hsl(45,100%,60%);
          opacity: 0;
          animation: beam-shoot 1.2s cubic-bezier(0.7, 0, 0.3, 1) 1s forwards;
        }
        .intro-beam-flash {
          position: absolute;
          bottom: 22%;
          right: 18%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: radial-gradient(circle, hsl(45,100%,80%) 0%, hsl(45,100%,55%) 30%, transparent 70%);
          opacity: 0;
          animation: beam-impact 0.8s ease-out 2.1s forwards;
        }
        @keyframes beam-shoot {
          0%   { width: 0; opacity: 0; }
          15%  { opacity: 1; }
          100% { width: 90vw; opacity: 1; }
        }
        @keyframes beam-impact {
          0%   { width: 0; height: 0; opacity: 0; }
          40%  { width: 400px; height: 400px; opacity: 1; transform: translate(50%, 50%); }
          100% { width: 800px; height: 800px; opacity: 0; transform: translate(50%, 50%); }
        }

        /* Ground & horizon */
        .intro-ground {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 22%;
          background: linear-gradient(180deg,
            transparent 0%,
            hsl(220,40%,8%) 30%,
            hsl(220,50%,5%) 100%);
          opacity: 0;
          animation: fade-in-soft 1s ease-out 0.4s forwards;
        }
        .intro-horizon-glow {
          position: absolute;
          bottom: 18%;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, hsl(190,90%,55%), hsl(45,100%,60%), hsl(190,90%,55%), transparent);
          filter: blur(3px);
          opacity: 0;
          animation: fade-in-soft 1.2s ease-out 0.6s forwards;
        }
        @keyframes fade-in-soft {
          to { opacity: 1; }
        }

        /* Building */
        .intro-building-wrap {
          position: absolute;
          bottom: 18%;
          right: 12%;
          width: 220px;
          height: 340px;
          opacity: 0;
          transform: translateY(40px);
          animation: building-rise 1.2s cubic-bezier(0.22,1,0.36,1) 0.8s forwards;
        }
        @keyframes building-rise {
          to { opacity: 1; transform: translateY(0); }
        }
        .intro-building {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, hsl(220,30%,12%) 0%, hsl(220,40%,7%) 100%);
          border: 1px solid hsl(190,40%,25%);
          border-bottom: none;
          box-shadow:
            inset 0 0 40px hsl(220,60%,3%),
            0 0 30px hsl(190,90%,30%/0.3);
        }
        .intro-windows {
          position: absolute;
          inset: 12px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(6, 1fr);
          gap: 8px;
          padding-top: 60%;
        }
        .intro-windows span {
          background: hsl(45,90%,55%);
          opacity: 0.2;
          border-radius: 1px;
          box-shadow: 0 0 6px hsl(45,100%,60%);
          animation: window-flicker 2s ease-in-out infinite;
        }
        @keyframes window-flicker {
          0%, 100% { opacity: 0.2; }
          50%      { opacity: 0.85; }
        }

        /* Logo on building */
        .intro-building-logo {
          position: absolute;
          top: 18%;
          left: 50%;
          transform: translateX(-50%) scale(0.3);
          width: 120px;
          height: 120px;
          opacity: 0;
          filter: drop-shadow(0 0 20px hsl(45,100%,55%)) drop-shadow(0 0 40px hsl(190,90%,55%));
          animation: logo-pop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 2.2s forwards,
                     logo-pulse 1.5s ease-in-out 3.1s infinite;
        }
        @keyframes logo-pop {
          0%   { opacity: 0; transform: translateX(-50%) scale(0.3); }
          60%  { opacity: 1; transform: translateX(-50%) scale(1.15); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        @keyframes logo-pulse {
          0%, 100% { filter: drop-shadow(0 0 20px hsl(45,100%,55%)) drop-shadow(0 0 40px hsl(190,90%,55%)); }
          50%      { filter: drop-shadow(0 0 35px hsl(45,100%,70%)) drop-shadow(0 0 60px hsl(190,100%,65%)); }
        }
        .intro-building-logo-glow {
          position: absolute;
          top: 18%;
          left: 50%;
          width: 200px;
          height: 200px;
          transform: translateX(-50%);
          background: radial-gradient(circle, hsl(45,100%,60%/0.4) 0%, transparent 60%);
          border-radius: 50%;
          opacity: 0;
          animation: glow-fade-in 0.8s ease-out 2.3s forwards;
        }
        @keyframes glow-fade-in {
          to { opacity: 1; }
        }

        /* Final burst */
        .intro-burst {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 75% 65%, hsl(45,100%,90%) 0%, hsl(190,100%,70%) 20%, transparent 60%);
          opacity: 0;
          animation: burst-out 1s ease-out 3.6s forwards;
        }
        @keyframes burst-out {
          0%   { opacity: 0; transform: scale(0.5); }
          50%  { opacity: 0.9; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(2); }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;
