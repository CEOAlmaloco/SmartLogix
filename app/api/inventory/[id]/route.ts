import {
  deleteInventoryItemHandler,
  getInventoryItemHandler,
  updateInventoryItemHandler
} from '@/lib/handlers/inventory.handler'
import { getAuthenticatedUser } from '@/lib/middleware/auth'
import {
  HandlerError,
  errorResponse,
  successResponse
} from '@/lib/shared'

type RouteParams = { params: Promise<{ id: string }> };

// GET: Obtener un item específico
export async function GET(request: Request, { params }: RouteParams) {
  const auth = await getAuthenticatedUser()
  if (auth.response) return auth.response

  try {
    const { id } = await params;

    if (!id) {
      return errorResponse('VALIDATION_ERROR', 'ID requerido', 400)
    }

    const item = await getInventoryItemHandler(id, auth.pymeId!)
    
    // Si el handler devuelve null, enviamos un 404 explícito
    if (!item) {
      return errorResponse('NOT_FOUND', 'El item no existe o no tienes acceso', 404)
    }

    return successResponse(item, 'Item de inventario obtenido', 200)

  } catch (error: unknown) {
    if (error instanceof HandlerError) {
      return errorResponse(error.code, error.message, error.status)
    }
    return errorResponse('INTERNAL_ERROR', 'Error interno del servidor', 500)
  }
}

// PATCH: Actualizar parcialmente un item
export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await getAuthenticatedUser()
  if (auth.response) return auth.response

  try {
    const { id } = await params;
    const body = await request.json().catch(() => null)

    if (!body || typeof body !== 'object') {
      return errorResponse('VALIDATION_ERROR', 'Body JSON inválido', 400)
    }

    // ✅ Fix: filtrar null Y undefined con un tipo explícito
    type UpdatePayload = {
      name?: string
      sku?: string
      quantity?: number
      warehouse?: string
    }

    const raw = {
      name: body.name,
      sku: body.sku,
      quantity: body.quantity,
      warehouse: body.warehouse,
    }

    const updateData = Object.fromEntries(
  Object.entries(raw).filter(([_, v]) => v != null)  // != filtra null y undefined
) as UpdatePayload

  if (Object.keys(updateData).length === 0) {
    return errorResponse('VALIDATION_ERROR', 'No se enviaron campos para actualizar', 400)
  }

    const updated = await updateInventoryItemHandler(id, auth.pymeId!, updateData)

    return successResponse(updated, 'Item de inventario actualizado', 200)

  } catch (error: unknown) {
    if (error instanceof HandlerError) {
      return errorResponse(error.code, error.message, error.status)
    }
    return errorResponse('INTERNAL_ERROR', 'Error interno del servidor', 500)
  }
}

// DELETE: Eliminación lógica (Soft Delete)
export async function DELETE(request: Request, { params }: RouteParams) {
  const auth = await getAuthenticatedUser()
  if (auth.response) return auth.response

  try {
    const { id } = await params;

    const deleted = await deleteInventoryItemHandler(id, auth.pymeId!)

    return successResponse(deleted, 'Item de inventario eliminado', 200)

  } catch (error: unknown) {
    if (error instanceof HandlerError) {
      return errorResponse(error.code, error.message, error.status)
    }
    return errorResponse('INTERNAL_ERROR', 'Error interno del servidor', 500)
  }
}