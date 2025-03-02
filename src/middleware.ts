import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "@/lib/auth";

// const publicRoutes = ["/"];
const authRoutes = ["/sign-in", "/sign-up"];
const passwordRoutes = ["/forgot-password", "/reset-password"];

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName);
  const isPasswordRoute = passwordRoutes.includes(pathName);
  // const isPublicRoute = publicRoutes.includes(pathName);

  // if (isPublicRoute) {
  //   return NextResponse.next();
  // }

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BETTER_AUTH_URL,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (!session) {
    if (isAuthRoute || isPasswordRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute || isPasswordRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|public/|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.woff$|.*\\.woff2$|.*\\.ttf$|.*\\.otf$).*)",
  ],
};
