# Documentación SmartLogix

Índice de la documentación técnica del BFF (API REST).

| Archivo | Descripción |
|---------|-------------|
| [api/openapi.yaml](./api/openapi.yaml) | Especificación OpenAPI 3.0 (Swagger) |
| [api/smartlogix.postman_collection.json](./api/smartlogix.postman_collection.json) | Colección Postman importable |
| [integraciones.md](./integraciones.md) | Microservicio Docker marketplace-adapter |

## Cómo usar

### Swagger / OpenAPI

1. Abrir [Swagger Editor](https://editor.swagger.io/) o VS Code con extensión OpenAPI.
2. Cargar `docs/api/openapi.yaml`.
3. Servidor por defecto: `http://localhost:3000` (`npm run dev`).

### Postman

1. Postman → **Import** → seleccionar `docs/api/smartlogix.postman_collection.json`.
2. Variable de colección `baseUrl`: `http://localhost:3000`.
3. Ejecutar **Auth → Login** primero; las cookies de sesión se reutilizan en el resto de requests.

## Autenticación

La mayoría de endpoints requieren sesión Supabase (cookie). Flujo recomendado:

1. `POST /api/auth/register` — registro de dueño de PYME (público).
2. `POST /api/auth/login` — inicia sesión y establece cookies.
3. Llamar a `/api/inventory`, `/api/orders`, `/api/shipments` (rol `owner`).
4. `/api/platform/*` requiere rol `platform_admin`.

## Formato de respuesta

**Éxito:**

```json
{
  "data": {},
  "message": "Operación exitosa"
}
```

**Error:**

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Descripción del error",
  "details": {}
}
```
