-- Activar la politica de Row Level Security en las Tablas

ALTER TABLE public.pyme ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyme_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_schema.item ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_schema.order ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_schema.shipment ENABLE ROW LEVEL SECURITY;

-- Politicas para public.pyme

CREATE POLICY "usuario ve su propia pyme"
ON public.pyme FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "usuario crea su pyme"
ON public.pyme FOR INSERT
WITH CHECK (owner_id = auth.uid());

-- Politicas para public.pyme_user

CREATE POLICY "usuario ve su propia membresía"
ON public.pyme_user FOR SELECT
USING (user_id = auth.uid());

-- Politicas para inventory_schema.item

CREATE POLICY "usuario gestiona el inventario de su pyme"
ON inventory_schema.item FOR ALL
USING (
  pyme_id IN (
    SELECT pyme_id
    FROM public.pyme_user
    WHERE user_id = auth.uid()
  )
);

-- Politicas para order_schema.order

CREATE POLICY "usuario gestiona los pedidos de su pyme"
ON order_schema.order FOR ALL
USING (
  pyme_id IN (
    SELECT pyme_id
    FROM public.pyme_user
    WHERE user_id = auth.uid()
  )
);

-- Politicas para shipment_schema.shipment

CREATE POLICY "usuario gestiona los envios de su pyme"
ON order_schema.order FOR ALL
USING (
  pyme_id IN (
    SELECT pyme_id
    FROM public.pyme_user
    WHERE user_id = auth.uid()
  )
);