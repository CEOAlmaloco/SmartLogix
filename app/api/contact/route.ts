import { NextResponse } from "next/server";
import { CONTACT_REASONS, type ContactReason } from "@/config/contact";
import { LEGAL } from "@/config/legal";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const MAX_FIELD = 2000;

type ContactBody = {
  name?: string;
  company?: string;
  email?: string;
  reason?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_REASONS = new Set(CONTACT_REASONS.map((r) => r.value));

function buildMailto(body: ContactBody) {
  const reasonLabel =
    CONTACT_REASONS.find((r) => r.value === body.reason)?.label ?? body.reason ?? "Consulta";
  const subject = `[SmartLogix] ${reasonLabel} — ${body.company ?? body.name}`;
  const text = [
    `Nombre: ${body.name}`,
    `Empresa: ${body.company}`,
    `Correo: ${body.email}`,
    `Motivo: ${reasonLabel}`,
    "",
    body.message,
  ].join("\n");

  const params = new URLSearchParams({
    subject,
    body: text,
  });

  return `mailto:${LEGAL.contactEmail}?${params.toString()}`;
}

async function sendViaResend(body: ContactBody) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_INBOX_EMAIL ?? LEGAL.contactEmail;
  const from = process.env.RESEND_FROM_EMAIL ?? "SmartLogix <onboarding@resend.dev>";

  if (!apiKey) return { sent: false as const };

  const reasonLabel =
    CONTACT_REASONS.find((r) => r.value === body.reason)?.label ?? body.reason;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: body.email,
      subject: `[Contacto web] ${reasonLabel} — ${body.company}`,
      text: [
        `Nombre: ${body.name}`,
        `Empresa: ${body.company}`,
        `Correo: ${body.email}`,
        `Motivo: ${reasonLabel}`,
        "",
        body.message,
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error("Resend error:", res.status, err);
    return { sent: false as const };
  }

  return { sent: true as const };
}

export async function POST(request: Request) {
  const limit = rateLimit(`contact:${getClientIp(request)}`, 5, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Demasiados mensajes. Intenta más tarde." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let json: ContactBody;

  try {
    json = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ message: "Solicitud inválida" }, { status: 400 });
  }

  const name = json.name?.trim() ?? "";
  const company = json.company?.trim() ?? "";
  const email = json.email?.trim() ?? "";
  const reason = json.reason?.trim() ?? "";
  const message = json.message?.trim() ?? "";

  if (!name || name.length < 2) {
    return NextResponse.json({ message: "Indica tu nombre" }, { status: 400 });
  }
  if (!company || company.length < 2) {
    return NextResponse.json({ message: "Indica el nombre de la empresa" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ message: "Correo inválido" }, { status: 400 });
  }
  if (!VALID_REASONS.has(reason as ContactReason)) {
    return NextResponse.json({ message: "Selecciona un motivo válido" }, { status: 400 });
  }
  if (!message || message.length < 10) {
    return NextResponse.json({ message: "El mensaje debe tener al menos 10 caracteres" }, { status: 400 });
  }
  if (
    name.length > MAX_FIELD ||
    company.length > MAX_FIELD ||
    email.length > MAX_FIELD ||
    message.length > MAX_FIELD
  ) {
    return NextResponse.json({ message: "Uno o más campos exceden el tamaño permitido" }, { status: 400 });
  }

  const payload = { name, company, email, reason, message };

  const resend = await sendViaResend(payload);
  if (resend.sent) {
    return NextResponse.json({
      ok: true,
      mode: "email",
      message: "Mensaje enviado. Te responderemos a la brevedad.",
    });
  }

  return NextResponse.json({
    ok: true,
    mode: "mailto",
    mailto: buildMailto(payload),
    message:
      "Tu mensaje está listo. Se abrirá tu cliente de correo para enviarlo a nuestro equipo.",
  });
}
