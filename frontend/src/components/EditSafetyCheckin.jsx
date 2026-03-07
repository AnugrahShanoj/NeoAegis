import { useEffect, useState } from "react";
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
import { editSafetyCheckinAPI } from "../../Services/allAPI";

const EditSafetyCheckin = ({ checkin, open, onOpenChange, onSave }) => {
  const [checkinDetails, setCheckinDetails] = useState({ time: "", note: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (checkin) {
      setCheckinDetails({
        // ✅ Fixed: was using checkin.time (undefined) — now correctly reads checkInTime
        time: String(new Date(checkin.checkInTime).getHours()).padStart(2, "0") + ":00",
        // ✅ Fixed: was using checkin.note (undefined) — now correctly reads checkInNote
        note: checkin.checkInNote || "",
      });
    }
  }, [checkin]);

  const handleEditCheckin = async () => {
    if (!checkin?._id) return;
    const token = sessionStorage.getItem("token");
    if (!token) return;
    setSaving(true);
    try {
      const response = await editSafetyCheckinAPI(
        checkin._id,
        { time: checkinDetails.time, note: checkinDetails.note },
        { "Authorization": "Bearer " + token }
      );
      if (response.status === 200) {
        const received = response.data.updatedCheckin;
        const updated  = {
          ...received,
          formattedTime: format(new Date(received.checkInTime), "HH:mm"),
          formattedDate: format(new Date(received.checkInTime), "MMM d, yyyy"),
        };
        toast.success("Check-in updated successfully");
        onSave(updated);
        onOpenChange(false);
        setCheckinDetails({ time: "", note: "" });
      } else {
        toast.error("Failed to update check-in");
      }
    } catch (error) {
      console.error("Error editing check-in:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Check-in</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-neutral-700">Time</label>
            <Select
              value={checkinDetails.time}
              onValueChange={(value) => setCheckinDetails({ ...checkinDetails, time: value })}
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
              value={checkinDetails.note}
              onChange={(e) => setCheckinDetails({ ...checkinDetails, note: e.target.value })}
              placeholder="Add a note for this check-in..."
              className="resize-none min-h-[80px]"
            />
          </div>
          <button
            onClick={handleEditCheckin}
            disabled={saving}
            className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition-opacity"
            style={{ background: "linear-gradient(135deg, #312F2F, #EA2B1F)" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSafetyCheckin;