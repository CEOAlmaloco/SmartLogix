import { createClient } from "@supabase/supabase-js";

/**
 * Factory Method: crea un cliente Supabase con service_role apuntado a un schema.
 * Cada dominio (inventory_schema, order_schema, shipment_schema, public) usa su propio
 * cliente sin compartir estado entre schemas.
 *
 * @example
 *   const db = createSupabaseClientForSchema("inventory_schema");
 */
export function createSupabaseClientForSchema(schema: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Faltan variables NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  return createClient(url, key, { db: { schema } });
}
