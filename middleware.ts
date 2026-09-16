import { NextResponse, type NextRequest } from "next/server";
export function middleware(request: NextRequest) {
  const aliases: Record<string, string> = {
    "/index.html": "/",
    "/portal.html": "/portal",
    "/admin.html": "/admin",
    "/tv.html": "/tv",
  };
  if (aliases[request.nextUrl.pathname])
    return NextResponse.redirect(
      new URL(aliases[request.nextUrl.pathname], request.url),
      308,
    );
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  if (
    request.nextUrl.pathname.startsWith("/api/") ||
    ["/portal", "/admin", "/setup"].includes(request.nextUrl.pathname)
  )
    response.headers.set("Cache-Control", "no-store");
  return response;
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
