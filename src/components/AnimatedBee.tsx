import beeLogo from "@/assets/bee-logo.png";

interface AnimatedBeeProps {
  isSpeaking?: boolean;
}

const AnimatedBee = ({ isSpeaking = false }: AnimatedBeeProps) => {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(45, 100%, 50%, 0.35) 0%, transparent 70%)",
          animation: "orb-pulse 3s ease-in-out infinite",
        }}
      />

      {/* Animated ring when speaking */}
      {isSpeaking && (
        <>
          <div
            className="absolute w-40 h-40 rounded-full border-2"
            style={{
              borderColor: "hsl(var(--bee-glow) / 0.4)",
              animation: "sound-ring 1.2s ease-out infinite",
            }}
          />
          <div
            className="absolute w-48 h-48 rounded-full border"
            style={{
              borderColor: "hsl(var(--bee-glow) / 0.2)",
              animation: "sound-ring 1.2s ease-out 0.4s infinite",
            }}
          />
          <div
            className="absolute w-56 h-56 rounded-full border"
            style={{
              borderColor: "hsl(var(--bee-glow) / 0.1)",
              animation: "sound-ring 1.2s ease-out 0.8s infinite",
            }}
          />
        </>
      )}

      {/* Bee image */}
      <img
        src={beeLogo}
        alt="Bee AI"
        className="relative w-32 h-32 object-contain drop-shadow-lg z-10"
        style={{
          animation: isSpeaking
            ? "bee-bounce 0.4s ease-in-out infinite alternate, bee-fly-slow 9s ease-in-out infinite"
            : "bee-fly-slow 9s ease-in-out infinite",
          filter: isSpeaking
            ? "drop-shadow(0 0 20px hsl(195, 100%, 55%, 0.6))"
            : "drop-shadow(0 0 12px hsl(195, 100%, 55%, 0.35))",
          transition: "filter 0.3s ease",
        }}
      />
    </div>
  );
};

export default AnimatedBee;
