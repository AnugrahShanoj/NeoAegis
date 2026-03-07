const mongoose = require('mongoose');

const safetyCheckinsSchema = new mongoose.Schema({
  checkInTime: {
    type:     Date,
    required: true,
    index:    true,
  },
  checkInNote: {
    type: String,
  },
  checkInStatus: {
    type:    String,
    enum:    ["Pending", "Completed", "Missed"],
    default: "Pending",
    index:   true,
  },
  userId: {
    type: String,
  },
  gracePeriodNotifiedAt: {
    type:    Date,
    default: null,
  },
  // ── Archive flag — set by cron after 30 days, never shown in UI ──────────
  archived: {
    type:    Boolean,
    default: false,
    index:   true,
  },
  createdAt: {
    type:    Date,
    default: Date.now,
  },
});

const SafetyCheckin = mongoose.model("safetyCheckins", safetyCheckinsSchema);
module.exports = SafetyCheckin;