# SmartLogix

Plataforma logistica para PYMEs eCommerce: inventario, pedidos y envios, con un monolito modular en Next.js + Supabase.

**Stack:** Next.js (App Router) + TypeScript + Supabase (Postgres + Auth + RLS) + Vercel.

---

## Arbol

```text
smartlogix/
├── app/
│   ├── api/                      # BFF: solo entrypoints HTTP, sin logica
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── register/route.ts
│   │   ├── inventory/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── shipments/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── (views)/                  
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── dashboard.module.css
│   │       ├── inventory/page.tsx
│   │       ├── order/page.tsx
│   │       └── shipment/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── page.module.css
│
├── modules/                      # Microservicios logicos (1 carpeta = 1 dominio)
│   ├── auth/
│   │   ├── auth.handler.ts       # Controller (orquesta y aplica reglas)
│   │   ├── auth.repository.ts    # Repository (acceso a datos)
│   │   ├── auth.types.ts         # DTOs / tipos del dominio
│   │   └── auth.validator.ts     # Validador unico del dominio
│   ├── inventory/
│   │   ├── inventory.handler.ts
│   │   ├── inventory.repository.ts
│   │   ├── inventory.types.ts
│   │   └── inventory.validator.ts
│   ├── orders/
│   │   ├── orders.handler.ts
│   │   ├── orders.repository.ts
│   │   ├── orders.types.ts
│   │   └── orders.validator.ts
│   └── shipments/
│       ├── shipments.handler.ts
│       ├── shipments.repository.ts
│       ├── shipments.types.ts
│       └── shipments.validator.ts
│
├── lib/                          # Infraestructura compartida (lo justo)
│   ├── supabase/
│   │   ├── server.ts             # cliente service_role (servidor) + middleware util
│   │   ├── browser.ts            # clientes anon (cliente)
│   │   └── factory.ts            # Factory method por schema
│   ├── http/
│   │   └── circuit-breaker.ts    # Circuit breaker para APIs externas
│   ├── auth.ts                   # getAuthenticatedUser (BFF guard)
│   └── shared.ts                 # HandlerError, successResponse, errorResponse
│
├── components/                   # UI: unica carpeta, sin _components duplicados
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── TextField.tsx
│   │   └── StatusMessage.tsx
│   ├── auth/
│   │   ├── AuthForm.tsx
│   │   └── AuthPageLayout.tsx
│   ├── dashboard/
│   │   ├── MobileMenu.tsx
│   │   ├── LogoutButton.tsx
│   │   └── inventory/
│   │       ├── InventoryForm.tsx
│   │       ├── InventoryStats.tsx
│   │       ├── InventoryTable.tsx
│   │       └── hooks/useInventory.ts
│   └── home/
│       ├── HomeNavbar.tsx
│       ├── HomeHero.tsx
│       ├── HomeBenefits.tsx
│       ├── HomeFlow.tsx
│       └── HomeCTA.tsx
│
├── db/
│   └── migrations/
│       ├── 001_schemas_tables.sql
│       ├── 002_triggers_indices_funciones.sql
│       └── 003_rls_grants.sql
│
├── config/
│   ├── constants.ts              # SCHEMAS, ORDER_STATUS, SHIPMENT_STATUS, etc.
│   └── env.ts                    # Acceso centralizado a process.env
│
├── middleware.ts                 # refresca sesion Supabase en Edge
├── next-env.d.ts
├── next.config.ts
├── package.json
└── tsconfig.json
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

---

## Reglas que se sostienen solas

- **`app/api/` no tiene logica.** Solo: leer body, llamar al handler del modulo, devolver JSON.
- **Cada dominio se basta solo.** Si un cambio en `orders` rompe `inventory`, algo esta mal.
- **El validador del dominio es unico** (`<x>.validator.ts`). Si una regla aplica en otro lado, llaman a esa funcion, no la copian.
- **`lib/` solo guarda lo verdaderamente compartido.** Si algo es de un dominio, va al modulo.
- **Sin Observer / Pub-Sub / Singleton manual** hasta que un caso real lo pida. Ya hay `useState`, modulos ESM y RLS para eso.

## Setup local

### Requisitos
- Node.js 20 LTS o superior
- npm 10+
- Cuenta Supabase con un proyecto creado

### Pasos

```powershell
# 1. Clonar
git clone https://github.com/CEOAlmaloco/SmartLogix.git
cd SmartLogix

# 2. Instalar dependencias
npm install

# 3. Crear .env.local con tus credenciales (ver .env.local.example)
copy .env.local.example .env.local

# 4. Aplicar migraciones SQL en Supabase (ver db/migrations/)

# 5. Levantar dev server
npm run dev
```

Abre `http://localhost:3000`.

### Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

- Las dos `NEXT_PUBLIC_*` son visibles en cliente; usalas con RLS estricto.
- `SUPABASE_SERVICE_ROLE_KEY` es **solo servidor**; nunca exponerla en `NEXT_PUBLIC_*`.

### Scripts npm

| Comando | Que hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de produccion |
| `npm start` | Sirve el build de produccion |
| `npm run lint` | ESLint sobre todo el repo |
| `npm audit` | Reporte de vulnerabilidades (objetivo: 0) |

---

## Base de datos (Supabase)

Schemas separados por dominio para aislar permisos y tablas:

- `public` → `pyme`, `pyme_user`
- `inventory_schema` → `item`
- `order_schema` → `order`
- `shipment_schema` → `shipment`

Las migraciones viven en `db/migrations/` y se aplican en orden:

1. `001_schemas_tables.sql` — crea schemas + tablas + columnas.
2. `002_triggers_indices_funciones.sql` — triggers de `updated_at`, indices, funciones helper.
3. `003_rls_grants.sql` — politicas RLS y permisos por schema.

> Aplicalas pegandolas en **Supabase → SQL Editor** (o con `supabase db push` si usas Supabase CLI).

---

## Estrategia de ramas (Git Flow simplificado)

### Ramas principales
- `main` — produccion (estable, deploy automatico)
- `develop` — integracion del equipo

### Ramas de trabajo (creadas desde `develop`)
- `feature/<nombre>` — nueva funcionalidad
- `fix/<nombre>` — bugfix
- `chore/<nombre>` — tareas tecnicas (deps, docs, configs)
- `refactor/<nombre>` — refactor sin cambios de comportamiento

#### Ejemplos
- `feature/orders-pdf-export`
- `fix/register-validation`
- `chore/upgrade-next`
- `refactor/structure-mvp`

### Flujo

```bash
# 1. Comenzar
git checkout develop
git pull origin develop
git checkout -b feature/mi-funcionalidad

# 2. Trabajar y commitear
git add .
git commit -m "feat: agrega validacion de SKU"

# 3. Subir y abrir PR
git push -u origin feature/mi-funcionalidad
# Pull Request: feature/* -> develop  (requiere 1 aprobacion)

# 4. Promocion a produccion
# Pull Request: develop -> main
```

### Convencion de commits (Conventional Commits)

Formato: `tipo: descripcion`

| Tipo | Cuando |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Correccion de bug |
| `refactor` | Mejora de codigo sin cambio de comportamiento |
| `chore` | Tareas internas (deps, build, configs) |
| `docs` | Solo documentacion |
| `test` | Solo tests |

Ejemplos:
- `feat: agrega endpoint POST /api/shipments`
- `fix: corrige transicion de estado pending -> approved`
- `refactor: extrae validaciones a inventory.validator.ts`

### Proteccion de ramas

| Rama | Reglas |
|---|---|
| `main` | PR obligatorio · 1 aprobacion · sin push directo · CI verde |
| `develop` | PR obligatorio recomendado · CI verde |

### Checklist antes de un PR

- [ ] `npm run build` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] `npm audit` sin vulnerabilidades altas
- [ ] No rompe funcionalidades existentes
- [ ] Commits siguen Conventional Commits
- [ ] Rama actualizada con `develop`

---

## Buenas practicas del equipo

- No trabajar directamente en `main` ni `develop`.
- PRs pequeños y enfocados (idealmente < 400 lineas modificadas).
- Mensajes de commit descriptivos en presente (`feat: agrega ...`, no `agregue ...`).
- Eliminar la rama remota despues del merge.
- Si una regla de validacion aplica en dos modulos, **vive en el del dueno** y el otro la importa. **No copiar.**
- Si algo no es claramente compartido, **no va a `lib/`**.

---

## Seguridad y deps

- `npm audit` debe quedar en **0 vulnerabilidades**.
- Override actual en `package.json` para forzar `postcss >= 8.5.12` (cierra el moderate transitivo).
- No subir `.env` ni `.env.local` (ya estan en `.gitignore`).

---

## Licencia

Ver `LICENSE`.
