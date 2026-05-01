import { NextResponse, type NextRequest } from "next/server";
import { mergeCookiesIntoRedirect, runSupabaseMiddleware } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const { response, isAuthenticated } = await runSupabaseMiddleware(request);

  if (response.status === 500) {
    return response;
  }

  const isDashboard = pathname.startsWith("/dashboard");
  const isHome = pathname === "/";

  if (isDashboard && !isAuthenticated) {
    const redirect = NextResponse.redirect(new URL("/auth/login", request.url));
    return mergeCookiesIntoRedirect(response, redirect);
  }

  if (isHome && isAuthenticated) {
    const redirect = NextResponse.redirect(new URL("/dashboard", request.url));
    return mergeCookiesIntoRedirect(response, redirect);
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register",
    "/api/orders/:path*",
    "/api/shipments/:path*",
  ],
};
