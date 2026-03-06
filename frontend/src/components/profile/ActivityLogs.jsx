import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, CheckCircle, ShieldAlert,
  UserPlus, UserMinus, User,UserCheck, Bell,
  ChevronLeft, ChevronRight, RefreshCw, Filter
} from "lucide-react";

const MotionDiv = motion.div;

const ITEMS_PER_PAGE = 6;

const TYPE_CONFIG = {
  sos:             { label: "SOS Alert",          iconBg: "bg-red-50",     dot: "bg-red-500",    lineColor: "#EA2B1F" },
  checkin:         { label: "Safety Check-in",    iconBg: "bg-green-50",   dot: "bg-green-500",  lineColor: "#16a34a" },
  breach_scan:     { label: "Email Breach Scan",  iconBg: "bg-purple-50",  dot: "bg-purple-500", lineColor: "#7c3aed" },
  contact_added:   { label: "Contact Added",      iconBg: "bg-blue-50",    dot: "bg-blue-500",   lineColor: "#2563eb" },
  contact_deleted: { label: "Contact Removed",    iconBg: "bg-orange-50",  dot: "bg-orange-500", lineColor: "#ea580c" },
  contact_updated: { label: "Contact Updated", iconBg: "bg-cyan-50", dot: "bg-cyan-500", lineColor: "#0891b2" },
  profile_updated: { label: "Profile Updated",    iconBg: "bg-neutral-100",dot: "bg-neutral-400",lineColor: "#9ca3af" },
};

function getConfig(type) {
  return TYPE_CONFIG[type] || TYPE_CONFIG["profile_updated"];
}

function getIconNode(type) {
  if (type === "sos")             return <AlertTriangle className="w-4 h-4 text-red-500" />;
  if (type === "checkin")         return <CheckCircle   className="w-4 h-4 text-green-500" />;
  if (type === "breach_scan")     return <ShieldAlert   className="w-4 h-4 text-purple-500" />;
  if (type === "contact_added")   return <UserPlus      className="w-4 h-4 text-blue-500" />;
  if (type === "contact_deleted") return <UserMinus     className="w-4 h-4 text-orange-500" />;
  if (type === "contact_updated") return <UserCheck className="w-4 h-4 text-cyan-500" />;
  return                                 <User          className="w-4 h-4 text-neutral-400" />;
}

function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getRelativeTime(ts) {
  if (!ts) return "";
  const diff = Date.now() - new Date(ts).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return mins + "m ago";
  if (hours < 24) return hours + "h ago";
  if (days < 7)   return days + "d ago";
  return formatTime(ts);
}

function getPaginationClass(active) {
  if (active) return "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary text-white";
  return "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50";
}

function buildPageButtons(total, current, onPage) {
  const btns = [];
  for (let p = 1; p <= total; p++) {
    const isFirst   = p === 1;
    const isLast    = p === total;
    const isCurrent = p === current;
    const isNear    = Math.abs(p - current) <= 1;
    if (!isFirst && !isLast && !isNear) {
      if (p === 2 || p === total - 1) {
        btns.push(
          <span key={"e" + p} className="h-8 w-8 flex items-center justify-center text-xs text-neutral-400">
            ...
          </span>
        );
      }
      continue;
    }
    const cls = getPaginationClass(isCurrent);
    const pg  = p;
    btns.push(
      <button key={p} onClick={() => onPage(pg)} className={cls}>
        {p}
      </button>
    );
  }
  return btns;
}

const FILTER_OPTIONS = [
  { value: "all",             label: "All Activities"   },
  { value: "sos",             label: "SOS Alerts"       },
  { value: "checkin",         label: "Safety Check-ins" },
  { value: "breach_scan",     label: "Email Breach"     },
  { value: "contact_added",   label: "Contacts Added"   },
  { value: "contact_deleted", label: "Contacts Removed" },
  { value: "profile_updated", label: "Profile Updates"  },
];

const ActivityLogs = ({ logs, loading, onRefresh }) => {
  const [filter,      setFilter]      = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = (logs || []).filter((log) => {
    if (filter === "all") return true;
    return log.type === filter;
  });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage    = Math.min(currentPage, totalPages);
  const startIndex  = (safePage - 1) * ITEMS_PER_PAGE;
  const paginated   = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const pageButtons = buildPageButtons(totalPages, safePage, (p) => setCurrentPage(p));

  const totalLabel   = String(filtered.length) + " " + (filtered.length === 1 ? "entry" : "entries");
  const showingStart = String(startIndex + 1);
  const showingEnd   = String(Math.min(safePage * ITEMS_PER_PAGE, filtered.length));

  function handleFilterChange(val) {
    setFilter(val);
    setCurrentPage(1);
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white border border-neutral-200 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-neutral-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-base text-neutral-800 flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Activity Log
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">{loading ? "Loading..." : totalLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 rounded-lg bg-white">
              <Filter className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="text-xs font-medium text-neutral-700 bg-transparent outline-none cursor-pointer"
              >
                {FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="h-8 w-8 flex items-center justify-center border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
              title="Refresh logs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 sm:px-6 py-4">
        {loading && (
          <div className="py-12 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-neutral-400">Loading activity logs...</p>
          </div>
        )}

        {!loading && paginated.length === 0 && (
          <div className="py-12 flex flex-col items-center gap-2">
            <Bell className="w-8 h-8 text-neutral-200" />
            <p className="text-sm font-medium text-neutral-400">No activities found</p>
            <p className="text-xs text-neutral-300">
              {filter === "all" ? "Your activity will appear here as you use NeoAegis" : "Try changing the filter"}
            </p>
          </div>
        )}

        {!loading && paginated.length > 0 && (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-neutral-100" />

            <div className="space-y-0">
              {paginated.map((log, index) => {
                const cfg         = getConfig(log.type);
                const iconNode    = getIconNode(log.type);
                const timeText    = formatTime(log.createdAt);
                const relTime     = getRelativeTime(log.createdAt);
                const isLast      = index === paginated.length - 1;
                const logKey      = log._id || (log.type + String(index));
                const descText    = log.description || "";
                const dotColor    = cfg.dot;
                const iconBg      = cfg.iconBg;
                const borderColor = cfg.lineColor;

                return (
                  <div key={logKey} className={isLast ? "relative flex gap-4 pb-0" : "relative flex gap-4 pb-5"}>
                    {/* Dot on timeline */}
                    <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
                      <div className={"w-8 h-8 rounded-full flex items-center justify-center " + iconBg}
                        style={{ border: "2px solid " + borderColor + "33" }}>
                        {iconNode}
                      </div>
                    </div>

                    {/* Content */}
                    <div
                      className="flex-1 min-w-0 p-3 rounded-xl border bg-neutral-50/50 hover:bg-white transition-colors"
                      style={{ borderColor: borderColor + "22" }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-800 truncate">{log.title}</p>
                          {descText.length > 0 && (
                            <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{descText}</p>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-xs font-semibold text-neutral-400">{relTime}</p>
                          <p className="text-xs text-neutral-300 mt-0.5 hidden sm:block">{timeText}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="px-5 sm:px-6 py-3 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-400 order-2 sm:order-1">
            {"Showing " + showingStart + "–" + showingEnd + " of " + filtered.length + " entries"}
          </p>
          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="h-8 w-8 rounded-full flex items-center justify-center bg-white border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {pageButtons}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="h-8 w-8 rounded-full flex items-center justify-center bg-white border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </MotionDiv>
  );
};

export default ActivityLogs;