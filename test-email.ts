// test-email.ts
import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function testEmail() {
  console.log("Testing SMTP connection...");
  console.log("Host:", process.env.SMTP_HOST);
  console.log("Port:", process.env.SMTP_PORT);
  console.log("User:", process.env.SMTP_USER);

  try {
    await transporter.verify();
    console.log("✅ SMTP connection successful!");

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@travis.af.mil",
      to: process.env.SMTP_USER,
      subject: "Verify your email - Base Rideshare",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Verify your email</h1>
      <p>Hello Test,</p>
      <p>Thank you for registering with Base Rideshare. Please click the link below to verify your email address:</p>
      <a href="http://www.google.com" style="display: inline-block; padding: 12px 24px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Verify Email
      </a>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #666;">url</p>
      <p>This link will expire in 24 hours.</p>
    </div>
      `
})

    console.log("✅ Email sent!");
    // console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testEmail();