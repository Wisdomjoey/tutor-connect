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
    signIn: "/login",
    signOut: "/logout",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.id) return false;

      const existingInvestor = await getUserById(user.id);

      if (!existingInvestor) return false;
      // if (!existingInvestor.emailVerified) return false;
      // if (!existingInvestor.phoneVerified) return false;

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingInvestor = await getUserById(token.sub);

      if (!existingInvestor) return token;

      const { password, email, ...rest } = existingInvestor;
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
