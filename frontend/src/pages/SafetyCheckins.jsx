import { useState } from "react";
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
import { Input } from "@/components/ui/input";
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

const SafetyCheckins = () => {
  const [checkins, setCheckins] = useState([
    {
      id: 1,
      time: "09:00",
      status: "completed",
      note: "Morning check-in",
      date: new Date(),
    },
    {
      id: 2,
      time: "18:00",
      status: "pending",
      note: "Evening check-in",
      date: new Date(),
    },
  ]);

  const [newCheckin, setNewCheckin] = useState({
    time: "",
    note: "",
  });

  const handleAddCheckin = () => {
    if (!newCheckin.time) {
      toast.error("Please select a time for the check-in");
      return;
    }

    const checkin = {
      id: Date.now(),
      time: newCheckin.time,
      status: "pending",
      note: newCheckin.note,
      date: new Date(),
    };

    setCheckins([...checkins, checkin]);
    setNewCheckin({ time: "", note: "" });
    toast.success("Check-in scheduled successfully");
  };

  const handleDeleteCheckin = (id) => {
    setCheckins(checkins.filter((checkin) => checkin.id !== id));
    toast.success("Check-in deleted successfully");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "missed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex h-screen bg-neutral-300/40 ">
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
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
                          onValueChange={(value) =>
                            setNewCheckin({ ...newCheckin, time: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent className='bg-white'>
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, "0");
                              return (
                                <SelectItem key={hour} value={`${hour}:00`}>
                                  {`${hour}:00`}
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
                          onChange={(e) =>
                            setNewCheckin({ ...newCheckin, note: e.target.value })
                          }
                          placeholder="Add a note for this check-in"
                        />
                      </div>
                      <Button onClick={handleAddCheckin}>Schedule Check-in</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {checkins.map((checkin) => (
                  <motion.div
                    key={checkin.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-lg shadow-sm p-6 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{checkin.time}</h3>
                        <p className="text-sm text-gray-500">
                          {format(checkin.date, "MMM d, yyyy")}
                        </p>
                      </div>
                      <Badge
                        className={`${getStatusColor(
                          checkin.status
                        )} capitalize`}
                      >
                        {checkin.status}
                      </Badge>
                    </div>
                    {checkin.note && (
                      <p className="text-sm text-gray-600">{checkin.note}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => toast.info("Edit functionality coming soon")}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteCheckin(checkin.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          </LayoutWrapper>
        </div>
      </div>
    </div>
  );
};

export default SafetyCheckins;