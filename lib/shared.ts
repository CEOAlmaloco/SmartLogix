// Tipos, errores y helpers comunes para respuestas HTTP de los handlers.

export class HandlerError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "HandlerError";
    this.code = code;
    this.status = status;
  }
}

export type ApiSuccess<T> = {
  data: T;
  message?: string;
};

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export function successResponse<T>(data: T, message?: string, status = 200) {
  return Response.json({ data, message } satisfies ApiSuccess<T>, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status = 500,
  details?: unknown
) {
  return Response.json({ code, message, details } satisfies ApiError, { status });
}

/**
 * Maneja errores de un Route Handler sin filtrar detalles internos al cliente.
 * Solo expone el mensaje de errores de dominio (HandlerError); para cualquier
 * otro error registra el detalle en el servidor y responde genérico.
 */
export function handleRouteError(error: unknown, context: string) {
  if (error instanceof HandlerError) {
    return errorResponse(error.code, error.message, error.status);
  }
  console.error(`Error en ${context}:`, error);
  return errorResponse("INTERNAL_ERROR", "Error interno del servidor", 500);
}
