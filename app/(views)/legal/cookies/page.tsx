import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { cookiesPreamble, cookiesSections } from "./content";
import { LEGAL } from "@/config/legal";

export default function CookiesPage() {
  return (
    <LegalPageLayout
      eyebrow="Cookies y almacenamiento local"
      title="Política de cookies"
      summary="Cookies, localStorage y tecnologías técnicas en el sitio público y en el panel de SmartLogix, con consentimiento claro entre esenciales y opcionales."
      updatedAt="21 de mayo de 2026"
      version="2.3"
      contactEmail={LEGAL.privacyEmail}
      contactLabel="Consultas de privacidad"
      preamble={cookiesPreamble}
      sections={cookiesSections}
      tocNote={
        <>
          Preferencias y consultas:{" "}
          <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>
        </>
      }
    />
  );
}
