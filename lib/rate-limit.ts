/**
 * @module lib/rate-limit
 * @description Rate limiter en memoria (ventana deslizante) para endpoints públicos.
 *
 * Nota: el estado vive en el proceso. En despliegues serverless con múltiples
 * instancias el límite es por instancia (mitigación, no garantía dura). Para
 * producción a escala, sustituir por un store compartido (Redis / Upstash).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Aplica un límite de `limit` solicitudes por `windowMs` para una clave dada.
 * @param key - Identificador (ej. `login:<ip>`).
 * @param limit - Máximo de solicitudes permitidas en la ventana.
 * @param windowMs - Tamaño de la ventana en milisegundos.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, retryAfterSeconds: 0 };
}

/** Extrae una IP aproximada desde las cabeceras del request (proxy/Vercel). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Limpia buckets expirados para evitar crecimiento de memoria sin cota. */
export function pruneRateLimitBuckets(): void {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}
