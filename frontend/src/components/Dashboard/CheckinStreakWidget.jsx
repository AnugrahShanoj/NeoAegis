import { motion } from "framer-motion";
import { MapPin, Flame, Calendar, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const MotionDiv = motion.div;

function getDateKey(dateStr) {
  const d = new Date(dateStr);
  return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
}

function getTimestamp(item) {
  return item.createdAt || item.date || item.checkInTime || item.timestamp || null;
}

function calculateStreak(checkins) {
  if (!checkins || checkins.length === 0) return 0;

  const dateSet = new Set();
  checkins.forEach((c) => {
    const ts = getTimestamp(c);
    if (ts) dateSet.add(getDateKey(ts));
  });

  const dates = Array.from(dateSet).map((key) => {
    const parts = key.split("-");
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
    d.setHours(0, 0, 0, 0);
    return d;
  }).sort((a, b) => b.getTime() - a.getTime());

  if (dates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffFromToday = Math.round((today.getTime() - dates[0].getTime()) / 86400000);
  if (diffFromToday > 1) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = Math.round((dates[i - 1].getTime() - dates[i].getTime()) / 86400000);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function getLastCheckinText(checkins) {
  if (!checkins || checkins.length === 0) return "Never checked in";
  const sorted = [...checkins].sort((a, b) => {
    const da = new Date(getTimestamp(a) || 0);
    const db = new Date(getTimestamp(b) || 0);
    return db.getTime() - da.getTime();
  });
  const ts = getTimestamp(sorted[0]);
  if (!ts) return "Unknown";
  return new Date(ts).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function getStreakMessage(streak) {
  if (streak === 0)  return "Start your streak today!";
  if (streak < 3)    return "Great start! Keep going.";
  if (streak < 7)    return "Building momentum!";
  if (streak < 14)   return "You're on a roll! 🔥";
  return "Incredible dedication! 🏆";
}

function getStreakColorClass(streak) {
  if (streak === 0) return "text-neutral-300";
  if (streak < 7)   return "text-amber-500";
  return "text-orange-500";
}

function getBarColorClass(streak) {
  if (streak === 0) return "bg-neutral-200";
  if (streak < 7)   return "bg-amber-400";
  return "bg-orange-500";
}

const CheckinStreakWidget = ({ checkinsData, loading }) => {
  const data          = checkinsData || [];
  const streak        = loading ? 0 : calculateStreak(data);
  const lastText      = loading ? "Loading..." : getLastCheckinText(data);
  const message       = getStreakMessage(streak);
  const total         = data.length;
  const barPct        = Math.min((streak / 30) * 100, 100);
  const barWidth      = barPct + "%";
  const colorClass    = getStreakColorClass(streak);
  const barClass      = getBarColorClass(streak);
  const streakLabel   = loading ? "—" : String(streak);
  const totalLabel    = loading ? "—" : String(total);
  const progressLabel = loading ? "—/30" : streak + "/30";

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white border border-neutral-200 rounded-xl p-5 sm:p-6 flex flex-col"
    >
      <h2 className="font-bold text-base text-neutral-800 flex items-center gap-2 mb-5">
        <MapPin className="w-5 h-5 text-red-600" />
        Safety Check-in
      </h2>

      {/* Streak + total */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-end gap-2 mb-1">
            <Flame className={"w-9 h-9 " + colorClass} />
            <span className={"text-5xl font-bold leading-none " + colorClass}>
              {streakLabel}
            </span>
            <span className="text-sm font-semibold text-neutral-400 pb-1">day streak</span>
          </div>
          <p className="text-sm text-neutral-500">{loading ? "Loading..." : message}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex items-center gap-1 justify-end text-neutral-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Total</span>
          </div>
          <div className="text-2xl font-bold text-neutral-700">{totalLabel}</div>
          <div className="text-xs text-neutral-400">check-ins</div>
        </div>
      </div>

      {/* Progress bar toward 30-day goal */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
          <span>30-day goal progress</span>
          <span className="font-semibold">{progressLabel}</span>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className={"h-full rounded-full transition-all duration-700 " + barClass}
            style={{ width: loading ? "0%" : barWidth }}
          />
        </div>
      </div>

      {/* Last check-in */}
      <div className="flex items-center gap-2.5 p-3 bg-neutral-50 border border-neutral-100 rounded-lg mb-5">
        <Calendar className="w-4 h-4 text-neutral-400 flex-shrink-0" />
        <div className="text-xs">
          <span className="font-semibold text-neutral-500">Last check-in: </span>
          <span className="text-neutral-600">{lastText}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-auto space-y-2">
        <Link
          to="/checkins"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity duration-200"
          style={{ background: "linear-gradient(135deg, #312F2F, #EA2B1F)" }}
        >
          Check In Now
          <ArrowRight className="w-4 h-4" />
        </Link>
        {streak > 0 && (
          <p className="text-center text-xs text-neutral-400">
            {"Keep your " + streak + "-day streak alive! " + (streak >= 7 ? "🔥" : "⚡")}
          </p>
        )}
      </div>
    </MotionDiv>
  );
};

export default CheckinStreakWidget;