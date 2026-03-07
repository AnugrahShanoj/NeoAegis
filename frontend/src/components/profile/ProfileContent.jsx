import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield } from "lucide-react";
import UserInfo from "./UserInfo";
import ActivityLogs from "./ActivityLogs";
import LayoutWrapper from "../LayoutWrapper";
import { getActivityLogsAPI } from "../../../Services/allAPI";

const MotionDiv = motion.div;

const ProfileContent = () => {
  const [logs,        setLogs]        = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const username = sessionStorage.getItem("username") || "User";

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLogsLoading(true);
    const token = sessionStorage.getItem("token");
    if (!token) { setLogsLoading(false); return; }
    const reqHeader = {
      "Content-Type":  "application/json",
      "Authorization": "Bearer " + token,
    };
    try {
      const res = await getActivityLogsAPI(reqHeader);
      if (res && res.data && Array.isArray(res.data)) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch activity logs:", err);
    } finally {
      setLogsLoading(false);
    }
  }

  const totalLogs  = logs.length;
  const recentLogs = logs.filter((l) => {
    const diff = Date.now() - new Date(l.createdAt).getTime();
    return diff < 7 * 86400000;
  }).length;

  return (
    <LayoutWrapper>
      <MotionDiv
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-5xl mx-auto px-2 sm:px-4 pt-4 pb-10 space-y-5"
      >

        {/* ── HERO BANNER ── */}
        <div
          className="relative rounded-2xl overflow-hidden px-6 py-7 sm:px-8 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          style={{ background: "linear-gradient(135deg, #312F2F 0%, #5a1515 55%, #EA2B1F 100%)" }}
        >
          {/* Grid texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Decorative rings */}
          <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute top-4 right-16 w-28 h-28 rounded-full border border-white/5 pointer-events-none" />

          <div className="relative z-10">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">
              Profile
            </p>
            <h1 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2">
              {username}'s Account
            </h1>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm mb-3">
              Manage your personal information and review your complete activity history.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
              <span
                className="w-2 h-2 rounded-full bg-green-400"
                style={{ boxShadow: "0 0 6px #4ade80" }}
              />
              <span className="text-white/80 text-xs font-semibold">Account active</span>
            </div>
          </div>

          {/* Avatar initial badge */}
          <div className="relative z-10 flex-shrink-0">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-white/20"
              style={{ background: "rgba(255,255,255,0.12)", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
            >
              <span className="text-white font-bold text-4xl">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400">Account</p>
              <p className="text-sm font-bold text-neutral-700 truncate max-w-[80px]">{username}</p>
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400">Total Logs</p>
              <p className="text-xl font-bold text-blue-600">{logsLoading ? "—" : totalLogs}</p>
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400">This Week</p>
              <p className="text-xl font-bold text-green-600">{logsLoading ? "—" : recentLogs}</p>
            </div>
          </div>
        </div>

        {/* ── PERSONAL INFO ── */}
        <UserInfo onProfileUpdated={fetchLogs} />

        {/* ── ACTIVITY LOG ── */}
        <ActivityLogs logs={logs} loading={logsLoading} onRefresh={fetchLogs} />

      </MotionDiv>
    </LayoutWrapper>
  );
};

export default ProfileContent;