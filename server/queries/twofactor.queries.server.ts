import { prisma } from "../db.server";

export async function getTwoFactorData( userId: string ) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      phoneNumber: true,
    },
  });

  const protectedPhone = user?.phoneNumber.slice(10);

  return protectedPhone;
}

export async function sendVerificationCode(userId: string, phone: string) {
    
}