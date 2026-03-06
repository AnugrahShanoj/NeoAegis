const SafetyCheckin = require('../Models/safetyCheckinsSchema');
const logActivity   = require("../Utils/activityLogger");

// 1 — Add safety check-in
exports.addSafetyCheckin = async (req, res) => {
  try {
    const { time, note } = req.body;
    const { userId }     = req.payload;

    const timeRegex = /^([01]\d|2[0-3]):00$/;
    if (!timeRegex.test(time)) {
      return res.status(401).json({ message: "Invalid time format. Use HH:00 format." });
    }

    const hours       = parseInt(time.split(':')[0], 10);
    const now         = new Date();
    const checkInTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, 0);

    const newCheckin = new SafetyCheckin({
      checkInTime,
      checkInNote: note || "",
      userId,
    });

    const savedCheckin = await newCheckin.save();

    await logActivity({
      userId,
      type:        "checkin",
      title:       "Safety Check-in Scheduled",
      description: "Check-in scheduled at " + time,
    });

    return res.status(200).json({
      message: "Safety check-in added successfully.",
      checkin: savedCheckin,
    });

  } catch (error) {
    console.error("Error adding safety check-in:", error);
    res.status(500).json({ message: "Server error occurred while adding safety check-in." });
  }
};

// 2 — Get all check-ins for user
exports.getSafetyCheckins = async (req, res) => {
  const { userId } = req.payload;
  try {
    const allCheckins = await SafetyCheckin.find({ userId });
    res.status(200).json(allCheckins);
  } catch (error) {
    console.error("Error getting safety check-ins:", error);
    res.status(500).json({ message: "Server error occurred while getting safety check-in." });
  }
};

// 3 — Edit a check-in
exports.editSafetyCheckin = async (req, res) => {
  const { checkinId }  = req.params;
  const { userId }     = req.payload;
  const { time, note } = req.body;

  try {
    const timeRegex = /^([01]\d|2[0-3]):00$/;
    if (!timeRegex.test(time)) {
      return res.status(401).json({ message: "Invalid time format. Use HH:00 format." });
    }

    const hours       = parseInt(time.split(':')[0], 10);
    const now         = new Date();
    const checkInTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, 0);

    // ✅ ownership check — only update if checkin belongs to this user
    const updatedCheckin = await SafetyCheckin.findOneAndUpdate(
      { _id: checkinId, userId: userId },
      { checkInTime, checkInNote: note || "" },
      { new: true }
    );

    if (!updatedCheckin) {
      return res.status(404).json({ message: "Check-in not found or access denied." });
    }

    await logActivity({
      userId,
      type:        "checkin",
      title:       "Safety Check-in Rescheduled",
      description: "Check-in rescheduled to " + time,
    });

    res.status(200).json({ updatedCheckin });

  } catch (error) {
    console.error("Error editing safety check-in:", error);
    res.status(500).json({ message: "Server error while editing check-in." });
  }
};

// 4 — Check now (complete a check-in)
exports.checkNow = async (req, res) => {
  const { checkinId } = req.params;
  const { userId }    = req.payload; // ✅ now correctly extracted

  try {
    // ✅ ownership check
    const checkin = await SafetyCheckin.findOne({ _id: checkinId, userId });

    if (!checkin) {
      return res.status(404).json({ message: "Check-in not found or access denied." });
    }

    const now                = new Date();
    const checkInWindowStart = new Date(checkin.checkInTime);
    const checkInWindowEnd   = new Date(checkin.checkInTime);
    checkInWindowStart.setMinutes(checkInWindowStart.getMinutes() - 15);
    checkInWindowEnd.setMinutes(checkInWindowEnd.getMinutes() + 15);

    if (now >= checkInWindowStart && now <= checkInWindowEnd) {
      checkin.checkInStatus = "Completed";
      await checkin.save();

      // ✅ time now correctly derived from the saved checkin
      const completedHour = checkin.checkInTime.getHours();
      const timeLabel     = String(completedHour).padStart(2, "0") + ":00";

      await logActivity({
        userId,
        type:        "checkin",
        title:       "Safety Check-in Completed",
        description: "Check-in completed at " + timeLabel,
      });

      return res.status(200).json({ message: "Check-In marked as Completed", checkin });
    }

    return res.status(400).json({ message: "Not within the check-in window" });

  } catch (error) {
    console.error("Error during check-in:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 5 — Delete a check-in
exports.deleteSafetyCheckin = async (req, res) => {
  const { checkinId } = req.params;
  const { userId }    = req.payload; // ✅ now correctly extracted

  try {
    // ✅ ownership check
    const deleted = await SafetyCheckin.findOneAndDelete({
      _id:    checkinId,
      userId: userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Check-in not found or access denied." });
    }

    // ✅ time correctly derived from the deleted document
    const deletedHour = deleted.checkInTime.getHours();
    const timeLabel   = String(deletedHour).padStart(2, "0") + ":00";

    await logActivity({
      userId,
      type:        "checkin",
      title:       "Safety Check-in Deleted",
      description: "Check-in at " + timeLabel + " was deleted",
    });

    res.status(200).json(deleted);

  } catch (error) {
    console.error("Error deleting safety check-in:", error);
    res.status(500).json({ message: "Server Error" });
  }
};