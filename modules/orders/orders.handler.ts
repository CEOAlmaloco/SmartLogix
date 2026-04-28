import { HandlerError } from "@/lib/shared";
import { OrdersRepository } from "./orders.repository";
import {
  validateCreateOrderInput,
  validatePymeId,
  validateStatusTransition,
} from "./orders.validator";
import type { CreateOrderInput, UpdateOrderStatusInput } from "./orders.types";

export async function getOrdersHandler(pymeId: string) {
  validatePymeId(pymeId);
  return OrdersRepository.findAllOrders(pymeId);
}

export async function createOrderHandler(pymeId: string, payload: CreateOrderInput) {
  validatePymeId(pymeId);
  validateCreateOrderInput(payload);
  return OrdersRepository.createOrder(pymeId, payload);
}

export async function updateOrderStatusHandler(
  pymeId: string,
  payload: UpdateOrderStatusInput
) {
  validatePymeId(pymeId);
  if (!payload.id || !payload.status) {
    throw new HandlerError("VALIDATION_ERROR", "El ID y status son requeridos", 400);
  }

  const status = payload.status.toLowerCase();
  const currentRows = await OrdersRepository.findAllOrders(pymeId);
  const currentOrder = currentRows.find(
    (order: { id: string }) => order.id === payload.id
  );

  if (!currentOrder) {
    throw new HandlerError("NOT_FOUND", "Pedido no encontrado", 404);
  }

  const currentStatus = String((currentOrder as { status?: string }).status ?? "");
  validateStatusTransition(currentStatus, status);

  return OrdersRepository.updateOrderStatus(payload.id, pymeId, status);
}
