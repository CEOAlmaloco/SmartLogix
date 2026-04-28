/**
 * Circuit Breaker minimalista para llamadas a APIs externas (transportistas, marketplaces).
 *
 * Estados:
 *   - closed: deja pasar las llamadas y cuenta fallos.
 *   - open: rechaza inmediatamente hasta que pase el cooldown.
 *   - half-open: deja pasar 1 prueba para decidir si vuelve a closed.
 *
 * Uso esperado:
 *   const breaker = new CircuitBreaker({ failureThreshold: 5, cooldownMs: 30_000 });
 *   const data = await breaker.execute(() => fetch(url).then(r => r.json()));
 */

export type CircuitBreakerOptions = {
  failureThreshold?: number;
  cooldownMs?: number;
};

type State = "closed" | "open" | "half-open";

export class CircuitOpenError extends Error {
  constructor(message = "Circuit breaker is open") {
    super(message);
    this.name = "CircuitOpenError";
  }
}

export class CircuitBreaker {
  private state: State = "closed";
  private failures = 0;
  private nextAttemptAt = 0;
  private readonly failureThreshold: number;
  private readonly cooldownMs: number;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 5;
    this.cooldownMs = options.cooldownMs ?? 30_000;
  }

  async execute<T>(action: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() < this.nextAttemptAt) {
        throw new CircuitOpenError();
      }
      this.state = "half-open";
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = "closed";
  }

  private onFailure() {
    this.failures += 1;
    if (this.failures >= this.failureThreshold) {
      this.state = "open";
      this.nextAttemptAt = Date.now() + this.cooldownMs;
    }
  }

  getState(): State {
    return this.state;
  }
}
