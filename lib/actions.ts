import { db } from "./prisma";

export const getUserById = async (id: string) => {
  const user = await db.user.findUnique({ where: { id } });

  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
  });

  return user;
};
