import { LegalPageLayout, type LegalSection } from "@/components/legal/LegalPageLayout";

export default function CookiesPage() {
  const sections: LegalSection[] = [
    {
      id: "tipos",
      title: "Cookies que utiliza SmartLogix",
      content: (
        <p>
          Utilizamos cookies técnicas de sesión asociadas a Supabase Auth para
          mantener la autenticación y la continuidad segura entre solicitudes.
        </p>
      ),
    },
    {
      id: "finalidad",
      title: "Finalidad",
      content: (
        <ul>
          <li>Mantener sesiones activas de usuarios autenticados.</li>
          <li>Evitar reautenticaciones innecesarias durante la operación.</li>
          <li>Aplicar controles de seguridad de sesión.</li>
        </ul>
      ),
    },
    {
      id: "gestion",
      title: "Cómo desactivarlas",
      content: (
        <p>
          Puede gestionar o bloquear cookies desde su navegador. Si se desactivan,
          ciertas funciones que dependen de autenticación persistente podrían no
          funcionar correctamente.
        </p>
      ),
    },
    {
      id: "no-tracking",
      title: "Sin publicidad ni tracking de terceros",
      content: (
        <p>
          SmartLogix no implementa cookies de publicidad, perfilado comercial
          ni rastreo de terceros para campañas de marketing.
        </p>
      ),
    },
  ];

  return (
    <LegalPageLayout
      eyebrow="Navegación Segura"
      title="Política de cookies"
      summary="Uso mínimo y transparente de cookies técnicas necesarias para mantener la sesión y la seguridad operativa."
      updatedAt="21 mayo 2026"
      contactEmail="privacidad@smartlogix.cl"
      highlights={["Solo Técnicas", "Sin Ads", "Sesión Segura"]}
      sections={sections}
    />
  );
}
