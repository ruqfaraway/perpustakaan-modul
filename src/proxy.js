import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isPublicRoute = nextUrl.pathname === "/login";

  // Jika tidak login dan mencoba akses rute terproteksi
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Jika sudah login tapi malah mau ke halaman login
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Tetap gunakan matcher untuk filter rute mana yang kena proxy
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
