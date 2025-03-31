"use server";

import { errorHandler } from "@/lib/handlers";
import { db } from "@/lib/prisma";
import { hashPassword } from "@/lib/utils";
import { RegisterSchema, UseRegisterSchema } from "@/zod/schema";
import { authenticate } from "./auth";

export const register = async (values: UseRegisterSchema) => {
  try {
    const { success, data } = RegisterSchema.safeParse(values);

    if (!success || !data)
      return {
        success: false,
        message: "Invalid field values passed",
      };

    const {
      email,
      phone,
      department,
      faculty,
      fullname,
      matric,
      password,
      cPassword,
    } = data;

    if (!password || !cPassword)
      return { success: false, message: "Password is required" };
    if (password !== cPassword)
      return { success: false, message: "Passwords do not match" };

    const existingUser = await db.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existingUser)
      return {
        success: false,
        message: "A user with this E-mail/Phone Number already exists",
      };

    const hash = await hashPassword(password);

    await db.user.create({
      data: {
        email,
        phone,
        department,
        faculty,
        matric,
        fullname,
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return { success: true, message: "Successfully created user" };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const updateUser = async ({
  name,
  bio,
}: {
  name?: string;
  bio?: string;
}) => {
  try {
    const auth = await authenticate();
    const userId = auth.session?.user.id;

    if (!auth.valid || !userId)
      return {
        success: false,
        message: "Session has expired",
      };

    await db.user.update({
      where: { id: userId },
      data: {
        bio,
        fullname: name,
        updatedAt: new Date(),
      },
    });

    return { success: true, message: "Successfully updated detailes" };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};
