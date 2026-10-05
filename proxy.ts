import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, CLIENT_COOKIE, verifySession } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // First-user registration is only available through the signed-in Hanabi admin.
  if (
    pathname === "/cms/create-first-user" ||
    pathname === "/cms-api/users/first-register"
  ) {
    return new NextResponse(null, { status: 404 });
  }

  // Admin area
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const session = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value);
    if (session?.kind !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Client portal
  if (pathname.startsWith("/portal")) {
    if (pathname === "/portal/login") return NextResponse.next();
    const session = await verifySession(req.cookies.get(CLIENT_COOKIE)?.value);
    if (session?.kind !== "client") {
      const url = req.nextUrl.clone();
      url.pathname = "/portal/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/portal/:path*",
    "/cms/create-first-user",
    "/cms-api/users/first-register",
  ],
};
