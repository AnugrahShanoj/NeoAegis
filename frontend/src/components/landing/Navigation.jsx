import React, { useState, useEffect } from "react";
import { Menu, X, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const NavLink = ({ href, children, onClick }) => {
  return React.createElement(
    "a",
    {
      href,
      onClick,
      className: "px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 block",
      style: { color: "rgba(255,255,255,0.65)" },
      onMouseEnter: (e) => {
        e.currentTarget.style.color = "#ffffff";
        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.color = "rgba(255,255,255,0.65)";
        e.currentTarget.style.background = "transparent";
      },
    },
    children
  );
};

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div
          className="rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-300"
          style={{
            background: scrolled ? "rgba(26,24,24,0.92)" : "rgba(26,24,24,0.75)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.2)",
          }}
        >
          {/* Logo */}
          {React.createElement(
            "a",
            { href: "/", className: "flex items-center gap-2.5 flex-shrink-0" },
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #EA2B1F, #5a1515)" }}
            >
              <Shield className="w-4 h-4 text-white" />
            </div>,
            <span className="text-white font-black text-lg tracking-tight">
              Neo<span style={{ color: "#EA2B1F" }}>Aegis</span>
            </span>
          )}

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="#about">About</NavLink>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#safety-news">Safety News</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/sign-in">
              <button
                className="px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }}
              >
                Log In
              </button>
            </Link>
            <Link to="/sign-up">
              <button
                className="px-5 py-2 text-sm font-bold rounded-xl text-white transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #EA2B1F, #c0221a)",
                  boxShadow: "0 4px 16px rgba(234,43,31,0.35)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(234,43,31,0.5)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(234,43,31,0.35)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl"
            style={{ color: "rgba(255,255,255,0.8)" }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="mt-2 rounded-2xl p-5 flex flex-col gap-1"
              style={{
                background: "rgba(26,24,24,0.96)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <NavLink href="#about"        onClick={close}>About</NavLink>
              <NavLink href="#features"     onClick={close}>Features</NavLink>
              <NavLink href="#safety-news"  onClick={close}>Safety News</NavLink>
              <NavLink href="#testimonials" onClick={close}>Testimonials</NavLink>
              <NavLink href="#contact"      onClick={close}>Contact</NavLink>

              <div
                className="border-t mt-2 pt-3 flex flex-col gap-2"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <Link to="/sign-in" onClick={close}>
                  <button
                    className="w-full py-2.5 text-sm font-semibold rounded-xl"
                    style={{ color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    Log In
                  </button>
                </Link>
                <Link to="/sign-up" onClick={close}>
                  <button
                    className="w-full py-2.5 text-sm font-bold rounded-xl text-white"
                    style={{ background: "linear-gradient(135deg, #EA2B1F, #c0221a)" }}
                  >
                    Get Started
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
};

export default Navigation;