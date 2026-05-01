import { HandlerError } from "@/lib/shared";
import { ShipmentsRepository } from "./shipments.repository";
import {
  ensureValidShipmentStatus,
  validateCreateShipmentInput,
  validateShipmentCanDelete,
  validatePymeId,
  validateShipmentTransition,
} from "./shipments.validator";
import type {
  CreateShipmentInput,
  Shipment,
  UpdateShipmentStatusInput,
} from "./shipments.types";

export async function getShipmentsHandler(pymeId: string) {
  validatePymeId(pymeId);
  return ShipmentsRepository.findAll(pymeId);
}

export async function createShipmentHandler(
  pymeId: string,
  payload: CreateShipmentInput
) {
  validatePymeId(pymeId);
  validateCreateShipmentInput(payload);

  return ShipmentsRepository.create(pymeId, {
    order_id: payload.orderId,
    carrier: payload.carrier,
    tracking_code: payload.trackingCode,
    estimated_delivery: payload.estimatedDelivery,
  });
}

export async function updateShipmentStatusHandler(
  pymeId: string,
  payload: UpdateShipmentStatusInput
) {
  validatePymeId(pymeId);
  if (!payload.id || !payload.status) {
    throw new HandlerError("VALIDATION_ERROR", "El ID y status son requeridos", 400);
  }

  const status = ensureValidShipmentStatus(payload.status);

  const currentRows = (await ShipmentsRepository.findAll(pymeId)) as Shipment[];
  const currentShipment = currentRows.find((shipment) => shipment.id === payload.id);
  if (!currentShipment) {
    throw new HandlerError("NOT_FOUND", "Envio no encontrado", 404);
  }

  validateShipmentTransition(currentShipment.status, status);

  return ShipmentsRepository.updateStatus(payload.id, pymeId, {
    status,
    delivered_at: status === "delivered" ? new Date().toISOString() : undefined,
  });
}

export async function deleteShipmentHandler(pymeId: string, id: string) {
  validatePymeId(pymeId);
  if (!id) {
    throw new HandlerError("VALIDATION_ERROR", "El ID es requerido", 400);
  }

  const currentRows = (await ShipmentsRepository.findAll(pymeId)) as Shipment[];
  const currentShipment = currentRows.find((shipment) => shipment.id === id);
  if (!currentShipment) {
    throw new HandlerError("NOT_FOUND", "Envio no encontrado", 404);
  }

  validateShipmentCanDelete(currentShipment.status);

  return ShipmentsRepository.delete(id, pymeId);
}
