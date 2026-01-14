import { registerUser } from "server/queries/auth.queries.server";
import RegisterForm from "~/components/Forms/RegisterForm";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";
import { getUserId as getUserIdFromEmail } from "server/queries/user.queries.server";
import { createUserSession } from "server/session.server";
import { csrf } from "server/csrf.server";
import { CSRFError } from "remix-utils/csrf/server";
import { requireSameOrigin } from "server/session.server";
import { sendWelcomeEmail } from "server/queries/verify.queries.server";

// Turnstile validation function
async function validateTurnstile(token: string, remoteip: string) {
  const formData = new FormData();
  formData.append('secret', process.env.VITE_CF_SECRETKEY!); // ✓ Fixed: removed VITE_ prefix
  formData.append('response', token); // ✓ Fixed: was 'reponse'
  formData.append('remoteip', remoteip);

  try {
    const response = await fetch( // ✓ Fixed: was 'reponse'
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Turnstile validation error:', error);
    return { success: false, 'error-codes': ['internal-error'] };
  }
}

export const action = async ({ request }: { request: Request }) => {
  requireSameOrigin(request);

  // CSRF validation
  try {
    await csrf.validate(request);
  } catch (error) {
    if (error instanceof CSRFError) {
      return { success: false, message: "Invalid Security Token" };
    }
    return { success: false, message: error };
  }

  const formData = await request.formData();

  // ✓ ADDED: Validate Turnstile first
  const turnstileToken = formData.get('cf-turnstile-response') as string; // ✓ Fixed: was 'reponse'
  
  if (!turnstileToken) {
    return {
      success: false,
      error: "Security verification missing. Please complete the verification.",
    };
  }

  const remoteIp =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For') ||
    request.headers.get('X-Real-IP') ||
    'unknown';

  const validation = await validateTurnstile(turnstileToken, remoteIp);

  if (!validation.success) {
    console.error('Turnstile validation failed:', validation['error-codes']);
    return {
      success: false,
      error: "Security verification failed. Please try again.",
      errorCodes: validation['error-codes'],
    };
  }

  console.log('✓ Turnstile validation successful from:', validation.hostname);

  // Extract form data
  const inviteCode = formData.get("inviteCode") as string | null;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;
  const base = formData.get("base") as string;

  // Register user
  const result = await registerUser(
    inviteCode,
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    base
  );

  if (result?.error) {
    return { error: result.error };
  }

  // Get user ID and send welcome email
  const { id } = (await getUserIdFromEmail(email))!;
  await sendWelcomeEmail(id, email);

  // Create session and redirect
  return await createUserSession(id, "/login");
};

export default function Register() {
  return <RegisterForm />;
}

export { ErrorBoundary };