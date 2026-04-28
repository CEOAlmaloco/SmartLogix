import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let publicBrowserClient: SupabaseClient | null = null;
let authBrowserClient: SupabaseClient | null = null;

/**
 * Cliente anon para el navegador. Apunta al schema por defecto.
 * Se usa para queries directas desde componentes "use client".
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (!publicBrowserClient) {
    publicBrowserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return publicBrowserClient;
}

/**
 * Cliente anon dedicado a flujos de auth (signOut, sesion local).
 */
export function getSupabaseAuthBrowserClient(): SupabaseClient {
  if (!authBrowserClient) {
    authBrowserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return authBrowserClient;
}
