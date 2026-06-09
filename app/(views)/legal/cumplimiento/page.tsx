import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { cumplimientoPreamble, cumplimientoSections } from "./content";
import { LEGAL } from "@/config/legal";

export default function CumplimientoPage() {
  return (
    <LegalPageLayout
      eyebrow="Cumplimiento y verificación"
      title="Verificación del sitio"
      contactLabel="Canal de cumplimiento"
      summary="Guía integral para validar que la documentación legal, corporativa y los controles de consentimiento están publicados y operativos."
      updatedAt="21 de mayo de 2026"
      version="2.0"
      contactEmail={LEGAL.legalEmail}
      preamble={cumplimientoPreamble}
      sections={cumplimientoSections}
    />
  );
}
