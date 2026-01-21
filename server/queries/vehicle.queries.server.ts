import { userInfo } from "os";
import { prisma } from "../db.server";

export async function enableVehicle(userId: string, isDriver: boolean) {
  const vehicle = await prisma.user.update({
    where: { id: userId},
    data: { isDriver },
  });
  return vehicle;
}

export async function createVehicle(
  userId: string,
  year: string,
  make: string,
  model: string,
  color: string,
  plate: string,
) {
  const [vehicle, user] = await prisma.$transaction([
    prisma.vehicle.create({
      data: {
        userId,
        year,
        make,
        model,
        color,
        plate,
      },
    }),
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isDriver: true,
      }
    })
  ])

  return vehicle;
}

export async function getVehicles(userId: string) {
  return prisma.vehicle.findMany({
    where: { userId },
    select: {
      id: true,
      year: true,
      make: true,
      model: true,
      color: true,
      plate: true,
      createdAt: true,
    },
  });
}

export async function deleteVehicle(vehicleId: string, userId: string) {
  // const vehicle = await prisma.vehicle.delete({
  //   where: { id },
  // });

  const [deleteVehicle, remainingCount] = await prisma.$transaction([
    prisma.vehicle.delete({
      where: {id: vehicleId},
    }),
    prisma.vehicle.count({
      where: {id: userId}
    })
  ]);


  if(remainingCount === 0){
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isDriver: false,
      }
    });
  }

  return deleteVehicle;
}