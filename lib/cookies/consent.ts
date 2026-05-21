import { COOKIE_CONSENT_KEY, COOKIE_CONSENT_KEY_LEGACY } from "@/config/legal";

export type CookieCategoryId = "necessary" | "preferences" | "analytics" | "marketing";

export type CookieConsentPreferences = {
  /** Siempre true; cookies de sesión, auth y seguridad. */
  necessary: true;
  /** Preferencias de interfaz (idioma, tema, etc.). */
  preferences: boolean;
  /** Métricas agregadas (Vercel Analytics, PostHog, etc.). */
  analytics: boolean;
  /** No utilizamos marketing; se guarda siempre en false. */
  marketing: false;
  savedAt: string;
};

export const COOKIE_CATEGORY_META: {
  id: CookieCategoryId;
  label: string;
  description: string;
  required: boolean;
  used: boolean;
}[] = [
  {
    id: "necessary",
    label: "Necesarias",
    description:
      "Permiten funciones básicas como navegación, acceso al panel y autenticación segura. El sitio no puede operar sin ellas.",
    required: true,
    used: true,
  },
  {
    id: "preferences",
    label: "Preferencias",
    description:
      "Recuerdan opciones que cambian el comportamiento del sitio (por ejemplo, elecciones de interfaz).",
    required: false,
    used: true,
  },
  {
    id: "analytics",
    label: "Estadísticas",
    description:
      "Ayudan a comprender el uso del servicio de forma agregada y anónima para mejorar rendimiento y experiencia.",
    required: false,
    used: true,
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "No utilizamos cookies de publicidad ni seguimiento publicitario en SmartLogix.",
    required: false,
    used: false,
  },
];

export const COOKIE_CONSENT_EVENT = "smartlogix:cookie-consent";

const ESSENTIAL_ONLY: CookieConsentPreferences = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
  savedAt: "",
};

const ACCEPT_ALL: Omit<CookieConsentPreferences, "savedAt"> = {
  necessary: true,
  preferences: true,
  analytics: true,
  marketing: false,
};

function withTimestamp(
  prefs: Omit<CookieConsentPreferences, "savedAt">
): CookieConsentPreferences {
  return { ...prefs, savedAt: new Date().toISOString() };
}

export function essentialOnlyPreferences(): CookieConsentPreferences {
  return withTimestamp(ESSENTIAL_ONLY);
}

export function acceptAllPreferences(): CookieConsentPreferences {
  return withTimestamp(ACCEPT_ALL);
}

export function parseStoredConsent(raw: string | null): CookieConsentPreferences | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CookieConsentPreferences;
    if (parsed && parsed.necessary === true && typeof parsed.savedAt === "string") {
      return {
        necessary: true,
        preferences: Boolean(parsed.preferences),
        analytics: Boolean(parsed.analytics),
        marketing: false,
        savedAt: parsed.savedAt,
      };
    }
  } catch {
    /* legacy string */
  }
  if (raw === "accepted") return acceptAllPreferences();
  if (raw === "essential") return essentialOnlyPreferences();
  return null;
}

export function readCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const current = parseStoredConsent(localStorage.getItem(COOKIE_CONSENT_KEY));
    if (current) return current;
    const legacy = parseStoredConsent(localStorage.getItem(COOKIE_CONSENT_KEY_LEGACY));
    if (legacy) {
      writeCookieConsent(legacy);
      return legacy;
    }
  } catch {
    return null;
  }
  return null;
}

export function writeCookieConsent(prefs: CookieConsentPreferences): void {
  if (typeof window === "undefined") return;
  const record = withTimestamp({
    necessary: true,
    preferences: prefs.preferences,
    analytics: prefs.analytics,
    marketing: false,
  });
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
    localStorage.removeItem(COOKIE_CONSENT_KEY_LEGACY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: record }));
}

export function hasStoredCookieConsent(): boolean {
  return readCookieConsent() !== null;
}

export function hasAnalyticsConsent(): boolean {
  return readCookieConsent()?.analytics === true;
}

export function hasPreferencesConsent(): boolean {
  return readCookieConsent()?.preferences === true;
}
