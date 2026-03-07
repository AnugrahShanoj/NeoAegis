import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Bell, CheckCircle, List, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title:       "SOS Button",
    description: "Send instant emergency alerts to all your trusted contacts with a single tap. Your location is shared automatically.",
    icon:        Bell,
    color:       "#EA2B1F",
    bgColor:     "rgba(234,43,31,0.1)",
    points:      ["One-tap emergency activation", "Instant notification to all contacts", "Live location sharing"],
  },
  {
    title:       "Safety Check-Ins",
    description: "Schedule regular check-ins to confirm your safety. Missed check-ins trigger a grace period before notifying contacts.",
    icon:        CheckCircle,
    color:       "#16a34a",
    bgColor:     "rgba(22,163,74,0.1)",
    points:      ["Scheduled check-in reminders", "45-minute grace period system", "Automatic contact notification"],
  },
  {
    title:       "Activity Logs",
    description: "Every safety event is recorded in a detailed timeline — check-ins, SOS alerts, email scans, and profile updates.",
    icon:        List,
    color:       "#2563eb",
    bgColor:     "rgba(37,99,235,0.1)",
    points:      ["Full activity timeline", "Filterable log history", "Real-time log updates"],
  },
  {
    title:       "Email Breach Scanner",
    description: "Instantly check whether your email address has been exposed in any known data breach to keep your account secure.",
    icon:        ShieldCheck,
    color:       "#7c3aed",
    bgColor:     "rgba(124,58,237,0.1)",
    points:      ["Real-time breach detection", "Detailed breach reports", "Actionable safety guidance"],
  },
];

const safetyStats = [
  { value: "1 in 3", label: "women experience physical violence in their lifetime"     },
  { value: "68%",    label: "of emergencies happen within 5 miles of home"             },
  { value: "4 min",  label: "average emergency response time in urban areas"           },
  { value: "87%",    label: "of people feel safer with a safety app installed"         },
];

const Features = () => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      {/* FEATURES SECTION */}
      <section className="py-28 bg-white" id="features">
        <div className="max-w-6xl mx-auto px-6">

          <div ref={ref} className="text-center mb-20">
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
                Key Features
              </div>
              <h2
                className="font-black text-neutral-900 mb-5"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
              >
                Everything you need to{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #EA2B1F, #5a1515)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  stay protected
                </span>
              </h2>
              <p className="text-neutral-500 text-lg max-w-xl mx-auto leading-relaxed">
                Comprehensive tools for personal safety and peace of mind — built for individuals, families, and solo travelers.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 32 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                  className="group relative p-7 rounded-2xl bg-white overflow-hidden"
                  style={{
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.12)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 20px rgba(0,0,0,0.06)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: feature.color }}
                  />
                  <div className="flex items-start gap-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: feature.bgColor }}
                    >
                      <Icon className="w-5 h-5" style={{ color: feature.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-neutral-900 text-lg mb-2">{feature.title}</h3>
                      <p className="text-neutral-500 text-sm leading-relaxed mb-5">{feature.description}</p>
                      <ul className="space-y-2.5">
                        {feature.points.map((point) => (
                          <li key={point} className="flex items-center gap-2.5">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: feature.bgColor }}
                            >
                              <Check className="w-3 h-3" style={{ color: feature.color }} />
                            </div>
                            <span className="text-sm text-neutral-600">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <Link to="/sign-in">
              <button
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white rounded-2xl transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #312F2F, #EA2B1F)",
                  boxShadow: "0 8px 32px rgba(234,43,31,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(234,43,31,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(234,43,31,0.3)";
                }}
              >
                Explore All Features
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SAFETY AWARENESS STATS STRIP */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg, #312F2F 0%, #5a1515 55%, #EA2B1F 100%)" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
              Safety Awareness
            </p>
            <h2
              className="text-white font-black mb-3"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "-0.02em" }}
            >
              The numbers that matter
            </h2>
            <p className="text-white/50 text-sm max-w-xl mx-auto">
              Understanding the scale of personal safety challenges drives us to build better tools every day.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {safetyStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p
                  className="text-white font-black text-3xl sm:text-4xl mb-2"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {stat.value}
                </p>
                <p className="text-white/50 text-xs leading-relaxed">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;