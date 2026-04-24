import { useEffect, useState } from "react";
import beeLogo from "@/assets/bee-logo.png";
import cosmos from "@/assets/intro-cosmos.jpg";
import tower from "@/assets/intro-tower.jpg";

const STORAGE_KEY = "beee_intro_played_v3";

const IntroAnimation = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(STORAGE_KEY);
  });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!show) return;
    const fadeTimer = setTimeout(() => setFadeOut(true), 10500);
    const endTimer = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setShow(false);
    }, 11400);
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

      {/* ============ ACT 1: Cosmic backdrop with black hole + earth (0 - 4.5s) ============ */}
      <div className="intro-act intro-act-1">
        <img src={cosmos} alt="" className="intro-cosmos-img" />
        {/* Pink + blue energy streams converging */}
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
          {/* Black hole singularity at galaxy center */}
          <div className="intro-singularity">
            <div className="intro-sing-disk" />
            <div className="intro-sing-core" />
          </div>
        </div>

        {/* Tagline 1 */}
        <div className="intro-tagline intro-tagline-1">
          <span className="intro-tagline-kicker">In a universe of noise</span>
          <span className="intro-tagline-line">one signal cuts through.</span>
        </div>
      </div>

      {/* ============ ACT 2: Beam from black hole hits Earth (3.8 - 5.5s) ============ */}
      <div className="intro-beam" />
      <div className="intro-earth-impact" />

      {/* ============ ACT 3: Zoom into Earth → city grid (5 - 7s) ============ */}
      <div className="intro-act intro-act-3">
        <div className="intro-grid-floor" />
        <div className="intro-horizon-glow" />
      </div>

      {/* ============ ACT 4: HQ Tower rises with logo (6 - 9.5s) ============ */}
      <div className="intro-act intro-act-4">
        <div className="intro-tower-wrap">
          <img src={tower} alt="" className="intro-tower-img" />
          {/* Logo halo on top of the tower */}
          <div className="intro-tower-logo">
            <div className="intro-logo-pulse" />
            <img src={beeLogo} alt="" className="w-full h-full object-contain relative z-10" />
          </div>
          <div className="intro-tower-name">QUANTUM&nbsp;BEE</div>
          <div className="intro-tower-tagline">
            Where intelligence meets infinity
          </div>
        </div>
      </div>

      {/* ============ ACT 5: Push through gate (9 - 10.5s) ============ */}
      <div className="intro-gate-burst" />

      <style>{`
        @keyframes intro-fade { to { opacity: 0; } }
        .intro-fade-out { animation: intro-fade 0.9s ease-out forwards; }

        .intro-act { position: absolute; inset: 0; opacity: 0; }

        /* ============== ACT 1 ============== */
        .intro-act-1 {
          animation: act1-life 4.8s ease-out 0s forwards;
        }
        @keyframes act1-life {
          0%   { opacity: 0; transform: scale(1.08); }
          10%  { opacity: 1; }
          75%  { opacity: 1; transform: scale(1.18); }
          100% { opacity: 0; transform: scale(1.35); }
        }
        .intro-cosmos-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.85) contrast(1.1) saturate(1.2);
          animation: cosmos-drift 12s ease-in-out infinite alternate;
        }
        @keyframes cosmos-drift {
          from { transform: scale(1) translateX(0); }
          to   { transform: scale(1.06) translateX(-2%); }
        }

        .intro-vortex {
          position: absolute;
          left: 32%;
          top: 62%;
          width: 1px;
          height: 1px;
        }
        .intro-stream {
          position: absolute;
          top: 0;
          left: 0;
          width: 70vmax;
          height: 2.5px;
          transform-origin: 0 50%;
          transform: rotate(var(--angle));
          opacity: 0;
          filter: blur(1px);
          animation: stream-suck 2.6s ease-in var(--delay) infinite;
        }
        @keyframes stream-suck {
          0%   { opacity: 0; transform: rotate(var(--angle)) scaleX(1); }
          25%  { opacity: 1; }
          100% { opacity: 0; transform: rotate(var(--angle)) scaleX(0.04); }
        }
        .intro-singularity {
          position: absolute;
          top: -80px;
          left: -80px;
          width: 160px;
          height: 160px;
        }
        .intro-sing-disk {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(from 0deg,
            hsl(330,100%,70%),
            hsl(280,90%,65%),
            hsl(200,100%,72%),
            hsl(330,100%,70%));
          -webkit-mask: radial-gradient(circle, transparent 38%, #000 46%, #000 70%, transparent 78%);
                  mask: radial-gradient(circle, transparent 38%, #000 46%, #000 70%, transparent 78%);
          filter: blur(2px);
          animation: sing-spin 3s linear infinite;
        }
        .intro-sing-core {
          position: absolute;
          inset: 32%;
          border-radius: 50%;
          background: radial-gradient(circle, #000 55%, hsl(260,80%,12%) 85%, transparent);
          box-shadow:
            inset 0 0 25px #000,
            0 0 40px hsl(330,90%,50%),
            0 0 100px hsl(200,90%,55%);
        }
        @keyframes sing-spin { to { transform: rotate(360deg); } }

        /* ============== Taglines ============== */
        .intro-tagline {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          font-family: 'Space Grotesk', sans-serif;
          color: white;
          opacity: 0;
          z-index: 5;
          padding: 0 1rem;
          width: min(92vw, 800px);
        }
        .intro-tagline-kicker {
          display: block;
          font-size: clamp(11px, 1.4vw, 14px);
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: hsl(200,100%,80%);
          margin-bottom: 0.6rem;
          opacity: 0.85;
        }
        .intro-tagline-line {
          display: block;
          font-size: clamp(22px, 4.2vw, 48px);
          font-weight: 300;
          letter-spacing: -0.01em;
          line-height: 1.15;
          background: linear-gradient(90deg, hsl(330,100%,82%), white 50%, hsl(200,100%,82%));
          -webkit-background-clip: text;
                  background-clip: text;
          color: transparent;
          text-shadow: 0 0 40px hsl(280,80%,60%/0.6);
        }
        .intro-tagline-1 {
          top: 18%;
          animation: tag-in 3.2s ease-out 0.6s forwards;
        }
        @keyframes tag-in {
          0%   { opacity: 0; transform: translate(-50%, 20px); filter: blur(8px); }
          25%  { opacity: 1; transform: translate(-50%, 0);    filter: blur(0); }
          80%  { opacity: 1; }
          100% { opacity: 0; filter: blur(4px); }
        }

        /* ============== ACT 2: Beam ============== */
        .intro-beam {
          position: absolute;
          top: 62%;
          left: 32%;
          width: 0;
          height: 5px;
          transform-origin: 0 50%;
          background: linear-gradient(90deg,
            hsl(280,100%,80%),
            hsl(330,100%,75%),
            hsl(200,100%,82%));
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
        .intro-earth-impact {
          position: absolute;
          top: 35%;
          right: 8%;
          width: 30vmax;
          height: 30vmax;
          border-radius: 50%;
          background: radial-gradient(circle, white 0%, hsl(200,100%,75%) 25%, hsl(330,100%,60%) 50%, transparent 75%);
          opacity: 0;
          animation: impact 1s ease-out 4.8s forwards;
          z-index: 4;
        }
        @keyframes impact {
          0%   { opacity: 0; transform: scale(0.2); }
          40%  { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(1.8); }
        }

        /* ============== ACT 3: City grid floor ============== */
        .intro-act-3 {
          background: radial-gradient(ellipse at 50% 100%, hsl(220,60%,15%) 0%, hsl(240,60%,4%) 60%, #000 100%);
          animation: act3-life 2.2s ease-out 5s forwards;
        }
        @keyframes act3-life {
          0%   { opacity: 0; }
          25%  { opacity: 1; }
          100% { opacity: 1; }
        }
        .intro-grid-floor {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 300%;
          height: 60%;
          transform: translateX(-50%) perspective(600px) rotateX(60deg);
          transform-origin: 50% 100%;
          background-image:
            linear-gradient(hsl(200,100%,60%/0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(200,100%,60%/0.5) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: linear-gradient(to top, black 30%, transparent 90%);
          -webkit-mask-image: linear-gradient(to top, black 30%, transparent 90%);
          animation: grid-rush 3s linear 5s infinite;
        }
        @keyframes grid-rush {
          from { background-position: 0 0; }
          to   { background-position: 0 60px; }
        }
        .intro-horizon-glow {
          position: absolute;
          left: 0;
          right: 0;
          top: 38%;
          height: 4px;
          background: hsl(200,100%,70%);
          box-shadow: 0 0 30px hsl(200,100%,60%), 0 0 80px hsl(330,100%,55%);
          opacity: 0.85;
        }

        /* ============== ACT 4: Tower ============== */
        .intro-act-4 {
          animation: act4-life 4s cubic-bezier(0.22,1,0.36,1) 6s forwards;
        }
        @keyframes act4-life {
          0%   { opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { opacity: 1; }
        }
        .intro-tower-wrap {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: min(70vw, 520px);
          height: 100vh;
          transform: translateX(-50%) translateY(100%);
          animation: tower-rise 3.5s cubic-bezier(0.22,1,0.36,1) 6s forwards,
                     tower-zoom 1.5s cubic-bezier(0.6,0,0.4,1) 9s forwards;
        }
        @keyframes tower-rise {
          0%   { transform: translateX(-50%) translateY(100%); }
          100% { transform: translateX(-50%) translateY(0%); }
        }
        @keyframes tower-zoom {
          0%   { transform: translateX(-50%) translateY(0%) scale(1); }
          100% { transform: translateX(-50%) translateY(-15%) scale(2.4); }
        }
        .intro-tower-img {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          height: 100%;
          width: auto;
          max-width: none;
          object-fit: contain;
          filter: drop-shadow(0 0 60px hsl(200,100%,55%/0.7))
                  drop-shadow(0 0 120px hsl(330,80%,50%/0.4));
        }
        .intro-tower-logo {
          position: absolute;
          top: 4%;
          left: 50%;
          width: 22%;
          aspect-ratio: 1;
          transform: translateX(-50%) scale(0);
          opacity: 0;
          animation: logo-pop 1.1s cubic-bezier(0.34,1.56,0.64,1) 7.2s forwards;
        }
        @keyframes logo-pop {
          0%   { opacity: 0; transform: translateX(-50%) scale(0) rotate(-180deg); }
          70%  { opacity: 1; transform: translateX(-50%) scale(1.25) rotate(15deg); }
          100% { opacity: 1; transform: translateX(-50%) scale(1) rotate(0deg); }
        }
        .intro-logo-pulse {
          position: absolute;
          inset: -40%;
          border-radius: 50%;
          background: radial-gradient(circle, hsl(45,100%,70%/0.6) 0%, hsl(330,100%,60%/0.3) 40%, transparent 70%);
          animation: logo-pulse 2s ease-in-out 7.5s infinite;
        }
        @keyframes logo-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50%      { transform: scale(1.2); opacity: 1; }
        }
        .intro-tower-name {
          position: absolute;
          top: 24%;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(16px, 2.4vw, 26px);
          letter-spacing: 0.4em;
          background: linear-gradient(90deg, hsl(45,100%,75%), white, hsl(200,100%,80%));
          -webkit-background-clip: text;
                  background-clip: text;
          color: transparent;
          opacity: 0;
          white-space: nowrap;
          text-shadow: 0 0 30px hsl(200,100%,60%/0.6);
          animation: name-in 0.9s ease-out 7.8s forwards;
        }
        @keyframes name-in {
          from { opacity: 0; letter-spacing: 0.7em; filter: blur(6px); }
          to   { opacity: 1; letter-spacing: 0.4em; filter: blur(0); }
        }
        .intro-tower-tagline {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 300;
          font-size: clamp(10px, 1.2vw, 13px);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: hsl(200,100%,85%);
          opacity: 0;
          white-space: nowrap;
          animation: tag2-in 0.9s ease-out 8.2s forwards;
        }
        @keyframes tag2-in {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 0.9; transform: translateX(-50%) translateY(0); }
        }

        /* ============== ACT 5: Final burst through gate ============== */
        .intro-gate-burst {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 70%,
            white 0%,
            hsl(45,100%,85%) 15%,
            hsl(330,100%,72%) 35%,
            hsl(200,100%,68%) 60%,
            transparent 85%);
          opacity: 0;
          transform: scale(0.15);
          animation: gate-burst 1.6s cubic-bezier(0.4,0,0.2,1) 9s forwards;
        }
        @keyframes gate-burst {
          0%   { opacity: 0; transform: scale(0.15); }
          50%  { opacity: 1; transform: scale(1.5); }
          100% { opacity: 1; transform: scale(3.2); }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;
