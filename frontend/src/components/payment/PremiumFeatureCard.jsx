import { motion } from "framer-motion";
const PremiumFeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.div 
      className="p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors relative overflow-hidden group"
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-center gap-3">
        <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
          <Icon className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <span className="font-medium text-primary block mb-1">{title}</span>
          <p className="text-sm text-neutral-600">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};
export default PremiumFeatureCard;