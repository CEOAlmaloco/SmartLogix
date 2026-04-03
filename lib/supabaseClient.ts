import { createClient } from "@supabase/supabase-js";

type OrderSchemaClient = ReturnType<
  typeof createClient<any, "order_schema">
>;

let browserClient: OrderSchemaClient | null = null;

/** Cliente anon para el navegador; se crea solo al usarlo (evita fallos en build/SSR sin .env). */
export function getSupabaseBrowserClient(): OrderSchemaClient {
  if (!browserClient) {
    browserClient = createClient<any, "order_schema">(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        db: {
          schema: "order_schema",
        },
      }
    );
  }
  return browserClient;
}
