"use server";

import { auth, signIn, signOut } from "@/auth";
import { getUserByEmail } from "@/lib/actions";
import { errorHandler } from "@/lib/handlers";
import { PRIVATE_REDIRECT } from "@/routes";
import { LoginSchema, UseLoginSchema } from "@/zod/schema";
import { isRedirectError } from "next/dist/client/components/redirect";

export const getSession = async () => await auth();

export const authenticate = async () => {
  const session = await getSession();

  if (!session || new Date(session.expires) <= new Date()) {
    signOut();

    return { valid: false, session };
  }

  return { valid: true, session };
};

export const login = async (values: UseLoginSchema) => {
  try {
    const fields = LoginSchema.safeParse(values);
    const { success, data } = fields;

    if (!success || !data)
      return { success: false, message: "Invalid fields passed" };

    const existingUser = await getUserByEmail(data.email);

    if (!existingUser)
      return {
        success: false,
        message: "Invalid credentials",
      };

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: PRIVATE_REDIRECT,
    });

    return { success: true, message: "Login Successfull" };
  } catch (error) {
    const err = errorHandler(error);

    if (isRedirectError(error)) {
      throw error;
    }

    return { ...err, success: false };
  }
};
