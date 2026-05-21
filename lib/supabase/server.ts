import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ENV } from "@/config/env";
import { createSupabaseClientForSchema } from "./factory";
import { getAuthLandingPath, resolveAuthScope } from "@/lib/auth";

/**
 * Cliente Supabase con service_role para uso en handlers/repositorios del servidor.
 * Internamente usa el Factory Method por schema.
 */
export function createServiceRoleClient(schema: string) {
  return createSupabaseClientForSchema(schema);
}

/**
 * Refresca cookies de sesion Supabase en la Edge y valida el JWT con getClaims().
 * Se invoca desde middleware.ts.
 */
export async function runSupabaseMiddleware(request: NextRequest): Promise<{
  response: NextResponse;
  isAuthenticated: boolean;
  landingPath: string | null;
  isPlatformAdmin: boolean;
  pymeStatus: string | null;
}> {
  let response = NextResponse.next({ request });

  const url = ENV.SUPABASE_URL();
  const anonKey = ENV.SUPABASE_ANON_KEY();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims?.sub);

  if (!isAuthenticated || !data?.claims?.sub) {
    return {
      response,
      isAuthenticated: false,
      landingPath: null,
      isPlatformAdmin: false,
      pymeStatus: null,
    };
  }

  try {
    const scope = await resolveAuthScope(supabase, data.claims.sub);

    return {
      response,
      isAuthenticated: true,
      landingPath: getAuthLandingPath(scope),
      isPlatformAdmin: scope.isPlatformAdmin,
      pymeStatus: scope.pymeStatus,
    };
  } catch (error) {
    const err = error as { message?: string };

    return {
      response: NextResponse.json(
        {
          code: "INTERNAL_ERROR",
          message: err.message ?? "Error al resolver la sesión",
        },
        { status: 500 }
      ),
      isAuthenticated: false,
      landingPath: null,
      isPlatformAdmin: false,
      pymeStatus: null,
    };
  }
}

/** Copia cookies Set-Cookie de una respuesta a otra (p. ej. al hacer redirect tras refresh). */
export function mergeCookiesIntoRedirect(
  source: NextResponse,
  redirect: NextResponse
): NextResponse {
  source.cookies.getAll().forEach(({ name, value }) => {
    redirect.cookies.set(name, value);
  });
  return redirect;
}
