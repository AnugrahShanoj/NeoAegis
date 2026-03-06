import { motion } from "framer-motion";
import { Shield, Users, CheckCircle, Bell, ShieldAlert, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const MotionDiv = motion.div;

const CIRCUMFERENCE = 220;

function getDaysSince(dateStr) {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function calcScore(contactCount, daysSinceCheckin, activeSos, daysSinceBreach) {
  let s = 0;
  if (contactCount >= 4)      s += 25;
  else if (contactCount >= 2) s += 17;
  else if (contactCount >= 1) s += 8;

  if (daysSinceCheckin !== null) {
    if (daysSinceCheckin === 0)      s += 25;
    else if (daysSinceCheckin <= 3)  s += 18;
    else if (daysSinceCheckin <= 7)  s += 10;
    else                             s += 3;
  }

  if (activeSos === 0) s += 25;
  else                 s += 10;

  if (daysSinceBreach !== null) {
    if (daysSinceBreach <= 7)       s += 25;
    else if (daysSinceBreach <= 30) s += 15;
    else                            s += 5;
  }

  return Math.min(s, 100);
}

function getScoreInfo(score) {
  if (score >= 90) return { label: "Fully Protected", color: "#16a34a" };
  if (score >= 70) return { label: "Good Standing",   color: "#16a34a" };
  if (score >= 50) return { label: "Needs Attention", color: "#d97706" };
  return           { label: "At Risk",               color: "#EA2B1F" };
}

function getRingColor(score) {
  if (score >= 70) return "#16a34a";
  if (score >= 50) return "#d97706";
  return "#EA2B1F";
}

function getBadgeClass(status) {
  if (status === "good")  return "text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700";
  if (status === "amber") return "text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700";
  return "text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700";
}

function buildTip(score, contactCount, daysSinceCheckin, daysSinceBreach) {
  if (daysSinceBreach === null) return "Check your email for data breaches to boost your safety score.";
  if (daysSinceBreach > 7)     return "Your email breach check is outdated. Run a scan to stay protected.";
  if (contactCount < 4)        return "Add more emergency contacts to reach full protection.";
  if (daysSinceCheckin !== null && daysSinceCheckin > 3)
    return "Check in more regularly to maintain your streak and safety score.";
  return "Your safety profile is in great shape. Keep it up!";
}

const SafetyReadiness = ({ contactCount, lastCheckinDate, activeSosCount, loading }) => {
  const lastBreachStr    = sessionStorage.getItem("lastEmailBreachCheck");
  const daysSinceBreach  = getDaysSince(lastBreachStr);
  const daysSinceCheckin = getDaysSince(lastCheckinDate);
  const contacts         = contactCount || 0;
  const activeSos        = activeSosCount || 0;

  const score        = loading ? 0 : calcScore(contacts, daysSinceCheckin, activeSos, daysSinceBreach);
  const scoreInfo    = getScoreInfo(score);
  const ringColor    = getRingColor(score);
  const strokeOffset = String(CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE);
  const tipText      = buildTip(score, contacts, daysSinceCheckin, daysSinceBreach);
  const tipIcon      = score >= 90 ? "✅" : "⚠️";

  // Contacts row
  const cStatus = contacts === 0 ? "none" : contacts >= 3 ? "good" : "amber";
  const cBadge  = cStatus === "good" ? "Good" : cStatus === "amber" ? "Review" : "None";
  const cSub    = loading ? "Loading..." : (contacts + " of 4 slots filled");

  // Checkin row
  const ciStatus = daysSinceCheckin === null ? "none" : daysSinceCheckin <= 3 ? "good" : "amber";
  const ciBadge  = ciStatus === "good" ? "Active" : ciStatus === "amber" ? "Stale" : "None";
  const ciSub    = loading ? "Loading..." : (
    daysSinceCheckin === null  ? "Never checked in"   :
    daysSinceCheckin === 0     ? "Today"              :
    daysSinceCheckin + " days ago"
  );

  // SOS row
  const sStatus = activeSos === 0 ? "good" : "red";
  const sBadge  = activeSos === 0 ? "Clear" : "Active";
  const sSub    = loading ? "Loading..." : (activeSos === 0 ? "No active alerts" : activeSos + " active alert(s)");

  // Breach row
  // ✅ New
const bStatus = daysSinceBreach === null ? "amber" : "good";
const bBadge  = daysSinceBreach === null ? "Check Now" : "Recent";
const bSub    = daysSinceBreach === null ? "Check recommended every session" : "Checked earlier this session";

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white border border-neutral-200 rounded-xl p-5 sm:p-6"
    >
      <h2 className="font-bold text-base text-neutral-800 flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-red-600" />
        Safety Readiness
      </h2>

      {/* Score ring */}
      <div className="flex items-center gap-5 mb-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="40" cy="40" r="35" fill="none" stroke="#f0eeee" strokeWidth="8" />
            <circle
              cx="40" cy="40" r="35"
              fill="none"
              stroke={loading ? "#f0eeee" : ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={String(CIRCUMFERENCE)}
              strokeDashoffset={loading ? String(CIRCUMFERENCE) : strokeOffset}
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold leading-none" style={{ color: loading ? "#ccc" : scoreInfo.color }}>
              {loading ? "—" : score + "%"}
            </span>
            <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wide mt-0.5">Score</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-base text-neutral-800 mb-1">
            {loading ? "Calculating..." : scoreInfo.label}
          </div>
          <div className="text-xs text-neutral-500 leading-relaxed">
            Based on your contacts, check-ins, alerts and breach scan history.
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-800 mb-4">
        <span className="flex-shrink-0 mt-0.5">{tipIcon}</span>
        <span>{tipText}</span>
      </div>

      {/* Checklist rows */}
      <div className="space-y-0.5">
        <Link to="/contacts" className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-neutral-50 transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-neutral-700">Emergency Contacts</div>
            <div className="text-xs text-neutral-400">{cSub}</div>
          </div>
          <span className={getBadgeClass(cStatus)}>{cBadge}</span>
          <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0" />
        </Link>

        <Link to="/checkins" className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-neutral-50 transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-neutral-700">Safety Check-ins</div>
            <div className="text-xs text-neutral-400">{ciSub}</div>
          </div>
          <span className={getBadgeClass(ciStatus)}>{ciBadge}</span>
          <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0" />
        </Link>

        <Link to="/alerts" className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-neutral-50 transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-neutral-700">SOS Alerts</div>
            <div className="text-xs text-neutral-400">{sSub}</div>
          </div>
          <span className={getBadgeClass(sStatus)}>{sBadge}</span>
          <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0" />
        </Link>

        <Link to="/email-breach" className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-neutral-50 transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-neutral-700">Email Breach Check</div>
            <div className="text-xs text-neutral-400">{bSub}</div>
          </div>
          <span className={getBadgeClass(bStatus)}>{bBadge}</span>
          <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0" />
        </Link>
      </div>
    </MotionDiv>
  );
};

export default SafetyReadiness;