import { HandlerError } from "@/lib/shared";
import { PlatformRepository } from "./platform.repository";
import { validatePymeId, validateUpdatePyme } from "./platform.validator";
import type { PymeStatus } from "./platform.types";

export async function getPymesHandler() {
  return PlatformRepository.findAllPymes();
}

export async function getPymeDetailHandler(pymeId: string) {
  validatePymeId(pymeId);
  const pyme = await PlatformRepository.findPymeById(pymeId);

  if (!pyme) {
    throw new HandlerError("NOT_FOUND", "PYME no encontrada", 404);
  }

  return pyme;
}

export async function getPymeUsersHandler(pymeId: string) {
  validatePymeId(pymeId);
  return PlatformRepository.findPymeUsers(pymeId);
}

export async function updatePymeStatusHandler(pymeId: string, body: unknown) {
  validatePymeId(pymeId);
  const validation = validateUpdatePyme(body);

  if (!validation.valid || !validation.data) {
    throw new HandlerError("VALIDATION_ERROR", validation.error ?? "Payload inválido", 400);
  }

  const updated = await PlatformRepository.updatePymeStatus(pymeId, validation.data);
  return updated;
}

export async function getMetricsHandler() {
  return PlatformRepository.getMetrics();
}

export function getAllowedTransitions(status: PymeStatus): PymeStatus[] {
  if (status === "active") return ["suspended", "pending_review"];
  if (status === "pending_review") return ["active", "suspended"];
  if (status === "suspended") return ["active"];
  return [];
}