import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle } from "lucide-react";

const MotionDiv = motion.div;

const Settings = () => {
  const [sosAlerts,      setSosAlerts]      = useState(true);
  const [safetyCheckins, setSafetyCheckins] = useState(true);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white border border-neutral-200 rounded-xl overflow-hidden"
    >
      <div className="px-5 sm:px-6 py-4 border-b border-neutral-100">
        <h2 className="font-bold text-base text-neutral-800 flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          Notification Preferences
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">Control which alerts you receive</p>
      </div>

      <div className="px-5 sm:px-6 py-4 space-y-4">
        <SettingRow
          label="SOS Alerts"
          description="Receive notifications when an SOS alert is triggered"
          checked={sosAlerts}
          onChange={setSosAlerts}
        />
        <SettingRow
          label="Safety Check-in Reminders"
          description="Get reminders for your scheduled safety check-ins"
          checked={safetyCheckins}
          onChange={setSafetyCheckins}
        />
      </div>
    </MotionDiv>
  );
};

function SettingRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-700">{label}</p>
        <p className="text-xs text-neutral-400 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={[
          "relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200",
          checked ? "bg-primary" : "bg-neutral-200",
        ].join(" ")}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={[
            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export default Settings;