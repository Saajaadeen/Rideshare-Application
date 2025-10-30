import { prisma } from "../db.server";
import bcrypt from "bcryptjs";

export async function getUserDetails(userId: string) {
  const userDetails = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true,
      isAdmin: true,
    },
  });
  return userDetails;
}