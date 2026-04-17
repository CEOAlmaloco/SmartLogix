-- Schema de Inventario
CREATE SCHEMA IF NOT EXISTS inventory_schema;

-- Tabla `item`
CREATE TABLE inventory_schema.item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pyme_id UUID NOT NULL REFERENCES public.pyme(id),
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  warehouse TEXT NOT NULL DEFAULT 'principal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pyme_id, sku)
);

-- Schema de Pedidos
CREATE SCHEMA IF NOT EXISTS order_schema;

-- Tabla `order`
CREATE TABLE order_schema.order (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pyme_id UUID NOT NULL REFERENCES public.pyme(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'dispatched', 'cancelled')),
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schema de Envios
CREATE SCHEMA IF NOT EXISTS shipment_schema;

-- Tabla `shipment`
CREATE TABLE shipment_schema.shipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pyme_id UUID NOT NULL REFERENCES public.pyme(id),
  order_id UUID NOT NULL REFERENCES order_schema.order(id),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_transit', 'delivered')),
  carrier TEXT,
  tracking_code TEXT,
  estimated_delivery DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);