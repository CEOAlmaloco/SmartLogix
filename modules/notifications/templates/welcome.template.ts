import type { WelcomeEmailPayload } from "../types/email.types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildWelcomeTemplate({
  email,
  companyName,
}: WelcomeEmailPayload): string {
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(companyName);

  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
      <h1>🎉 Bienvenido a SmartLogix</h1>

      <p>Hola <strong>${safeEmail}</strong>,</p>

      <p>
        La organización <strong>${safeCompany}</strong> fue registrada correctamente.
      </p>

      <p>
        Desde este momento podrás administrar:
      </p>

      <ul>
        <li>📦 Inventario</li>
        <li>🛒 Pedidos</li>
        <li>🚚 Envíos</li>
      </ul>

      <p>
        Gracias por confiar en SmartLogix.
      </p>

      <hr>

      <small>
        Este es un correo automático, no responder.
      </small>
    </div>
  `;
}
