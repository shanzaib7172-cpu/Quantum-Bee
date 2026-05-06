import { useEffect, useState } from "react";
import cosmos from "@/assets/intro-cosmos.jpg";
import earth from "@/assets/intro-earth.jpg";

const STORAGE_KEY = "beee_intro_played_v10";
const TOTAL_MS = 9500;

const IntroAnimation = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(STORAGE_KEY);
  });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!show) return;
    const fadeTimer = setTimeout(() => setFadeOut(true), TOTAL_MS - 800);
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

  const stars = Array.from({ length: 140 }).map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    dur: 2 + Math.random() * 3,
  }));

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden bg-black ${fadeOut ? "intro-fade-out" : ""}`}
      aria-hidden="true"
    >
      <button
        onClick={skip}
        className="absolute top-4 right-4 z-[10000] px-3 py-1.5 text-xs rounded-full bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-md border border-white/20"
      >
        Skip intro →
      </button>

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
      </div>

      {/* ACT 1: Cosmic lightning singularity (0 - 4s) */}
      <div className="intro-act intro-act-1">
        <img src={cosmos} alt="" className="intro-cosmos-img" />
        <div className="intro-vortex">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="intro-stream"
              style={{
                ["--angle" as any]: `${(i / 24) * 360}deg`,
                ["--delay" as any]: `${(i % 8) * 0.12}s`,
              } as React.CSSProperties}
            />
          ))}
          <div className="intro-singularity">
            <div className="intro-sing-halo" />
            <div className="intro-sing-ring" />
            <div className="intro-sing-core" />
          </div>
        </div>
        <div className="intro-tagline intro-tagline-1">
          <span className="intro-tagline-kicker">In a universe of noise</span>
          <span className="intro-tagline-line">one signal cuts through.</span>
        </div>
      </div>

      {/* ACT 2: Beam (3.5 - 4.8s) */}
      <div className="intro-beam" />

      {/* ACT 3: Earth — zoom in and light explodes (4.5 - 9.5s) */}
      <div className="intro-act intro-act-earth">
        <img src={earth} alt="" className="intro-earth-img" />
        <div className="intro-earth-glow" />
        {/* Galaxy halo around earth */}
        <div className="intro-galaxy">
          {Array.from({ length: 90 }).map((_, i) => {
            const ang = (i / 90) * Math.PI * 2;
            const r = 38 + Math.random() * 30;
            return (
              <span
                key={i}
                className="intro-gstar"
                style={{
                  left: `calc(50% + ${Math.cos(ang) * r}vmin)`,
                  top: `calc(50% + ${Math.sin(ang) * r}vmin)`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            );
          })}
        </div>
        <div className="intro-tagline intro-tagline-2">
          <span className="intro-tagline-kicker">A signal reaches earth</span>
          <span className="intro-tagline-line">Welcome to Quantum Bee Planet.</span>
        </div>
        <div className="intro-light-flash" />
      </div>

      <style>{`
        @keyframes intro-fade { to { opacity: 0; } }
        .intro-fade-out { animation: intro-fade 0.8s ease-out forwards; }

        .intro-act { position: absolute; inset: 0; opacity: 0; }

        .intro-starfield { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .intro-star {
          position: absolute; background: white; border-radius: 50%;
          box-shadow: 0 0 6px white, 0 0 12px hsl(200,100%,80%);
          animation: star-twinkle linear infinite; opacity: 0.85;
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }

        /* ACT 1 */
        .intro-act-1 { animation: act1-life 4.2s ease-out 0s forwards; z-index: 2; }
        @keyframes act1-life {
          0%   { opacity: 0; transform: scale(1.08); }
          12%  { opacity: 1; }
          75%  { opacity: 1; transform: scale(1.18); }
          100% { opacity: 0; transform: scale(1.4); }
        }
        .intro-cosmos-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.8) contrast(1.1) saturate(1.2);
          animation: cosmos-drift 12s ease-in-out infinite alternate;
        }
        @keyframes cosmos-drift {
          from { transform: scale(1) translateX(0); }
          to   { transform: scale(1.06) translateX(-2%); }
        }
        .intro-vortex { position: absolute; left: 50%; top: 50%; width: 1px; height: 1px; }
        .intro-stream {
          position: absolute; top: 0; left: 0;
          width: 70vmax; height: 2px;
          transform-origin: 0 50%;
          transform: rotate(var(--angle));
          background: linear-gradient(90deg, transparent, hsl(200,100%,80%), hsl(220,100%,65%), transparent);
          opacity: 0; filter: blur(1px);
          animation: stream-suck 2.4s ease-in var(--delay) infinite;
        }
        @keyframes stream-suck {
          0%   { opacity: 0; transform: rotate(var(--angle)) scaleX(1); }
          25%  { opacity: 1; }
          100% { opacity: 0; transform: rotate(var(--angle)) scaleX(0.04); }
        }
        .intro-singularity {
          position: absolute; top: -110px; left: -110px;
          width: 220px; height: 220px;
        }
        .intro-sing-halo {
          position: absolute; inset: -40%; border-radius: 50%;
          background: radial-gradient(circle, transparent 30%, hsl(200,100%,55%/0.45) 45%, hsl(220,100%,50%/0.2) 60%, transparent 75%);
          filter: blur(10px);
          animation: sing-pulse 2.4s ease-in-out infinite;
        }
        @keyframes sing-pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50%      { transform: scale(1.12); opacity: 1; }
        }
        .intro-sing-ring {
          position: absolute; inset: 0; border-radius: 50%;
          background: conic-gradient(from 0deg, hsl(190,100%,80%), hsl(220,100%,55%), hsl(200,100%,70%), hsl(190,100%,80%));
          -webkit-mask: radial-gradient(circle, transparent 40%, #000 47%, #000 62%, transparent 72%);
                  mask: radial-gradient(circle, transparent 40%, #000 47%, #000 62%, transparent 72%);
          filter: blur(2px) brightness(1.4);
          animation: sing-spin 4s linear infinite;
        }
        .intro-sing-core {
          position: absolute; inset: 32%; border-radius: 50%;
          background: radial-gradient(circle, #fff 0%, hsl(195,100%,85%) 35%, hsl(210,100%,55%) 70%, hsl(230,80%,15%) 100%);
          box-shadow:
            0 0 60px hsl(200,100%,70%),
            0 0 140px hsl(220,100%,55%),
            inset 0 0 30px #fff;
          animation: sing-pulse 1.6s ease-in-out infinite;
        }
        @keyframes sing-spin { to { transform: rotate(360deg); } }

        /* Taglines */
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
          background: linear-gradient(90deg, hsl(200,100%,82%), white 50%, hsl(220,100%,80%));
          -webkit-background-clip: text; background-clip: text;
          color: transparent;
          text-shadow: 0 0 40px hsl(210,80%,60%/0.6);
        }
        .intro-tagline-1 { top: 18%; animation: tag-in 3s ease-out 0.6s forwards; }
        .intro-tagline-2 { top: 14%; animation: tag-in 3.2s ease-out 5.2s forwards; }
        @keyframes tag-in {
          0%   { opacity: 0; transform: translate(-50%, 20px); filter: blur(8px); }
          25%  { opacity: 1; transform: translate(-50%, 0);    filter: blur(0); }
          80%  { opacity: 1; }
          100% { opacity: 0; filter: blur(4px); }
        }

        /* ACT 2 Beam */
        .intro-beam {
          position: absolute; top: 50%; left: 50%;
          width: 0; height: 5px;
          transform-origin: 0 50%;
          background: linear-gradient(90deg, hsl(200,100%,80%), hsl(220,100%,65%), hsl(190,100%,82%));
          box-shadow: 0 0 18px hsl(200,100%,70%), 0 0 50px hsl(220,100%,60%), 0 0 90px hsl(210,100%,65%);
          opacity: 0;
          transform: rotate(-12deg);
          animation: beam-fire 1.3s cubic-bezier(0.7,0,0.3,1) 3.5s forwards;
          z-index: 3;
        }
        @keyframes beam-fire {
          0%   { width: 0;     opacity: 0; }
          15%  {                opacity: 1; }
          85%  { width: 80vmax; opacity: 1; }
          100% { width: 80vmax; opacity: 0; }
        }

        /* ACT 3: Earth — zoom in until it fills screen, then light flash */
        .intro-act-earth {
          z-index: 4;
          animation: act-earth-life 5s ease-in 4.5s forwards;
        }
        @keyframes act-earth-life {
          0%   { opacity: 0; transform: scale(0.35); }
          15%  { opacity: 1; transform: scale(0.5); }
          70%  { opacity: 1; transform: scale(2.8); }
          88%  { opacity: 1; transform: scale(5);   filter: brightness(2); }
          100% { opacity: 0; transform: scale(8);   filter: brightness(4); }
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
          width: min(82vmin, 820px); height: min(82vmin, 820px);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle, transparent 40%, hsl(200,100%,60%/0.32) 50%, transparent 72%);
          animation: earth-pulse 3s ease-in-out infinite;
        }
        @keyframes earth-pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.05); }
        }
        .intro-light-flash {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 50%, white 0%, hsl(200,100%,85%) 25%, hsl(220,100%,55%) 55%, transparent 80%);
          opacity: 0;
          animation: light-burst 1.6s ease-out 7.6s forwards;
          mix-blend-mode: screen;
        }
        @keyframes light-burst {
          0%   { opacity: 0; transform: scale(0.6); }
          40%  { opacity: 1; transform: scale(1.4); }
          100% { opacity: 0; transform: scale(2.4); }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;
