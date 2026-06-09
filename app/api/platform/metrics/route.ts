import { getPlatformAdmin } from "@/lib/auth";
import { errorResponse, handleRouteError, successResponse } from "@/lib/shared";
import { getMetricsHandler } from "@/modules/platform/platform.handler";

export async function GET() {
  const { admin, response } = await getPlatformAdmin();
  if (response) return response;
  if (!admin) return errorResponse("FORBIDDEN", "Acceso restringido", 403);

  try {
    const metrics = await getMetricsHandler();
    return successResponse(metrics, "Métricas de plataforma obtenidas", 200);
  } catch (error: unknown) {
    return handleRouteError(error, "GET /api/platform/metrics");
  }
}