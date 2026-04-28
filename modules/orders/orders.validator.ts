import { HandlerError } from "@/lib/shared";
import type { CreateOrderInput, OrderStatus } from "./orders.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["approved", "cancelled"],
  approved: ["dispatched", "cancelled"],
  dispatched: [],
  cancelled: [],
};

export function validatePymeId(pymeId: string | null | undefined): asserts pymeId is string {
  if (!pymeId) {
    throw new HandlerError("VALIDATION_ERROR", "El ID de la PYME es requerido", 400);
  }
}

export function validateCreateOrderInput(payload: CreateOrderInput): void {
  if (!payload.customerName || !payload.customerEmail || payload.total === undefined) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      "El nombre, email del cliente y total son requeridos",
      400
    );
  }
  if (!EMAIL_REGEX.test(payload.customerEmail)) {
    throw new HandlerError("VALIDATION_ERROR", "El email del cliente no es valido", 400);
  }
  if (typeof payload.total !== "number" || payload.total <= 0) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      "El total debe ser un numero mayor a 0",
      400
    );
  }
}

export function validateStatusTransition(current: string, next: string): void {
  const currentStatus = current.toLowerCase() as OrderStatus;
  const nextStatus = next.toLowerCase() as OrderStatus;
  if (!VALID_TRANSITIONS[currentStatus]?.includes(nextStatus)) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      `Transicion no permitida: ${currentStatus} -> ${nextStatus}`,
      400
    );
  }
}
