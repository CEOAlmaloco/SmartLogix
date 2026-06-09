import Link from "next/link";
import type { LegalSection } from "@/components/legal/LegalPageLayout";
import { LEGAL } from "@/config/legal";

export const seguridadPreamble = (
  <p>
    Controles de seguridad aplicados por {LEGAL.brandName}. La seguridad es un proceso continuo;
    aquí publicamos prácticas vigentes y evolución del programa.
  </p>
);

export const seguridadSections: LegalSection[] = [
  {
    id: "alcance",
    title: "Alcance y responsabilidad compartida",
    content: (
      <>
        <p>
          {LEGAL.companyName} protege la infraestructura, el código y los controles de la
          plataforma. Cada PYME es responsable de sus credenciales, dispositivos de acceso y del
          uso que sus usuarios autorizados hagan del sistema.
        </p>
        <p>
          Consultas o reportes de seguridad:{" "}
          <a href="mailto:seguridad@smartlogix.cl">seguridad@smartlogix.cl</a>.
        </p>
      </>
    ),
  },
  {
    id: "acceso",
    title: "Acceso e identidad",
    content: (
      <>
        <p>
          La autenticación utiliza un <strong>proveedor de autenticación administrada</strong> con
          contraseñas almacenadas de forma segura y <strong>tokens JWT de corta duración</strong> para
          validar sesiones. Los permisos se asignan por rol dentro de cada organización.
        </p>
        <ul>
          <li>Requisitos de contraseña en el registro (longitud y complejidad).</li>
          <li>Cierre de sesión y revocación al cambiar credenciales.</li>
          <li>Acceso de plataforma global limitado a administradores de {LEGAL.companyName}.</li>
          <li>
            <strong>Autenticación multifactor (MFA/2FA):</strong> en evaluación para planes
            empresariales; se anunciará en el panel cuando esté disponible.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "datos",
    title: "Protección de datos",
    content: (
      <>
        <p>
          Las comunicaciones con la plataforma usan <strong>HTTPS (TLS 1.2+)</strong>. Los datos en
          reposo se alojan en <strong>infraestructura cloud administrada</strong> (Supabase / AWS),
          con cifrado en reposo gestionado por el proveedor (habitualmente <strong>AES-256</strong> en
          almacenamiento y bases administradas).
        </p>
        <p>
          En base de datos aplicamos <strong>Row Level Security (RLS)</strong>: aislamiento lógico
          entre organizaciones, de modo que cada consulta en contexto de usuario solo accede a los
          datos de su PYME.
        </p>
      </>
    ),
  },
  {
    id: "monitoreo",
    title: "Monitoreo y registro",
    content: (
      <>
        <p>
          Registramos eventos relevantes de acceso y errores críticos para detectar anomalías y
          apoyar investigaciones. Los logs operativos se conservan por un período acotado (orientativo:
          hasta 90 días) y no incluyen contraseñas ni secretos.
        </p>
        <p>
          Revisamos de forma periódica intentos de acceso fallidos y patrones inusuales en cuentas
          administrativas.
        </p>
      </>
    ),
  },
  {
    id: "backups",
    title: "Copias de seguridad",
    content: (
      <p>
        Ejecutamos <strong>respaldos automatizados diarios</strong> de la base de datos con retención
        orientativa de treinta (30) días, según la política del proveedor cloud. Las restauraciones se
        prueban en entornos no productivos de forma periódica.
      </p>
    ),
  },
  {
    id: "disponibilidad",
    title: "Disponibilidad",
    content: (
      <p>
        {LEGAL.brandName} opera con un <strong>objetivo de disponibilidad mensual del 99%</strong>,
        excluyendo mantenimientos programados y causas fuera de nuestro control (conectividad o
        proveedores externos de infraestructura). El detalle contractual figura en los{" "}
        <Link href="/legal/terminos">Términos de servicio</Link>.
      </p>
    ),
  },
  {
    id: "desarrollo",
    title: "Desarrollo y despliegue",
    content: (
      <p>
        El código pasa por revisión antes de integrarse a ramas principales. Secretos y claves no se
        versionan en el repositorio; se gestionan como variables de entorno en el hosting. Los
        despliegues a producción dejan <strong>trazabilidad auditable</strong> (registros de release
        y control de versiones).
      </p>
    ),
  },
  {
    id: "roadmap",
    title: "Evolución del programa",
    content: (
      <p>
        En desarrollo: MFA/2FA para planes empresariales, alertas de acceso, auditoría de eventos,
        exportación de logs y gestión de sesiones activas. Las novedades se anuncian en el panel.
      </p>
    ),
  },
  {
    id: "incidentes",
    title: "Incidentes y divulgación responsable",
    content: (
      <>
        <p>
          Si detecta una vulnerabilidad, escriba a{" "}
          <a href="mailto:seguridad@smartlogix.cl">seguridad@smartlogix.cl</a> con descripción,
          pasos para reproducir y alcance estimado. Agradecemos la divulgación coordinada antes de
          publicar detalles técnicos.
        </p>
        <p>
          Ante un incidente confirmado que afecte datos personales, notificaremos al cliente{" "}
          <strong>a la brevedad razonable</strong>, indicando naturaleza del evento, datos
          potencialmente involucrados y medidas tomadas, en línea con la{" "}
          <Link href="/legal/privacidad">Política de privacidad</Link>.
        </p>
      </>
    ),
  },
  {
    id: "cumplimiento",
    title: "Documentación relacionada",
    content: (
      <p>
        Esta política complementa la{" "}
        <Link href="/legal/privacidad">Política de privacidad</Link>, los{" "}
        <Link href="/legal/terminos">Términos de servicio</Link> y la página de{" "}
        <Link href="/legal/cumplimiento">Cumplimiento y verificación</Link> del sitio.
      </p>
    ),
  },
];
