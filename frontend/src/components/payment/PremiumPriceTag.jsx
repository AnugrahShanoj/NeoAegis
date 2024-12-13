import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
const PremiumPriceTag = () => {
  return (
    <div className="text-center mb-8">
      <motion.span 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-secondary/10 text-secondary px-6 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 mb-6"
      >
        <Sparkles className="w-4 h-4" />
        Lifetime Access
      </motion.span>
      <div className="mt-6">
        <div className="flex items-center justify-center gap-2">
          <motion.span 
            className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            ₹599
          </motion.span>
          <div className="text-left">
            <span className="text-neutral-600 block text-sm">one-time</span>
            <span className="text-neutral-600 block text-sm">payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PremiumPriceTag;