import type { ActionFunctionArgs } from "react-router";
import { requireUserId } from "server/session.server";
import { prisma } from "server/db.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const userId = await requireUserId(request);

  let body: { endpoint: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { endpoint } = body;
  if (!endpoint) {
    return Response.json({ error: "Missing endpoint" }, { status: 400 });
  }

  await prisma.pushSubscription.deleteMany({
    where: { userId, endpoint },
  });

  return Response.json({ success: true });
}
