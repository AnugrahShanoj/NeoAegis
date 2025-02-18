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



// Logic for edit a safety checkin
exports.editSafetyCheckin=async(req,res)=>{
  console.log("Inside Edit Safety Checkin")
  const {checkinId}= req.params
  console.log('Checkin Id :',checkinId)
  const {time,note}= req.body
  const {userId}=req.payload
  try {
    console.log("Inside try of Edit Safety Checkin")
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

    const updatedCheckin= await SafetyCheckin.findByIdAndUpdate({_id:checkinId},{
      checkInTime:checkInTime,
      checkInNote:note || ""
    },
    {new:true})
    res.status(200).json({updatedCheckin:updatedCheckin})
  } catch (error) {
    console.log("Error while editting the safety checkin: ",error)
    res.status(500).json({message:error})
  }
}


// Logic for check now 
exports.checkNow=async(req,res)=>{
  try {
    console.log("Inside Check Now Function")
    const {checkinId}=req.params
    const checkin = await SafetyCheckin.findById(checkinId);

    // Check if check-in is within valid time range
    const now = new Date();
    const checkInWindowStart = new Date(checkin.checkInTime);
    checkInWindowStart.setMinutes(checkInWindowStart.getMinutes() - 15); // Allow 15 minutes before
    const checkInWindowEnd = new Date(checkin.checkInTime);
    checkInWindowEnd.setMinutes(checkInWindowEnd.getMinutes() + 15); // Allow 15 minutes after

    if (now >= checkInWindowStart && now <= checkInWindowEnd) {
        checkin.checkInStatus = "Completed";
        await checkin.save();
        return res.status(200).json({ message: "Check-In marked as Completed", checkin });
    }

    return res.status(400).json({ message: "Not within the check-in window" });
  } catch (error) {
      console.error("Error during check-in:", error);
        res.status(500).json({ message: "Server Error" });
  }
}


// Logic for delete a safety checkin
exports.deleteSafetyCheckin=async(req,res)=>{
  const {checkinId}= req.params
  try {
    console.log("Inside try of deleteSafetyCheckin")
    const response= await SafetyCheckin.findByIdAndDelete({_id:checkinId},{new:true})
    res.status(200).json(response)
  } catch (error) {
    console.log("Error while deleting safety checkin: ",error)
    res.status(500).json({message:"Server Error"})
  }
}