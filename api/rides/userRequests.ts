import type { LoaderFunctionArgs } from "react-router";
import { prisma } from "server/db.server";
import { checkEmailVerification, requireUserId } from "server/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  await checkEmailVerification(userId, request)
//   const searchParams = new URL(request.url).searchParams;
//   const userId = searchParams.get("userId");

  const userRequests = prisma.request.findMany({
    where: {
      userId,
    },
  });
  return { rideData: userRequests };
};
