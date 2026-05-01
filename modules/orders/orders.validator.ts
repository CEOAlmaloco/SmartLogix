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
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    throw new HandlerError("VALIDATION_ERROR", "El pedido debe incluir al menos un item", 400);
  }

  for (const item of payload.items) {
    if (!item.sku || typeof item.sku !== "string") {
      throw new HandlerError("VALIDATION_ERROR", "Cada item requiere un SKU valido", 400);
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new HandlerError(
        "VALIDATION_ERROR",
        "Cada item debe tener una cantidad mayor a 0",
        400
      );
    }
    if (typeof item.unitPrice !== "number" || item.unitPrice <= 0) {
      throw new HandlerError(
        "VALIDATION_ERROR",
        "Cada item debe tener un precio unitario mayor a 0",
        400
      );
    }
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

export function validateOrderCanDelete(status: string): void {
  const normalized = status.toLowerCase() as OrderStatus;
  if (normalized !== "pending" && normalized !== "cancelled") {
    throw new HandlerError(
      "VALIDATION_ERROR",
      "No se puede eliminar un pedido en curso",
      400
    );
  }
}
