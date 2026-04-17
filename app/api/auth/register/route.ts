import { registerHandler } from '@/lib/handlers/auth.handler'
import { errorResponse, successResponse } from '@/lib/shared'

export async function POST(request: Request) {
  try {
    const { email, password, pymeName } = await request.json()

    if (!email || !password || !pymeName) {
      return errorResponse('VALIDATION_ERROR', 'email, password y pymeName son requeridos', 400)
    }

    const result = await registerHandler(email, password, pymeName)
    return successResponse(result, 'Registro exitoso', 201)
  } catch (error: unknown) {
    const err = error as { code?: string; status?: number; message?: string }
    return errorResponse(
      err.code ?? 'INTERNAL_ERROR',
      err.message ?? 'Error interno del servidor',
      err.status ?? 500
    )
  }
}