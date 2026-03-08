import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Edit2, Trash2, Clock, CheckCircle2,
  XCircle, AlertCircle, ShieldCheck, ClipboardList
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import LayoutWrapper from "../components/LayoutWrapper";
import {
  addSafetyCheckinAPI, checkNowAPI,
  deleteSafetyCheckinAPI, getSafetyCheckins,
  confirmSafeAPI,
} from "../../Services/allAPI";
import EditSafetyCheckin from "../components/EditSafetyCheckin";

const MotionDiv = motion.div;
const MAX_CHECKINS = 6; // must match backend constant

const SafetyCheckins = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkins,    setCheckins]    = useState([]);
  const [editCheckin, setEditCheckin] = useState(null);
  const [newCheckin,  setNewCheckin]  = useState({ time: "", note: "" });

  const getReqHeader = () => {
    const token = sessionStorage.getItem("token");
    return token ? { "Authorization": "Bearer " + token } : null;
  };

  const handleGetCheckins = async () => {
    const reqHeader = getReqHeader();
    if (!reqHeader) return;
    try {
      const response = await getSafetyCheckins(reqHeader);
      if (response.status === 200) {
        const formatted = response.data
          .map((checkin) => ({
            ...checkin,
            formattedTime: format(new Date(checkin.checkInTime), "HH:mm"),
            formattedDate: format(new Date(checkin.checkInTime), "MMM d, yyyy"),
          }))
          .sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime)) // newest first
          .slice(0, 10); // show only last 10
        setCheckins(formatted);
      } else {
        toast.error("Failed to get Safety Check-ins");
      }
    } catch (error) {
      console.error("Error getting check-ins:", error);
    }
  };

  const handleAddCheckin = async () => {
    if (!newCheckin.time) {
      toast.error("Please select a time for the check-in");
      return;
    }
    const reqHeader = getReqHeader();
    if (!reqHeader) return;
    try {
      const response = await addSafetyCheckinAPI(
        { time: newCheckin.time, note: newCheckin.note },
        reqHeader
      );
      if (response.status === 200) {
        toast.success("Safety Check-in Scheduled");
        setNewCheckin({ time: "", note: "" });
        setIsModalOpen(false);
        handleGetCheckins();
      } else {
        // Show the backend's limit message directly if returned
        toast.error(response.data?.message || "Failed to add Safety Check-in");
      }
    } catch (error) {
      console.error("Error adding check-in:", error);
      const msg = error?.response?.data?.message;
      toast.error(msg || "Something went wrong. Please try again.");
    }
  };

  const handleCheckIn = async (checkinId) => {
    const reqHeader = getReqHeader();
    if (!reqHeader) return;
    try {
      const response = await checkNowAPI(checkinId, reqHeader);
      if (response.status === 200) {
        toast.success("Check-in Successful!");
        handleGetCheckins();
      } else {
        toast.error("Failed to Check-in");
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleConfirmSafe = async (checkinId) => {
    const reqHeader = getReqHeader();
    if (!reqHeader) return;
    try {
      const response = await confirmSafeAPI(checkinId, reqHeader);
      if (response.status === 200) {
        toast.success("You've been marked safe. Contacts will not be notified.");
        handleGetCheckins();
      } else {
        toast.error(response.data?.message || "Failed to confirm safe.");
      }
    } catch (error) {
      console.error("Error confirming safe:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDeleteCheckin = async (checkinId) => {
    const reqHeader = getReqHeader();
    if (!reqHeader) return;
    try {
      const response = await deleteSafetyCheckinAPI(checkinId, reqHeader);
      if (response.status === 200) {
        toast.success("Check-in Deleted");
        handleGetCheckins();
      } else {
        toast.error("Failed to Delete Check-in");
      }
    } catch (error) {
      console.error("Error deleting check-in:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // ── Window helpers ────────────────────────────────────────────────────────

  function canCheckIn(checkInTime) {
    const now   = new Date();
    const start = new Date(checkInTime);
    const end   = new Date(checkInTime);
    start.setMinutes(start.getMinutes() - 15);
    end.setMinutes(end.getMinutes() + 15);
    return now >= start && now <= end;
  }

  function isInGracePeriod(checkInTime) {
    const now      = new Date();
    const winEnd   = new Date(checkInTime);
    const graceEnd = new Date(checkInTime);
    winEnd.setMinutes(winEnd.getMinutes() + 15);
    graceEnd.setMinutes(graceEnd.getMinutes() + 45);
    return now > winEnd && now <= graceEnd;
  }

  function graceMinutesLeft(checkInTime) {
    const graceEnd = new Date(checkInTime);
    graceEnd.setMinutes(graceEnd.getMinutes() + 45);
    return Math.max(0, Math.round((graceEnd - new Date()) / 60000));
  }

  // ── Fetch on mount + poll every 30s ──────────────────────────────────────

  useEffect(() => {
    handleGetCheckins();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleGetCheckins();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Derived stats ─────────────────────────────────────────────────────────

  const totalCount     = checkins.length;
  const completedCount = checkins.filter((c) => c.checkInStatus === "Completed").length;
  const pendingCount   = checkins.filter((c) => c.checkInStatus === "Pending").length;
  const missedCount    = checkins.filter((c) => c.checkInStatus === "Missed").length;

  // How many active (Pending) slots remain out of MAX_CHECKINS
  const activeCount    = checkins.filter((c) => c.checkInStatus === "Pending").length;
  const slotsRemaining = MAX_CHECKINS - activeCount;

  function getStatusConfig(status) {
    if (status === "Completed") return {
      badgeClass:  "bg-green-50 text-green-700 border border-green-200",
      borderColor: "#16a34a22",
    };
    if (status === "Missed") return {
      badgeClass:  "bg-red-50 text-red-700 border border-red-200",
      borderColor: "#ea2b1f22",
    };
    return {
      badgeClass:  "bg-amber-50 text-amber-700 border border-amber-200",
      borderColor: "#f59e0b22",
    };
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />

      <main className="flex-1 min-w-0 transition-all duration-200 bg-neutral-100/60">
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
              <div
                className="absolute inset-0 pointer-events-none opacity-5"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute top-4 right-16 w-28 h-28 rounded-full border border-white/5 pointer-events-none" />

              <div className="relative z-10">
                <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">
                  Safety Check-ins
                </p>
                <h1 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2">
                  Scheduled Check-ins
                </h1>
                <p className="text-white/55 text-sm leading-relaxed max-w-sm mb-3">
                  Schedule regular check-ins to confirm your safety. Missed check-ins
                  notify your emergency contacts after a 45-minute grace period.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: "0 0 6px #4ade80" }} />
                    <span className="text-white/80 text-xs font-semibold">
                      {totalCount === 0
                        ? "No check-ins scheduled"
                        : totalCount + " check-in" + (totalCount === 1 ? "" : "s") + " scheduled"}
                    </span>
                  </div>
                  {/* Slot indicator */}
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
                    <span className="text-white/80 text-xs font-semibold">
                      {slotsRemaining} active slot{slotsRemaining === 1 ? "" : "s"} remaining
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex-shrink-0">
                <MotionDiv whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <button
                    onClick={() => {
                      if (slotsRemaining <= 0) {
                        toast.error("You have reached the maximum of " + MAX_CHECKINS + " active check-ins.");
                        return;
                      }
                      setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-white text-primary font-bold text-sm px-6 py-3 rounded-xl hover:bg-neutral-50 transition-colors"
                    style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Check-in
                  </button>
                </MotionDiv>
              </div>
            </div>

            {/* ── STATS ROW ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-4 h-4 text-neutral-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400">Showing</p>
                  <p className="text-xl font-bold text-neutral-700">{totalCount}</p>
                </div>
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400">Completed</p>
                  <p className="text-xl font-bold text-green-600">{completedCount}</p>
                </div>
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400">Pending</p>
                  <p className="text-xl font-bold text-amber-600">{pendingCount}</p>
                </div>
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400">Missed</p>
                  <p className="text-xl font-bold text-red-600">{missedCount}</p>
                </div>
              </div>
            </div>

            {/* ── CHECKINS GRID ── */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-base text-neutral-800 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-primary" />
                    Your Check-ins
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Showing last 10 · Check-in window opens 15 min before and closes 15 min after scheduled time · Max {MAX_CHECKINS} active
                  </p>
                </div>
              </div>

              <div className="p-5">
                {checkins.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14">
                    <ClipboardList className="w-10 h-10 text-neutral-200 mb-3" />
                    <p className="text-sm font-medium text-neutral-400">No check-ins scheduled yet</p>
                    <p className="text-xs text-neutral-300 mt-1 mb-4">
                      Add your first check-in to get started
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #312F2F, #EA2B1F)" }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Check-in
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {checkins.map((checkin) => {
                      const cfg      = getStatusConfig(checkin.checkInStatus);
                      const inWindow = canCheckIn(checkin.checkInTime) && checkin.checkInStatus === "Pending";
                      const inGrace  = isInGracePeriod(checkin.checkInTime) && checkin.checkInStatus === "Pending";
                      const minsLeft = inGrace ? graceMinutesLeft(checkin.checkInTime) : 0;

                      return (
                        <MotionDiv
                          key={checkin._id}
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="rounded-xl border bg-neutral-50/50 hover:bg-white hover:shadow-sm transition-all overflow-hidden"
                          style={{ borderColor: cfg.borderColor }}
                        >
                          {/* Grace period warning banner */}
                          {inGrace && (
                            <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                              <p className="text-xs font-semibold text-amber-700">
                                Grace period — {minsLeft} min left to confirm safe
                              </p>
                            </div>
                          )}

                          <div className="p-4 space-y-3">
                            {/* Time + status */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-2xl font-bold text-neutral-800 leading-none">
                                  {checkin.formattedTime}
                                </p>
                                <p className="text-xs text-neutral-400 mt-1">
                                  {checkin.formattedDate}
                                </p>
                              </div>
                              <span className={"flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold " + cfg.badgeClass}>
                                {checkin.checkInStatus}
                              </span>
                            </div>

                            {/* Note */}
                            <p className="text-sm text-neutral-500 leading-relaxed min-h-[1.25rem]">
                              {checkin.checkInNote || "No note added"}
                            </p>

                            {/* Edit + Delete */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditCheckin(checkin)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCheckin(checkin._id)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-red-600 bg-white border border-red-100 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>

                            {/* Check-In Now (normal window) */}
                            {inWindow && (
                              <MotionDiv whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <button
                                  onClick={() => handleCheckIn(checkin._id)}
                                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white"
                                  style={{ background: "linear-gradient(135deg, #312F2F, #EA2B1F)" }}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  Check-In Now
                                </button>
                              </MotionDiv>
                            )}

                            {/* I'm Safe (grace period) */}
                            {inGrace && (
                              <MotionDiv whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <button
                                  onClick={() => handleConfirmSafe(checkin._id)}
                                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-amber-800 bg-amber-50 border-2 border-amber-200 hover:bg-amber-100 transition-colors"
                                >
                                  <ShieldCheck className="w-4 h-4" />
                                  I'm Safe — Confirm Now
                                </button>
                              </MotionDiv>
                            )}
                          </div>
                        </MotionDiv>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </MotionDiv>
        </LayoutWrapper>

        {/* ── Add Check-in Dialog ── */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule New Check-in</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-neutral-700">Time</label>
                <Select
                  value={newCheckin.time}
                  onValueChange={(value) => setNewCheckin({ ...newCheckin, time: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, "0");
                      return (
                        <SelectItem key={hour} value={hour + ":00"}>
                          {hour + ":00"}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-neutral-700">
                  Note <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <Textarea
                  value={newCheckin.note}
                  onChange={(e) => setNewCheckin({ ...newCheckin, note: e.target.value })}
                  placeholder="Add a note for this check-in..."
                  className="resize-none min-h-[80px]"
                />
              </div>
              <button
                onClick={handleAddCheckin}
                className="w-full py-3 rounded-xl text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #312F2F, #EA2B1F)" }}
              >
                Schedule Check-in
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <EditSafetyCheckin
          checkin={editCheckin}
          open={!!editCheckin}
          onOpenChange={(open) => { if (!open) setEditCheckin(null); }}
          onSave={(updatedCheckin) => {
            if (!updatedCheckin || !updatedCheckin._id) return;
            setCheckins((prev) =>
              prev.map((c) => c._id === updatedCheckin._id ? updatedCheckin : c)
            );
            setEditCheckin(null);
          }}
        />
      </main>
    </div>
  );
};

export default SafetyCheckins;