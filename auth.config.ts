import { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./zod/schema";
import { getUserByEmail } from "./lib/actions";

export default {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const fields = LoginSchema.safeParse(credentials);

        if (fields.success) {
          const { email, password } = fields.data;
          const existingUser = await getUserByEmail(email);

          if (!existingUser) return null;

          const validPassword = await bcrypt.compare(
            password,
            existingUser.password ?? ""
          );

          if (validPassword) return { ...existingUser, password: null };
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
