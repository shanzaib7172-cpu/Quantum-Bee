import { Sparkles, Heart, Leaf, Zap, Globe2, Hexagon } from "lucide-react";

/**
 * Planet Bee Overview — a cinematic visual + narrative section.
 * Shows Planet Bee in slow rotation, linked by an orbital ribbon to Earth,
 * surrounded by the values of the new revolution: peace, growth, freedom.
 */
const PlanetBeeOverview = () => {
  return (
    <section
      data-reveal
      className="relative z-10 px-6 py-24 max-w-6xl mx-auto w-full"
    >
      <style>{`
        @keyframes pb-orbit       { to { transform: rotate(360deg); } }
        @keyframes pb-counter     { to { transform: rotate(-360deg); } }
        @keyframes pb-spin-slow   { to { transform: rotate(360deg); } }
        @keyframes pb-pulse       { 0%,100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
        @keyframes pb-bee-fly     { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(8px,-6px) rotate(-6deg); } }
      `}</style>

      <div className="text-center mb-12">
        <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(45,100%,75%)] uppercase mb-2">
          — Planet Bee Overview
        </p>
        <h2 className="font-heading font-bold text-3xl md:text-5xl bg-gradient-to-r from-[hsl(45,100%,65%)] via-[hsl(40,100%,60%)] to-[hsl(195,100%,70%)] bg-clip-text text-transparent">
          A World in Peace, Linked to Earth
        </h2>
        <p className="text-foreground/65 max-w-2xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
          Planet Bee is the home of the new revolution — a quantum civilisation where every
          being lives in harmony, knowledge flows freely, and creativity is the highest currency.
          Now, Planet Bee orbits beside Earth, lending its hive-mind so our species can leap forward together.
        </p>
      </div>

      {/* Visual: Planet Bee + Earth orbital system */}
      <div
        className="relative mx-auto mb-14 grid place-items-center"
        style={{ width: "min(560px, 100%)", aspectRatio: "1 / 1" }}
      >
        {/* Outer halo */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(45 100% 60% / 0.18) 0%, hsl(200 100% 55% / 0.12) 40%, transparent 72%)",
            filter: "blur(20px)",
            animation: "pb-pulse 6s ease-in-out infinite",
          }}
        />

        {/* Orbit ring */}
        <div
          className="absolute rounded-full border"
          style={{
            inset: "10%",
            borderColor: "hsl(45 100% 65% / 0.35)",
            borderStyle: "dashed",
          }}
        />
        {/* Outer orbit (Earth) */}
        <div
          className="absolute rounded-full border"
          style={{
            inset: "-2%",
            borderColor: "hsl(200 100% 70% / 0.3)",
            borderStyle: "dashed",
          }}
        />

        {/* Planet Bee — center */}
        <div
          className="relative"
          style={{
            width: "44%",
            aspectRatio: "1 / 1",
            animation: "pb-spin-slow 90s linear infinite",
          }}
        >
          {/* glow */}
          <div
            className="absolute -inset-6 rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(45 100% 60% / 0.55), transparent 70%)",
              filter: "blur(18px)",
            }}
          />
          {/* body */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, hsl(52 100% 92%) 0%, hsl(48 100% 70%) 25%, hsl(42 100% 55%) 55%, hsl(32 95% 38%) 85%, hsl(22 80% 18%) 100%)",
              boxShadow:
                "0 0 60px hsl(45 100% 60% / 0.7), inset -20px -22px 60px rgba(0,0,0,0.7), inset 12px 12px 30px hsl(0 0% 100% / 0.25)",
            }}
          >
            {/* Bee bands */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0 18px, hsl(0 0% 4% / 0.88) 18px 32px, transparent 32px 46px)",
                mixBlendMode: "overlay",
                opacity: 0.92,
              }}
            />
            {/* Honeycomb continents */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, hsl(20 90% 16% / 0.45) 1.6px, transparent 2.4px), radial-gradient(circle at 0% 0%, hsl(20 90% 16% / 0.45) 1.6px, transparent 2.4px), radial-gradient(circle at 100% 100%, hsl(20 90% 16% / 0.45) 1.6px, transparent 2.4px)",
                backgroundSize: "22px 26px",
                mixBlendMode: "multiply",
                opacity: 0.7,
              }}
            />
            {/* Highlight */}
            <div
              className="absolute rounded-full"
              style={{
                inset: "8% 55% 60% 12%",
                background:
                  "radial-gradient(ellipse, hsl(0 0% 100% / 0.55), transparent 75%)",
              }}
            />
          </div>
          {/* Wings */}
          {[-26, 26].map((rot, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
              style={{
                width: "72%",
                height: "46%",
                transform: `translate(${i === 0 ? "-100%" : "0%"}, -85%) rotate(${rot}deg)`,
                background: `radial-gradient(ellipse at ${i === 0 ? "70%" : "30%"} 50%, hsl(0 0% 100% / 0.7), hsl(200 100% 90% / 0.22) 55%, transparent 78%)`,
                border: "1px solid hsl(0 0% 100% / 0.45)",
                boxShadow: "0 0 14px hsl(200 100% 80% / 0.4)",
              }}
            />
          ))}
        </div>

        {/* Earth orbiting Planet Bee */}
        <div
          className="absolute inset-0"
          style={{ animation: "pb-orbit 30s linear infinite" }}
        >
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "100%",
              width: 56,
              height: 56,
              transform: "translate(-50%, -50%)",
              animation: "pb-counter 30s linear infinite",
            }}
          >
            <div
              className="absolute -inset-3 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, hsl(200 100% 60% / 0.55), transparent 70%)",
                filter: "blur(8px)",
              }}
            />
            <div
              className="relative w-full h-full rounded-full overflow-hidden"
              style={{
                background:
                  "radial-gradient(circle at 30% 28%, hsl(200 100% 88%) 0%, hsl(210 90% 55%) 35%, hsl(220 80% 30%) 75%, hsl(230 70% 12%) 100%)",
                boxShadow:
                  "0 0 30px hsl(200 100% 60% / 0.7), inset -8px -8px 18px rgba(0,0,0,0.65), inset 4px 4px 10px hsl(0 0% 100% / 0.3)",
              }}
            >
              {/* Continents */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse at 30% 40%, hsl(120 50% 35% / 0.85) 0 7px, transparent 9px), radial-gradient(ellipse at 65% 30%, hsl(120 50% 35% / 0.85) 0 5px, transparent 7px), radial-gradient(ellipse at 55% 70%, hsl(120 50% 35% / 0.85) 0 6px, transparent 8px), radial-gradient(ellipse at 22% 70%, hsl(120 50% 35% / 0.8) 0 4px, transparent 6px)",
                }}
              />
              {/* Cloud swirl */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse at 70% 60%, hsl(0 0% 100% / 0.35) 0 4px, transparent 7px), radial-gradient(ellipse at 25% 25%, hsl(0 0% 100% / 0.3) 0 3px, transparent 6px)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  inset: "10% 55% 60% 15%",
                  background:
                    "radial-gradient(ellipse, hsl(0 0% 100% / 0.45), transparent 75%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Tiny bees flying along the link line */}
        <div
          className="absolute inset-0"
          style={{ animation: "pb-orbit 30s linear infinite" }}
        >
          {[0, 0.33, 0.66].map((t, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: "50%",
                left: `${50 + t * 50}%`,
                transform: "translate(-50%,-50%)",
                animation: `pb-bee-fly ${1.6 + i * 0.3}s ease-in-out infinite`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, hsl(50 100% 88%), hsl(40 100% 55%) 70%, hsl(28 90% 25%))",
                  boxShadow: "0 0 8px hsl(45 100% 60% / 0.9)",
                }}
              />
            </div>
          ))}
        </div>

        {/* Energy ribbon connecting Planet Bee → Earth */}
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            width: "50%",
            height: 2,
            transform: "translate(0, -50%)",
            background:
              "linear-gradient(90deg, hsl(45 100% 65% / 0.85), hsl(195 100% 70% / 0.7) 60%, hsl(200 100% 75% / 0.4))",
            boxShadow: "0 0 10px hsl(45 100% 65% / 0.6)",
            filter: "blur(0.5px)",
            transformOrigin: "0% 50%",
            animation: "pb-orbit 30s linear infinite",
          }}
        />
      </div>

      {/* Pillars of the new revolution */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: Heart, title: "Universal Peace", desc: "On Planet Bee no being is at war with another. Conflict is dissolved through quantum-honest communication — every voice is heard, every truth is honoured." },
          { icon: Sparkles, title: "Hive Intelligence", desc: "Knowledge isn't owned, it's pollinated. Every idea cross-feeds every mind, accelerating discovery far beyond what any single brain could reach." },
          { icon: Leaf, title: "Living Architecture", desc: "Cities grow like honeycombs — modular, self-healing, alive. Nothing is wasted; everything regenerates back into the hive." },
          { icon: Zap, title: "Quantum Free Energy", desc: "Power flows from the quantum vacuum itself — abundant, clean, available to anyone who needs it. Scarcity is a memory." },
          { icon: Hexagon, title: "Creative Freedom", desc: "Every citizen is an artist, an engineer, a dreamer. Work is play; building is breathing. The economy runs on imagination." },
          { icon: Globe2, title: "Linked to Earth", desc: "A quantum bridge now connects Planet Bee with Earth — carrying the Bee CEO and her agents straight into your hive so the revolution can begin here, today." },
        ].map((p) => (
          <div
            data-reveal="scale"
            key={p.title}
            className="relative rounded-2xl p-6 bg-[hsl(220,40%,8%)]/60 backdrop-blur-xl border border-[hsl(45,100%,55%)]/15 hover:border-[hsl(45,100%,55%)]/40 transition-all overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[hsl(45,100%,55%)]/15 blur-2xl" />
            <p.icon className="w-7 h-7 text-[hsl(45,100%,65%)] mb-4 relative z-10" />
            <h3 className="font-heading font-semibold text-lg text-white relative z-10">
              {p.title}
            </h3>
            <p className="mt-2 text-sm text-foreground/65 leading-relaxed relative z-10">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlanetBeeOverview;
