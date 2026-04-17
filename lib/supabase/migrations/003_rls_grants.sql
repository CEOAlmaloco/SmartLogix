-- SmartLogix — Paso 3 de 3: Row Level Security + permisos PostgREST
-- Ejecutar después de 02_triggers_indices_y_funciones.sql
--
-- Políticas multi-tenant: el usuario solo ve/gestiona datos de PYMEs donde es miembro.

ALTER TABLE public.pyme ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyme_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_schema.item ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_schema."order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_schema.shipment ENABLE ROW LEVEL SECURITY;

-- pyme: el dueño ve y crea su registro
CREATE POLICY "pyme_select_owner"
  ON public.pyme FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "pyme_insert_owner"
  ON public.pyme FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "pyme_update_owner"
  ON public.pyme FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- pyme_user: cada usuario ve sus membresías
CREATE POLICY "pyme_user_select_self"
  ON public.pyme_user FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "pyme_user_insert_owner"
  ON public.pyme_user FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pyme p
      WHERE p.id = pyme_id AND p.owner_id = auth.uid()
    )
  );

-- Dominios: mismo patrón por pyme_id vía pyme_user
CREATE POLICY "item_by_membership"
  ON inventory_schema.item FOR ALL
  USING (
    pyme_id IN (
      SELECT pu.pyme_id FROM public.pyme_user pu WHERE pu.user_id = auth.uid()
    )
  )
  WITH CHECK (
    pyme_id IN (
      SELECT pu.pyme_id FROM public.pyme_user pu WHERE pu.user_id = auth.uid()
    )
  );

CREATE POLICY "order_by_membership"
  ON order_schema."order" FOR ALL
  USING (
    pyme_id IN (
      SELECT pu.pyme_id FROM public.pyme_user pu WHERE pu.user_id = auth.uid()
    )
  )
  WITH CHECK (
    pyme_id IN (
      SELECT pu.pyme_id FROM public.pyme_user pu WHERE pu.user_id = auth.uid()
    )
  );

CREATE POLICY "shipment_by_membership"
  ON shipment_schema.shipment FOR ALL
  USING (
    pyme_id IN (
      SELECT pu.pyme_id FROM public.pyme_user pu WHERE pu.user_id = auth.uid()
    )
  )
  WITH CHECK (
    pyme_id IN (
      SELECT pu.pyme_id FROM public.pyme_user pu WHERE pu.user_id = auth.uid()
    )
  );

-- ── PostgREST (Supabase Data API): permisos sobre esquemas custom ─────
GRANT USAGE ON SCHEMA inventory_schema TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA order_schema TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA shipment_schema TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA inventory_schema TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA order_schema TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA shipment_schema TO anon, authenticated, service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA inventory_schema TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA order_schema TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA shipment_schema TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA inventory_schema
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA order_schema
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA shipment_schema
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
