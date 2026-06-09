import { createOrderHandler, getOrdersHandler } from '@/modules/orders/orders.handler'
import { getAuthenticatedUser } from '@/lib/auth'
import { errorResponse, handleRouteError, successResponse } from '@/lib/shared'

const MAX_ORDER_ITEMS = 200

export async function GET() {
  const auth = await getAuthenticatedUser()
  if (auth.response) return auth.response
  if (auth.isPlatformAdmin) {
    return errorResponse('FORBIDDEN', 'Acceso restringido a administradores de plataforma', 403)
  }

  try {
    const orders = await getOrdersHandler(auth.pymeId!)
    return successResponse(orders, 'Pedidos obtenidos', 200)
  } catch (error: unknown) {
    return handleRouteError(error, 'GET /api/orders')
  }
}

export async function POST(request: Request) {
  const auth = await getAuthenticatedUser()
  if (auth.response) return auth.response
  if (auth.isPlatformAdmin) {
    return errorResponse('FORBIDDEN', 'Acceso restringido a administradores de plataforma', 403)
  }

  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return errorResponse('VALIDATION_ERROR', 'Body JSON invalido', 400)
    }

    const payload = body as Record<string, unknown>
    const rawItems = Array.isArray(payload.items) ? payload.items : []
    if (rawItems.length > MAX_ORDER_ITEMS) {
      return errorResponse(
        'VALIDATION_ERROR',
        `El pedido no puede tener más de ${MAX_ORDER_ITEMS} items`,
        400
      )
    }
    const items = rawItems
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        const entry = item as Record<string, unknown>
        const quantity = typeof entry.quantity === 'number' ? entry.quantity : Number(entry.quantity)
        const unitPrice =
          typeof entry.unitPrice === 'number'
            ? entry.unitPrice
            : typeof entry.unit_price === 'number'
              ? entry.unit_price
              : Number(entry.unitPrice ?? entry.unit_price)

        return {
          sku: typeof entry.sku === 'string' ? entry.sku : '',
          quantity,
          unitPrice,
        }
      })
      .filter(Boolean)

    const created = await createOrderHandler(auth.pymeId!, {
      customerName:
        typeof payload.customerName === 'string'
          ? payload.customerName
          : typeof payload.customer_name === 'string'
            ? payload.customer_name
            : '',
      customerEmail:
        typeof payload.customerEmail === 'string'
          ? payload.customerEmail
          : typeof payload.customer_email === 'string'
            ? payload.customer_email
            : '',
      total: typeof payload.total === 'number' ? payload.total : Number(payload.total),
      notes:
        typeof payload.notes === 'string'
          ? payload.notes
          : typeof payload.notes === 'string'
            ? payload.notes
            : undefined,
      items: items as Array<{ sku: string; quantity: number; unitPrice: number }>,
    })

    return successResponse(created, 'Pedido creado', 201)
  } catch (error: unknown) {
    return handleRouteError(error, 'POST /api/orders')
  }
}


