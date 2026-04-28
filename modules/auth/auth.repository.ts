import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { PymeRole } from "./auth.types";

export const AuthRepository = {
  async signUp(email: string, password: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      const err = new Error(error.message) as Error & {
        code?: string;
        status?: number;
      };
      err.code = "AUTH_ERROR";
      err.status = 400;
      throw err;
    }
    return data.user;
  },

  async createPyme(name: string, ownerId: string) {
    const db = createServiceRoleClient("public");
    const { data, error } = await db
      .from("pyme")
      .insert({ name, owner_id: ownerId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async createPymeMember(pymeId: string, userId: string, role: PymeRole) {
    const db = createServiceRoleClient("public");
    const { error } = await db
      .from("pyme_user")
      .insert({ pyme_id: pymeId, user_id: userId, role });
    if (error) throw error;
  },

  async getPymeById(pymeId: string) {
    const db = createServiceRoleClient("public");
    const { data, error } = await db
      .from("pyme")
      .select("name")
      .eq("id", pymeId)
      .single();
    if (error) throw error;
    return data;
  },
};
