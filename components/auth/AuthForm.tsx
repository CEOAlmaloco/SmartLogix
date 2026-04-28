"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { TextField } from "@/components/ui/TextField";
import styles from "./AuthForm.module.css";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

type Feedback = {
  type: "success" | "error";
  message: string;
} | null;

type InputState = "default" | "error" | "success";

type FieldErrors = {
  email?: string;
  password?: string;
  pymeName?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function getPasswordValidationState(password: string) {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pymeName, setPymeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [fieldStates, setFieldStates] = useState<{
    email: InputState;
    password: InputState;
    pymeName: InputState;
  }>({
    email: "default",
    password: "default",
    pymeName: "default",
  });

  const router = useRouter();

  const isRegister = mode === "register";

  const helperLink = useMemo(() => {
    if (isRegister) {
      return {
        text: "¿Ya tienes cuenta? Inicia sesión",
        href: "/auth/login",
      };
    }

    return {
      text: "¿No tienes cuenta? Regístrate",
      href: "/auth/register",
    };
  }, [isRegister]);

  const passwordChecks = getPasswordValidationState(password.trim());
  const passwordChecksCompleted = Object.values(passwordChecks).every(Boolean);

  const validateRegister = (emailValue: string, passwordValue: string, pymeValue: string) => {
    const errors: FieldErrors = {};

    if (!emailRegex.test(emailValue)) {
      errors.email = "Ingresa un email válido";
    }

    if (!passwordRegex.test(passwordValue)) {
      errors.password =
        "Mínimo 8 caracteres, incluyendo mayúscula, minúscula y un número";
    }

    if (pymeValue.length < 3 || pymeValue.length > 80) {
      errors.pymeName = "El nombre de la PYME debe tener entre 3 y 80 caracteres";
    }

    return errors;
  };

  const validateLogin = (emailValue: string, passwordValue: string) => {
    const errors: FieldErrors = {};

    if (!emailRegex.test(emailValue)) {
      errors.email = "Ingresa un email válido";
    }

    if (!passwordValue.trim()) {
      errors.password = "Ingresa tu contraseña";
    }

    return errors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const emailValue = email.trim();
    const passwordValue = password.trim();
    const pymeValue = pymeName.trim();

    const validationErrors = isRegister
      ? validateRegister(emailValue, passwordValue, pymeValue)
      : validateLogin(emailValue, passwordValue);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setFieldStates({
        email: validationErrors.email ? "error" : "success",
        password: validationErrors.password ? "error" : "success",
        pymeName: isRegister
          ? validationErrors.pymeName
            ? "error"
            : "success"
          : "default",
      });
      return;
    }

    setFieldErrors({});
    setFieldStates({
      email: "success",
      password: "success",
      pymeName: isRegister ? "success" : "default",
    });
    setLoading(true);

    try {
      if (isRegister) {
        const registerResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailValue,
            password: passwordValue,
            pymeName: pymeValue,
          }),
        });

        const registerJson = (await registerResponse.json().catch(() => null)) as {
          message?: string;
        } | null;

        if (!registerResponse.ok) {
          throw new Error(registerJson?.message ?? "No fue posible registrar la cuenta");
        }

        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailValue,
            password: passwordValue,
          }),
        });

        const loginJson = (await loginResponse.json().catch(() => null)) as {
          message?: string;
        } | null;

        if (!loginResponse.ok) {
          setFeedback({
            type: "success",
            message:
              "Cuenta creada correctamente. Si no se inicia sesión automáticamente, confirma tu email e inicia sesión.",
          });
          return;
        }

        router.push("/dashboard");
        router.refresh();
        return;
      }

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
        }),
      });

      const loginJson = (await loginResponse.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!loginResponse.ok) {
        throw new Error(loginJson?.message || "Credenciales inválidas");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Ocurrió un error inesperado al autenticar";

      setFeedback({
        type: "error",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <TextField
        id={`${mode}-email`}
        label="Email"
        placeholder="empresa@correo.com"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => {
          const nextValue = event.target.value;
          setEmail(nextValue);

          const trimmed = nextValue.trim();
          if (!trimmed) {
            setFieldStates((prev) => ({ ...prev, email: "default" }));
            setFieldErrors((prev) => ({ ...prev, email: undefined }));
            return;
          }

          if (emailRegex.test(trimmed)) {
            setFieldStates((prev) => ({ ...prev, email: "success" }));
            setFieldErrors((prev) => ({ ...prev, email: undefined }));
            return;
          }

          setFieldStates((prev) => ({ ...prev, email: "error" }));
          setFieldErrors((prev) => ({ ...prev, email: "Ingresa un email válido" }));
        }}
        state={fieldStates.email}
        error={fieldErrors.email}
        required
      />

      <TextField
        id={`${mode}-password`}
        label="Contraseña"
        placeholder="Mínimo 8 caracteres"
        type="password"
        autoComplete={isRegister ? "new-password" : "current-password"}
        value={password}
        onChange={(event) => {
          const nextValue = event.target.value;
          setPassword(nextValue);

          const trimmed = nextValue.trim();
          if (!trimmed) {
            setFieldStates((prev) => ({ ...prev, password: "default" }));
            setFieldErrors((prev) => ({ ...prev, password: undefined }));
            return;
          }

          if (isRegister) {
            if (passwordRegex.test(trimmed)) {
              setFieldStates((prev) => ({ ...prev, password: "success" }));
              setFieldErrors((prev) => ({ ...prev, password: undefined }));
            } else {
              setFieldStates((prev) => ({ ...prev, password: "error" }));
              setFieldErrors((prev) => ({
                ...prev,
                password: "La contraseña aún no cumple todos los requisitos",
              }));
            }

            return;
          }

          setFieldStates((prev) => ({ ...prev, password: "success" }));
          setFieldErrors((prev) => ({ ...prev, password: undefined }));
        }}
        state={fieldStates.password}
        error={fieldErrors.password}
        required
      />

      {isRegister ? (
        <>
          <ul className={styles.passwordChecklist}>
            <li className={passwordChecks.minLength ? styles.met : styles.unmet}>
              <span aria-hidden>{passwordChecks.minLength ? "✓" : "○"}</span> Mínimo 8 caracteres
            </li>
            <li className={passwordChecks.hasUppercase ? styles.met : styles.unmet}>
              <span aria-hidden>{passwordChecks.hasUppercase ? "✓" : "○"}</span> Al menos una mayúscula
            </li>
            <li className={passwordChecks.hasLowercase ? styles.met : styles.unmet}>
              <span aria-hidden>{passwordChecks.hasLowercase ? "✓" : "○"}</span> Al menos una minúscula
            </li>
            <li className={passwordChecks.hasNumber ? styles.met : styles.unmet}>
              <span aria-hidden>{passwordChecks.hasNumber ? "✓" : "○"}</span> Al menos un número
            </li>
          </ul>

          <TextField
            id="register-pyme"
            label="Nombre de tu PYME"
            placeholder="Ej: Bodega Norte"
            type="text"
            autoComplete="organization"
            value={pymeName}
            onChange={(event) => {
              const nextValue = event.target.value;
              setPymeName(nextValue);

              const trimmed = nextValue.trim();
              if (!trimmed) {
                setFieldStates((prev) => ({ ...prev, pymeName: "default" }));
                setFieldErrors((prev) => ({ ...prev, pymeName: undefined }));
                return;
              }

              if (trimmed.length >= 3 && trimmed.length <= 80) {
                setFieldStates((prev) => ({ ...prev, pymeName: "success" }));
                setFieldErrors((prev) => ({ ...prev, pymeName: undefined }));
                return;
              }

              setFieldStates((prev) => ({ ...prev, pymeName: "error" }));
              setFieldErrors((prev) => ({
                ...prev,
                pymeName: "El nombre de la PYME debe tener entre 3 y 80 caracteres",
              }));
            }}
            state={fieldStates.pymeName}
            error={fieldErrors.pymeName}
            required
          />
          {password && passwordChecksCompleted ? (
            <p className={styles.passwordReady}>Contraseña lista para crear tu cuenta.</p>
          ) : null}
        </>
      ) : null}

      {feedback ? <StatusMessage variant={feedback.type} message={feedback.message} /> : null}

      <Button type="submit" loading={loading}>
        {isRegister ? "Crear cuenta" : "Iniciar sesión"}
      </Button>

      <p className={styles.switchAuth}>
        <Link href={helperLink.href}>{helperLink.text}</Link>
      </p>
    </form>
  );
}
