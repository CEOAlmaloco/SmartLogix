import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { errorResponse, successResponse } from "@/lib/shared";

export async function POST(request: Request) {
  try {
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

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options });
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return errorResponse("AUTH_ERROR", error.message, 401);
    }

    return successResponse(
      {
        userId: data.user?.id ?? null,
        hasSession: Boolean(data.session),
      },
      "Login exitoso",
      200
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    return errorResponse("INTERNAL_ERROR", err.message ?? "Error interno del servidor", 500);
  }
}
