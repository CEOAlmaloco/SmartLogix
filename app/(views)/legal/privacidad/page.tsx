import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { privacidadPreamble, privacidadSections } from "@/content/legal/privacidad";
import { LEGAL } from "@/config/legal";

export default function PrivacidadPage() {
  return (
    <LegalPageLayout
      eyebrow="Privacidad y tratamiento de datos"
      title="Política de privacidad"
      summary="Cómo SmartLogix trata datos personales de usuarios, PYMEs y flujos operativos en un entorno cloud multi-tenant."
      updatedAt="21 de mayo de 2026"
      version="2.2"
      contactEmail={LEGAL.privacyEmail}
      contactLabel="Contacto de privacidad"
      preamble={privacidadPreamble}
      sections={privacidadSections}
      tocNote={
        <>
          Documento para clientes B2B y sus usuarios autorizados. Consultas:{" "}
          <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>
        </>
      }
    />
  );
}
