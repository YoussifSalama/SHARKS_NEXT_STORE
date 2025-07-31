import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("sharktoken")?.value;

  if (!token && req.nextUrl.pathname.startsWith("/sharks-dashboard-2025") && req.nextUrl.pathname !== "/sharks-dashboard-2025/login") {
    return NextResponse.redirect(new URL("/sharks-dashboard-2025/login", req.url));
  }

  if (token && req.nextUrl.pathname === "/sharks-dashboard-2025/login") {
    return NextResponse.redirect(new URL("/sharks-dashboard-2025", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sharks-dashboard-2025/:path*"],
};
