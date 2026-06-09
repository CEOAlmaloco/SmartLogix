import { registerHandler } from '@/modules/auth/auth.handler'
import { HandlerError, errorResponse, successResponse } from '@/lib/shared'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`register:${getClientIp(request)}`, 5, 60_000)
    if (!limit.allowed) {
      return errorResponse(
        'RATE_LIMITED',
        'Demasiados registros. Intenta más tarde.',
        429,
        { retryAfterSeconds: limit.retryAfterSeconds }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return errorResponse('VALIDATION_ERROR', 'Body JSON inválido', 400)
    }

    const payload = body as Record<string, unknown>
    const email = typeof payload.email === 'string' ? payload.email : ''
    const password = typeof payload.password === 'string' ? payload.password : ''
    const pymeName = typeof payload.pymeName === 'string' ? payload.pymeName : ''

    if (!email || !password || !pymeName) {
      return errorResponse('VALIDATION_ERROR', 'email, password y pymeName son requeridos', 400)
    }

    const result = await registerHandler(email, password, pymeName)
    return successResponse(result, 'Registro exitoso', 201)
  } catch (error: unknown) {
    if (error instanceof HandlerError) {
      return errorResponse(error.code, error.message, error.status)
    }
    console.error('Error en POST /api/auth/register:', error)
    return errorResponse('INTERNAL_ERROR', 'Error interno del servidor', 500)
  }
}
