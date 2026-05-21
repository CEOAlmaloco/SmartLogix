import { getPlatformAdmin } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/shared";
import { getMetricsHandler } from "@/modules/platform/platform.handler";

export async function GET() {
  const { admin, response } = await getPlatformAdmin();
  if (response) return response;
  if (!admin) return errorResponse("FORBIDDEN", "Acceso restringido", 403);

  try {
    const metrics = await getMetricsHandler();
    return successResponse(metrics, "Métricas de plataforma obtenidas", 200);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string; status?: number };
    return errorResponse(
      err.code ?? "INTERNAL_ERROR",
      err.message ?? "Error interno del servidor",
      err.status ?? 500
    );
  }
}