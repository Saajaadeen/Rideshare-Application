// app/routes/auth/register.tsx
import { redirect, type ActionFunctionArgs } from "react-router";
import { prisma } from "server/db.server";
import RegisterForm from "~/components/Forms/RegisterForm";
import { auth } from "~/lib/auth-server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const inviteCode = formData.get("inviteCode") as string | null;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;

  console.log("🚀 Starting registration for:", email);

  try {
    // Create user with better-auth
    const { user } = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: `${firstName} ${lastName}`,
      },
    });

    console.log("✅ User created:", user.id);
    console.log("📧 Email verified status:", user.emailVerified);

    // Update user with custom fields
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        phoneNumber, 
        firstName, 
        lastName 
      },
    });

    console.log("✅ User updated with custom fields");

    // Generate verification token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification token in database
    await prisma.verification.create({
      data: {
        id: crypto.randomUUID(),
        identifier: email,
        value: token,
        expiresAt,
      },
    });

    console.log("✅ Verification token created");

    // Build verification URL
    const baseURL = process.env.BETTER_AUTH_URLS || "http://10.0.30.204:3000";
    const verificationUrl = `${baseURL}/success?token=${token}&identifier=${encodeURIComponent(email)}&callbackURL=/success`;

    console.log("🔔 Sending verification email to:", email);
    console.log("🔗 Verification URL:", verificationUrl);

    // Send verification email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@example.com",
      to: email,
      subject: "Verify your email - Base Rideshare",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Verify your email</h1>
          <p>Hello ${firstName} ${lastName},</p>
          <p>Thank you for registering with Base Rideshare. Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Verify Email
          </a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    });

    console.log("✅ Verification email sent successfully!");

    // Optional: Handle invite code if needed
    // if (inviteCode) {
    //   await validateAndUseInviteCode(inviteCode, user.id);
    // }

    return redirect("/auth/login?message=check-email");
  } catch (error: any) {
    console.error("❌ Registration error:", error);
    return { error: error.message || "Failed to register user" };
  }
};

export default function Register() {
  return <RegisterForm />;
}