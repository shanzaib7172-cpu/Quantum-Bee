import { useEffect, useRef, useState } from "react";
import beeLogo from "@/assets/bee-logo.png";

const BeeCursor = () => {
  const beeRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const lastX = useRef(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const tick = () => {
      // Bee follows fast
      pos.current.x += (target.current.x - pos.current.x) * 0.25;
      pos.current.y += (target.current.y - pos.current.y) * 0.25;
      // Ring trails slower
      ringPos.current.x += (target.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (target.current.y - ringPos.current.y) * 0.12;

      const dx = target.current.x - lastX.current;
      lastX.current = target.current.x;
      const tilt = Math.max(-20, Math.min(20, dx * 1.2));

      if (beeRef.current) {
        beeRef.current.style.transform = `translate3d(${pos.current.x - 18}px, ${pos.current.y - 18}px, 0) rotate(${tilt}deg)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - 22}px, ${ringPos.current.y - 22}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] w-11 h-11 rounded-full border border-[hsl(200,100%,60%)]/60"
        style={{ boxShadow: "0 0 18px hsl(200 100% 55% / 0.35)" }}
      />
      <div
        ref={beeRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-9 h-9"
        style={{ filter: "drop-shadow(0 0 10px hsl(45 100% 55% / 0.7))" }}
      >
        <img src={beeLogo} alt="" className="w-full h-full object-contain" style={{ animation: "bee-bounce 0.4s ease-in-out infinite alternate" }} />
      </div>
    </>
  );
};

export default BeeCursor;
