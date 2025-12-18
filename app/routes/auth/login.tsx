import {
  redirect,
  type LoaderFunctionArgs,
  useLoaderData,
  useActionData,
} from "react-router";
import { authenticateUser } from "server/queries/auth.queries.server";
import {
  createUserSession,
  getUserId,
  getSession,
  requireCSRFToken,
  generateCSRFToken,
  storage,
} from "server/session.server";
import LoginForm from "~/components/Forms/LoginForm";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");

  const session = await getSession(request);
  const csrfToken = generateCSRFToken();
  session.set("csrfToken", csrfToken);

  return new Response(
    JSON.stringify({ csrfToken }),
    {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": await storage.commitSession(session),
      },
    }
  );
}


export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  await requireCSRFToken(request, formData);

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return { error: "Invalid credentials" };
  }

  return createUserSession(user.id, "/dashboard");
};

export default function Login() {
  const { csrfToken } = useLoaderData<{ csrfToken: string }>();
  const actionData = useActionData<{ error?: string }>();

  return <LoginForm error={actionData?.error} csrfToken={csrfToken} />;
}

export { ErrorBoundary };
