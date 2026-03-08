import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Bell, History, MapPin, ChevronLeft, ChevronRight, ShieldAlert, Filter } from "lucide-react";
import { io } from "socket.io-client";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import LayoutWrapper from "../components/LayoutWrapper";
import {
  createSOSAlertAPI,
  getSOSAlertsAPI,
  resolveSOSAlertAPI,
} from "../../Services/allAPI";
import { serverUrl } from "../../Services/serverURL";

const MotionDiv = motion.div;
const ALERTS_PER_PAGE = 3;

const SOSAlerts = () => {
  const [isDialogOpen, setIsDialogOpen]   = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [filter, setFilter]               = useState("all");
  const [token, setToken]                 = useState("");
  const [alertHistory, setAlertHistory]   = useState([]);
  const [sosActive, setSosActive]         = useState(false);
  const [currentPage, setCurrentPage]     = useState(1);

  const socketRef       = useRef(null);
  const watchIdRef      = useRef(null);
  const heartbeatRef    = useRef(null);
  const lastPositionRef = useRef(null);

  // ── Location helpers ──────────────────────────────────────────────────────

  const fetchCityName = async (lat, lon) => {
    const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?key=${OPENCAGE_API_KEY}&q=${lat}+${lon}&pretty=1`;
    try {
      const response = await fetch(url);
      const data     = await response.json();
      const c        = data.results[0]?.components;
      if (!c) return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      return (
        c.city || c.town || c.village || c.suburb ||
        c.state_district || c.county || c.state ||
        `${lat.toFixed(4)}, ${lon.toFixed(4)}`
      );
    } catch {
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  };

  const getLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          const cityName = await fetchCityName(latitude, longitude);
          resolve({ latitude, longitude, cityName });
        },
        (error) => {
          const msgs = {
            [error.PERMISSION_DENIED]:    "Permission denied: Please allow location access.",
            [error.POSITION_UNAVAILABLE]: "Position unavailable.",
            [error.TIMEOUT]:              "Timeout: Location request took too long.",
          };
          reject(msgs[error.code] || "Unknown error retrieving location.");
        }
      );
    });

  // ── Socket / tracking ─────────────────────────────────────────────────────

  const startLiveTracking = (userId) => {
    socketRef.current = io(serverUrl);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-sos-room", userId);
    });
    watchIdRef.current = navigator.geolocation.watchPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        lastPositionRef.current = { lat, lng };
        if (socketRef.current?.connected) {
          socketRef.current.emit("location-update", { userId, lat, lng });
        }
      },
      (err) => console.error("Live tracking error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
    heartbeatRef.current = setInterval(() => {
      if (lastPositionRef.current && socketRef.current?.connected) {
        socketRef.current.emit("location-update", { userId, ...lastPositionRef.current });
      }
    }, 3000);
    setSosActive(true);
  };

  const stopLiveTracking = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (heartbeatRef.current !== null) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    lastPositionRef.current = null;
    setSosActive(false);
    const currentToken = sessionStorage.getItem("token");
    if (currentToken) {
      try {
        const reqHeader = { Authorization: "Bearer " + currentToken };
        const response  = await resolveSOSAlertAPI(reqHeader);
        if (response.status === 200) getAllSOSAlerts();
      } catch (err) {
        console.error("Failed to resolve SOS alert:", err);
      }
    }
  };

  // ── SOS trigger ───────────────────────────────────────────────────────────

  const handleSendAlert = async () => {
    try {
      const { latitude, longitude, cityName } = await getLocation();
      if (!token) { toast.error("Session expired. Please login again."); return; }
      const reqHeader = { Authorization: "Bearer " + token };
      const reqBody   = {
        latitude, longitude,
        city:    cityName,
        message: customMessage || "SOS Alert!",
      };
      const response = await createSOSAlertAPI(reqBody, reqHeader);
      if (response.status === 200) {
        startLiveTracking(response.data.alert.userId);
        setCustomMessage("");
        setIsDialogOpen(false);
        setCurrentPage(1);
        getAllSOSAlerts();
       toast.success("🚨 SOS Alert sent! Emergency contacts notified via email.");
      } else {
        toast.error("Error sending SOS Alert. Please try again.");
      }
    } catch (error) {
      console.error("handleSendAlert error:", error);
      toast.error("Failed to get location. Please allow location access and try again.");
    }
  };

  // ── Data ──────────────────────────────────────────────────────────────────

  const getAllSOSAlerts = async () => {
    if (!token) return;
    try {
      const reqHeader = { Authorization: "Bearer " + token };
      const response  = await getSOSAlertsAPI(reqHeader);
      if (response.status === 200) {
        setAlertHistory(response.data);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching SOS Alerts:", error);
    }
  };

  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
    getAllSOSAlerts();
  }, [token]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null)   navigator.geolocation.clearWatch(watchIdRef.current);
      if (heartbeatRef.current !== null) clearInterval(heartbeatRef.current);
      if (socketRef.current)             socketRef.current.disconnect();
    };
  }, []);

  // ── Pagination & filter ───────────────────────────────────────────────────

  const filteredAlerts  = alertHistory.filter(
    (alert) => filter === "all" || alert.status === filter
  );
  const totalPages      = Math.max(1, Math.ceil(filteredAlerts.length / ALERTS_PER_PAGE));
  const safePage        = Math.min(currentPage, totalPages);
  const paginatedAlerts = filteredAlerts.slice(
    (safePage - 1) * ALERTS_PER_PAGE,
    safePage * ALERTS_PER_PAGE
  );

  const handleFilterChange = (value) => { setFilter(value); setCurrentPage(1); };
  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // ── Status badge ──────────────────────────────────────────────────────────

  function getStatusClass(status) {
    if (status === "Resolved")     return "bg-green-50 text-green-700 border border-green-200";
    if (status === "Pending")      return "bg-blue-50 text-blue-700 border border-blue-200";
    return "bg-neutral-100 text-neutral-600";
  }

  // ── Stats derived from data ───────────────────────────────────────────────
  const totalAlerts    = alertHistory.length;
  const pendingCount   = alertHistory.filter((a) => a.status === "Pending").length;
  const resolvedCount  = alertHistory.filter((a) => a.status === "Resolved").length;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />

      <main className="flex-1 min-w-0 transition-all duration-200 bg-neutral-300/40">
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
                  SOS Alerts
                </p>
                <h1 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2">
                  Emergency Response
                </h1>
                <p className="text-white/55 text-sm leading-relaxed max-w-sm mb-3">
                  Instantly alert your emergency contacts with your live location during critical situations.
                </p>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
                  {sosActive
                    ? <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" style={{ boxShadow: "0 0 6px #f87171" }} />
                    : <span className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: "0 0 6px #4ade80" }} />
                  }
                  <span className="text-white/80 text-xs font-semibold">
                    {sosActive ? "SOS Active — Live tracking running" : "All clear — No active alerts"}
                  </span>
                </div>
              </div>

              {/* SOS trigger button in banner */}
              <div className="relative z-10 w-full sm:w-auto flex-shrink-0">
                {sosActive ? (
                  <MotionDiv whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <button
                      onClick={stopLiveTracking}
                      className="flex items-center justify-center gap-2 bg-white/10 border-2 border-white/30 text-white font-bold text-sm px-6 py-3 rounded-xl w-full sm:w-auto hover:bg-white/15 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      Stop SOS Tracking
                    </button>
                  </MotionDiv>
                ) : (
                  <MotionDiv whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <button
                      onClick={() => setIsDialogOpen(true)}
                      className="relative flex items-center justify-center gap-2 bg-white text-red-600 font-bold text-sm px-8 py-3 rounded-xl w-full sm:w-auto hover:bg-neutral-50 transition-colors"
                      style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}
                    >
                      <span className="absolute inset-0 rounded-xl animate-ping bg-white/20 pointer-events-none" style={{ animationDuration: "2.5s" }} />
                      <Bell className="w-4 h-4" />
                      SOS ALERT
                    </button>
                  </MotionDiv>
                )}
              </div>
            </div>

            {/* ── STATS ROW ── */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400">Total Alerts</p>
                  <p className="text-xl font-bold text-red-600">{totalAlerts}</p>
                </div>
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400">Pending</p>
                  <p className="text-xl font-bold text-blue-600">{pendingCount}</p>
                </div>
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <History className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400">Resolved</p>
                  <p className="text-xl font-bold text-green-600">{resolvedCount}</p>
                </div>
              </div>
            </div>

            {/* ── TWO COLUMN ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Trigger card — 1/3 */}
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-100">
                  <h2 className="font-bold text-base text-neutral-800 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    Send SOS Alert
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Notifies all emergency contacts instantly
                  </p>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                      Custom Message (optional)
                    </label>
                    <Textarea
                      placeholder="Add context about your situation..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="min-h-[90px] resize-none text-sm border-neutral-200 focus:border-primary"
                    />
                  </div>

                  {sosActive ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                        <p className="text-xs font-semibold text-red-700">
                          SOS Active — Live location tracking is running
                        </p>
                      </div>
                      <button
                        onClick={stopLiveTracking}
                        className="w-full py-2.5 rounded-xl text-sm font-bold text-red-600 bg-white border-2 border-red-200 hover:bg-red-50 transition-colors"
                      >
                        Stop SOS Tracking
                      </button>
                    </div>
                  ) : (
                    <MotionDiv whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <button
                        onClick={() => setIsDialogOpen(true)}
                        className="relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white overflow-hidden"
                        style={{ background: "linear-gradient(135deg, #312F2F, #EA2B1F)" }}
                      >
                        <Bell className="w-4 h-4" />
                        Trigger SOS Alert
                      </button>
                    </MotionDiv>
                  )}

                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <span className="text-base flex-shrink-0">⚠️</span>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      This will immediately notify all your emergency contacts via email with a live tracking link.
                    </p>
                  </div>
                </div>
              </div>

              {/* Alert history — 2/3 */}
              <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-base text-neutral-800 flex items-center gap-2">
                      <History className="w-4 h-4 text-primary" />
                      Alert History
                      {filteredAlerts.length > 0 && (
                        <span className="text-xs font-normal text-neutral-400">
                          ({filteredAlerts.length} total)
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">Your past SOS alerts</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 rounded-lg bg-white w-fit">
                    <Filter className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                    <Select value={filter} onValueChange={handleFilterChange}>
                      <SelectTrigger className="border-0 p-0 h-auto text-xs font-medium text-neutral-700 bg-transparent shadow-none focus:ring-0 w-[120px]">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="all">All Alerts</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-5">
                  {paginatedAlerts.length > 0 ? (
                    <div className="space-y-3">
                      {paginatedAlerts.map((alert) => (
                        <div
                          key={alert._id}
                          className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white hover:shadow-sm transition-all"
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Bell className="w-4 h-4 text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-neutral-800 leading-snug truncate">
                                {alert.message}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <MapPin className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                                <span className="text-xs text-neutral-400 truncate">
                                  {alert.location.city}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-300 mt-0.5">
                                {new Date(alert.timestamp).toLocaleString("en-IN", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </p>
                            </div>
                          </div>
                          <span className={"self-start flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold " + getStatusClass(alert.status)}>
                            {alert.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-14">
                      <History className="w-10 h-10 text-neutral-200 mb-3" />
                      <p className="text-sm font-medium text-neutral-400">No alerts found</p>
                      <p className="text-xs text-neutral-300 mt-1">
                        {filter === "all" ? "Your SOS alert history will appear here" : "Try changing the filter"}
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <p className="text-xs text-neutral-400 order-2 sm:order-1">
                        Showing{" "}
                        <span className="font-semibold text-neutral-600">
                          {(safePage - 1) * ALERTS_PER_PAGE + 1}–{Math.min(safePage * ALERTS_PER_PAGE, filteredAlerts.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-neutral-600">{filteredAlerts.length}</span>{" "}
                        alerts
                      </p>
                      <div className="flex items-center gap-1.5 order-1 sm:order-2">
                        <button
                          onClick={handlePrev}
                          disabled={safePage === 1}
                          className="h-8 w-8 rounded-full flex items-center justify-center bg-white border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          const isFirst   = page === 1;
                          const isLast    = page === totalPages;
                          const isCurrent = page === safePage;
                          const isNear    = Math.abs(page - safePage) <= 1;
                          if (!isFirst && !isLast && !isNear) {
                            if (page === 2 || page === totalPages - 1) {
                              return (
                                <span key={page} className="h-8 w-8 flex items-center justify-center text-xs text-neutral-400">…</span>
                              );
                            }
                            return null;
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={"h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all " + (isCurrent ? "bg-primary text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50")}
                            >
                              {page}
                            </button>
                          );
                        })}
                        <button
                          onClick={handleNext}
                          disabled={safePage === totalPages}
                          className="h-8 w-8 rounded-full flex items-center justify-center bg-white border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </MotionDiv>
        </LayoutWrapper>

        {/* ── Confirm dialog ── */}
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent className="max-w-sm sm:max-w-md mx-4">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm SOS Alert</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to send an SOS alert? This will immediately
                notify all your emergency contacts via email with a live tracking link.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                onClick={handleSendAlert}
              >
                Send Alert
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </main>
    </div>
  );
};

export default SOSAlerts;