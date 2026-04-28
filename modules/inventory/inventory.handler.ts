import { HandlerError } from "@/lib/shared";
import { InventoryRepository } from "./inventory.repository";
import {
  validateCreatePayload,
  validateItemId,
  validatePymeId,
  validateUpdatePayload,
} from "./inventory.validator";
import type {
  CreateInventoryItemPayload,
  UpdateInventoryItemPayload,
} from "./inventory.types";

export async function getInventoryItemsHandler(pymeId: string) {
  validatePymeId(pymeId);
  return InventoryRepository.findAllItems(pymeId);
}

export async function getInventoryItemHandler(id: string, pymeId: string) {
  validatePymeId(pymeId);
  validateItemId(id);

  const item = await InventoryRepository.findItemById(id, pymeId);
  if (!item) {
    throw new HandlerError("NOT_FOUND", "Item no encontrado", 404);
  }
  return item;
}

export async function createInventoryItemHandler(
  pymeId: string,
  payload: CreateInventoryItemPayload
) {
  validatePymeId(pymeId);
  validateCreatePayload(payload);
  return InventoryRepository.createItem(pymeId, payload);
}

export async function updateInventoryItemHandler(
  id: string,
  pymeId: string,
  payload: UpdateInventoryItemPayload
) {
  validatePymeId(pymeId);
  validateItemId(id);
  validateUpdatePayload(payload);

  const existing = await InventoryRepository.findItemById(id, pymeId);
  if (!existing) {
    throw new HandlerError("NOT_FOUND", "Item no encontrado", 404);
  }
  return InventoryRepository.updateItem(id, pymeId, payload);
}

export async function deleteInventoryItemHandler(id: string, pymeId: string) {
  validatePymeId(pymeId);
  validateItemId(id);

  const existing = await InventoryRepository.findItemById(id, pymeId);
  if (!existing) {
    throw new HandlerError("NOT_FOUND", "Item no encontrado", 404);
  }
  return InventoryRepository.deleteItem(id, pymeId);
}
