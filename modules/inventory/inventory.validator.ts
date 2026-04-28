import { HandlerError } from "@/lib/shared";
import type {
  CreateInventoryItemPayload,
  UpdateInventoryItemPayload,
} from "./inventory.types";

export function validatePymeId(pymeId: string | null | undefined): asserts pymeId is string {
  if (!pymeId) {
    throw new HandlerError("VALIDATION_ERROR", "pymeId requerido", 400);
  }
}

export function validateItemId(id: string | null | undefined): asserts id is string {
  if (!id) {
    throw new HandlerError("VALIDATION_ERROR", "ID del item requerido", 400);
  }
}

export function validateCreatePayload(payload: CreateInventoryItemPayload): void {
  if (!payload.name || payload.name.trim().length === 0) {
    throw new HandlerError("VALIDATION_ERROR", "El nombre es requerido", 400);
  }
  if (!payload.sku) {
    throw new HandlerError("VALIDATION_ERROR", "El SKU es requerido", 400);
  }
  if (payload.sku.length > 50) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      "El SKU no puede tener mas de 50 caracteres",
      400
    );
  }
  if (
    payload.quantity === undefined ||
    !Number.isInteger(payload.quantity) ||
    payload.quantity < 0
  ) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      "La cantidad debe ser un entero mayor o igual a 0",
      400
    );
  }
}

export function validateUpdatePayload(payload: UpdateInventoryItemPayload): void {
  if (Object.keys(payload).length === 0) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      "Debe enviar al menos un campo a actualizar",
      400
    );
  }
  if (payload.name !== undefined && payload.name.trim().length === 0) {
    throw new HandlerError("VALIDATION_ERROR", "El nombre no puede estar vacio", 400);
  }
  if (
    payload.quantity !== undefined &&
    (!Number.isInteger(payload.quantity) || payload.quantity < 0)
  ) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      "La cantidad debe ser un entero mayor o igual a 0",
      400
    );
  }
  if (payload.sku && payload.sku.length > 50) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      "El SKU no puede tener mas de 50 caracteres",
      400
    );
  }
}
