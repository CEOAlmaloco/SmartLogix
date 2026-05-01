import { HandlerError } from "@/lib/shared";
import type { CreateShipmentInput, ShipmentStatus } from "./shipments.types";

export const VALID_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  pending: ["in_transit", "cancelled"],
  in_transit: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export function validatePymeId(pymeId: string | null | undefined): asserts pymeId is string {
  if (!pymeId) {
    throw new HandlerError("VALIDATION_ERROR", "El ID de la PYME es requerido", 400);
  }
}

export function validateCreateShipmentInput(payload: CreateShipmentInput): void {
  if (!payload.orderId) {
    throw new HandlerError("VALIDATION_ERROR", "orderId es requerido", 400);
  }
  if (
    payload.estimatedDelivery &&
    Number.isNaN(Date.parse(payload.estimatedDelivery))
  ) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      "estimatedDelivery no tiene formato valido",
      400
    );
  }
}

export function ensureValidShipmentStatus(status: string): ShipmentStatus {
  const normalized = status.toLowerCase() as ShipmentStatus;
  if (!Object.prototype.hasOwnProperty.call(VALID_TRANSITIONS, normalized)) {
    throw new HandlerError("VALIDATION_ERROR", "Status de envio invalido", 400);
  }
  return normalized;
}

export function validateShipmentTransition(
  current: ShipmentStatus,
  next: ShipmentStatus
): void {
  if (!VALID_TRANSITIONS[current]?.includes(next)) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      `Transicion no permitida: ${current} -> ${next}`,
      400
    );
  }
}

export function validateShipmentCanDelete(status: ShipmentStatus): void {
  if (status !== "pending") {
    throw new HandlerError(
      "VALIDATION_ERROR",
      "Solo se puede eliminar un envio en estado pending",
      400
    );
  }
}
