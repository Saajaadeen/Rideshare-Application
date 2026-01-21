import { prisma } from "../db.server";

export async function createStop(
  baseId: string,
  name: string,
  longitude: string,
  latitude: string,
  description?: string
) {
  const existing = await prisma.station.findFirst({
    where: {
      baseId,
      OR:[
        {name},
        {description},
      ],
    }
  })

  console.log(existing?.name.toLowerCase(), " ---- ", name.toLowerCase(), " = ", (existing?.name.toLowerCase() === name.toLowerCase()))

  if(existing?.name.toLowerCase() === name.toLowerCase() || existing?.description?.toLowerCase() === description?.toLowerCase()){
    return {success: false, message: "Location already exists!"}
  }

  const stop = await prisma.station.create({
    data: {
      baseId,
      name,
      longitude,
      latitude,
      description,
    },
  });

  return {success: true, message: "New stop created!"};
}

export async function getStop(baseId: string) {
  if (!baseId) {
    return [];
  }

  const stop = await prisma.station.findMany({
    where: {
      baseId,
    },
    select: {
      id: true,
      baseId: true,
      name: true,
      longitude: true,
      latitude: true,
      description: true,
      base: {
        select: {
          name: true,
        },
      },
    },
  });

  return stop;
}

export async function updateStop(
  id: string,
  baseId: string,
  name: string,
  longitude: string,
  latitude: string,
  description: string
) {
  const stop = await prisma.station.update({
    where: { id },
    data: {
      baseId,
      name,
      longitude,
      latitude,
      description,
    },
  });

  return stop;
}

export async function deleteStop(id: string) {
  const stop = await prisma.station.delete({
    where: { id },
  });

  return stop;
}
