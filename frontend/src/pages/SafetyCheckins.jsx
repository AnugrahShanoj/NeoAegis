import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LayoutWrapper from "../components/LayoutWrapper";
import { addSafetyCheckinAPI, checkNowAPI, deleteSafetyCheckinAPI, getSafetyCheckins } from "../../Services/allAPI";
import EditSafetyCheckin from "../components/EditSafetyCheckin";

const SafetyCheckins = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkins,    setCheckins]    = useState([]);
  const [editCheckin, setEditCheckin] = useState(null);
  const [newCheckin,  setNewCheckin]  = useState({ time: "", note: "" });

  // ✅ Read token directly from sessionStorage — no token state needed
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
        const formatted = response.data.map((checkin) => ({
          ...checkin,
          formattedTime: format(new Date(checkin.checkInTime), "HH:mm"),
          formattedDate: format(new Date(checkin.checkInTime), "MMM d, yyyy"),
        }));
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
    const reqBody = { time: newCheckin.time, note: newCheckin.note };
    try {
      const response = await addSafetyCheckinAPI(reqBody, reqHeader);
      if (response.status === 200) {
        toast.success("Safety Check-in Added Successfully");
        setNewCheckin({ time: "", note: "" });
        setIsModalOpen(false);
        handleGetCheckins(); // ✅ refetch immediately after add
      } else {
        toast.error("Failed to add Safety Check-in");
      }
    } catch (error) {
      console.error("Error adding check-in:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleCheckIn = async (checkinId) => {
    const reqHeader = getReqHeader();
    if (!reqHeader) return;
    try {
      const response = await checkNowAPI(checkinId, reqHeader);
      if (response.status === 200) {
        toast.success("Check-in Successful");
        handleGetCheckins();
      } else {
        toast.error("Failed to Check-in");
      }
    } catch (error) {
      console.error("Error during check-in:", error);
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

  const canCheckIn = (checkInTime) => {
    const now                = new Date();
    const checkInWindowStart = new Date(checkInTime);
    const checkInWindowEnd   = new Date(checkInTime);
    checkInWindowStart.setMinutes(checkInWindowStart.getMinutes() - 15);
    checkInWindowEnd.setMinutes(checkInWindowEnd.getMinutes() + 15);
    return now >= checkInWindowStart && now <= checkInWindowEnd;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-500";
      case "pending":   return "bg-yellow-500";
      case "missed":    return "bg-red-500";
      default:          return "bg-gray-500";
    }
  };

  // ✅ Runs once on mount — no infinite loop
  useEffect(() => {
    handleGetCheckins();
  }, []);

  return (
    <div className="flex h-screen bg-neutral-300/40">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <LayoutWrapper>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Safety Check-ins</h1>
                <p className="text-gray-600">
                  Schedule regular check-ins to ensure your safety and notify your emergency
                  contacts if a check-in is missed.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Scheduled Check-ins</h2>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Add Check-in
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Schedule New Check-in</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <label htmlFor="time">Time</label>
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
                          <label htmlFor="note">Note (Optional)</label>
                          <Textarea
                            id="note"
                            value={newCheckin.note}
                            onChange={(e) => setNewCheckin({ ...newCheckin, note: e.target.value })}
                            placeholder="Add a note for this check-in"
                          />
                        </div>
                        <Button onClick={handleAddCheckin}>Schedule Check-in</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {checkins.length === 0 && (
                    <p className="text-sm text-gray-500 col-span-3 text-center py-8">
                      No check-ins scheduled yet. Add one to get started.
                    </p>
                  )}
                  {checkins.map((checkin) => (
                    <motion.div
                      key={checkin._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-lg shadow-sm p-6 space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{checkin.formattedTime}</h3>
                          <p className="text-sm text-gray-500">{checkin.formattedDate}</p>
                        </div>
                        <Badge className={getStatusColor(checkin.checkInStatus) + " capitalize"}>
                          {checkin.checkInStatus}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600">
                        {checkin.checkInNote ? checkin.checkInNote : "No Message"}
                      </p>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setEditCheckin(checkin)}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteCheckin(checkin._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>

                      {canCheckIn(checkin.checkInTime) && checkin.checkInStatus === "Pending" && (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full"
                          onClick={() => handleCheckIn(checkin._id)}
                        >
                          Check-In Now
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </LayoutWrapper>
        </div>
      </div>

      <EditSafetyCheckin
        checkin={editCheckin}
        open={!!editCheckin}
        onOpenChange={(open) => { if (!open) setEditCheckin(null); }}
        onSave={(updatedCheckin) => {
          if (!updatedCheckin || !updatedCheckin._id) {
            console.error("Updated checkin is missing _id");
            return;
          }
          setCheckins((prev) =>
            prev.map((c) => c._id === updatedCheckin._id ? updatedCheckin : c)
          );
          setEditCheckin(null);
        }}
      />
    </div>
  );
};

export default SafetyCheckins;