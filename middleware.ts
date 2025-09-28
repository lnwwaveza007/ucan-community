import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "ucan_admin";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /backoffice and nested routes
  if (pathname.startsWith("/backoffice")) {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!cookie) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in admins away from /login to /backoffice
  if (pathname === "/login") {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (cookie) {
      return NextResponse.redirect(new URL("/backoffice", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/backoffice/:path*", "/login"],
};


