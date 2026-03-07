import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Users, Activity } from "lucide-react";

const Hero = () => {
  const stats = [
    { icon: Shield,   value: "100,000+",    label: "App Downloads"     },
    { icon: Activity, value: "600,000+",    label: "Activities Started" },
    { icon: Users,    value: "20,000,000+", label: "Check-Ins Sent"     },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* Dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #0d0b0b 0%, #1a1010 40%, #2a0f0f 70%, #312F2F 100%)",
        }}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(234,43,31,0.18) 0%, transparent 70%)" }}
      />

      {/* Decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/3 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-36 pb-20 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background: "rgba(234,43,31,0.15)",
              border: "1px solid rgba(234,43,31,0.4)",
              color: "#EA2B1F",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Personal Safety Platform
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white font-black leading-none mb-6"
          style={{ fontSize: "clamp(3rem, 8vw, 6rem)", letterSpacing: "-0.03em" }}
        >
          Your{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #EA2B1F, #ff6b5a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Safety
          </span>
          ,<br />Our{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #EA2B1F, #ff6b5a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Priority
          </span>
          .
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          <span className="text-white font-semibold">NeoAegis</span> ensures your peace of mind wherever you go —
          instant SOS alerts, real-time tracking, and smart safety check-ins, all in one place.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-20"
        >
          <Link to="/sign-up">
            <button
              className="flex items-center gap-2 px-8 py-4 text-base font-bold text-white rounded-2xl transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #EA2B1F, #c0221a)",
                boxShadow: "0 8px 32px rgba(234,43,31,0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(234,43,31,0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(234,43,31,0.4)";
              }}
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link to="/sign-in">
            <button
              className="flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl transition-all duration-200"
              style={{
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "rgba(255,255,255,0.8)";
              }}
            >
              Log In
            </button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex flex-col items-center gap-2 p-6 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
                  style={{ background: "rgba(234,43,31,0.15)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#EA2B1F" }} />
                </div>
                <p
                  className="text-white font-black text-2xl sm:text-3xl"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #f5f5f5)" }}
      />
    </section>
  );
};

export default Hero;