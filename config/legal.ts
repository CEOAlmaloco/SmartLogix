/**
 * Enlaces y textos legales centralizados (footer, registro, cumplimiento).
 */

export const LEGAL = {
  companyName: "SmartLogix SpA",
  brandName: "SmartLogix",
  contactEmail: "contacto@smartlogix.cl",
  legalEmail: "legal@smartlogix.cl",
  privacyEmail: "privacidad@smartlogix.cl",
  copyrightYear: 2026,
  country: "Chile",
  /** Aviso fijo en pie de página (home y minimal). */
  stageNotice:
    "SmartLogix se encuentra actualmente en etapa de desarrollo, validación y demostración académica. Algunas funciones pueden cambiar, limitarse o no representar un servicio comercial definitivo.",
} as const;

export type FooterLink = {
  href: string;
  label: string;
};

/** Footer completo — solo página principal (home). */
export const FOOTER_HOME = {
  producto: [
    { href: "/#features", label: "Funcionalidades" },
    { href: "/#pricing", label: "Precios" },
    { href: "/#integrations", label: "Integraciones" },
  ],
  legal: [
    { href: "/legal/terminos", label: "Términos" },
    { href: "/legal/privacidad", label: "Privacidad" },
    { href: "/legal/cookies", label: "Cookies" },
    { href: "/legal/seguridad", label: "Seguridad" },
  ],
  empresa: [
    { href: "/about", label: "Quiénes somos" },
    { href: "/contact", label: "Contacto" },
  ],
} as const satisfies Record<string, FooterLink[]>;

/** Footer simple — auth, panel, páginas legales y corporativas. */
export const FOOTER_MINIMAL_LINKS: FooterLink[] = [
  { href: "/legal/terminos", label: "Términos" },
  { href: "/legal/privacidad", label: "Privacidad" },
  { href: "/legal/cookies", label: "Cookies" },
  { href: "/contact", label: "Contacto" },
];

/** Rutas para auditoría en /legal/cumplimiento */
export const COMPLIANCE_REQUIRED_ROUTES = [
  "/legal/terminos",
  "/legal/privacidad",
  "/legal/cookies",
  "/legal/aviso-legal",
  "/legal/seguridad",
  "/legal/cumplimiento",
  "/about",
  "/contact",
  "/blog",
  "/",
  "/auth/register",
] as const;

/** Preferencias granulares (JSON). */
export const COOKIE_CONSENT_KEY = "smartlogix_cookie_consent_v2";
/** Valores legacy: "accepted" | "essential" */
export const COOKIE_CONSENT_KEY_LEGACY = "smartlogix_cookie_consent_v1";
