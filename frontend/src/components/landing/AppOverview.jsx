import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Zap, Heart } from "lucide-react";

const AppOverview = () => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const pillars = [
    {
      icon:        Zap,
      title:       "Instant Response",
      description: "One tap sends your location and an SOS alert to all emergency contacts simultaneously. No delays when it matters most.",
    },
    {
      icon:        Shield,
      title:       "Always Protected",
      description: "Real-time tracking and automated check-ins keep your loved ones informed of your safety 24/7.",
    },
    {
      icon:        Heart,
      title:       "Peace of Mind",
      description: "Whether you're commuting late, traveling solo, or just want family to know you're okay — NeoAegis has you covered.",
    },
  ];

  return (
    <section className="py-28 bg-neutral-50" id="about">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div ref={ref} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{
                background: "rgba(234,43,31,0.08)",
                border: "1px solid rgba(234,43,31,0.2)",
                color: "#EA2B1F",
              }}
            >
              Why NeoAegis?
            </div>
            <h2
              className="font-black text-neutral-900 mb-6"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Safety shouldn't be{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #EA2B1F, #5a1515)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                complicated
              </span>
            </h2>
            <p className="text-neutral-500 text-lg max-w-2xl mx-auto leading-relaxed">
              <strong className="text-neutral-800">NeoAegis</strong> is your trusted personal safety companion,
              built to ensure that help is always a tap away. Designed for individuals and families,
              this platform empowers you with tools to stay safe, informed, and connected.
            </p>
          </motion.div>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="group relative p-7 rounded-2xl bg-white overflow-hidden"
                style={{
                  border: "1px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.12)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(234,43,31,0.04), transparent)" }}
                />
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "linear-gradient(135deg, rgba(234,43,31,0.12), rgba(90,21,21,0.08))" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#EA2B1F" }} />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg mb-2">{pillar.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{pillar.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Mission banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative rounded-3xl overflow-hidden p-10 sm:p-14 text-center"
          style={{ background: "linear-gradient(135deg, #312F2F 0%, #5a1515 55%, #EA2B1F 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">
              Our Mission
            </p>
            <p
              className="text-white font-bold text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed"
              style={{ letterSpacing: "-0.01em" }}
            >
              "We are on a mission to make the world a safer place by putting the right information
              in front of the right people, at the right time."
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AppOverview;