import {
  createInventoryItemHandler,
  getInventoryItemsHandler
} from '@/lib/handlers/inventory.handler'

import { getAuthenticatedUser } from '@/lib/middleware/auth'

import {
  HandlerError,
  errorResponse,
  successResponse
} from '@/lib/shared'


// GET /inventory → listar items

export async function GET() {

  const auth = await getAuthenticatedUser()

  if (auth.response) return auth.response

  try {

    if (!auth.pymeId) {
      return errorResponse(
        'AUTH_ERROR',
        'PYME no encontrada',
        403
      )
    }

    const items =
      await getInventoryItemsHandler(
        auth.pymeId
      )

    return successResponse(
      items,
      'Items de inventario obtenidos',
      200
    )

  } catch (error: unknown) {

    if (error instanceof HandlerError) {
      return errorResponse(
        error.code,
        error.message,
        error.status
      )
    }

    return errorResponse(
      'INTERNAL_ERROR',
      'Error interno del servidor',
      500
    )
  }
}



// POST /inventory → crear item

export async function POST(request: Request) {

  const auth = await getAuthenticatedUser()

  if (auth.response) return auth.response

  try {

    if (!auth.pymeId) {
      return errorResponse(
        'AUTH_ERROR',
        'PYME no encontrada',
        403
      )
    }

    const body =
      await request.json().catch(() => null)

    if (!body || typeof body !== 'object') {
      return errorResponse(
        'VALIDATION_ERROR',
        'Body JSON inválido',
        400
      )
    }

    const payload =
      body as Record<string, unknown>

    const created =
      await createInventoryItemHandler(
        auth.pymeId,
        {
          name:
            typeof payload.name === 'string'
              ? payload.name
              : '',

          sku:
            typeof payload.sku === 'string'
              ? payload.sku
              : '',

          quantity:
            typeof payload.quantity === 'number'
              ? payload.quantity
              : undefined as unknown as number,

          warehouse:
            typeof payload.warehouse === 'string'
              ? payload.warehouse
              : undefined,
        }
      )

    return successResponse(
      created,
      'Item de inventario creado',
      201
    )

  } catch (error: unknown) {

    if (error instanceof HandlerError) {
      return errorResponse(
        error.code,
        error.message,
        error.status
      )
    }

    return errorResponse(
      'INTERNAL_ERROR',
      'Error interno del servidor',
      500
    )
  }
}