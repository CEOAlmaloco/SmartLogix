import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { seguridadPreamble, seguridadSections } from "./content";

export default function SeguridadPage() {
  return (
    <LegalPageLayout
      eyebrow="Centro de seguridad"
      title="Seguridad de la plataforma"
      summary="Controles técnicos y operativos para proteger datos, accesos y continuidad del servicio SmartLogix."
      updatedAt="21 de mayo de 2026"
      version="2.1"
      contactEmail="seguridad@smartlogix.cl"
      contactLabel="Contacto de seguridad"
      preamble={seguridadPreamble}
      sections={seguridadSections}
    />
  );
}
