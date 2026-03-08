import { motion } from "framer-motion";

const PremiumFeatureCard = ({ icon: Icon, title, description, index }) => {
  const colors = [
    { color: "#EA2B1F", bg: "rgba(234,43,31,0.08)", border: "rgba(234,43,31,0.15)" },
    { color: "#2563eb", bg: "rgba(37,99,235,0.08)",  border: "rgba(37,99,235,0.15)"  },
    { color: "#16a34a", bg: "rgba(22,163,74,0.08)",  border: "rgba(22,163,74,0.15)"  },
    { color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.15)" },
  ];
  const c = colors[index % colors.length];

  return (
    <motion.div
      className="relative p-5 rounded-2xl overflow-hidden group cursor-default"
      style={{
        background: "white",
        border: `1px solid ${c.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        transition: "all 0.25s ease",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * (index + 1) }}
      whileHover={{
        y: -4,
        boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${c.color}, transparent)` }}
      />

      <div className="flex items-start gap-3.5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: c.bg }}
        >
          <Icon className="w-5 h-5" style={{ color: c.color }} />
        </div>
        <div>
          <p className="font-bold text-neutral-900 text-sm mb-1">{title}</p>
          <p className="text-xs text-neutral-500 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumFeatureCard;