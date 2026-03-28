const GlassOrb = () => {
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)",
          animation: "orb-pulse 3s ease-in-out infinite",
        }}
      />

      {/* Rotating gradient ring */}
      <div
        className="absolute w-32 h-32 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, hsl(var(--primary) / 0.3), hsl(var(--accent) / 0.3), hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.3), hsl(var(--primary) / 0.3))",
          animation: "orb-rotate 6s linear infinite",
          filter: "blur(8px)",
        }}
      />

      {/* Main orb body */}
      <div
        className="relative w-28 h-28 rounded-full"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, hsl(var(--primary) / 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, hsl(var(--accent) / 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, hsl(220, 20%, 12%) 0%, hsl(220, 20%, 6%) 100%)
          `,
          boxShadow: `
            inset 0 -4px 12px hsl(var(--primary) / 0.15),
            inset 0 4px 12px hsl(210, 20%, 40%, 0.1),
            0 0 50px -10px hsl(var(--primary) / 0.3),
            0 0 100px -20px hsl(var(--accent) / 0.15)
          `,
          animation: "orb-float 4s ease-in-out infinite",
          border: "1px solid hsl(210, 20%, 30%, 0.2)",
        }}
      >
        {/* Glass highlight */}
        <div
          className="absolute top-2 left-4 w-16 h-8 rounded-full"
          style={{
            background: "linear-gradient(180deg, hsl(210, 20%, 90%, 0.15) 0%, transparent 100%)",
            filter: "blur(2px)",
          }}
        />

        {/* Inner shimmer */}
        <div
          className="absolute inset-3 rounded-full overflow-hidden"
          style={{
            background: "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.08) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
          }}
        />
      </div>
    </div>
  );
};

export default GlassOrb;
