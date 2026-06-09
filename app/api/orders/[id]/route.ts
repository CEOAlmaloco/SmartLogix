import { deleteOrderHandler, updateOrderStatusHandler } from '@/modules/orders/orders.handler'
import { getAuthenticatedUser } from '@/lib/auth'
import { errorResponse, handleRouteError, successResponse } from '@/lib/shared'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser()
  if (auth.response) return auth.response
  if (auth.isPlatformAdmin) {
    return errorResponse('FORBIDDEN', 'Acceso restringido a administradores de plataforma', 403)
  }

  try {
    const resolvedParams = await params
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return errorResponse('VALIDATION_ERROR', 'Body JSON invalido', 400)
    }

    const payload = body as Record<string, unknown>
    const updated = await updateOrderStatusHandler(auth.pymeId!, {
      id: resolvedParams.id,
      status: typeof payload.status === 'string' ? payload.status : '',
    })

    return successResponse(updated, 'Estado de pedido actualizado', 200)
  } catch (error: unknown) {
    return handleRouteError(error, 'PATCH /api/orders/[id]')
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser()
  if (auth.response) return auth.response
  if (auth.isPlatformAdmin) {
    return errorResponse('FORBIDDEN', 'Acceso restringido a administradores de plataforma', 403)
  }

  try {
    const resolvedParams = await params
    const deleted = await deleteOrderHandler(auth.pymeId!, resolvedParams.id)
    return successResponse(deleted, 'Pedido eliminado', 200)
  } catch (error: unknown) {
    return handleRouteError(error, 'DELETE /api/orders/[id]')
  }
}
