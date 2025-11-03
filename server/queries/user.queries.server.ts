import { prisma } from "../db.server";

export async function getUserInfo(intent: string, userId: string) {
  const dashboard = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  if (intent === "dashboard") {
    return dashboard;
  }
}
