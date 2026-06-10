import { BREVO_ENV } from "@/config/env";
import { buildWelcomeTemplate } from "./notifications.template";
import type { WelcomeEmailPayload } from "./notifications.types";

export async function sendWelcomeEmail({
  email,
  companyName,
}: WelcomeEmailPayload): Promise<void> {
  if (!BREVO_ENV.isConfigured()) {
    console.warn(
      "[notifications] Brevo no configurado (BREVO_API_KEY / BREVO_SENDER_EMAIL); se omite el correo de bienvenida."
    );
    return;
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_ENV.apiKey(),
    },
    body: JSON.stringify({
      sender: {
        name: BREVO_ENV.senderName(),
        email: BREVO_ENV.senderEmail(),
      },
      to: [{ email }],
      subject: "Bienvenido a SmartLogix",
      htmlContent: buildWelcomeTemplate({ email, companyName }),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[notifications] Brevo respondió con error:", response.status, errorBody);
    throw new Error("No se pudo enviar el correo de bienvenida");
  }
}
