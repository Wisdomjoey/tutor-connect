import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { db } from "./lib/prisma";
import { getUserById } from "./lib/actions";
// import "./envConfig";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: 86400, updateAge: 172800 },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.id) return false;

      const existingUser = await getUserById(user.id);

      if (!existingUser) return false;
      // if (!existingUser.emailVerified) return false;
      // if (!existingUser.phoneVerified) return false;

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const { password, email, ...rest } = existingUser;
      token = { ...token, ...rest };

      return token;
    },
    async session({ session, token }) {
      // if (!session.user || !token.id || !token.email) return session;
      if (!token.id || !token.email) return session;

      const { exp, sub, iat, jti, name, id, email, ...rest } = token;
      session.user = { ...session.user, id: id!, email: email!, ...rest };

      return session;
    },
  },
});
