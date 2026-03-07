import React, { useState } from "react";
import { Facebook, Twitter, Instagram, Shield, Mail, Phone, Send, ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Anchor = ({ href, children, className, style, onMouseEnter, onMouseLeave, target, rel, ariaLabel }) =>
  React.createElement(
    "a",
    { href, className, style, onMouseEnter, onMouseLeave, target, rel, "aria-label": ariaLabel },
    children
  );

const Footer = () => {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [newsletter, setNewsletter] = useState("");

  const features = ["SOS Button", "Safety Check-Ins", "Activity Logs", "Email Breach Scanner"];
  const company  = ["About Us", "Testimonials", "Privacy Policy", "Contact"];
  const socials  = [
    { Icon: Facebook,   href: "https://www.facebook.com/",    label: "Facebook"  },
    { Icon: Twitter,    href: "https://twitter.com/?lang=en", label: "Twitter"   },
    { Icon: Instagram,  href: "https://www.instagram.com/",   label: "Instagram" },
    { Icon: FaWhatsapp, href: "https://wa.me/",               label: "WhatsApp"  },
  ];

  const dimLink = { color: "rgba(255,255,255,0.45)" };
  const onEnterRed   = (e) => { e.currentTarget.style.color = "#EA2B1F"; };
  const onLeaveWhite = (e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; };

  return (
    <footer style={{ background: "#0d0b0b" }} id="contact">

      {/* ── Top CTA banner ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #312F2F 0%, #5a1515 55%, #EA2B1F 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-14 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Get Protected Today</p>
            <h3 className="text-white font-black text-2xl sm:text-3xl" style={{ letterSpacing: "-0.02em" }}>
              Start your safety journey now
            </h3>
            <p className="text-white/55 text-sm mt-2 max-w-sm">
              Join thousands of users who trust NeoAegis to keep them and their loved ones safe.
            </p>
          </div>
          <Anchor
            href="/sign-up"
            className="flex-shrink-0 flex items-center gap-2 px-7 py-4 rounded-2xl text-sm font-bold bg-white transition-all duration-200"
            style={{ color: "#EA2B1F", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)";
            }}
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Anchor>
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #EA2B1F, #5a1515)" }}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-black text-lg">
                Neo<span style={{ color: "#EA2B1F" }}>Aegis</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              Your trusted personal safety companion. Built to ensure that help is always a tap away.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
              <Anchor
                href="mailto:support@neoaegis.com"
                className="text-sm transition-colors"
                style={dimLink}
                onMouseEnter={onEnterRed}
                onMouseLeave={onLeaveWhite}
              >
                support@neoaegis.com
              </Anchor>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
              <Anchor
                href="tel:+919876543210"
                className="text-sm transition-colors"
                style={dimLink}
                onMouseEnter={onEnterRed}
                onMouseLeave={onLeaveWhite}
              >
                +91 98765 43210
              </Anchor>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Features</h4>
            <ul className="space-y-3">
              {features.map((item) => (
                <li key={item}>
                  <Anchor
                    href="#features"
                    className="text-sm transition-colors flex items-center gap-1.5 group"
                    style={dimLink}
                    onMouseEnter={onEnterRed}
                    onMouseLeave={onLeaveWhite}
                  >
                    <ArrowRight className="w-3 h-3" />
                    {item}
                  </Anchor>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item}>
                  <Anchor
                    href="#about"
                    className="text-sm transition-colors flex items-center gap-1.5 group"
                    style={dimLink}
                    onMouseEnter={onEnterRed}
                    onMouseLeave={onLeaveWhite}
                  >
                    <ArrowRight className="w-3 h-3" />
                    {item}
                  </Anchor>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Socials */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Newsletter</h4>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Get safety tips and product updates delivered to your inbox.
            </p>
            <div className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder="Your email"
                value={newsletter}
                onChange={(e) => setNewsletter(e.target.value)}
                className="flex-1 px-3 py-2.5 text-sm rounded-xl outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                }}
              />
              <button
                className="px-4 py-2.5 rounded-xl text-white font-bold text-sm flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #EA2B1F, #c0221a)" }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Social icons */}
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <Anchor
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(234,43,31,0.2)";
                    e.currentTarget.style.color = "#EA2B1F";
                    e.currentTarget.style.borderColor = "rgba(234,43,31,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </Anchor>
              ))}
            </div>
          </div>
        </div>

        {/* ── Contact form ── */}
        <div
          className="rounded-2xl p-7 sm:p-8 mb-10"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h4 className="text-white font-bold text-lg mb-1">Get in Touch</h4>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
            Have questions or feedback? We'd love to hear from you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Your Name"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              className="px-4 py-3 text-sm rounded-xl outline-none w-full"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "white",
              }}
            />
            <input
              type="email"
              placeholder="Your Email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              className="px-4 py-3 text-sm rounded-xl outline-none w-full"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "white",
              }}
            />
          </div>
          <textarea
            rows={4}
            placeholder="Your Message"
            value={contactForm.message}
            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
            className="w-full px-4 py-3 text-sm rounded-xl outline-none resize-none mb-4"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "white",
            }}
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-7 py-3 text-sm font-bold text-white rounded-xl transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #EA2B1F, #c0221a)",
              boxShadow: "0 4px 16px rgba(234,43,31,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(234,43,31,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(234,43,31,0.3)";
            }}
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
            © 2026{" "}
            <span className="font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
              Neo<span style={{ color: "#EA2B1F" }}>Aegis</span>
            </span>
            . All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <Anchor
                key={item}
                href="#"
                className="text-xs transition-colors"
                style={{ color: "rgba(255,255,255,0.25)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
              >
                {item}
              </Anchor>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;