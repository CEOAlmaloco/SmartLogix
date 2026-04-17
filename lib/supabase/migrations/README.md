# Migraciones SQL (SmartLogix)

Los scripts están en esta carpeta y **se aplican en orden** en el SQL Editor del proyecto de Supabase (basta con copiar y ejecutar cada archivo; no se exige CLI).

| Archivo | Qué hace |
|---------|----------|
| `001_schemas_tables.sql` | Crea `inventory_schema`, `order_schema`, `shipment_schema` y las tablas: `pyme`, `pyme_user`, `item`, `"purchase_order"`, `shipment`. |
| `002_triggers_indices_funciones.sql` | Añade el trigger que alinea pedido y envío por `pyme_id`, los triggers de `updated_at` en las tablas de dominio y los índices por tenant/pedido. |
| `003_rls_grants.sql` | Activa RLS en esas tablas, define las políticas por membresía en `pyme_user` y deja los `GRANT` para anon, authenticated y service_role. |

Antes de usar la Data API, en **Settings → API → Exposed schemas** deben constar, además de `public`, los tres esquemas de dominio anteriores.

Para revertir en un entorno de prueba, lo habitual es ir al revés del orden de creación (políticas primero, luego tablas y esquemas), para no dejar objetos sueltos; en producción no se deshace un despliegue así sin revisarlo antes.
