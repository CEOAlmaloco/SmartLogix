import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getAuthLandingPath, resolveAuthScope } from "@/lib/auth";
import { ENV } from "@/config/env";
import { errorResponse, successResponse } from "@/lib/shared";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`login:${getClientIp(request)}`, 10, 60_000);
    if (!limit.allowed) {
      return errorResponse(
        "RATE_LIMITED",
        "Demasiados intentos de inicio de sesión. Intenta más tarde.",
        429,
        { retryAfterSeconds: limit.retryAfterSeconds }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return errorResponse("VALIDATION_ERROR", "Body JSON invalido", 400);
    }

    const payload = body as Record<string, unknown>;
    const email = typeof payload.email === "string" ? payload.email.trim() : "";
    const password = typeof payload.password === "string" ? payload.password : "";

    if (!email || !password) {
      return errorResponse("VALIDATION_ERROR", "email y password son requeridos", 400);
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(ENV.SUPABASE_URL(), ENV.SUPABASE_ANON_KEY(), {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options });
          });
        },
      },
    });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return errorResponse("AUTH_ERROR", error.message, 401);
    }

    const userId = data.user?.id ?? null;
    const scope = userId ? await resolveAuthScope(supabase, userId) : null;
    const redirectTo = scope ? getAuthLandingPath(scope) : "/dashboard";

    return successResponse(
      {
        userId: data.user?.id ?? null,
        hasSession: Boolean(data.session),
        redirectTo,
        isPlatformAdmin: Boolean(scope?.isPlatformAdmin),
        pymeStatus: scope?.pymeStatus ?? null,
      },
      "Login exitoso",
      200
    );
  } catch (error: unknown) {
    console.error("Error en POST /api/auth/login:", error);
    return errorResponse("INTERNAL_ERROR", "Error interno del servidor", 500);
  }
}
