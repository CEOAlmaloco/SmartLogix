# Integraciones simuladas (EV3)

SmartLogix separa el **core logístico** (monorepo Next.js + Supabase) de las **integraciones externas** simuladas mediante un microservicio Docker.

## Microservicio: marketplace-adapter

| Aspecto | Detalle |
|---------|---------|
| Carpeta | `services/marketplace-adapter/` |
| Puerto | `3001` |
| Base de datos | PostgreSQL en Docker (`localhost:5433`) |
| Propósito | Simular listados y sincronización con un marketplace |

### Arranque local

```bash
docker compose up --build
```

### Pruebas rápidas

```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/listings
```

### Relación con el BFF

El BFF principal sigue en Next.js (`:3000`). El adaptador es un **segundo servicio** desplegable de forma independiente, alineado al enfoque de microservicios del caso semestral.

Conexión futura desde el monorepo:

```env
MARKETPLACE_ADAPTER_URL=http://localhost:3001
```

El `CircuitBreaker` en `lib/http/circuit-breaker.ts` puede envolver las llamadas HTTP al adaptador.

## Documentación API

- BFF interno: `docs/api/openapi.yaml`
- Adaptador: ver `services/marketplace-adapter/README.md`