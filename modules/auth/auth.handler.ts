import { HandlerError } from "@/lib/shared";
import { AuthRepository } from "./auth.repository";
import { validateRegisterInput } from "./auth.validator";
import type { RegisterResult } from "./auth.types";

export async function registerHandler(
  email: string,
  password: string,
  pymeName: string
): Promise<RegisterResult> {
  validateRegisterInput({ email, password, pymeName });

  try {
    const user = await AuthRepository.signUp(email, password);
    if (!user) throw new HandlerError("AUTH_ERROR", "Error al registrar", 400);

    const pyme = await AuthRepository.createPyme(pymeName, user.id);
    await AuthRepository.createPymeMember(pyme.id, user.id, "owner");

    return { userId: user.id, pymeId: pyme.id };
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string; status?: number };
    if (err.code === "23505") {
      throw new HandlerError("DB_ERROR", "El nombre de la PYME ya esta en uso", 400);
    }
    if (error instanceof HandlerError) throw error;
    throw new HandlerError(
      err.code ?? "DB_ERROR",
      err.message ?? "Error al registrar",
      err.status ?? 500
    );
  }
}
