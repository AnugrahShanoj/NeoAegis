const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  }
});

exports.sendSOSEmail = async (contacts, alertData, trackingUrl) => {
  const { location, message, timestamp } = alertData;

  const alertTime = new Date(timestamp).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata'
  });

  for (const contact of contacts) {
    const mailOptions = {
      from: `"NeoAegis Safety" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: `🚨 EMERGENCY — SOS Alert Triggered`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #dc2626; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">🚨 SOS Emergency Alert</h1>
          </div>
          <div style="background-color: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px;">Hi <strong>${contact.fullname}</strong>,</p>
            <p style="font-size: 16px;">An emergency SOS alert has been triggered. Immediate attention may be required.</p>
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0;"><strong>📍 Location:</strong> ${location.city || 'Unknown'}</p>
              <p style="margin: 8px 0 0;"><strong>🕒 Time:</strong> ${alertTime}</p>
              <p style="margin: 8px 0 0;"><strong>💬 Message:</strong> ${message}</p>
            </div>
            <div style="text-align: center; margin: 28px 0;">
              <a href="${trackingUrl}"
                style="background-color: #dc2626; color: white; padding: 14px 28px;
                       text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                👁️ Track Live Location
              </a>
            </div>
            <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
              This tracking link is valid for 3 hours. Please try to contact them immediately.
            </p>
          </div>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`SOS email sent to ${contact.email}`);
    } catch (err) {
      console.error(`Failed to send email to ${contact.email}:`, err.message);
    }
  }
};