import type { WelcomeEmailPayload } from "../types/email.types";

export function buildWelcomeTemplate({
  email,
  companyName,
}: WelcomeEmailPayload): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
      <h1>🎉 Bienvenido a SmartLogix</h1>

      <p>Hola <strong>${email}</strong>,</p>

      <p>
        La organización <strong>${companyName}</strong> fue registrada correctamente.
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