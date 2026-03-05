const EmergencyContact = require('../Models/emergencyContactSchema');
const nodemailer       = require('nodemailer');

const MAX_CONTACTS = 4;

// Reusable transporter
const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

// 1. Add emergency contact
exports.addEmergencyContact = async (req, res) => {
  const { fullname, phoneNumber, email } = req.body;
  const { userId } = req.payload;

  try {
    // Enforce 4-contact limit
    const existingCount = await EmergencyContact.countDocuments({ userId });
    if (existingCount >= MAX_CONTACTS) {
      return res.status(400).json({
        message: `You can add a maximum of ${MAX_CONTACTS} emergency contacts.`,
      });
    }

    // Check duplicate phone
    const duplicate = await EmergencyContact.findOne({ userId, phoneNumber });
    if (duplicate) {
      return res.status(400).json({ message: "Emergency contact already exists." });
    }

    const newContact = new EmergencyContact({ fullname, phoneNumber, email, userId });
    await newContact.save();
    res.status(200).json(newContact);

  } catch (error) {
    console.error("Error adding emergency contact:", error);
    res.status(500).json({ message: "Server error while adding emergency contact", error });
  }
};

// 2. Get all emergency contacts
exports.getEmergencyContacts = async (req, res) => {
  const { userId } = req.payload;
  try {
    const contacts = await EmergencyContact.find({ userId });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json(error);
  }
};

// 3. Delete a contact
exports.deleteEmergencyContact = async (req, res) => {
  const { contactId } = req.params;
  try {
    const deleted = await EmergencyContact.findByIdAndDelete({ _id: contactId });
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json(error);
  }
};

// 4. Edit a contact
exports.editEmergencyContact = async (req, res) => {
  const { contactId } = req.params;
  const { fullname, phoneNumber, email } = req.body;
  try {
    const updatedContact = await EmergencyContact.findByIdAndUpdate(
      { _id: contactId },
      { fullname, phoneNumber, email },
      { new: true }
    );
    res.status(200).json({ updatedContact });
  } catch (error) {
    res.status(500).json(error);
  }
};

// 5. Send test alert email to selected contacts
exports.sendTestAlert = async (req, res) => {
  const { contactIds } = req.body; // array of contact _id strings
  const { userId } = req.payload;

  if (!contactIds || contactIds.length === 0) {
    return res.status(400).json({ message: "No contacts selected." });
  }

  try {
    // Fetch the selected contacts (ensure they belong to this user)
    const contacts = await EmergencyContact.find({
      _id: { $in: contactIds },
      userId,
    });

    if (contacts.length === 0) {
      return res.status(404).json({ message: "Selected contacts not found." });
    }

    const transporter = createTransporter();

    const emailPromises = contacts.map((contact) =>
      transporter.sendMail({
        from: `"NeoAegis Safety" <${process.env.EMAIL_USER}>`,
        to: contact.email,
        subject: '🔔 NeoAegis — Test Alert',
        html: `
  <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;
              background: #312F2F; border-radius: 14px; overflow: hidden;
              box-shadow: 0 8px 32px rgba(0,0,0,0.18);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #EA2B1F 0%, #312F2F 100%);
                padding: 32px; text-align: center;">
      <div style="font-size: 38px; margin-bottom: 10px;">🛡️</div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 900;
                 color: #FFFFFF; letter-spacing: -0.5px;">NeoAegis</h1>
      <p style="margin: 4px 0 0; font-size: 10px; color: rgba(255,255,255,0.65);
                letter-spacing: 2px; font-weight: 700;">SAFETY PLATFORM</p>
    </div>

    <!-- Badge row -->
    <div style="background: #3d3b3b; padding: 16px 32px; text-align: center;
                border-bottom: 1px solid rgba(255,255,255,0.07);">
      <span style="display: inline-block; background: rgba(234,43,31,0.18);
                   border: 1px solid rgba(234,43,31,0.45); border-radius: 100px;
                   padding: 5px 16px; font-size: 11px; font-weight: 800;
                   color: #EA2B1F; letter-spacing: 0.8px;">
        🔔 TEST ALERT
      </span>
    </div>

    <!-- Body -->
    <div style="padding: 28px 32px;">

      <h2 style="margin: 0 0 14px; font-size: 18px; color: #FFFFFF; font-weight: 700;">
        Hi ${contact.fullname},
      </h2>

      <p style="color: rgba(255,255,255,0.65); font-size: 14px; line-height: 1.75; margin: 0 0 24px;">
        This is a <strong style="color: #FFFFFF;">test alert</strong> from NeoAegis.
        You have been added as an emergency contact. This email confirms that
        the alert system is working correctly and you will be notified immediately
        in case of a real emergency.
      </p>

      <!-- Info card -->
      <div style="background: #3d3b3b; border: 1px solid rgba(255,255,255,0.08);
                  border-radius: 10px; padding: 18px 22px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; font-size: 13px;
                       color: rgba(255,255,255,0.45); width: 40%;">📋 Status</td>
            <td style="padding: 5px 0; font-size: 13px;
                       font-weight: 700; color: #4ade80;">Test — No action required</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-size: 13px;
                       color: rgba(255,255,255,0.45);">🕐 Sent at</td>
            <td style="padding: 5px 0; font-size: 13px;
                       font-weight: 600; color: #FFFFFF;">
              ${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-size: 13px;
                       color: rgba(255,255,255,0.45);">👤 Sent to</td>
            <td style="padding: 5px 0; font-size: 13px;
                       font-weight: 600; color: #FFFFFF;">${contact.fullname}</td>
          </tr>
        </table>
      </div>

      <!-- Notice -->
      <div style="background: rgba(234,43,31,0.1); border-left: 3px solid #EA2B1F;
                  border-radius: 0 8px 8px 0; padding: 14px 18px;">
        <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6;">
          If you receive a <strong style="color: #FFFFFF;">real SOS alert</strong> from NeoAegis,
          it will include a live location tracking link. Please respond promptly and
          contact emergency services if needed.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="padding: 18px 32px; border-top: 1px solid rgba(255,255,255,0.07);
                text-align: center;">
      <p style="margin: 0; color: rgba(255,255,255,0.25); font-size: 11px; line-height: 1.6;">
        Sent by <strong style="color: rgba(255,255,255,0.4);">NeoAegis Safety Platform</strong>
        &nbsp;·&nbsp; Do not reply to this email
      </p>
    </div>

  </div>
`,
      })
    );

    await Promise.all(emailPromises);

    res.status(200).json({
      message: `Test alert sent to ${contacts.length} contact(s) successfully.`,
      count: contacts.length,
    });

  } catch (error) {
    console.error("Error sending test alert:", error);
    res.status(500).json({ message: "Failed to send test alert.", error: error.message });
  }
};