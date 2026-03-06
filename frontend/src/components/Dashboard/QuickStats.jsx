import { motion } from "framer-motion";
import { BellRing, CheckCircle, Users } from "lucide-react";

const MotionDiv = motion.div;

function getWrapClass(color) {
  if (color === "red")   return "p-2.5 rounded-xl bg-red-50";
  if (color === "green") return "p-2.5 rounded-xl bg-green-50";
  return "p-2.5 rounded-xl bg-blue-50";
}

function getValueClass(color) {
  if (color === "red")   return "text-2xl font-bold text-red-600";
  if (color === "green") return "text-2xl font-bold text-green-600";
  return "text-2xl font-bold text-blue-600";
}

const QuickStats = ({ contactCount, checkinCount, sosCount, loading }) => {
  const stats = [
    { label: "SOS Alerts",          value: sosCount,      Icon: BellRing,     color: "red",   delay: 0.1 },
    { label: "Safety Check-ins",    value: checkinCount,  Icon: CheckCircle,  color: "green", delay: 0.2 },
    { label: "Emergency Contacts",  value: contactCount,  Icon: Users,        color: "blue",  delay: 0.3 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const { label, value, Icon, color, delay } = stat;
        const wrapClass  = getWrapClass(color);
        const valueClass = getValueClass(color);
        const display    = loading ? "—" : (value !== null && value !== undefined ? value : "—");
        return (
          <MotionDiv
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay }}
            className="bg-white border border-neutral-200 rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className={wrapClass}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 mb-0.5">{label}</p>
              <p className={valueClass}>{display}</p>
            </div>
          </MotionDiv>
        );
      })}
    </div>
  );
};

export default QuickStats;