import { prisma } from "../db.server";

export async function createRequest(
  userId: string,
  pickupId: string,
  dropoffId: string
) {
  const request = await prisma.request.create({
    data: {
      userId,
      pickupId,
      dropoffId,
    },
  });
  return request;
}

export async function getUserRequest(userId: string) {
  const request = await prisma.request.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true,
        },
      },
      pickup: {
        select: {
          name: true,
          description: true,
          longitude: true,
          latitude: true,
        },
      },
      dropoff: {
        select: {
          name: true,
          description: true,
          longitude: true,
          latitude: true,
        },
      },
    },
  });

  return request;
}

export async function deleteRequest(id: string) {
    const request = await prisma.request.delete({
        where: { id },
    });

    return request;
}