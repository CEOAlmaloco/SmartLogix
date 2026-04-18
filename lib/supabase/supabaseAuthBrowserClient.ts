import { createClient } from "@supabase/supabase-js";

type BrowserAuthClient = ReturnType<typeof createClient>;

let browserClient: BrowserAuthClient | null = null;

export function getSupabaseAuthBrowserClient(): BrowserAuthClient {
  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return browserClient;
}
