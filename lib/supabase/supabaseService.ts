import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase con service_role: usar solo en Route Handlers / servidor.
 * Un cliente por esquema PostgreSQL materializa el límite de dominio
 * (Inventario | Pedidos | Envíos) y mantiene el contrato de microservicios
 * lógicos de SmartLogix sin acoplar tablas entre contextos.
 */
export function createServiceRoleClient(schema: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: { schema },
    }
  );
}
