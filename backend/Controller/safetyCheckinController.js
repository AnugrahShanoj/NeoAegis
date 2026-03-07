const SafetyCheckin = require('../Models/safetyCheckinsSchema');
const logActivity   = require("../Utils/activityLogger");

const MAX_CHECKINS = 6;

// 1 — Add safety check-in
exports.addSafetyCheckin = async (req, res) => {
  try {
    const { time, note } = req.body;
    const { userId }     = req.payload;

    const timeRegex = /^([01]\d|2[0-3]):00$/;
    if (!timeRegex.test(time)) {
      return res.status(401).json({ message: "Invalid time format. Use HH:00 format." });
    }

    // ── Limit check — only count active (Pending) check-ins ─────────────
    const activeCount = await SafetyCheckin.countDocuments({
      userId,
      checkInStatus: "Pending",
      archived:      { $ne: true },
    });

    if (activeCount >= MAX_CHECKINS) {
      return res.status(400).json({
        message: `You can have a maximum of ${MAX_CHECKINS} active check-ins at a time.`,
      });
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

// 2 — Get all check-ins for user (excludes archived)
exports.getSafetyCheckins = async (req, res) => {
  const { userId } = req.payload;
  try {
    const allCheckins = await SafetyCheckin.find({
      userId,
      archived: { $ne: true },
    });
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

    const updatedCheckin = await SafetyCheckin.findOneAndUpdate(
      { _id: checkinId, userId: userId, archived: { $ne: true } },
      {
        checkInTime,
        checkInNote:           note || "",
        gracePeriodNotifiedAt: null,
      },
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

// 4 — Check now (complete within ±15 min window)
exports.checkNow = async (req, res) => {
  const { checkinId } = req.params;
  const { userId }    = req.payload;

  try {
    const checkin = await SafetyCheckin.findOne({
      _id:      checkinId,
      userId,
      archived: { $ne: true },
    });

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

// 5 — Confirm safe (during grace period)
exports.confirmSafe = async (req, res) => {
  const { checkinId } = req.params;
  const { userId }    = req.payload;

  try {
    const checkin = await SafetyCheckin.findOne({
      _id:      checkinId,
      userId,
      archived: { $ne: true },
    });

    if (!checkin) {
      return res.status(404).json({ message: "Check-in not found or access denied." });
    }

    if (checkin.checkInStatus !== "Pending") {
      return res.status(400).json({
        message: "Check-in is already " + checkin.checkInStatus + ".",
      });
    }

    const now      = new Date();
    const graceEnd = new Date(checkin.checkInTime);
    graceEnd.setMinutes(graceEnd.getMinutes() + 45);

    if (now > graceEnd) {
      return res.status(400).json({
        message: "Grace period has expired. Your emergency contacts have already been notified.",
      });
    }

    checkin.checkInStatus = "Completed";
    await checkin.save();

    const hour      = checkin.checkInTime.getHours();
    const timeLabel = String(hour).padStart(2, "0") + ":00";

    await logActivity({
      userId,
      type:        "checkin",
      title:       "Safety Confirmed (Late)",
      description: "Safety confirmed during grace period for check-in at " + timeLabel,
    });

    return res.status(200).json({
      message: "You have been marked safe. Your emergency contacts will not be notified.",
      checkin,
    });

  } catch (error) {
    console.error("Error during confirm safe:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 6 — Delete a check-in
exports.deleteSafetyCheckin = async (req, res) => {
  const { checkinId } = req.params;
  const { userId }    = req.payload;

  try {
    const deleted = await SafetyCheckin.findOneAndDelete({
      _id:      checkinId,
      userId:   userId,
      archived: { $ne: true },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Check-in not found or access denied." });
    }

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