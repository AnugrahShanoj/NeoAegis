const ActivityLog = require("../Models/activityLogSchema");

const logActivity = async ({ userId, type, title, description = "" }) => {
  try {
    await ActivityLog.create({ userId, type, title, description });
  } catch (err) {
    console.error("Activity log error:", err);
  }
};

module.exports = logActivity;