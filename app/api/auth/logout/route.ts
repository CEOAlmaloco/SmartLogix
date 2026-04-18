import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { errorResponse, successResponse } from "@/lib/shared";

export async function POST() {
  try {
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

    const { error } = await supabase.auth.signOut();
    if (error) {
      return errorResponse("AUTH_ERROR", error.message, 400);
    }

    return successResponse({ ok: true }, "Sesion cerrada", 200);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return errorResponse("INTERNAL_ERROR", err.message ?? "Error cerrando sesion", 500);
  }
}
