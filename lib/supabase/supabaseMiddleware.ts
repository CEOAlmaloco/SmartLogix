import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Actualiza cookies de sesión Supabase en la Edge y valida JWT con getClaims()
 * (mejor que getSession() para decisiones de acceso — Supabase SSR).
 */
export async function runSupabaseMiddleware(request: NextRequest): Promise<{
  response: NextResponse;
  isAuthenticated: boolean;
}> {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return {
      response: NextResponse.json(
        { code: "CONFIG_ERROR", message: "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY" },
        { status: 500 }
      ),
      isAuthenticated: false,
    };
  }

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

  return { response, isAuthenticated };
}

/** Copia cookies Set-Cookie de una respuesta a otra (p. ej. al hacer redirect tras refresh). */
export function mergeCookiesIntoRedirect(source: NextResponse, redirect: NextResponse): NextResponse {
  source.cookies.getAll().forEach(({ name, value }) => {
    redirect.cookies.set(name, value);
  });
  return redirect;
}
