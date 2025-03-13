const cron= require('node-cron')
const SafetyCheckin= require('../Models/safetyCheckinsSchema')

// Run the job every minute (adjust as needed)
cron.schedule("15 * * * *", async () => {
    console.log("Running Safety Check-in Status Update Job...");

    try {
        const now = new Date();

        const result = await SafetyCheckin.updateMany(
            { checkInTime: { $lte: now }, 
            checkInStatus: "Pending" },

            { $set: { checkInStatus: "Missed" } }
        );

        console.log(`Updated ${result.modifiedCount} check-ins to 'Missed'`);
    } catch (error) {
        console.error("Error updating safety check-ins:", error);
    }
});
