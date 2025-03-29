import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  PRIVATE_REDIRECT,
  PUBLIC_REDIRECT,
  authRoutes,
  privateRoutes,
} from "./routes";
// import "./envConfig";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const loggedIn = !!req.auth;
  const path = `/${nextUrl.pathname.split("/")[1]}`;
  const isAuthRoute = authRoutes.includes(path);
  const isPrivateRoute = privateRoutes.includes(path);
  
  if (isAuthRoute && loggedIn)
    return Response.redirect(new URL(PRIVATE_REDIRECT, nextUrl));

  if (isPrivateRoute && !loggedIn)
    return Response.redirect(new URL(PUBLIC_REDIRECT, nextUrl));

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
