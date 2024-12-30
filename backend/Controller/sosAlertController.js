const SOSAlert= require('../Models/sosAlertSchema')

// Logic for creating SOS alert

exports.createSOSAlert = async (req, res) => {
  try {
    const { latitude, longitude, city, message } = req.body;
    const { userId } = req.payload;

    if (!latitude || !longitude) {
      return res.status(401).json({ message: "Latitude and Longitude are required." });
    }

    // Create a new SOS alert document
    const newAlert = new SOSAlert({
      userId,
      location: {
        latitude,
        longitude,
        city: city || "Unknown", 
      },
      message: message || "SOS Alert!",
    });

    // Save the alert to MongoDB
    const savedAlert = await newAlert.save();

    // Send response with the saved alert
    res.status(200).json({
      message: "SOS Alert created successfully.",
      alert: savedAlert,
    });
  } catch (error) {
    console.error("Error creating SOS Alert:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



// Logic for get the SOS Alerts
exports.getSOSAlerts= async(req,res)=>{
  try {
      const {userId}=req.payload
      const alerts = await SOSAlert.find({ userId });
      // Sort the alerts in newly created first
      const sortedAlerts=alerts.sort((a, b) => b.createdAt - a.createdAt);
      res.status(200).json(sortedAlerts);
  } catch (error) {
    console.log("Server Error: ",error)
    res.status(500).json({message:"Internal Server Error",error:error.message})
  }
}
