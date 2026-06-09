const { Pool } = require("pg");

let pool;

/**
 * @returns {import("pg").Pool}
 */
function getPool() {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL ||
      "postgres://marketplace:marketplace@localhost:5433/marketplace_db";

    pool = new Pool({ connectionString });
  }
  return pool;
}

async function checkConnection() {
  const client = await getPool().connect();
  try {
    await client.query("SELECT 1");
    return true;
  } finally {
    client.release();
  }
}

module.exports = { getPool, checkConnection };
