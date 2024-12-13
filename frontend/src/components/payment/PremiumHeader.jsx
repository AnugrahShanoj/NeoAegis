import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
const PremiumHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12 relative"
    >
      <span className="inline-block mb-4">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-12 h-12 text-secondary" />
        </motion.div>
      </span>
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary bg-300% animate-gradient">
        Join Our Safety Initiative
      </h1>
      <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
        Your contribution helps create a safer world while supporting various charitable causes
      </p>
    </motion.div>
  );
};
export default PremiumHeader;