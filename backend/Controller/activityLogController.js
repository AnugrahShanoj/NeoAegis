const ActivityLog = require("../Models/activityLogSchema");

exports.getActivityLogs = async (req, res) => {
  try {
    const { userId } = req.payload;
    const logs = await ActivityLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activity logs" });
  }
};