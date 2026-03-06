import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BellRing } from "lucide-react";

const MotionDiv = motion.div;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 12) return "Good Morning ☀️";
  if (hour >= 12 && hour < 17) return "Good Afternoon 👋";
  if (hour >= 17 && hour < 21) return "Good Evening 🌆";
  return "Good Night 🌙";
}

const WelcomeHeader = () => {
  const userName = sessionStorage.getItem("username") || "User";
  const greeting = getGreeting();

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(135deg, #312F2F 0%, #5a1515 55%, #EA2B1F 100%)" }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Decorative rings */}
      <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-4 right-12 w-28 h-28 rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute -bottom-8 right-4 w-16 h-16 rounded-full border border-white/5 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6 py-7 sm:px-8 sm:py-8">
        {/* Left */}
        <div>
          <p className="text-white/55 text-xs font-semibold uppercase tracking-widest mb-1.5">
            {greeting}
          </p>
          <h1 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-3">
            Welcome back, {userName}
          </h1>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
            <span
              className="w-2 h-2 rounded-full bg-green-400 animate-pulse"
              style={{ boxShadow: "0 0 6px #4ade80" }}
            />
            <span className="text-white/80 text-xs font-semibold">All systems protected</span>
          </div>
        </div>

        {/* SOS Button */}
        <div className="w-full sm:w-auto flex-shrink-0">
          <Link to="/alerts" className="block w-full sm:w-auto">
            <MotionDiv
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="relative inline-flex w-full sm:w-auto"
            >
              <span
                className="absolute inset-0 rounded-xl animate-ping bg-red-500/30 pointer-events-none"
                style={{ animationDuration: "2.5s" }}
              />
              <button
                className="relative flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold text-base px-10 py-4 rounded-xl border-2 border-white/20 w-full sm:w-auto transition-colors duration-200"
                style={{ boxShadow: "0 0 0 4px rgba(234,43,31,0.25), 0 8px 24px rgba(0,0,0,0.3)" }}
              >
                <BellRing className="w-5 h-5" />
                SOS ALERT
              </button>
            </MotionDiv>
          </Link>
        </div>
      </div>
    </MotionDiv>
  );
};

export default WelcomeHeader;