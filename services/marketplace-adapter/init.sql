-- Base de datos del microservicio marketplace-adapter (PostgreSQL independiente de Supabase)

CREATE TABLE IF NOT EXISTS marketplace_listing (
  id SERIAL PRIMARY KEY,
  external_sku VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  marketplace VARCHAR(50) NOT NULL DEFAULT 'mercadolibre',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sync_log (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(100) NOT NULL,
  external_ref VARCHAR(100),
  status VARCHAR(50) NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO marketplace_listing (external_sku, title, price, stock, marketplace)
VALUES
  ('ML-SKU-001', 'Caja mediana reforzada', 1990.00, 120, 'mercadolibre'),
  ('ML-SKU-002', 'Sobre acolchado A4', 890.00, 500, 'mercadolibre'),
  ('AMZ-SKU-010', 'Pack 10 cajas', 15990.00, 45, 'amazon')
ON CONFLICT (external_sku) DO NOTHING;
