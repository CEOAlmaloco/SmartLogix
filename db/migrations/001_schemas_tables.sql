/**
  SmartLogix — Paso 1 de 3: esquemas y tablas
  Ejecutar en Supabase → SQL Editor (proyecto vacío o tras borrar objetos previos del mismo modelo)

  Siguiente archivo: 02_triggers_indices_y_funciones.sql

  Dashboard: Settings → API → Exposed schemas:
    public, inventory_schema, order_schema, shipment_schema
**/

DROP TABLE IF EXISTS public.pyme CASCADE;
DROP TABLE IF EXISTS public.pyme_user CASCADE;
DROP TABLE IF EXISTS inventory_schema.item CASCADE;
DROP TABLE IF EXISTS order_schema.purchase_order CASCADE;
DROP TABLE IF EXISTS shipment_schema.shipment CASCADE;
DROP SCHEMA IF EXISTS order_schema CASCADE;
DROP SCHEMA IF EXISTS shipment_schema CASCADE;
DROP SCHEMA IF EXISTS inventory_schema CASCADE;

-- Multi Tenant
CREATE TABLE public.pyme (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.pyme_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pyme_id UUID NOT NULL REFERENCES public.pyme (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin'
    CHECK (role IN ('owner', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (pyme_id, user_id)
);

-- Inventario
CREATE SCHEMA IF NOT EXISTS inventory_schema;

CREATE TABLE inventory_schema.item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pyme_id UUID NOT NULL REFERENCES public.pyme (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  warehouse TEXT NOT NULL DEFAULT 'principal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (pyme_id, sku)
);

-- Pedidos
CREATE SCHEMA IF NOT EXISTS order_schema;

CREATE TABLE order_schema.purchase_order (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pyme_id UUID NOT NULL REFERENCES public.pyme (id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'dispatched', 'cancelled')),
  total NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Envios
CREATE SCHEMA IF NOT EXISTS shipment_schema;

CREATE TABLE shipment_schema.shipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pyme_id UUID NOT NULL REFERENCES public.pyme (id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES order_schema.purchase_order (id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_transit', 'delivered', 'cancelled')),
  carrier TEXT,
  tracking_code TEXT,
  estimated_delivery DATE,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
