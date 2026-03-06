const crypto = require('crypto');
const SOSAlert = require('../Models/sosAlertSchema');
const EmergencyContact = require('../Models/emergencyContactSchema');
const { sendSOSAlertEmail } = require('../Utils/emailService');
const logActivity = require("../Utils/activityLogger");

let ioInstance = null;
exports.setIO = (io) => { ioInstance = io; };

exports.createSOSAlert = async (req, res) => {
  try {
    const { latitude, longitude, city, message } = req.body;
    const { userId } = req.payload;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and Longitude are required." });
    }

    const trackingToken = crypto.randomBytes(16).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3 * 60 * 60 * 1000);

    const newAlert = new SOSAlert({
      userId,
      location: {
        latitude,
        longitude,
        city: city || "Unknown",
      },
      message: message || "SOS Alert!",
      trackingToken,
      tokenExpiry,
    });

    const savedAlert = await newAlert.save();

    const trackingUrl = `${process.env.FRONTEND_URL}/track/${trackingToken}`;

    const contacts = await EmergencyContact.find({ userId });

if (contacts.length > 0) {
  const emailPromises = contacts.map(contact =>
    sendSOSAlertEmail({
      contactEmail: contact.email,
      contactName:  contact.fullname,
      trackingUrl,
      alertDetails: {
        triggeredBy: 'A NeoAegis user',
        city:        city || 'Unknown',
        timestamp:   new Date().toLocaleString('en-IN', {
                       dateStyle: 'medium',
                       timeStyle: 'short',
                     }),
        message:     message || 'SOS Alert!',
      },
    })
  );
  Promise.all(emailPromises).catch(err =>
    console.error('Email sending error:', err)
  );
} else {
      console.log('No emergency contacts found for user:', userId);
    }

await logActivity({
  userId,
  type: "sos",
  title: "SOS Alert Triggered",
  description: message || "Emergency SOS alert was triggered",
});
    res.status(200).json({
      message: "SOS Alert created successfully.",
      alert: savedAlert,
      trackingToken,
    });

  } catch (error) {
    console.error("Error creating SOS Alert:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.verifyTrackingToken = async (req, res) => {
  try {
    const { token } = req.params;

    const alert = await SOSAlert.findOne({
      trackingToken: token,
      tokenExpiry: { $gt: new Date() },
      status: { $ne: 'Resolved' }
    });

    if (!alert) {
      return res.status(404).json({ message: "Tracking link is invalid or has expired." });
    }

    res.status(200).json({
      userId: alert.userId,
      alertId: alert._id,
      location: alert.location,
      message: alert.message,
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getSOSAlerts = async (req, res) => {
  try {
    const { userId } = req.payload;
    const alerts = await SOSAlert.find({ userId });
    const sortedAlerts = alerts.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(sortedAlerts);
  } catch (error) {
    console.log("Server Error: ", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.resolveSOSAlert = async (req, res) => {
  try {
    const { userId } = req.payload;

    // Find the most recent Pending alert for this user and resolve it
    const alert = await SOSAlert.findOneAndUpdate(
      { userId, status: 'Pending' },
      {
        status: 'Resolved',
        trackingToken: null,   // invalidate tracking link immediately
        tokenExpiry: null,
      },
      { sort: { createdAt: -1 }, new: true } // most recent first, return updated doc
    );

    if (!alert) {
      return res.status(404).json({ message: "No active SOS alert found." });
    }

    res.status(200).json({
      message: "SOS Alert resolved successfully.",
      alert,
    });

  } catch (error) {
    console.error("Error resolving SOS Alert:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};