/**
SmartLogix — Paso 2 de 3: integridad tenant/pedido, updated_at, índices
Ejecutar después de 01_schema_y_tablas.sql

Siguiente archivo: 03_rls_y_grants.sql

Integridad cross-schema: el envío debe pertenecer al mismo tenant que el pedido.
**/

CREATE OR REPLACE FUNCTION shipment_schema.enforce_shipment_order_same_pyme()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM order_schema.purchase_order o
    WHERE o.id = NEW.order_id
      AND o.pyme_id = NEW.pyme_id
  ) THEN
    RAISE EXCEPTION 'shipment: order_id debe existir y compartir el mismo pyme_id';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_shipment_order_same_pyme ON shipment_schema.shipment;
CREATE TRIGGER trg_shipment_order_same_pyme
  BEFORE INSERT OR UPDATE OF order_id, pyme_id
  ON shipment_schema.shipment
  FOR EACH ROW
  EXECUTE PROCEDURE shipment_schema.enforce_shipment_order_same_pyme();

-- updated_at automático (reutilizable)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_item_updated ON inventory_schema.item;
CREATE TRIGGER trg_item_updated
  BEFORE UPDATE ON inventory_schema.item
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS trg_order_updated ON order_schema.purchase_order;
CREATE TRIGGER trg_order_updated
  BEFORE UPDATE ON order_schema.purchase_order
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS trg_shipment_updated ON shipment_schema.shipment;
CREATE TRIGGER trg_shipment_updated
  BEFORE UPDATE ON shipment_schema.shipment
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

-- Índices para consultas por tenant e integraciones
CREATE INDEX IF NOT EXISTS idx_item_pyme_id ON inventory_schema.item (pyme_id);
CREATE INDEX IF NOT EXISTS idx_order_pyme_id ON order_schema.purchase_order (pyme_id);
CREATE INDEX IF NOT EXISTS idx_order_status ON order_schema.purchase_order (pyme_id, status);
CREATE INDEX IF NOT EXISTS idx_shipment_pyme_id ON shipment_schema.shipment (pyme_id);
CREATE INDEX IF NOT EXISTS idx_shipment_order_id ON shipment_schema.shipment (order_id);


