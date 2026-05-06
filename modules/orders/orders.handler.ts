import { HandlerError } from "@/lib/shared";
import { InventoryRepository } from "@/modules/inventory/inventory.repository";
import { OrdersRepository } from "./orders.repository";
import {
  validateOrderCanDelete,
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

  if (status === "approved") {
    const currentOrderWithItems = currentOrder as { items?: Array<{ item_sku: string; quantity: number }> };
    const orderItems = currentOrderWithItems.items ?? [];

    if (orderItems.length === 0) {
      throw new HandlerError("VALIDATION_ERROR", "No se puede aprobar un pedido sin items", 422);
    }

    const stockChecks = await Promise.all(
      orderItems.map(async (item) => {
        const inventoryItem = await InventoryRepository.findItemBySku(item.item_sku, pymeId);
        return {
          item,
          inventoryItem,
        };
      })
    );

    const insufficient = stockChecks.find(
      ({ inventoryItem, item }) => !inventoryItem || Number(inventoryItem.quantity) < Number(item.quantity)
    );

    if (insufficient) {
      throw new HandlerError(
        "VALIDATION_ERROR",
        `Stock insuficiente para SKU ${insufficient.item.item_sku}`,
        422
      );
    }

    for (const { item } of stockChecks) {
      await InventoryRepository.adjustStockBySku(pymeId, item.item_sku, -Number(item.quantity));
    }
  }

  return OrdersRepository.updateOrderStatus(payload.id, pymeId, status);
}

export async function deleteOrderHandler(pymeId: string, id: string) {
  validatePymeId(pymeId);
  if (!id) {
    throw new HandlerError("VALIDATION_ERROR", "El ID es requerido", 400);
  }

  const currentRows = await OrdersRepository.findAllOrders(pymeId);
  const currentOrder = currentRows.find((order: { id: string }) => order.id === id);

  if (!currentOrder) {
    throw new HandlerError("NOT_FOUND", "Pedido no encontrado", 404);
  }

  const currentStatus = String((currentOrder as { status?: string }).status ?? "pending");
  validateOrderCanDelete(currentStatus);

  try {
    const deleted = await OrdersRepository.deleteOrder(id, pymeId);
    if (!deleted) {
      throw new HandlerError("NOT_FOUND", "Pedido no encontrado", 404);
    }
    return deleted;
  } catch (error: unknown) {
    const pgError = error as { code?: string; message?: string };
    if (pgError?.code === "23503") {
      throw new HandlerError(
        "CONFLICT",
        "No se puede eliminar el pedido porque tiene envios asociados",
        409
      );
    }
    throw error;
  }
}
