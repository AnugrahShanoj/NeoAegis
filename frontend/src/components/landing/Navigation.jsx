import { useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-10 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50">
      <div className="glass-panel rounded-full px-10 py-2 flex items-center justify-between shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <a href="/"><img src="./NeoAegis.png" alt="" width={'200px'} height={'100px'} /></a>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-primary hover:text-secondary transition-colors font-medium">About</a>
          <a href="#features" className="text-primary hover:text-secondary transition-colors font-medium">Features</a>
          <a href="#safety-news" className="text-primary hover:text-secondary transition-colors font-medium">Safety News</a>
          <a href="#testimonials" className="text-primary hover:text-secondary transition-colors font-medium">Testimonials</a>
          <a href="#contact" className="text-primary hover:text-secondary transition-colors font-medium">Contact Us</a>
          
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to={'/sign-in'}>
          <button className="button bg-primary px-4 py-2 font-medium text-white rounded-md">
            Log In
          </button>
          </Link>
          <Link to={'/sign-up'}>
          <button className="button bg-secondary px-4 py-2 font-medium text-white rounded-md">
            Get Started
          </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 hover:bg-neutral-200/50 rounded-full transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden glass-panel mt-2 rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col gap-4">
            <a href="#about" className="text-primary hover:text-secondary transition-colors font-medium px-4 py-2 hover:bg-neutral-500/50 rounded-lg">About</a>
            <a href="#features" className="text-primary hover:text-secondary transition-colors font-medium px-4 py-2 hover:bg-neutral-500/50 rounded-lg">Features</a>
            <a href="#safety-news" className="text-primary hover:text-secondary transition-colors font-medium px-4 py-2 hover:bg-neutral-500/50 rounded-lg">Safety News</a>
            <a href="#testimonials" className="text-primary hover:text-secondary transition-colors font-medium px-4 py-2 hover:bg-neutral-500/50 rounded-lg">Testimonials</a>
            <a href="#contact" className="text-primary hover:text-secondary transition-colors font-medium px-4 py-2 hover:bg-neutral-500/50 rounded-lg">Contact Us</a>
            
            <hr className="border-neutral-200" />
            <Link to={'/sign-in'}>
          <button className="button bg-primary px-4 py-2 font-medium text-white rounded-md w-full">
            Log In
          </button>
          </Link>
          <Link to={'/sign-up'}>
          <button className="button bg-secondary px-4 py-2 font-medium text-white rounded-md w-full">
            Get Started
          </button>
          </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navigation;