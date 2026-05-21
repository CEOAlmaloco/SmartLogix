import { LegalPageLayout, type LegalSection } from "@/components/legal/LegalPageLayout";

export default function PrivacidadPage() {
  const sections: LegalSection[] = [
    {
      id: "datos",
      title: "Qué datos recopilamos",
      content: (
        <ul>
          <li>Identidad de cuenta: correo y metadatos de autenticación.</li>
          <li>Datos de organización: razón social, RUT y datos de operación.</li>
          <li>Datos transaccionales: inventario, pedidos, envíos y estados logísticos.</li>
        </ul>
      ),
    },
    {
      id: "uso",
      title: "Cómo usamos la información",
      content: (
        <p>
          Utilizamos los datos para operar la plataforma, habilitar trazabilidad,
          generar métricas del servicio, gestionar soporte y fortalecer medidas
          de seguridad técnica y operativa.
        </p>
      ),
    },
    {
      id: "terceros",
      title: "Con quién compartimos datos",
      content: (
        <p>
          SmartLogix utiliza Supabase como proveedor de infraestructura para
          autenticación, base de datos y servicios asociados. No comercializamos
          datos personales con terceros.
        </p>
      ),
    },
    {
      id: "derechos",
      title: "Derechos del titular",
      content: (
        <p>
          Usted puede solicitar acceso, rectificación, eliminación o limitación
          del tratamiento de datos personales escribiendo al canal oficial de
          privacidad.
        </p>
      ),
    },
  ];

  return (
    <LegalPageLayout
      eyebrow="Protección de Datos"
      title="Política de privacidad"
      summary="Transparencia sobre los datos que procesamos, su finalidad y los mecanismos de control disponibles para nuestros clientes."
      updatedAt="21 mayo 2026"
      contactEmail="privacidad@smartlogix.cl"
      highlights={["Datos Operativos", "Supabase", "Derechos ARCO"]}
      sections={sections}
    />
  );
}
