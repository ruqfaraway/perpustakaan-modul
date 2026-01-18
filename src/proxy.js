import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { PROTECTED_ROUTES } from "./constants/permission";


export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth; 
  const userPermissions = req.auth?.user?.permissions || [];

  const isAuthPage = nextUrl.pathname.startsWith("/login");
  const isPublicPage = nextUrl.pathname === "/";

  if (!isLoggedIn && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  const currentRoute = PROTECTED_ROUTES.find((route) =>
    nextUrl.pathname.startsWith(route.path)
  );

  if (isLoggedIn && currentRoute) {
    const hasPermission = userPermissions.includes(currentRoute.permission);
    
    if (!hasPermission) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  // Melindungi semua halaman kecuali aset statis dan API auth
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};