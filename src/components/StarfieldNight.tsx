import { useMemo } from "react";

interface Props {
  density?: number;
}

const StarfieldNight = ({ density = 1 }: Props) => {
  const stars = useMemo(() => {
    const make = (count: number, sizeMin: number, sizeMax: number) =>
      Array.from({ length: count }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: sizeMin + Math.random() * (sizeMax - sizeMin),
        delay: Math.random() * 6,
        dur: 2.5 + Math.random() * 5,
      }));
    return [
      ...make(Math.round(180 * density), 0.4, 1.1),
      ...make(Math.round(70 * density), 1.0, 1.8),
      ...make(Math.round(20 * density), 1.8, 2.6),
    ];
  }, [density]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden
      style={{ background: "#000" }}
    >
      <style>{`@keyframes sf-twinkle { 0%,100%{opacity:.2}50%{opacity:1} }`}</style>
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background: "#fff",
            opacity: 0.7,
            animation: `sf-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default StarfieldNight;
