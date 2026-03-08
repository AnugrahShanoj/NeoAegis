import { motion } from "framer-motion";
import { Infinity, Zap } from "lucide-react";

const PremiumPriceTag = () => {
  return (
    <div className="relative">
      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mb-6"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            background: "rgba(234,43,31,0.12)",
            border: "1px solid rgba(234,43,31,0.3)",
            color: "#EA2B1F",
          }}
        >
          <Zap className="w-3 h-3" />
          Limited Time — Lifetime Deal
        </div>
      </motion.div>

      {/* Big price display */}
      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
      >
        <div className="flex items-start justify-center gap-1">
          <span
            className="font-black mt-3 text-2xl"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            ₹
          </span>
          <span
            className="font-black text-white"
            style={{ fontSize: "clamp(5rem, 15vw, 7rem)", letterSpacing: "-0.05em", lineHeight: 1 }}
          >
            599
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Infinity className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
          <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
            One-time payment · No renewals · Forever yours
          </p>
        </div>
      </motion.div>

      {/* Divider */}
      <div
        className="my-6 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }}
      />

      {/* What you get */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p
          className="text-xs font-bold uppercase tracking-widest mb-4 text-center"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          What's Included
        </p>
        <div className="space-y-2.5">
          {[
            "Full lifetime access to all features",
            "All future updates & improvements",
            "Emergency SOS & real-time tracking",
            "Unlimited safety check-ins",
            "Priority customer support",
          ].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.07 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(234,43,31,0.25)", border: "1px solid rgba(234,43,31,0.4)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              </div>
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumPriceTag;