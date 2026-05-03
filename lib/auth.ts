import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { ENV } from "@/config/env";
import { errorResponse } from "./shared";

/**
 * Resuelve el usuario autenticado y la pyme asociada usando las cookies de Supabase.
 * Usado por los routes de la BFF antes de llamar al handler del modulo.
 */
export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const supabaseUrl = ENV.SUPABASE_URL();
  const supabaseKey = ENV.SUPABASE_ANON_KEY();

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as CookieOptions)
          );
        } catch {}
      },
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      pymeId: null,
      role: null,
      response: errorResponse("UNAUTHORIZED", "Usuario no autenticado", 401),
    };
  }

  const { data: pymeUser, error: pymeError } = await supabase
    .from("pyme_user")
    .select("pyme_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (pymeError || !pymeUser) {
    return {
      user: null,
      pymeId: null,
      role: null,
      response: errorResponse("FORBIDDEN", "Usuario no vinculado a una PYME", 403),
    };
  }

  return {
    user,
    pymeId: pymeUser.pyme_id as string,
    role: pymeUser.role as string,
    response: null,
  };
}
