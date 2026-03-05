const nodemailer = require('nodemailer');

const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

const sendSOSAlertEmail = async ({ contactEmail, contactName, alertDetails, trackingUrl }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"NeoAegis Safety" <${process.env.EMAIL_USER}>`,
    to: contactEmail,
    subject: '🚨 NeoAegis — Emergency SOS Alert',
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
          <span style="display: inline-block; background: rgba(234,43,31,0.22);
                       border: 1px solid rgba(234,43,31,0.55); border-radius: 100px;
                       padding: 5px 16px; font-size: 11px; font-weight: 800;
                       color: #EA2B1F; letter-spacing: 0.8px;">
            🚨 EMERGENCY SOS TRIGGERED
          </span>
        </div>

        <!-- Body -->
        <div style="padding: 28px 32px;">

          <!-- Greeting -->
          <h2 style="margin: 0 0 6px; font-size: 18px; color: #FFFFFF; font-weight: 700;">
            Hi ${contactName},
          </h2>
          <p style="color: rgba(255,255,255,0.55); font-size: 13px; margin: 0 0 22px; line-height: 1.6;">
            Your emergency contact <strong style="color: #FFFFFF;">${alertDetails.triggeredBy}</strong>
            has triggered an SOS alert and may need immediate assistance.
            Please check on them right away.
          </p>

          <!-- Alert details card -->
          <div style="background: #3d3b3b; border: 1px solid rgba(255,255,255,0.08);
                      border-radius: 10px; padding: 18px 22px; margin-bottom: 22px;">
            <p style="margin: 0 0 12px; font-size: 11px; font-weight: 800;
                      color: rgba(255,255,255,0.35); letter-spacing: 1.2px;
                      text-transform: uppercase;">Alert Details</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; font-size: 13px;
                           color: rgba(255,255,255,0.45); width: 38%;">📍 Location</td>
                <td style="padding: 5px 0; font-size: 13px;
                           font-weight: 600; color: #FFFFFF;">${alertDetails.city}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-size: 13px;
                           color: rgba(255,255,255,0.45);">🕐 Triggered at</td>
                <td style="padding: 5px 0; font-size: 13px;
                           font-weight: 600; color: #FFFFFF;">${alertDetails.timestamp}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-size: 13px;
                           color: rgba(255,255,255,0.45);">💬 Message</td>
                <td style="padding: 5px 0; font-size: 13px;
                           font-weight: 600; color: #FFFFFF;">${alertDetails.message}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-size: 13px;
                           color: rgba(255,255,255,0.45);">⏳ Link valid for</td>
                <td style="padding: 5px 0; font-size: 13px;
                           font-weight: 600; color: #FFFFFF;">3 hours</td>
              </tr>
            </table>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 22px;">
            <a href="${trackingUrl}"
               style="display: inline-block;
                      background: linear-gradient(135deg, #EA2B1F 0%, #c0221a 100%);
                      color: #FFFFFF; text-decoration: none; font-size: 15px;
                      font-weight: 800; padding: 14px 36px; border-radius: 10px;
                      letter-spacing: 0.3px;
                      box-shadow: 0 4px 16px rgba(234,43,31,0.4);">
              👁️ &nbsp;Track Live Location
            </a>
            <p style="margin: 10px 0 0; font-size: 11px; color: rgba(255,255,255,0.35);">
              This link expires in 3 hours
            </p>
          </div>

          <!-- Warning box -->
          <div style="background: rgba(234,43,31,0.1); border-left: 3px solid #EA2B1F;
                      border-radius: 0 8px 8px 0; padding: 14px 18px;">
            <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6;">
              ⚠️ &nbsp;If you are unable to reach them, please
              <strong style="color: #FFFFFF;">contact emergency services immediately</strong>.
              Do not wait if you believe they are in danger.
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
  });
};

module.exports = { sendSOSAlertEmail };