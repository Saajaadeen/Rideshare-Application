import type { ActionFunctionArgs } from "react-router";
import { requireUserId } from "server/session.server";
import { prisma } from "server/db.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const userId = await requireUserId(request);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isDriver: true },
  });

  if (!user?.isDriver) {
    return Response.json({ error: "Only drivers can subscribe to push notifications" }, { status: 403 });
  }

  let body: { endpoint: string; keys: { p256dh: string; auth: string } };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { endpoint, keys } = body;
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return Response.json({ error: "Missing subscription fields" }, { status: 400 });
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: {
      userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
    update: {
      userId,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
  });

  return Response.json({ success: true });
}
