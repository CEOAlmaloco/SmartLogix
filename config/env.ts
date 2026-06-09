/**
 * Acceso centralizado a variables de entorno.
 * Si una variable es obligatoria y no esta definida, lanzamos al iniciar
 * para fallar rapido en vez de explotar dentro de un handler.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable de entorno requerida no definida: ${name}`);
  }
  return value;
}

function optional(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const PUBLIC_ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
} as const;

export const SERVER_ENV = {
  SUPABASE_SERVICE_ROLE_KEY: () => required("SUPABASE_SERVICE_ROLE_KEY"),
  NODE_ENV: () => optional("NODE_ENV", "development"),
};

export const ENV = {
  SUPABASE_URL: () => required("NEXT_PUBLIC_SUPABASE_URL"),
  SUPABASE_ANON_KEY: () => required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  ...SERVER_ENV,
};

/** Brevo (opcional): correo de bienvenida al registrar una PYME. */
export const BREVO_ENV = {
  isConfigured(): boolean {
    const apiKey = process.env.BREVO_API_KEY?.trim();
    const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
    return Boolean(apiKey && senderEmail);
  },
  apiKey: () => optional("BREVO_API_KEY"),
  senderName: () => optional("BREVO_SENDER_NAME", "SmartLogix"),
  senderEmail: () => optional("BREVO_SENDER_EMAIL"),
};
