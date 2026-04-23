import { createShipmentHandler, getShipmentsHandler } from "@/lib/handlers/shipment.handler";
import { getAuthenticatedUser } from "@/lib/middleware/auth";
import { HandlerError, errorResponse, successResponse } from "@/lib/shared";

export async function GET() {
  const auth = await getAuthenticatedUser();
  if (auth.response) return auth.response;

  try {
    const shipments = await getShipmentsHandler(auth.pymeId!);
    return successResponse(shipments, "Envios obtenidos", 200);
  } catch (error: unknown) {
    if (error instanceof HandlerError) {
      return errorResponse(error.code, error.message, error.status);
    }
    const err = error as { code?: string; message?: string; status?: number };
    return errorResponse(
      err.code ?? "INTERNAL_ERROR",
      err.message ?? "Error interno del servidor",
      err.status ?? 500
    );
  }
}

export async function POST(request: Request) {
  const auth = await getAuthenticatedUser();
  if (auth.response) return auth.response;

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return errorResponse("VALIDATION_ERROR", "Body JSON invalido", 400);
    }

    const payload = body as Record<string, unknown>;
    const created = await createShipmentHandler(auth.pymeId!, {
      orderId: typeof payload.orderId === "string" ? payload.orderId : "",
      carrier: typeof payload.carrier === "string" ? payload.carrier : undefined,
      trackingCode: typeof payload.trackingCode === "string" ? payload.trackingCode : undefined,
      estimatedDelivery:
        typeof payload.estimatedDelivery === "string" ? payload.estimatedDelivery : undefined,
    });

    return successResponse(created, "Envio creado", 201);
  } catch (error: unknown) {
    if (error instanceof HandlerError) {
      return errorResponse(error.code, error.message, error.status);
    }
    const err = error as { code?: string; message?: string; status?: number };
    return errorResponse(
      err.code ?? "INTERNAL_ERROR",
      err.message ?? "Error interno del servidor",
      err.status ?? 500
    );
  }
}
