import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name:     "Priya M.",
    role:     "Solo Traveler",
    content:  "NeoAegis gave me peace of mind while traveling. The SOS feature is a lifesaver! I felt protected throughout my entire solo trip across South India.",
    rating:   5,
    initials: "PM",
    color:    "#EA2B1F",
  },
  {
    name:     "Rahul S.",
    role:     "Parent",
    content:  "As a parent, the safety check-ins feature helps me ensure my children are safe at all times. The grace period system is especially thoughtful.",
    rating:   5,
    initials: "RS",
    color:    "#2563eb",
  },
  {
    name:     "Sarah K.",
    role:     "Business Professional",
    content:  "The safety check-ins feature is perfect for late-night work schedules. My family knows I'm okay without me having to text them every hour.",
    rating:   5,
    initials: "SK",
    color:    "#16a34a",
  },
  {
    name:     "Arjun T.",
    role:     "College Student",
    content:  "I started using NeoAegis after a friend had a scary incident. Now my parents can see I'm safe and I don't have to worry about keeping them updated.",
    rating:   5,
    initials: "AT",
    color:    "#7c3aed",
  },
  {
    name:     "Meena R.",
    role:     "Night Shift Nurse",
    content:  "Working late nights at the hospital, NeoAegis is my silent guardian. The automatic check-in notifications keep my husband from worrying.",
    rating:   5,
    initials: "MR",
    color:    "#ea580c",
  },
  {
    name:     "David P.",
    role:     "Delivery Driver",
    content:  "The live tracking and SOS features have made my daily routes much safer. Customer support is also very responsive.",
    rating:   5,
    initials: "DP",
    color:    "#0891b2",
  },
];

const TrustedBy = () => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 bg-white" id="testimonials">
      <div className="max-w-6xl mx-auto px-6">

        <div ref={ref} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{
                background: "rgba(234,43,31,0.08)",
                border: "1px solid rgba(234,43,31,0.2)",
                color: "#EA2B1F",
              }}
            >
              Testimonials
            </div>
            <h2
              className="font-black text-neutral-900 mb-5"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Trusted by people who{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #EA2B1F, #5a1515)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                care about safety
              </span>
            </h2>
            <p className="text-neutral-500 text-lg max-w-xl mx-auto leading-relaxed">
              Real stories from real users — solo travelers, parents, professionals, and students who rely on NeoAegis every day.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              className="relative flex flex-col p-6 rounded-2xl bg-white overflow-hidden"
              style={{
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: t.color }} />
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{ background: t.color + "18" }}
              >
                <Quote className="w-4 h-4" style={{ color: t.color }} />
              </div>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed flex-grow mb-6">
                "{t.content}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, " + t.color + ", " + t.color + "88)" }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-neutral-900 text-sm">{t.name}</p>
                  <p className="text-xs text-neutral-400 font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-8 rounded-2xl text-center"
          style={{
            background: "linear-gradient(135deg, rgba(234,43,31,0.06), rgba(90,21,21,0.04))",
            border: "1px solid rgba(234,43,31,0.12)",
          }}
        >
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-center">
              <p className="font-black text-3xl text-neutral-900" style={{ letterSpacing: "-0.02em" }}>4.9/5</p>
              <div className="flex gap-0.5 justify-center mt-1 mb-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-400 font-medium">Average Rating</p>
            </div>
            <div className="w-px h-12 bg-neutral-200 hidden sm:block" />
            <div className="text-center">
              <p className="font-black text-3xl text-neutral-900" style={{ letterSpacing: "-0.02em" }}>50K+</p>
              <p className="text-xs text-neutral-400 font-medium mt-1">Happy Users</p>
            </div>
            <div className="w-px h-12 bg-neutral-200 hidden sm:block" />
            <div className="text-center">
              <p className="font-black text-3xl text-neutral-900" style={{ letterSpacing: "-0.02em" }}>98%</p>
              <p className="text-xs text-neutral-400 font-medium mt-1">Would Recommend</p>
            </div>
            <div className="w-px h-12 bg-neutral-200 hidden sm:block" />
            <div className="text-center">
              <p className="font-black text-3xl text-neutral-900" style={{ letterSpacing: "-0.02em" }}>24/7</p>
              <p className="text-xs text-neutral-400 font-medium mt-1">Always Available</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default TrustedBy;