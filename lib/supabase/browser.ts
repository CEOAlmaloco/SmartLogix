import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PUBLIC_ENV } from "@/config/env";

let publicBrowserClient: SupabaseClient | null = null;
let authBrowserClient: SupabaseClient | null = null;

/**
 * Cliente anon para el navegador. Apunta al schema por defecto.
 * Se usa para queries directas desde componentes "use client".
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (!publicBrowserClient) {
    if (!PUBLIC_ENV.SUPABASE_URL || !PUBLIC_ENV.SUPABASE_ANON_KEY) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }

    publicBrowserClient = createClient(PUBLIC_ENV.SUPABASE_URL, PUBLIC_ENV.SUPABASE_ANON_KEY);
  }
  return publicBrowserClient;
}

/**
 * Cliente anon dedicado a flujos de auth (signOut, sesion local).
 */
export function getSupabaseAuthBrowserClient(): SupabaseClient {
  if (!authBrowserClient) {
    if (!PUBLIC_ENV.SUPABASE_URL || !PUBLIC_ENV.SUPABASE_ANON_KEY) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }

    authBrowserClient = createClient(PUBLIC_ENV.SUPABASE_URL, PUBLIC_ENV.SUPABASE_ANON_KEY);
  }
  return authBrowserClient;
}
