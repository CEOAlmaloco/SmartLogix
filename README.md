# SmartLogix

Plataforma logistica para PYMEs eCommerce: inventario, pedidos y envios, con un monolito modular en Next.js + Supabase.

**Stack:** Next.js (App Router) + TypeScript + Supabase (Postgres + Auth + RLS) + Vercel.

**Documentacion tecnica:** [docs/](./docs/) (OpenAPI, Postman, integraciones Docker).

---

## Arbol

```text
smartlogix/
├── app/
│   ├── api/                      # BFF: entrypoints HTTP (sin logica de negocio)
│   │   ├── auth/                 # login, register, logout
│   │   ├── inventory/
│   │   ├── orders/
│   │   ├── shipments/
│   │   ├── platform/             # admin global (platform_admin)
│   │   └── contact/              # formulario publico
│   ├── (views)/                  # paginas por ruta
│   │   ├── auth/                 # login, register, suspended
│   │   ├── dashboard/            # inventario, pedidos, envios (owner)
│   │   ├── platform/             # panel admin global
│   │   ├── legal/                # terminos, privacidad, etc. (content.tsx por ruta)
│   │   ├── contact/
│   │   ├── about/
│   │   └── blog/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # landing
│
├── modules/                      # Microservicios logicos (1 carpeta = 1 dominio)
│   ├── auth/
│   ├── inventory/
│   ├── orders/
│   ├── shipments/
│   ├── platform/
│   └── notifications/            # correo bienvenida (Brevo, opcional)
│
├── components/                   # UI reutilizable
│   ├── ui/
│   ├── auth/
│   ├── dashboard/
│   ├── home/
│   └── legal/
│
├── lib/                          # Infraestructura compartida
│   ├── supabase/                 # server, browser, factory (por schema)
│   ├── http/circuit-breaker.ts   # APIs externas (marketplaces, transportistas)
│   ├── rate-limit.ts             # login, register, contact
│   ├── auth.ts
│   └── shared.ts
│
├── __tests__/validators/         # Pruebas unitarias Vitest (reglas de negocio)
│
├── docs/
│   ├── api/openapi.yaml
│   ├── api/smartlogix.postman_collection.json
│   └── integraciones.md
│
├── services/
│   └── marketplace-adapter/      # Microservicio Docker simulado (:3001)
│
├── db/migrations/                # 001 schemas, 002 triggers, 003 RLS
├── config/                       # env, legal, contact, constants
├── docker-compose.yml            # adapter + PostgreSQL local (opcional)
├── env-ejemplo.md                # plantilla .env (copiar a .env.local)
├── middleware.ts
├── vitest.config.ts
└── vitest.setup.ts
```

---

## Como encajan los patrones

| Patron | Donde vive |
|---|---|
| **MVC** | View en `app/`, Controller en `modules/<x>/<x>.handler.ts`, Model en `modules/<x>/<x>.repository.ts` + Supabase |
| **BFF** | `app/api/<x>/route.ts`: solo recibe HTTP, llama al handler y responde JSON |
| **Repository** | `modules/<x>/<x>.repository.ts` (1 por dominio) |
| **Factory Method** | `lib/supabase/factory.ts`: un cliente Supabase por schema |
| **Circuit Breaker** | `lib/http/circuit-breaker.ts`: envuelve llamadas a APIs externas (transportistas, marketplaces) |

### Flujo de una peticion

```text
fetch("/api/inventory")
        │
        ▼
app/api/inventory/route.ts          ← BFF (lee body, devuelve JSON)
        │
        ▼
lib/auth.ts (getAuthenticatedUser)  ← guard de sesion + pyme_id
        │
        ▼
modules/inventory/inventory.handler.ts   ← Controller
        │
        ▼ (valida via inventory.validator.ts)
        ▼
modules/inventory/inventory.repository.ts  ← Repository
        │
        ▼
lib/supabase/factory.ts              ← Factory Method (cliente por schema)
        │
        ▼
Supabase (inventory_schema.item)
```

### Integraciones externas (simuladas)

```text
[Next.js BFF :3000]  ──(futuro)──►  [marketplace-adapter Docker :3001]
                                              │
                                              ▼
                                    PostgreSQL Docker (:5433)
```

El core en Vercel no levanta Docker. El adaptador es para demo local; ver [docs/integraciones.md](./docs/integraciones.md) y [services/marketplace-adapter/README.md](./services/marketplace-adapter/README.md).

---

## Reglas que se sostienen solas

- **`app/api/` no tiene logica.** Solo: leer body, llamar al handler del modulo, devolver JSON.
- **Cada dominio se basta solo.** Si un cambio en `orders` rompe `inventory`, algo esta mal.
- **El validador del dominio es unico** (`<x>.validator.ts`). Si una regla aplica en otro lado, llaman a esa funcion, no la copian.
- **`lib/` solo guarda lo verdaderamente compartido.** Si algo es de un dominio, va al modulo.
- **Textos legales** viven en `app/(views)/legal/<pagina>/content.tsx`, junto a su `page.tsx`.

---

## Setup local

### Requisitos

- Node.js 20 LTS o superior
- npm 10+
- Cuenta Supabase con un proyecto creado
- Docker Desktop (opcional, solo para marketplace-adapter)

### Pasos

```powershell
# 1. Clonar
git clone https://github.com/CEOAlmaloco/SmartLogix.git
cd SmartLogix

# 2. Instalar dependencias
npm install

# 3. Variables de entorno
copy env-ejemplo.md .env.local
notepad .env.local
# Obligatorias: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# 4. Migraciones SQL en Supabase → SQL Editor (orden):
#    db/migrations/001_schemas_tables.sql
#    db/migrations/002_triggers_indices_funciones.sql
#    db/migrations/003_rls_grants.sql

# 5. Dev server
npm run dev
```

Abre `http://localhost:3000`.

Plantilla de variables: **[env-ejemplo.md](./env-ejemplo.md)**.

### Docker (opcional)

```powershell
docker compose up -d
Invoke-RestMethod http://localhost:3001/health
```

---

## Scripts npm

| Comando | Que hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm start` | Sirve el build de produccion |
| `npm run lint` | ESLint |
| `npm run test` | Vitest en modo watch |
| `npm run test:run` | Vitest una ejecucion (CI / entrega) |
| `npm run test:ui` | Vitest UI |
| `npx vitest run --coverage` | Reporte de cobertura |
| `npm audit` | Vulnerabilidades (objetivo: 0) |

---

## Pruebas unitarias

Vitest sobre **validators** de negocio (`__tests__/validators/`): transiciones de estado, payloads y reglas de Platform.

```powershell
npm run test:run
```

Salida esperada: **5 archivos, 19 tests passed**.

---

## Base de datos (Supabase)

Schemas separados por dominio:

- `public` → `pyme`, `pyme_user`, `platform_admin`
- `inventory_schema` → `item` (campo `warehouse` por bodega)
- `order_schema` → `purchase_order`, `order_item`
- `shipment_schema` → `shipment` (campo `carrier`)

Migraciones en `db/migrations/` — aplicar en orden en **Supabase → SQL Editor**.

---

## Documentacion API

| Recurso | Ruta |
|---|---|
| OpenAPI / Swagger | [docs/api/openapi.yaml](./docs/api/openapi.yaml) |
| Postman | [docs/api/smartlogix.postman_collection.json](./docs/api/smartlogix.postman_collection.json) |
| Integraciones Docker | [docs/integraciones.md](./docs/integraciones.md) |
| Indice docs | [docs/README.md](./docs/README.md) |

---

## Estrategia de ramas (Git Flow simplificado)

### Ramas principales

- `main` — produccion (estable, deploy en Vercel)
- `develop` — integracion del equipo

### Ramas de trabajo (desde `develop`)

- `feature/<nombre>` — nueva funcionalidad
- `fix/<nombre>` — bugfix
- `chore/<nombre>` — deps, docs, configs
- `refactor/<nombre>` — refactor sin cambio de comportamiento

### Flujo

```powershell
git checkout develop
git pull origin develop
git checkout -b feature/mi-funcionalidad

git add .
git commit -m "feat: agrega validacion de SKU"
git push -u origin feature/mi-funcionalidad
# PR: feature/* -> develop (1 aprobacion)

# Promocion a produccion: PR develop -> main
```

### Convencion de commits

Formato: `tipo: descripcion` — `feat`, `fix`, `refactor`, `chore`, `docs`, `test`.

### Checklist antes de un PR

- [ ] `npm run build` sin errores
- [ ] `npm run test:run` pasa
- [ ] `npm audit` sin vulnerabilidades altas
- [ ] Commits en Conventional Commits
- [ ] Rama actualizada con `develop`

---

## Buenas practicas del equipo

- No trabajar directamente en `main` ni `develop`.
- PRs pequeños y enfocados.
- Si una regla de validacion aplica en dos modulos, **vive en el del dueno**; el otro la importa.
- Si algo no es claramente compartido, **no va a `lib/`**.
- No subir `.env.local` ni secretos (ver `.gitignore`).

---

## Seguridad

- Cabeceras de seguridad en `next.config.ts`
- Rate limiting en login, register y contact (`lib/rate-limit.ts`)
- RLS y grants minimos en `003_rls_grants.sql`
- `npm audit` objetivo: **0 vulnerabilidades**

---

## Licencia

Ver `LICENSE`.
