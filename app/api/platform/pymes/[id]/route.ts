import { getPlatformAdmin } from "@/lib/auth";
import { errorResponse, handleRouteError, successResponse } from "@/lib/shared";
import { getPymeDetailHandler, updatePymeStatusHandler } from "@/modules/platform/platform.handler";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteParams) {
  const { admin, response } = await getPlatformAdmin();
  if (response) return response;
  if (!admin) return errorResponse("FORBIDDEN", "Acceso restringido", 403);

  try {
    const resolved = await params;
    const pyme = await getPymeDetailHandler(resolved.id);
    return successResponse(pyme, "PYME obtenida", 200);
  } catch (error: unknown) {
    return handleRouteError(error, "GET /api/platform/pymes/[id]");
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { admin, response } = await getPlatformAdmin();
  if (response) return response;
  if (!admin) return errorResponse("FORBIDDEN", "Acceso restringido", 403);

  try {
    const resolved = await params;
    const body = await request.json().catch(() => null);
    const updated = await updatePymeStatusHandler(resolved.id, body);
    return successResponse(updated, "Estado de PYME actualizado correctamente", 200);
  } catch (error: unknown) {
    return handleRouteError(error, "PATCH /api/platform/pymes/[id]");
  }
}