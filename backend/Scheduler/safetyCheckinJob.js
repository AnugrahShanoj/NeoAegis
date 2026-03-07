const cron             = require('node-cron');
const SafetyCheckin    = require('../Models/safetyCheckinsSchema');
const EmergencyContact = require('../Models/emergencyContactSchema');
const User             = require('../Models/userSchema'); // adjust path if different
const { sendMissedCheckinEmail } = require('../Utils/emailService');

function formatScheduledTime(date) {
  return new Date(date).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

// ── Run every 5 minutes ───────────────────────────────────────────────────
cron.schedule("*/5 * * * *", async () => {
  console.log("[CheckinCron] Running at", new Date().toISOString());

  const now             = new Date();
  const stage1Threshold = new Date(now.getTime() - 15 * 60 * 1000); // 15 mins ago
  const stage2Threshold = new Date(now.getTime() - 45 * 60 * 1000); // 45 mins ago
  const thirtyDaysAgo   = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // ── STAGE 0: Auto-archive check-ins older than 30 days ───────────────────
  // Only archives Completed or Missed — never touches Pending
  try {
    const archiveResult = await SafetyCheckin.updateMany(
      {
        checkInTime:   { $lte: thirtyDaysAgo },
        checkInStatus: { $in: ["Completed", "Missed"] },
        archived:      { $ne: true },
      },
      { $set: { archived: true } }
    );

    if (archiveResult.modifiedCount > 0) {
      console.log("[CheckinCron] Stage 0 — archived", archiveResult.modifiedCount, "old check-in(s)");
    }
  } catch (err) {
    console.error("[CheckinCron] Stage 0 error:", err);
  }

  // ── STAGE 1: Flag grace period entries ───────────────────────────────────
  // Pending check-ins whose window just closed (15–45 min past due)
  // but haven't been flagged yet
  try {
    const graceEntries = await SafetyCheckin.find({
      checkInStatus:         "Pending",
      checkInTime:           { $lte: stage1Threshold, $gt: stage2Threshold },
      gracePeriodNotifiedAt: null,
      archived:              { $ne: true },
    });

    if (graceEntries.length > 0) {
      console.log("[CheckinCron] Stage 1 — grace period flagged for", graceEntries.length, "check-in(s)");
      const graceIds = graceEntries.map((c) => c._id);
      await SafetyCheckin.updateMany(
        { _id: { $in: graceIds } },
        { $set: { gracePeriodNotifiedAt: now } }
      );
    }
  } catch (err) {
    console.error("[CheckinCron] Stage 1 error:", err);
  }

  // ── STAGE 2: Grace period expired — mark Missed and notify contacts ───────
  try {
    const missedEntries = await SafetyCheckin.find({
      checkInStatus: "Pending",
      checkInTime:   { $lte: stage2Threshold },
      archived:      { $ne: true },
    });

    if (missedEntries.length === 0) {
      console.log("[CheckinCron] Stage 2 — no missed check-ins found");
      return;
    }

    console.log("[CheckinCron] Stage 2 — processing", missedEntries.length, "missed check-in(s)");

    // Bulk mark all as Missed first
    const missedIds = missedEntries.map((c) => c._id);
    await SafetyCheckin.updateMany(
      { _id: { $in: missedIds } },
      { $set: { checkInStatus: "Missed" } }
    );

    // Group by userId to avoid duplicate contact lookups
    const byUser = {};
    for (const checkin of missedEntries) {
      const uid = String(checkin.userId);
      if (!byUser[uid]) byUser[uid] = [];
      byUser[uid].push(checkin);
    }

    for (const [userId, userCheckins] of Object.entries(byUser)) {
      try {
        const [user, contacts] = await Promise.all([
          User.findById(userId),
          EmergencyContact.find({ userId }),
        ]);

        if (!user) {
          console.warn("[CheckinCron] User not found:", userId);
          continue;
        }

        if (!contacts || contacts.length === 0) {
          console.log("[CheckinCron] No contacts for user:", userId);
          continue;
        }

        const userName = user.username || user.email || "A NeoAegis user";

        const emailPromises = [];
        for (const checkin of userCheckins) {
          const scheduledTime = formatScheduledTime(checkin.checkInTime);
          for (const contact of contacts) {
            emailPromises.push(
              sendMissedCheckinEmail({
                contactEmail:  contact.email,
                contactName:   contact.fullname,
                userName,
                scheduledTime,
              }).catch((err) => {
                console.error("[CheckinCron] Email failed for", contact.email, err);
              })
            );
          }
        }

        await Promise.all(emailPromises);
        console.log("[CheckinCron] Notified", contacts.length, "contact(s) for user", userId);

      } catch (userErr) {
        console.error("[CheckinCron] Error processing user", userId, ":", userErr);
      }
    }

  } catch (err) {
    console.error("[CheckinCron] Stage 2 error:", err);
  }
});