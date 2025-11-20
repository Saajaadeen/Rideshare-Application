import { Prisma } from "@prisma/client";
import { prisma } from "../db.server";

function generateInviteCode(length = 15): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
}

export async function createInvite(email: string, userId: string) {
  try {
    const invite = await prisma.invite.create({
      data: {
        email,
        userId,
        code: generateInviteCode(),
      },
    });

    return { invite, error: null };
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return { invite: null, error: "An invite for this email already exists." };
      }
    }
    return { invite: null, error: "Something went wrong creating the invite." };
  }
}

export async function getInvites(userId: string) {
  const invite = await prisma.invite.findMany({
    where: { userId },
    select: {
      id: true,
      email: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      isActive: true,
      code: true,
    },
  });
  return invite;
}

export async function updateInvite(id: string) {
  const invite = await prisma.invite.update({
    where: { id },
    data: {
      code: generateInviteCode(),
      updatedAt: new Date(Date.now())
    },
  });
  return invite;
}

export async function disableInvite(id: string) {
    const invite = await prisma.invite.update({
        where: { id },
        data: {
            isActive: false,
            updatedAt: new Date(Date.now())
        },
    });

    return invite;
}

export async function enableInvite(id: string) {
    const invite = await prisma.invite.update({
        where: { id },
        data: {
            isActive: true,
            updatedAt: new Date(Date.now())
        },
    });

    return invite;
}

export async function deleteInvite(id: string) {
    const invite = await prisma.invite.delete({
        where: { id },
    });

    return invite;
}