import { getPlatformAdmin } from "@/lib/auth";
import { errorResponse, handleRouteError, successResponse } from "@/lib/shared";
import { getPymeUsersHandler } from "@/modules/platform/platform.handler";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteParams) {
  const { admin, response } = await getPlatformAdmin();
  if (response) return response;
  if (!admin) return errorResponse("FORBIDDEN", "Acceso restringido", 403);

  try {
    const resolved = await params;
    const users = await getPymeUsersHandler(resolved.id);
    return successResponse(users, "Usuarios de la PYME obtenidos", 200);
  } catch (error: unknown) {
    return handleRouteError(error, "GET /api/platform/pymes/[id]/users");
  }
}