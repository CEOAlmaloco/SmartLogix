import { NextResponse, type NextRequest } from "next/server";
import { mergeCookiesIntoRedirect, runSupabaseMiddleware } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const { response, isAuthenticated, landingPath, isPlatformAdmin, pymeStatus } = await runSupabaseMiddleware(request);

  if (response.status === 500) {
    return response;
  }

  const isDashboard = pathname.startsWith("/dashboard");
  const isPlatform = pathname.startsWith("/platform");
  const isHome = pathname === "/";
  const isAuthLogin = pathname.startsWith("/auth/login");
  const isAuthRegister = pathname.startsWith("/auth/register");
  const isSuspendedPage = pathname.startsWith("/auth/suspended");
  const isAuthPage = isAuthLogin || isAuthRegister;
  const isApi = pathname.startsWith("/api/");
  const isPlatformApi = pathname.startsWith("/api/platform");

  const suspendedRedirect =
    pymeStatus === "suspended" && landingPath?.startsWith("/auth/suspended")
      ? landingPath
      : null;

  if (!isAuthenticated) {
    if (isApi) {
      return mergeCookiesIntoRedirect(
        response,
        NextResponse.json(
        {
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        },
        { status: 401 }
        )
      );
    }

    if (isDashboard || isPlatform) {
      const redirect = NextResponse.redirect(new URL("/auth/login", request.url));
      return mergeCookiesIntoRedirect(response, redirect);
    }

    return response;
  }

  if (suspendedRedirect && (isHome || isAuthPage || isDashboard || isPlatform)) {
    const redirect = NextResponse.redirect(new URL(suspendedRedirect, request.url));
    return mergeCookiesIntoRedirect(response, redirect);
  }

  if (isAuthPage || isHome) {
    const redirect = NextResponse.redirect(new URL(landingPath ?? "/dashboard", request.url));
    return mergeCookiesIntoRedirect(response, redirect);
  }

  if (isSuspendedPage && pymeStatus !== "suspended") {
    const redirect = NextResponse.redirect(new URL(landingPath ?? "/dashboard", request.url));
    return mergeCookiesIntoRedirect(response, redirect);
  }

  if (isDashboard && isPlatformAdmin) {
    const redirect = NextResponse.redirect(new URL(landingPath ?? "/platform", request.url));
    return mergeCookiesIntoRedirect(response, redirect);
  }

  if (isPlatform && !isPlatformAdmin) {
    const redirect = NextResponse.redirect(new URL(landingPath ?? "/dashboard", request.url));
    return mergeCookiesIntoRedirect(response, redirect);
  }

  if (isPlatformApi && !isPlatformAdmin) {
    return mergeCookiesIntoRedirect(
      response,
      NextResponse.json(
        {
          code: "FORBIDDEN",
          message: "Acceso restringido a administradores de plataforma",
        },
        { status: 403 }
      )
    );
  }

  if (isDashboard && pymeStatus === "suspended") {
    const redirect = NextResponse.redirect(new URL(landingPath ?? "/auth/suspended", request.url));
    return mergeCookiesIntoRedirect(response, redirect);
  }

  if (isDashboard && !isPlatformAdmin && !pymeStatus) {
    const redirect = NextResponse.redirect(new URL("/auth/login", request.url));
    return mergeCookiesIntoRedirect(response, redirect);
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/platform/:path*",
    "/auth/login",
    "/auth/register",
    "/auth/suspended",
    "/api/orders/:path*",
    "/api/shipments/:path*",
    "/api/platform/:path*",
  ],
};
