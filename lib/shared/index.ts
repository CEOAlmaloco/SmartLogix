// SL-12 Este archivo contiene tipos y funciones comunes para manejar respuestas de API.

export type ApiSuccess<T> = {
  data: T;
  message?: string;
};

export type ApiError = {
  code: string
  message: string
  details?: unknown
}

export function successResponse<T>(data: T, message?: string, status = 200){
  return Response.json({data, message} satisfies ApiSuccess<T>, {status});
}

export function errorResponse(
  code: string,
  message: string,
  status = 500,
  details?: unknown
) {
  return Response.json({ code, message, details } satisfies ApiError, { status })
}
