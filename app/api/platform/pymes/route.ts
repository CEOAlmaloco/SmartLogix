import { getPlatformAdmin } from "@/lib/auth";
import { errorResponse, handleRouteError, successResponse } from "@/lib/shared";
import { getPymesHandler } from "@/modules/platform/platform.handler";

export async function GET() {
  const { admin, response } = await getPlatformAdmin();
  if (response) return response;
  if (!admin) return errorResponse("FORBIDDEN", "Acceso restringido", 403);

  try {
    const pymes = await getPymesHandler();
    return successResponse(pymes, "PYMEs obtenidas", 200);
  } catch (error: unknown) {
    return handleRouteError(error, "GET /api/platform/pymes");
  }
}