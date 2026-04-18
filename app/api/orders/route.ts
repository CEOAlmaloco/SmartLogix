import { createOrderHandler, getOrdersHandler } from '@/lib/handlers/order.handler'
import { getAuthenticatedUser } from '@/lib/middleware/auth'
import { HandlerError, errorResponse, successResponse } from '@/lib/shared'

export async function GET() {
  const auth = await getAuthenticatedUser()
  if (auth.response) return auth.response

  try {
    const orders = await getOrdersHandler(auth.pymeId!)
    return successResponse(orders, 'Pedidos obtenidos', 200)
  } catch (error: unknown) {
    if (error instanceof HandlerError) {
      return errorResponse(error.code, error.message, error.status)
    }

    const err = error as { code?: string; message?: string; status?: number }
    return errorResponse(err.code ?? 'INTERNAL_ERROR', err.message ?? 'Error interno del servidor', err.status ?? 500)
  }
}

export async function POST(request: Request) {
  const auth = await getAuthenticatedUser()
  if (auth.response) return auth.response

  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return errorResponse('VALIDATION_ERROR', 'Body JSON invalido', 400)
    }

    const payload = body as Record<string, unknown>
    const created = await createOrderHandler(auth.pymeId!, {
      customerName: typeof payload.customerName === 'string' ? payload.customerName : '',
      customerEmail: typeof payload.customerEmail === 'string' ? payload.customerEmail : '',
      total: typeof payload.total === 'number' ? payload.total : Number(payload.total),
      notes: typeof payload.notes === 'string' ? payload.notes : undefined,
    })

    return successResponse(created, 'Pedido creado', 201)
  } catch (error: unknown) {
    if (error instanceof HandlerError) {
      return errorResponse(error.code, error.message, error.status)
    }

    const err = error as { code?: string; message?: string; status?: number }
    return errorResponse(err.code ?? 'INTERNAL_ERROR', err.message ?? 'Error interno del servidor', err.status ?? 500)
  }
}


