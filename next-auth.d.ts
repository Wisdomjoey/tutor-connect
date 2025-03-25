import "next-auth";
import "next-auth/jwt";
import { User, ROLES } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: Partial<User>;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Partial<User> {}
}
