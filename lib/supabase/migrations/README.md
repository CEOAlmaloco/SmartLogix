## Migraciones

Los archivos se ejecutan en orden numérico en el **SQL Editor** de Supabase.

| Archivo | Descripción |
|---|---|
| 001_schemas_and_tables.sql | Esquemas y tablas por dominio |
| 002_multitenant.sql | Modelo multi-tenant y roles |
| 003_rls_policies.sql | Politicas RLS por tenant (PYME) |

Para rollback básico: eliminar los esquemas y tablas en orden inverso.