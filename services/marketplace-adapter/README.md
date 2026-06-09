# Marketplace Adapter (microservicio Docker)

Adaptador **simulado** de marketplace externo para la demo EV3. Corre en un contenedor aparte del monorepo Next.js y usa **su propia base PostgreSQL**.

## Arquitectura

```text
SmartLogix (Next.js BFF :3000)  ----HTTP---->  marketplace-adapter (:3001)
                                                      |
                                                      v
                                              PostgreSQL (:5433)
```

## Endpoints


| Método | Ruta              | Descripción                                       |
| ------ | ----------------- | ------------------------------------------------- |
| GET    | `/health`         | Health check + estado de la DB                    |
| GET    | `/api/listings`   | Productos publicados en el marketplace (desde DB) |
| POST   | `/api/sync-order` | Simula sync de un pedido; guarda en `sync_log`    |
| GET    | `/api/sync-log`   | Últimas sincronizaciones                          |


## Levantar con Docker (recomendado)

Desde la **raíz del repo** SmartLogix:

```bash
docker compose up --build
```

Verificar (bash / Git Bash):

```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/listings
```

Ejemplo sync (bash):

```bash
curl -X POST http://localhost:3001/api/sync-order \
  -H "Content-Type: application/json" \
  -d '{"orderId":"ORD-001","customerEmail":"cliente@test.com","total":15000}'
```

### Probar en PowerShell (Windows)

En PowerShell, `curl` es un **alias de `Invoke-WebRequest`**, no el curl de Linux. Por eso fallan `-X`, `-H` y `-d`.

**Opción recomendada — `Invoke-RestMethod`:**

```powershell
# Health
Invoke-RestMethod http://localhost:3001/health

# Listings
Invoke-RestMethod http://localhost:3001/api/listings

# Sync de pedido (POST)
$body = @{
  orderId       = "ORD-001"
  customerEmail = "cliente@test.com"
  total         = 15000
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3001/api/sync-order `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

# Historial de sincronizaciones
Invoke-RestMethod http://localhost:3001/api/sync-log
```

**Alternativa — `curl.exe` (con extensión `.exe`):**

```powershell
curl.exe http://localhost:3001/health
curl.exe http://localhost:3001/api/listings

curl.exe -X POST http://localhost:3001/api/sync-order `
  -H "Content-Type: application/json" `
  -d '{"orderId":"ORD-001","customerEmail":"cliente@test.com","total":15000}'
```

> Usa comillas **simples** `'...'` en el JSON con `curl.exe`. Con comillas dobles y `\"` PowerShell suele romper el body y el servidor responde `JSON inválido`.

| Comando | ¿Funciona en PowerShell? |
|---------|--------------------------|
| `curl -X POST ...` | ❌ No (es `Invoke-WebRequest`) |
| `curl.exe -X POST ...` | ✅ Sí |
| `Invoke-RestMethod ...` | ✅ Sí (recomendado) |

## Levantar sin Docker (solo Node)

1. Tener PostgreSQL en `localhost:5433` con credenciales del `docker-compose.yml`.
2. Ejecutar `init.sql` manualmente.
3. En esta carpeta:

```bash
npm install
set DATABASE_URL=postgres://marketplace:marketplace@localhost:5433/marketplace_db
npm run dev
```

## Variables de entorno


| Variable       | Default     | Descripción               |
| -------------- | ----------- | ------------------------- |
| `PORT`         | `3001`      | Puerto HTTP del adaptador |
| `DATABASE_URL` | ver compose | Conexión PostgreSQL       |


## Detener

```bash
docker compose down
# con volúmenes: docker compose down -v
```

