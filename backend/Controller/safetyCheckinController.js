const SafetyCheckin= require('../Models/safetyCheckinsSchema')

// Logic for adding a new safety check-in
exports.addSafetyCheckin= async(req,res)=>{
    console.log("Inside AddSafetyCheckin");
    try {
        const {time, note}= req.body
        const {userId}= req.payload

        // Validate time format (HH:00) using regex
    const timeRegex = /^([01]\d|2[0-3]):00$/; // Matches 00:00 to 23:00 where minutes are always "00"
    if (!timeRegex.test(time)) {
      return res.status(401).json({ message: "Invalid time format. Use HH:00 format." });
    }


    // Convert time to Date object
    const hours = parseInt(time.split(':')[0], 10); // Extract hours from "HH:00"
    console.log("Extracted Hour: ",hours)
    const now = new Date();
    const checkInTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, 0); // Minutes are always 0

    // Create the new safety check-in
    const newCheckin = new SafetyCheckin({
      checkInTime,
      checkInNote: note || "", // Note is optional
      userId,
    });

    // Save the check-in to the database
    const savedCheckin = await newCheckin.save();

    // Send back the saved details as a response
    return res.status(200).json({
      message: "Safety check-in added successfully.",
      checkin: savedCheckin,
    });
    } catch (error) {
        console.error("Error adding safety check-in:", error);
    res.status(500).json({ message: "Server error occurred while adding safety check-in." });

    }
}

// Logic for getting the all safety check-ins
exports.getSafetyCheckins= async(req,res)=>{
    const {userId}= req.payload
    try {
        const allSafetyCheckins= await SafetyCheckin.find({userId})
        res.status(200).json(allSafetyCheckins)
    } catch (error) {
        console.log("Server Error while getting safety checkins: ",error)
        res.status(500).json({message: "Server error occurred while getting safety check-in."})
    }
}