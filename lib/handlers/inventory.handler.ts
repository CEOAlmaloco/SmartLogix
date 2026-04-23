import { HandlerError } from '@/lib/shared'
import { InventoryRepository } from '../repositories/inventory.repository'
import {
    CreateInventoryItemPayload,
    UpdateInventoryItemPayload
} from '@/types/inventory'

// Obtener todos los items
export async function getInventoryItemsHandler(pymeId: string) {

    if (!pymeId) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'pymeId requerido',
            400
        )
    }

    return InventoryRepository.findAllItems(pymeId)
}


// Obtener un item por ID
export async function getInventoryItemHandler(
    id: string,
    pymeId: string
) {

    if (!pymeId) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'pymeId requerido',
            400
        )
    }

    if (!id) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'ID del item requerido',
            400
        )
    }

    const item = await InventoryRepository.findItemById(id, pymeId)

    if (!item) {
        throw new HandlerError(
            'NOT_FOUND',
            'Item no encontrado',
            404
        )
    }

    return item
}


// Crear item
export async function createInventoryItemHandler(
    pymeId: string,
    payload: CreateInventoryItemPayload
) {

    if (!pymeId) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'El ID de la PYME es requerido',
            400
        )
    }

    if (
        !payload.name ||
        payload.name.trim().length === 0
    ) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'El nombre es requerido',
            400
        )
    }

    if (!payload.sku) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'El SKU es requerido',
            400
        )
    }

    if (payload.sku.length > 50) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'El SKU no puede tener más de 50 caracteres',
            400
        )
    }

    if (
        payload.quantity === undefined ||
        !Number.isInteger(payload.quantity) ||
        payload.quantity < 0
    ) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'La cantidad debe ser un entero mayor o igual a 0',
            400
        )
    }

    return InventoryRepository.createItem(
        pymeId,
        payload
    )
}


// Actualizar item
export async function updateInventoryItemHandler(
    id: string,
    pymeId: string,
    payload: UpdateInventoryItemPayload
) {

    if (!pymeId) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'El ID de la PYME es requerido',
            400
        )
    }

    if (!id) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'ID del item requerido',
            400
        )
    }

    // evitar update vacío
    if (Object.keys(payload).length === 0) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'Debe enviar al menos un campo a actualizar',
            400
        )
    }

    if (
        payload.name !== undefined &&
        payload.name.trim().length === 0
    ) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'El nombre no puede estar vacío',
            400
        )
    }

    if (
        payload.quantity !== undefined &&
        (
            !Number.isInteger(payload.quantity) ||
            payload.quantity < 0
        )
    ) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'La cantidad debe ser un entero mayor o igual a 0',
            400
        )
    }

    if (
        payload.sku &&
        payload.sku.length > 50
    ) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'El SKU no puede tener más de 50 caracteres',
            400
        )
    }

    // verificar existencia
    const existing =
        await InventoryRepository.findItemById(
            id,
            pymeId
        )

    if (!existing) {
        throw new HandlerError(
            'NOT_FOUND',
            'Item no encontrado',
            404
        )
    }

    return InventoryRepository.updateItem(
        id,
        pymeId,
        payload
    )
}


// Eliminar item
export async function deleteInventoryItemHandler(
    id: string,
    pymeId: string
) {

    if (!pymeId) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'El ID de la PYME es requerido',
            400
        )
    }

    if (!id) {
        throw new HandlerError(
            'VALIDATION_ERROR',
            'ID del item requerido',
            400
        )
    }

    // verificar existencia
    const existing =
        await InventoryRepository.findItemById(
            id,
            pymeId
        )

    if (!existing) {
        throw new HandlerError(
            'NOT_FOUND',
            'Item no encontrado',
            404
        )
    }

    return InventoryRepository.deleteItem(
        id,
        pymeId
    )
}