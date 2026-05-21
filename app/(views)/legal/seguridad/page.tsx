import { LegalPageLayout, type LegalSection } from "@/components/legal/LegalPageLayout";

export default function SeguridadPage() {
  const sections: LegalSection[] = [
    {
      id: "https",
      title: "Comunicación cifrada",
      content: (
        <p>
          Todas las comunicaciones con SmartLogix se realizan por HTTPS. Esto
          protege los datos en tránsito y minimiza riesgos de interceptación.
        </p>
      ),
    },
    {
      id: "jwt",
      title: "Autenticación y sesiones",
      content: (
        <p>
          Usamos Supabase Auth con tokens JWT para validar identidad y permisos.
          El ciclo de sesión está sujeto a controles de expiración y renovación
          segura conforme a la arquitectura de la plataforma.
        </p>
      ),
    },
    {
      id: "rls",
      title: "Aislamiento por tenant",
      content: (
        <p>
          La base de datos aplica Row Level Security (RLS) para separar datos por
          organización, evitando accesos cruzados entre cuentas de distintos tenants.
        </p>
      ),
    },
    {
      id: "incidentes",
      title: "Reporte de vulnerabilidades",
      content: (
        <p>
          Si detecta una vulnerabilidad, reporte de forma responsable a
          seguridad@smartlogix.cl incluyendo evidencia reproducible y alcance.
        </p>
      ),
    },
  ];

  return (
    <LegalPageLayout
      eyebrow="Confianza y Seguridad"
      title="Seguridad de la plataforma"
      summary="Controles técnicos para proteger identidad, sesiones y datos de cada PYME dentro de SmartLogix."
      updatedAt="21 mayo 2026"
      contactEmail="seguridad@smartlogix.cl"
      highlights={["HTTPS", "JWT", "RLS Multi-tenant"]}
      sections={sections}
    />
  );
}
