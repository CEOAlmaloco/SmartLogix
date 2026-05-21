import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { ENV } from "@/config/env";
import { errorResponse } from "./shared";

type PymeStatus = "active" | "suspended" | "pending_review";

export type AuthScope = {
  user: User | null;
  isPlatformAdmin: boolean;
  pymeId: string | null;
  role: string | null;
  pymeStatus: PymeStatus | null;
  suspendedReason: string | null;
  suspendedAt: string | null;
  response: Response | null;
};

function buildSuspendedPath(scope: Pick<AuthScope, "suspendedReason" | "suspendedAt">) {
  const params = new URLSearchParams();

  if (scope.suspendedReason) {
    params.set("reason", scope.suspendedReason);
  }

  if (scope.suspendedAt) {
    params.set("suspendedAt", scope.suspendedAt);
  }

  const query = params.toString();
  return query ? `/auth/suspended?${query}` : "/auth/suspended";
}

export function getAuthLandingPath(scope: Pick<AuthScope, "isPlatformAdmin" | "pymeStatus" | "suspendedReason" | "suspendedAt">) {
  if (scope.isPlatformAdmin) {
    return "/platform";
  }

  if (scope.pymeStatus === "suspended") {
    return buildSuspendedPath(scope);
  }

  return "/dashboard";
}

export async function resolveAuthScope(
  db: SupabaseClient,
  userId: string
): Promise<Omit<AuthScope, "user" | "response">> {
  const { data: platformAdmin } = await db
    .from("platform_admin")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (platformAdmin) {
    return {
      isPlatformAdmin: true,
      pymeId: null,
      role: null,
      pymeStatus: null,
      suspendedReason: null,
      suspendedAt: null,
    };
  }

  const { data: pymeUser } = await db
    .from("pyme_user")
    .select("pyme_id, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (!pymeUser) {
    return {
      isPlatformAdmin: false,
      pymeId: null,
      role: null,
      pymeStatus: null,
      suspendedReason: null,
      suspendedAt: null,
    };
  }

  const { data: pyme } = await db
    .from("pyme")
    .select("status, suspended_reason, suspended_at")
    .eq("id", pymeUser.pyme_id)
    .maybeSingle();

  return {
    isPlatformAdmin: false,
    pymeId: pymeUser.pyme_id as string,
    role: pymeUser.role as string,
    pymeStatus: (pyme?.status as PymeStatus | undefined) ?? null,
    suspendedReason: (pyme?.suspended_reason as string | null | undefined) ?? null,
    suspendedAt: (pyme?.suspended_at as string | null | undefined) ?? null,
  };
}

/**
 * Resuelve el usuario autenticado y la pyme asociada usando las cookies de Supabase.
 * Usado por los routes de la BFF antes de llamar al handler del modulo.
 */
export async function getAuthenticatedUser(): Promise<AuthScope> {
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
      isPlatformAdmin: false,
      pymeId: null,
      role: null,
      pymeStatus: null,
      suspendedReason: null,
      suspendedAt: null,
      response: errorResponse("UNAUTHORIZED", "Usuario no autenticado", 401),
    };
  }

  const scope = await resolveAuthScope(supabase, user.id);

  if (scope.isPlatformAdmin) {
    return {
      user,
      ...scope,
      response: null,
    };
  }

  if (!scope.pymeId) {
    return {
      user,
      ...scope,
      response: errorResponse("FORBIDDEN", "Usuario no vinculado a una PYME", 403),
    };
  }

  if (scope.pymeStatus === "suspended") {
    return {
      user,
      ...scope,
      response: errorResponse("SUSPENDED", "PYME suspendida", 403, {
        reason: scope.suspendedReason,
        suspendedAt: scope.suspendedAt,
      }),
    };
  }

  return {
    user,
    ...scope,
    response: null,
  };
}

export async function getPlatformAdmin(): Promise<{
  admin: { userId: string } | null;
  response: Response | null;
}> {
  const auth = await getAuthenticatedUser();

  if (auth.response) {
    return { admin: null, response: auth.response };
  }

  if (!auth.isPlatformAdmin || !auth.user) {
    return {
      admin: null,
      response: errorResponse("FORBIDDEN", "Acceso restringido a administradores de plataforma", 403),
    };
  }

  return { admin: { userId: auth.user.id }, response: null };
}
