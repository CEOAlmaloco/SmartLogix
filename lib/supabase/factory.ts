import { createClient } from "@supabase/supabase-js";
import { ENV } from "@/config/env";

/**
 * Factory Method: crea un cliente Supabase con service_role apuntado a un schema.
 * Cada dominio (inventory_schema, order_schema, shipment_schema, public) usa su propio
 * cliente sin compartir estado entre schemas.
 *
 * @example
 *   const db = createSupabaseClientForSchema("inventory_schema");
 */
export function createSupabaseClientForSchema(schema: string) {
  const url = ENV.SUPABASE_URL();
  const key = ENV.SUPABASE_SERVICE_ROLE_KEY();
  return createClient(url, key, { db: { schema } });
}
