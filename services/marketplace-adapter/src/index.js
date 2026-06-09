const express = require("express");
const { getPool, checkConnection } = require("./db");

const PORT = Number(process.env.PORT) || 3001;
// Token compartido entre el BFF y el adaptador. Si no se define, las rutas de
// datos quedan abiertas SOLO para facilitar la demo local (no usar en prod).
const API_TOKEN = process.env.ADAPTER_API_TOKEN || "";

const app = express();

// No revelar el framework subyacente (fingerprinting).
app.disable("x-powered-by");

// Límite de tamaño del body para evitar abuso/DoS.
app.use(express.json({ limit: "100kb" }));

// JSON malformado: responder limpio, sin filtrar stack trace.
app.use((err, _req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "JSON inválido" });
  }
  if (err && err.type === "entity.too.large") {
    return res.status(413).json({ code: "PAYLOAD_TOO_LARGE", message: "Body demasiado grande" });
  }
  return next(err);
});

/** Exige Bearer token en las rutas de datos cuando ADAPTER_API_TOKEN está definido. */
function requireToken(req, res, next) {
  if (!API_TOKEN) return next();
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token !== API_TOKEN) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Token inválido o ausente" });
  }
  next();
}

app.get("/health", async (_req, res) => {
  try {
    const dbOk = await checkConnection();
    res.json({
      status: "ok",
      service: "marketplace-adapter",
      db: dbOk ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "degraded",
      service: "marketplace-adapter",
      db: "disconnected",
      error: error.message,
    });
  }
});

/** Listados simulados del marketplace (persistidos en PostgreSQL del microservicio). */
app.get("/api/listings", requireToken, async (_req, res) => {
  try {
    const result = await getPool().query(
      `SELECT id, external_sku, title, price, stock, marketplace, created_at
       FROM marketplace_listing
       ORDER BY id ASC`
    );
    res.json({ data: result.rows, count: result.rowCount });
  } catch (error) {
    res.status(500).json({ code: "DB_ERROR", message: error.message });
  }
});

/**
 * Simula sincronizar un pedido de SmartLogix hacia el marketplace externo.
 * Guarda un registro en sync_log y devuelve una referencia externa ficticia.
 */
app.post("/api/sync-order", requireToken, async (req, res) => {
  const { orderId, customerEmail, total, items } = req.body ?? {};

  if (!orderId || !customerEmail) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "orderId y customerEmail son requeridos",
    });
  }

  const externalRef = `MP-${Date.now()}`;
  const payload = { orderId, customerEmail, total, items };

  try {
    const insert = await getPool().query(
      `INSERT INTO sync_log (order_id, external_ref, status, payload)
       VALUES ($1, $2, $3, $4::jsonb)
       RETURNING id, order_id, external_ref, status, created_at`,
      [orderId, externalRef, "synced", JSON.stringify(payload)]
    );

    res.status(201).json({
      data: {
        ...insert.rows[0],
        marketplace: "mercadolibre",
        message: "Pedido sincronizado (simulado)",
      },
    });
  } catch (error) {
    res.status(500).json({ code: "DB_ERROR", message: error.message });
  }
});

/** Historial de sincronizaciones (demo de lectura desde la DB del microservicio). */
app.get("/api/sync-log", requireToken, async (_req, res) => {
  try {
    const result = await getPool().query(
      `SELECT id, order_id, external_ref, status, payload, created_at
       FROM sync_log
       ORDER BY created_at DESC
       LIMIT 50`
    );
    res.json({ data: result.rows, count: result.rowCount });
  } catch (error) {
    res.status(500).json({ code: "DB_ERROR", message: error.message });
  }
});

// Handler de error final: nunca exponer stack traces al cliente.
app.use((err, _req, res, _next) => {
  console.error("[marketplace-adapter] error no controlado:", err);
  res.status(500).json({ code: "INTERNAL_ERROR", message: "Error interno del servidor" });
});

async function start() {
  const retries = 10;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await checkConnection();
      console.log("[marketplace-adapter] PostgreSQL conectado");
      break;
    } catch (error) {
      if (attempt === retries) {
        console.error("[marketplace-adapter] No se pudo conectar a la DB:", error.message);
        process.exit(1);
      }
      console.log(`[marketplace-adapter] Esperando DB (${attempt}/${retries})...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  app.listen(PORT, () => {
    console.log(`[marketplace-adapter] Escuchando en http://localhost:${PORT}`);
    console.log(`[marketplace-adapter] Health: http://localhost:${PORT}/health`);
  });
}

start();
