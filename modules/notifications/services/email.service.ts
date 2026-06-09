import { buildWelcomeTemplate } from "../templates/welcome.template";
import type { WelcomeEmailPayload } from "../types/email.types";

export async function sendWelcomeEmail({
  email,
  companyName,
}: WelcomeEmailPayload): Promise<void> {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },

    body: JSON.stringify({
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },

      to: [
        {
          email,
        },
      ],

      subject: "🎉 Bienvenido a SmartLogix",

      htmlContent: buildWelcomeTemplate({
        email,
        companyName,
      }),
    }),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Brevo Error: ${error}`);
  }
}