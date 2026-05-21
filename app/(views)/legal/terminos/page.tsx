import { LegalPageLayout, type LegalSection } from "@/components/legal/LegalPageLayout";

export default function TerminosPage() {
  const sections: LegalSection[] = [
    {
      id: "servicio",
      title: "Descripción del servicio",
      content: (
        <p>
          SmartLogix es una plataforma SaaS para la gestión de inventario, pedidos
          y envíos en operaciones de eCommerce. El servicio incluye acceso web,
          API interna y módulos de trazabilidad para PYMEs.
        </p>
      ),
    },
    {
      id: "uso",
      title: "Condiciones de uso",
      content: (
        <ul>
          <li>La cuenta debe operar con información real y verificable.</li>
          <li>No se permite uso para actividades ilícitas o fraudulentas.</li>
          <li>El cliente debe respetar límites técnicos y políticas de disponibilidad.</li>
          <li>El uso de credenciales compartidas queda bajo responsabilidad del cliente.</li>
        </ul>
      ),
    },
    {
      id: "responsabilidades",
      title: "Responsabilidades del usuario (PYME)",
      content: (
        <p>
          Cada PYME es responsable de custodiar sus accesos, mantener sus datos
          operativos actualizados y validar la información de inventario, pedidos
          y despacho registrada en la plataforma.
        </p>
      ),
    },
    {
      id: "suspension",
      title: "Suspensión de cuenta",
      content: (
        <p>
          SmartLogix podrá suspender cuentas ante incumplimientos de este acuerdo,
          sospecha razonable de abuso o requerimientos legales. Cuando aplique,
          se informará el motivo de la suspensión y el canal de revisión.
        </p>
      ),
    },
    {
      id: "jurisdiccion",
      title: "Jurisdicción aplicable",
      content: (
        <p>
          Este acuerdo se rige por la legislación de la República de Chile y
          cualquier controversia será conocida por los tribunales competentes
          del país.
        </p>
      ),
    },
  ];

  return (
    <LegalPageLayout
      eyebrow="Marco Legal"
      title="Términos de servicio"
      summary="Condiciones contractuales para el uso de SmartLogix por parte de organizaciones y equipos operativos."
      updatedAt="21 mayo 2026"
      contactEmail="legal@smartlogix.cl"
      highlights={["SaaS B2B", "Cumplimiento", "Jurisdicción Chile"]}
      sections={sections}
    />
  );
}
