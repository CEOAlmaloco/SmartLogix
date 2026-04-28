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
