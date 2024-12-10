import { motion } from "framer-motion";

const WelcomeHeader = ({ userName = "Anugrah P" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full text-center sm:text-left"
    >
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#4A4848]">
        Welcome back, {userName}
      </h1>
    </motion.div>
  );
};

export default WelcomeHeader;
