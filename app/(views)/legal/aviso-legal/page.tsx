import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { avisoLegalSections } from "@/content/legal/aviso-legal";
import { LEGAL } from "@/config/legal";

export default function AvisoLegalPage() {
  return (
    <LegalPageLayout
      eyebrow="Información al usuario"
      title="Aviso legal"
      contactLabel="Contacto legal"
      summary="Información institucional del titular del sitio web, condiciones de uso del portal y limitaciones de responsabilidad."
      updatedAt="21 de mayo de 2026"
      version="2.0"
      contactEmail={LEGAL.legalEmail}
      sections={avisoLegalSections}
    />
  );
}
