import { LEGAL } from "@/config/legal";
import { SUPPORT_SLA } from "@/config/support";

export const CONTACT_REASONS = [
  { value: "demo", label: "Solicitar demo" },
  { value: "ventas", label: "Comercial / planes" },
  { value: "integracion", label: "Integración" },
  { value: "soporte", label: "Soporte" },
  { value: "facturacion", label: "Facturación" },
  { value: "alianzas", label: "Alianzas" },
  { value: "otro", label: "Otro" },
] as const;

export type ContactReason = (typeof CONTACT_REASONS)[number]["value"];

export const CONTACT_SUBMIT_LABELS: Record<ContactReason, string> = {
  demo: "Agendar demo",
  ventas: "Enviar solicitud comercial",
  integracion: "Consultar integración",
  soporte: "Enviar solicitud de soporte",
  facturacion: "Consultar facturación",
  alianzas: "Proponer alianza",
  otro: "Enviar mensaje",
};

export const CONTACT_CHANNELS = [
  {
    id: "comercial",
    label: "Comercial",
    email: LEGAL.contactEmail,
    hint: "Demos, planes y alianzas",
    icon: "mail" as const,
  },
  {
    id: "soporte",
    label: "Soporte",
    email: LEGAL.contactEmail,
    hint: "Asunto: Soporte — [nombre PYME]",
    icon: "support" as const,
  },
  {
    id: "seguridad",
    label: "Seguridad",
    email: "seguridad@smartlogix.cl",
    hint: "Incidentes y vulnerabilidades",
    icon: "shield" as const,
  },
  {
    id: "privacidad",
    label: "Privacidad",
    email: LEGAL.privacyEmail,
    hint: "Datos personales y derechos ARCO",
    icon: "privacy" as const,
  },
  {
    id: "legal",
    label: "Legal",
    email: LEGAL.legalEmail,
    hint: "Contratos y notificaciones",
    icon: "legal" as const,
  },
] as const;

export const CONTACT_SLA = [
  { area: "Comercial / demo", time: "1 día hábil" },
  { area: "Soporte operativo", time: SUPPORT_SLA.firstResponse },
  { area: "Legal y privacidad", time: "Hasta 5 días hábiles" },
  {
    area: "Seguridad (incidentes)",
    time: "Prioridad — a la brevedad razonable",
  },
] as const;
