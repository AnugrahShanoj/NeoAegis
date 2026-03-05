import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bell, History, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { io } from "socket.io-client";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LayoutWrapper from "../components/LayoutWrapper";
import {
  createSOSAlertAPI,
  getSOSAlertsAPI,
  resolveSOSAlertAPI,
} from "../../Services/allAPI";
import { serverUrl } from "../../Services/serverURL";

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

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-sos-room', userId);
    });

    watchIdRef.current = navigator.geolocation.watchPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        lastPositionRef.current = { lat, lng };
        if (socketRef.current?.connected) {
          socketRef.current.emit('location-update', { userId, lat, lng });
        }
      },
      (err) => console.error('Live tracking error:', err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    heartbeatRef.current = setInterval(() => {
      if (lastPositionRef.current && socketRef.current?.connected) {
        socketRef.current.emit('location-update', {
          userId,
          ...lastPositionRef.current,
        });
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

    const currentToken = sessionStorage.getItem('token');
    if (currentToken) {
      try {
        const reqHeader = { Authorization: `Bearer ${currentToken}` };
        const response  = await resolveSOSAlertAPI(reqHeader);
        if (response.status === 200) getAllSOSAlerts();
      } catch (err) {
        console.error('Failed to resolve SOS alert:', err);
      }
    }
  };

  // ── SOS trigger ───────────────────────────────────────────────────────────

  const handleSendAlert = async () => {
    try {
      const { latitude, longitude, cityName } = await getLocation();

      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      const reqHeader = { Authorization: `Bearer ${token}` };
      const reqBody   = {
        latitude,
        longitude,
        city:    cityName,
        message: customMessage || "SOS Alert!",
      };

      const response = await createSOSAlertAPI(reqBody, reqHeader);

      if (response.status === 200) {
        startLiveTracking(response.data.alert.userId);
        setCustomMessage("");
        setIsDialogOpen(false);
        setCurrentPage(1);    // go back to page 1 after new alert
        getAllSOSAlerts();
        alert("🚨 SOS Alert sent! Emergency contacts notified via email.");
      } else {
        alert("Error sending SOS Alert. Please try again.");
      }
    } catch (error) {
      console.error('handleSendAlert error:', error);
      alert("Failed to get location. Please allow location access and try again.");
    }
  };

  // ── Data ──────────────────────────────────────────────────────────────────

  const getAllSOSAlerts = async () => {
    if (!token) return;
    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response  = await getSOSAlertsAPI(reqHeader);
      if (response.status === 200) {
        setAlertHistory(response.data);
        setCurrentPage(1); // reset to page 1 on fresh fetch
      }
    } catch (error) {
      console.error("Error fetching SOS Alerts:", error);
    }
  };

  useEffect(() => {
    setToken(sessionStorage.getItem('token'));
    getAllSOSAlerts();
  }, [token]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null)   navigator.geolocation.clearWatch(watchIdRef.current);
      if (heartbeatRef.current !== null) clearInterval(heartbeatRef.current);
      if (socketRef.current)             socketRef.current.disconnect();
    };
  }, []);

  // ── Pagination logic ──────────────────────────────────────────────────────

  const filteredAlerts = alertHistory.filter(
    (alert) => filter === "all" || alert.status === filter
  );

  const totalPages  = Math.max(1, Math.ceil(filteredAlerts.length / ALERTS_PER_PAGE));

  // If filter change makes currentPage invalid, clamp it
  const safePage    = Math.min(currentPage, totalPages);

  const paginatedAlerts = filteredAlerts.slice(
    (safePage - 1) * ALERTS_PER_PAGE,
    safePage       * ALERTS_PER_PAGE
  );

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1); // always reset to page 1 when filter changes
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // ── Status badge helper ───────────────────────────────────────────────────

  const statusBadge = (status) => {
    const map = {
      Resolved:     "bg-green-100 text-green-700 border border-green-200",
      Acknowledged: "bg-yellow-100 text-yellow-700 border border-yellow-200",
      Pending:      "bg-blue-100 text-blue-700 border border-blue-200",
    };
    return map[status] || "bg-neutral-100 text-neutral-600";
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-neutral-300/40">
      <DashboardSidebar />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <LayoutWrapper>
          <div className="max-w-5xl mx-auto space-y-6">

            {/* ── Page header ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">
                SOS Alerts
              </h1>
              <p className="text-sm sm:text-base text-neutral-600">
                Use the SOS feature to alert your emergency contacts during critical situations.
              </p>
            </motion.div>

            {/* ── Trigger card ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Send SOS Alert</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Add a custom message (optional)"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="min-h-[90px] resize-none text-sm"
                  />
                  {sosActive ? (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                        <span className="w-2.5 h-2.5 bg-red-600 rounded-full inline-block animate-pulse flex-shrink-0" />
                        SOS Active — Live tracking is running
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="sm:ml-auto border-red-600 text-red-600 hover:bg-red-50 w-full sm:w-auto"
                        onClick={stopLiveTracking}
                      >
                        Stop SOS Tracking
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      SOS Alert
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* ── Alert history card ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white shadow-sm">

                {/* Card header */}
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <History className="h-5 w-5 flex-shrink-0" />
                      Alert History
                      {filteredAlerts.length > 0 && (
                        <span className="text-xs font-normal text-neutral-400 ml-1">
                          ({filteredAlerts.length} total)
                        </span>
                      )}
                    </CardTitle>
                    <Select value={filter} onValueChange={handleFilterChange}>
                      <SelectTrigger className="w-full sm:w-[160px] text-sm">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="all">All Alerts</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">

                  {/* Alert list */}
                  {paginatedAlerts.length > 0 ? (
                    <div className="divide-y divide-neutral-100">
                      {paginatedAlerts.map((alert) => (
                        <div
                          key={alert._id}
                          className="py-4 first:pt-0 last:pb-0"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">

                            {/* Left — details */}
                            <div className="space-y-1 min-w-0 flex-1">
                              <p className="text-xs text-neutral-400">
                                {new Date(alert.timestamp).toLocaleString('en-IN', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })}
                              </p>
                              <p className="text-sm sm:text-base font-medium text-neutral-800 leading-snug">
                                {alert.message}
                              </p>
                              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">{alert.location.city}</span>
                              </div>
                            </div>

                            {/* Right — status badge */}
                            <span className={`
                              self-start flex-shrink-0 px-2.5 py-1 rounded-full
                              text-xs font-semibold ${statusBadge(alert.status)}
                            `}>
                              {alert.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <History className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
                      <p className="text-neutral-400 text-sm">No alerts found</p>
                    </div>
                  )}

                  {/* ── Pagination ── */}
                  {totalPages > 1 && (
                    <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">

                      {/* Page info */}
                      <p className="text-xs text-neutral-400 order-2 sm:order-1">
                        Showing{" "}
                        <span className="font-semibold text-neutral-600">
                          {(safePage - 1) * ALERTS_PER_PAGE + 1}–
                          {Math.min(safePage * ALERTS_PER_PAGE, filteredAlerts.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-neutral-600">
                          {filteredAlerts.length}
                        </span>{" "}
                        alerts
                      </p>

                      {/* Controls */}
                      <div className="flex items-center gap-1 order-1 sm:order-2">

                        {/* Prev */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrev}
                          disabled={safePage === 1}
                          className="h-8 w-8 p-0"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          // Show first, last, current, and neighbours — hide the rest as "..."
                          const isFirst   = page === 1;
                          const isLast    = page === totalPages;
                          const isCurrent = page === safePage;
                          const isNear    = Math.abs(page - safePage) <= 1;

                          if (!isFirst && !isLast && !isNear) {
                            // Show ellipsis only once per gap
                            if (page === 2 || page === totalPages - 1) {
                              return (
                                <span
                                  key={page}
                                  className="h-8 w-8 flex items-center justify-center text-xs text-neutral-400"
                                >
                                  …
                                </span>
                              );
                            }
                            return null;
                          }

                          return (
                            <Button
                              key={page}
                              variant={isCurrent ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={`h-8 w-8 p-0 text-xs font-semibold ${
                                isCurrent
                                  ? "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800"
                                  : "text-neutral-600 hover:bg-neutral-50"
                              }`}
                              aria-label={`Page ${page}`}
                              aria-current={isCurrent ? "page" : undefined}
                            >
                              {page}
                            </Button>
                          );
                        })}

                        {/* Next */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNext}
                          disabled={safePage === totalPages}
                          className="h-8 w-8 p-0"
                          aria-label="Next page"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            </motion.div>

          </div>
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