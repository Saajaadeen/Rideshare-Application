import { createCookieSessionStorage, redirect } from "react-router";
import { prisma } from "./db.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set in environment variables");
}

export const storage = createCookieSessionStorage({
  cookie: {
    name: "session-cookie",
    secure: process.env.NODE_ENV == "production",
    secrets: [sessionSecret],
    sameSite: "strict",
    path: "/",
    httpOnly: true,
  },
});

// Helper: get session from request
export async function getSession(request: Request) {
  if (!request) throw new Error("Request is required to get session");
  const cookie = request.headers?.get?.("Cookie") ?? "";
  return storage.getSession(cookie);
}

// Store userId in session and redirect
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// Belt and suspenders for XSS/CSRF Attacks
export function requireSameOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  if (!origin) {
    return;
  }

  const isProduction = process.env.NODE_ENV === "production";
  
  if (isProduction) {
    const expectedOrigin = `https://${process.env.WEBSITE_DOMAIN}`;
    
    if (origin !== expectedOrigin) {
      throw new Response("Invalid origin", { status: 403 });
    }
  } else {
    const port = process.env.VITE_DOMAIN_PORT;
    const originUrl = new URL(origin);
    
    const isValidDevOrigin = 
      originUrl.protocol === "http:" && 
      originUrl.port === port;
    
    if (!isValidDevOrigin) {
      throw new Response("Invalid origin", { status: 403 });
    }
  }
}

// Read url params and ensure the valid params exists in the url
export async function requireMagicLink(url: string): Promise<true> {
  const parsedUrl = new URL(url);
  const params = parsedUrl.searchParams;
  
  const token = params.get("token");
  const id = params.get("id");
  const userId = params.get("userId");
  const valid = params.get("valid");
  const code = params.get("code");

  if (!token || !id || !userId || !valid || !code) {
    throw redirect("/login");
  }

  const validUntil = new Date(valid);
  
  if (Number.isNaN(validUntil.getTime())) {
    throw redirect("/login");
  }

  const match = await prisma.reset.findFirst({
    where: {
      AND: [
        { id },
        { token },
        { userId },
        { code },
        {
          validUntil: {
            gte: new Date(),
          },
        },
      ],
    },
    select: { id: true },
  });

  if (!match) {
    throw redirect("/login");
  }

  return true;
}

// Read userId from session
export async function getUserId(request: Request) {
  const session = await getSession(request);
  return session.get("userId") ?? null;
}

// Destroy session (for logout)
export async function logoutUser(request: Request) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

// Require userId for protected routes
export async function requireUserId(request: Request, redirectTo = "/login") {
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect(redirectTo);
  }
  return userId;
}

// Require userId be verified before accessing account
export async function checkEmailVerification(userId: string, request: Request) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      emailVerified: true,
      emailVerificationCode: true,
      emailVerificationCodeExpiration: true,
      emailVerificationAttempts: true,
    },
  });

  const verificationCode = user?.emailVerificationCode;
  const expirationDate = user?.emailVerificationCodeExpiration;
  const emailVerified = user?.emailVerified;
  const currentUrl = new URL(request.url);
  const currentPath = currentUrl.pathname;

  if (emailVerified) {
    if (currentPath === "/send" || currentPath === "/verify") {
      throw redirect("/dashboard");
    }
    return;
  }

  if (!verificationCode && !expirationDate && currentPath !== "/send") {
    throw redirect("/send");
  }

  if (verificationCode && expirationDate && currentPath !== "/verify") {
    throw redirect("/verify");
  }
}

// Require admin userId for protected routes
export async function requireAdminId(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  if (!user || !user.isAdmin) {
    return ("Unauthorized user");
  }

  return user;
}


const userConnections = new Map<string, number>();
const MAX_CONNECTIONS_PER_USER = 5;

export function requireSseConnection(userId: string): void {
  const current = userConnections.get(userId) || 0;
  
  if (current >= MAX_CONNECTIONS_PER_USER) {
    console.warn(`[SSE] User ${userId} exceeded connection limit (${current}/${MAX_CONNECTIONS_PER_USER})`);
    throw new Response(
      `Too many connections (${current}/${MAX_CONNECTIONS_PER_USER}). Please close an existing connection.`,
      { 
        status: 429,
        headers: {
          "Retry-After": "10",
          "Content-Type": "text/plain"
        }
      }
    );
  }
  
  userConnections.set(userId, current + 1);
  console.log(`[SSE] User ${userId} connected. Total connections: ${current + 1}`);
}

export function releaseSseConnection(userId: string): void {
  const current = userConnections.get(userId) || 1;
  
  if (current <= 1) {
    userConnections.delete(userId);
    console.log(`[SSE] User ${userId} disconnected. Total connections: 0`);
  } else {
    userConnections.set(userId, current - 1);
    console.log(`[SSE] User ${userId} disconnected. Total connections: ${current - 1}`);
  }
}
