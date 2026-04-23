import { NextResponse, type NextRequest } from "next/server";
import { mergeCookiesIntoRedirect, runSupabaseMiddleware } from "@/lib/supabase/supabaseMiddleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const { response, isAuthenticated } = await runSupabaseMiddleware(request);

  if (response.status === 500) {
    return response;
  }

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthLogin = pathname.startsWith("/auth/login");
  const isAuthRegister = pathname.startsWith("/auth/register");
  const isAuthPage = isAuthLogin || isAuthRegister;

  if (isDashboard && !isAuthenticated) {
    const redirect = NextResponse.redirect(new URL("/auth/login", request.url));
    return mergeCookiesIntoRedirect(response, redirect);
  }

  if (isAuthPage && isAuthenticated) {
    const redirect = NextResponse.redirect(new URL("/dashboard", request.url));
    return mergeCookiesIntoRedirect(response, redirect);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register",
    "/api/orders/:path*",
    "/api/shipments/:path*",
  ],
};
