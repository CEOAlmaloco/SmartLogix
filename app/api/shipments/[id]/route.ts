import { getAuthenticatedUser } from '@/lib/middleware/auth'
import { ShipmentRepository } from '@/lib/repositories/shipment.repository'
import { HandlerError, errorResponse, successResponse } from '@/lib/shared'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser()
  if (auth.response) return auth.response

  try {
    const resolvedParams = await params
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return errorResponse('VALIDATION_ERROR', 'Body JSON invalido', 400)
    }

    const payload = body as Record<string, unknown>
    const status = typeof payload.status === 'string' ? payload.status.toLowerCase() : ''
    if (!status) {
      return errorResponse('VALIDATION_ERROR', 'status es requerido', 400)
    }

    const updated = await ShipmentRepository.updateStatus(resolvedParams.id, auth.pymeId!, {
      status,
      delivered_at: status === 'delivered' ? new Date().toISOString() : undefined,
    })

    return successResponse(updated, 'Estado de envio actualizado', 200)
  } catch (error: unknown) {
    if (error instanceof HandlerError) {
      return errorResponse(error.code, error.message, error.status)
    }
    const err = error as { code?: string; message?: string; status?: number }
    return errorResponse(err.code ?? 'INTERNAL_ERROR', err.message ?? 'Error interno del servidor', err.status ?? 500)
  }
}
