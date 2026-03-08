import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PremiumHeader = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-0"
    >
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm font-semibold transition-all duration-200"
        style={{ color: "rgba(255,255,255,0.5)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.9)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #EA2B1F, #5a1515)" }}
        >
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-black text-lg tracking-tight">
          Neo<span style={{ color: "#EA2B1F" }}>Aegis</span>
        </span>
      </div>
    </motion.div>
  );
};

export default PremiumHeader;