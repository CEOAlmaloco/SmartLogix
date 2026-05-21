import { HandlerError } from "@/lib/shared";
import type { UpdatePymePayload } from "./platform.types";

const VALID_STATUSES = ["active", "suspended", "pending_review"] as const;

export function validateUpdatePyme(payload: unknown): {
  valid: boolean;
  error?: string;
  data?: UpdatePymePayload;
} {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "Payload inválido" };
  }

  const candidate = payload as Record<string, unknown>;

  if (!candidate.status) {
    return { valid: false, error: "status es requerido" };
  }

  if (!VALID_STATUSES.includes(candidate.status as (typeof VALID_STATUSES)[number])) {
    return {
      valid: false,
      error: `status inválido. Valores permitidos: ${VALID_STATUSES.join(", ")}`,
    };
  }

  if (candidate.status === "suspended" && !candidate.suspended_reason) {
    return { valid: false, error: "suspended_reason es requerido al suspender una PYME" };
  }

  return { valid: true, data: candidate as UpdatePymePayload };
}

export function validatePymeId(pymeId: string | null | undefined): asserts pymeId is string {
  if (!pymeId) {
    throw new HandlerError("VALIDATION_ERROR", "El ID de la PYME es requerido", 400);
  }
}