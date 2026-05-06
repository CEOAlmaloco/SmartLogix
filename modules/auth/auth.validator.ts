import { HandlerError } from "@/lib/shared";
import type { RegisterInput } from "./auth.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function validateRegisterInput(input: RegisterInput): void {
  const { email, password, pymeName } = input;

  if (!email || !password || !pymeName) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      "email, password y pymeName son requeridos",
      400
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new HandlerError("VALIDATION_ERROR", "email no es valido", 400);
  }

  if (!PASSWORD_REGEX.test(password)) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      "La contrasena debe tener al menos 1 mayuscula, 1 minuscula y 1 numero",
      400
    );
  }

  if (password.length < 8) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      "La contrasena debe tener al menos 8 caracteres",
      400
    );
  }

  if (pymeName.length < 3 || pymeName.length > 80) {
    throw new HandlerError(
      "VALIDATION_ERROR",
      "El nombre de la PYME debe tener entre 3 y 80 caracteres",
      400
    );
  }
}
