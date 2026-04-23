import { HandlerError } from "@/lib/shared";
import { ShipmentRepository } from "../repositories/shipment.repository";
import type { CreateShipmentInput, Shipment, ShipmentStatus, UpdateShipmentStatusInput } from "@/types/shipment";
//validaciones de estado de envio global para todos los envios

//SOLO puede desde esta validacion nada mas 
const VALID_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = { 
  pending: ["in_transit", "cancelled"],  
  in_transit: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

//es async ya que se conecta a la base de datos , todas las bd son asincronas
export async function getShipmentsHandler(pymeId: string) {
  if (!pymeId) {
    throw new HandlerError("VALIDATION_ERROR", "pymeId requerido", 400);
  }
  return ShipmentRepository.findAll(pymeId);
}

export async function createShipmentHandler(pymeId: string, payload: CreateShipmentInput) {
  if (!pymeId) {
    throw new HandlerError("VALIDATION_ERROR", "El ID de la PYME es requerido", 400);
  }

  if (!payload.orderId) {
    throw new HandlerError("VALIDATION_ERROR", "orderId es requerido", 400);
  }

  if (payload.estimatedDelivery && Number.isNaN(Date.parse(payload.estimatedDelivery))) {
    throw new HandlerError("VALIDATION_ERROR", "estimatedDelivery no tiene formato valido", 400);
  }

  return ShipmentRepository.create(pymeId, {
    order_id: payload.orderId,
    carrier: payload.carrier,
    tracking_code: payload.trackingCode,
    estimated_delivery: payload.estimatedDelivery,
  });
}

export async function updateShipmentStatusHandler(pymeId: string, payload: UpdateShipmentStatusInput) {
  if (!pymeId) {
    throw new HandlerError("VALIDATION_ERROR", "El ID de la PYME es requerido", 400);
  }
  if (!payload.id || !payload.status) {
    throw new HandlerError("VALIDATION_ERROR", "El ID y status son requeridos", 400);
  }

  const status = payload.status.toLowerCase() as ShipmentStatus;
  if (!Object.prototype.hasOwnProperty.call(VALID_TRANSITIONS, status)) {
    throw new HandlerError("VALIDATION_ERROR", "Status de envio invalido", 400);
  }

  const currentRows = (await ShipmentRepository.findAll(pymeId)) as Shipment[];
  const currentShipment = currentRows.find((shipment) => shipment.id === payload.id);
  if (!currentShipment) {
    throw new HandlerError("NOT_FOUND", "Envio no encontrado", 404);
  }

  const currentStatus = currentShipment.status;
  if (!VALID_TRANSITIONS[currentStatus]?.includes(status)) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      `Transicion no permitida: ${currentStatus} -> ${status}`,
      400
    );
  }

  return ShipmentRepository.updateStatus(payload.id, pymeId, {
    status,
    delivered_at: status === "delivered" ? new Date().toISOString() : undefined,
  });
}
