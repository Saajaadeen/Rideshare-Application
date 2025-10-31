import { prisma } from "../db.server";
import bcrypt from "bcryptjs";

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingAdmin = await prisma.user.findFirst({
    where: { isAdmin: true },
  });

  const isAdmin = existingAdmin ? false : true;

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        isAdmin,
      },
    });
    return user;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Email is already in use");
    }
    throw error;
  }
}

export async function authenticateUser( email: string, password: string ) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
    }
  });

  if (!user || !user.password) { return null; }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) { return null; }
  
  return {
    id: user.id, 
    email: user.email
  };
}

export async function authenticateAdmin( userId: string ) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isAdmin: true
    },
  });

  if (!user) {
    return null;
  }
  return user.isAdmin;
}