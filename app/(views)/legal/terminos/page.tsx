import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { terminosPreamble, terminosSections } from "@/content/legal/terminos";
import { LEGAL } from "@/config/legal";

export default function TerminosPage() {
  return (
    <LegalPageLayout
      eyebrow="Términos y Condiciones"
      title="Contrato de Servicio"
      summary="Condiciones de uso de SmartLogix para PYMEs y equipos que gestionan inventario, pedidos y envíos de eCommerce en Chile."
      updatedAt="21 de mayo de 2026"
      version="2.2"
      contactEmail={LEGAL.legalEmail}
      contactLabel="Consultas contractuales"
      preamble={terminosPreamble}
      sections={terminosSections}
      tocNote={
        <>
          Aplicable a clientes PYME registrados en la plataforma. Consultas:{" "}
          <a href={`mailto:${LEGAL.legalEmail}`}>{LEGAL.legalEmail}</a>
        </>
      }
    />
  );
}
