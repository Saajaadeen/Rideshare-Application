// app/lib/auth.server.ts
import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSOWRD,
      },
});

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  // Base URL for your app
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  // Trusted origins (important for CORS)
  trustedOrigins: [
    "http://localhost:3000",
    // Add your production URL when deployed
  ],
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Set to true if you want email verification
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
});

export type Session = typeof auth.$Infer.Session;