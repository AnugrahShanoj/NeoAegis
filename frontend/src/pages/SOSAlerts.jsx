import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bell, History, MapPin } from "lucide-react";
import { io } from "socket.io-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LayoutWrapper from "../components/LayoutWrapper";
import { createSOSAlertAPI, getSOSAlertsAPI } from "../../Services/allAPI";
import { serverUrl } from "../../Services/serverURL";

const SOSAlerts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [token, setToken] = useState("");
  const [alertHistory, setAlertHistory] = useState([]);
  const [sosActive, setSosActive] = useState(false);

  const socketRef = useRef(null);
  const watchIdRef = useRef(null);
  const heartbeatRef = useRef(null);   // NEW — interval ref
  const lastPositionRef = useRef(null); // NEW — stores last known position

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by your browser.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const cityName = await fetchCityName(latitude, longitude);
          resolve({ latitude, longitude, cityName });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject("Permission denied: Please allow location access.");
              break;
            case error.POSITION_UNAVAILABLE:
              reject("Position unavailable.");
              break;
            case error.TIMEOUT:
              reject("Timeout: Location request took too long.");
              break;
            default:
              reject("Unknown error occurred while retrieving location.");
          }
        }
      );
    });
  };

  const fetchCityName = async (lat, lon) => {
    const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?key=${OPENCAGE_API_KEY}&q=${lat}+${lon}&pretty=1`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.results[0]?.components.city || 'Unknown';
    } catch {
      return 'Unknown';
    }
  };

  const startLiveTracking = (userId) => {
    socketRef.current = io(serverUrl);

    socketRef.current.on('connect', () => {
      console.log('Socket connected, joining SOS room');
      socketRef.current.emit('join-sos-room', userId);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // watchPosition — updates lastPositionRef whenever device moves
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        lastPositionRef.current = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // Emit immediately on position change
        if (socketRef.current?.connected) {
          socketRef.current.emit('location-update', {
            userId,
            ...lastPositionRef.current,
          });
        }
      },
      (err) => console.error('Live tracking error:', err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    // Heartbeat — emits last known position every 3 seconds
    // This keeps the tracking page alive even when stationary
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

  const stopLiveTracking = () => {
    // Stop geolocation
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    // Stop heartbeat
    if (heartbeatRef.current !== null) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    // Clear last position
    lastPositionRef.current = null;

    setSosActive(false);
  };

  const handleSendAlert = async () => {
    try {
      const { latitude, longitude, cityName } = await getLocation();

      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      const reqHeader = { "Authorization": `Bearer ${token}` };
      const reqBody = {
        latitude,
        longitude,
        city: cityName,
        message: customMessage || "SOS Alert!"
      };

      const response = await createSOSAlertAPI(reqBody, reqHeader);

      if (response.status === 200) {
        const userId = response.data.alert.userId;

        startLiveTracking(userId);

        setCustomMessage("");
        setIsDialogOpen(false);
        getAllSOSAlerts();

        alert("🚨 SOS Alert sent! Emergency contacts have been notified via email with a live tracking link.");
      } else {
        alert("Error sending SOS Alert. Please try again.");
      }
    } catch (error) {
      console.error('Error in handleSendAlert:', error);
      alert("Failed to get location. Please allow location access and try again.");
    }
  };

  const getAllSOSAlerts = async () => {
    try {
      if (!token) return;
      const reqHeader = { "Authorization": `Bearer ${token}` };
      const response = await getSOSAlertsAPI(reqHeader);
      if (response.status === 200) {
        setAlertHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching SOS Alerts:", error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopLiveTracking();
  }, []);

  useEffect(() => {
    setToken(sessionStorage.getItem('token'));
    getAllSOSAlerts();
  }, [token]);

  const filteredAlerts = alertHistory.filter(
    (alert) => filter === "all" || alert.status === filter
  );

  return (
    <div className="flex min-h-screen bg-neutral-300/40">
      <DashboardSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <LayoutWrapper>
          <div className="max-w-5xl mx-auto space-y-8">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">SOS Alerts</h1>
              <p className="text-neutral-600">
                Use the SOS feature to alert your emergency contacts during critical situations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className='bg-white'>
                <CardHeader>
                  <CardTitle>Send SOS Alert</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Add a custom message (optional)"
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                  {sosActive ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-red-600 font-semibold">
                        <span className="w-3 h-3 bg-red-600 rounded-full inline-block animate-pulse"></span>
                        SOS Active — Live tracking is running
                      </div>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto border-red-600 text-red-600 hover:bg-red-50"
                        onClick={stopLiveTracking}
                      >
                        Stop SOS Tracking
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-6 text-lg"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Bell className="mr-2 h-5 w-5" />
                      SOS Alert
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className='bg-white'>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Alert History
                  </CardTitle>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      <SelectItem value="all">All Alerts</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredAlerts.map((alert) => (
                      <div
                        key={alert._id}
                        className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <p className="text-sm text-neutral-500">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                            <p className="font-medium">{alert.message}</p>
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                              <MapPin className="h-4 w-4" />
                              {alert.location.city}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              alert.status === "Resolved"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {alert.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {filteredAlerts.length === 0 && (
                      <p className="text-center text-neutral-500 py-8">
                        No alerts found
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </LayoutWrapper>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm SOS Alert</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to send an SOS alert? This will immediately
                notify all your emergency contacts via email with a live tracking link.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
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