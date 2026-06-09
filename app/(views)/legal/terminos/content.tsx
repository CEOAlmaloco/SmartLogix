import Link from "next/link";
import type { LegalSection } from "@/components/legal/LegalPageLayout";
import { LegalHighlight, LegalKeyPoints, LegalNotice } from "@/components/legal/LegalBlocks";
import { LEGAL } from "@/config/legal";
import { SUPPORT_SLA } from "@/config/support";

export const terminosPreamble = (
  <p>
    Contrato de uso de {LEGAL.brandName} para <strong>empresas y personas con actividad comercial</strong>{" "}
    que registran una organización (el &quot;Cliente&quot; o la &quot;PYME&quot;). Al usar la
    plataforma acepta este documento, la <Link href="/legal/privacidad">Política de privacidad</Link>{" "}
    y la <Link href="/legal/cookies">Política de cookies</Link>.
  </p>
);

export const terminosSections: LegalSection[] = [
  {
    id: "definiciones",
    title: "Definiciones",
    content: (
      <>
        <LegalKeyPoints
          items={[
            "Plataforma: aplicación web y APIs de SmartLogix.",
            "Datos del Cliente: inventario, pedidos, envíos y configuración de la PYME.",
            "Usuario autorizado: persona con credenciales propias habilitada por el Cliente.",
            "Proveedor: tercero de infraestructura (alojamiento y autenticación).",
          ]}
        />
        <p>En singular o plural, según corresponda al contexto.</p>
      </>
    ),
  },
  {
    id: "objeto",
    title: "Objeto del servicio",
    content: (
      <>
        <p>
          {LEGAL.companyName} otorga una licencia no exclusiva, intransferible y revocable para usar
          la Plataforma con fines de gestión logística de eCommerce: stock, pedidos, despachos y
          métricas operativas.
        </p>
        <p>
          El servicio opera en modalidad <strong>cloud multi-tenant</strong> con aislamiento lógico
          por organización. La disponibilidad se describe en el capítulo de nivel de servicio.
        </p>
        <LegalKeyPoints
          items={[
            "Panel web para usuarios de la PYME.",
            "Trazabilidad de inventario, pedidos y envíos.",
            "Roles básicos y segregación por organización.",
          ]}
        />
      </>
    ),
  },
  {
    id: "funciones-beta",
    title: "Funciones beta",
    content: (
      <>
        <p>
          Ocasionalmente publicamos módulos, integraciones o mejoras marcadas como versión{" "}
          <strong>beta</strong> o en modo <strong>preview</strong>. Pueden cambiar, interrumpirse o
          retirarse sin previo aviso extendido.
        </p>
        <LegalNotice title="Limitaciones de funciones beta">
          <p>
            Las funciones beta se ofrecen &quot;tal cual&quot;, pueden contener errores y no forman
            parte del SLA estándar hasta su lanzamiento general. El feedback del Cliente puede usarse
            para mejorar el producto.
          </p>
        </LegalNotice>
      </>
    ),
  },
  {
    id: "registro",
    title: "Registro y cuentas",
    content: (
      <>
        <p>
          El Cliente debe registrar información veraz (razón social, RUT u otro ID fiscal, contacto
          operativo). {LEGAL.companyName} puede solicitar respaldo documental y aplicar{" "}
          <strong>revisión previa</strong> antes de habilitar producción.
        </p>
        <p>
          El Cliente custodia credenciales, define quién tiene acceso y revoca usuarios que dejen la
          organización. Las acciones bajo cuentas habilitadas por el Cliente se consideran realizadas
          con su autorización.
        </p>
      </>
    ),
  },
  {
    id: "uso-aceptable",
    title: "Uso aceptable",
    content: (
      <>
        <p>Está prohibido:</p>
        <ul>
          <li>Usar la Plataforma para actividades ilícitas o fraudulentas.</li>
          <li>Acceder a datos de otras organizaciones o eludir controles de seguridad.</li>
          <li>Introducir malware, scraping masivo no autorizado o sobrecarga deliberada.</li>
          <li>Revender el acceso sin acuerdo comercial específico.</li>
        </ul>
        <LegalNotice title="Incumplimiento">
          <p>
            Puede derivar en suspensión, conservación de evidencias y comunicación a autoridades
            cuando corresponda.
          </p>
        </LegalNotice>
      </>
    ),
  },
  {
    id: "datos",
    title: "Datos y confidencialidad",
    content: (
      <>
        <p>
          El Cliente es titular de sus Datos. {LEGAL.companyName} actúa como encargado del
          tratamiento de datos personales que el Cliente incorpore en su operación;
          el Cliente debe tener base legal frente a sus clientes finales.
        </p>
        <p>
          Podemos usar datos agregados y anonimizados para estadísticas de producto. Detalle en{" "}
          <Link href="/legal/privacidad">Política de Privacidad</Link>.
        </p>
        <h3>Retención y eliminación</h3>
        <ul>
          <li>
            Datos operativos: mientras la cuenta esté activa y el período necesario para soporte y
            obligaciones legales.
          </li>
          <li>
            Tras cierre: exportación disponible por treinta (30) días; luego eliminación o
            anonimización en ciclos de backup según política publicada.
          </li>
          <li>Logs técnicos: retención acotada (orientativo: hasta 90 días).</li>
        </ul>
        <p>Confidencialidad mutua por tres (3) años tras el término del contrato.</p>
      </>
    ),
  },
  {
    id: "integraciones",
    title: "Integraciones de terceros",
    content: (
      <>
        <p>
          La Plataforma puede interoperar con marketplaces, transportistas u otros sistemas mediante
          integraciones propias o de terceros. El Cliente es responsable de las credenciales y
          permisos que otorgue a esos servicios.
        </p>
        <LegalNotice title="Responsabilidad">
          <p>
            {LEGAL.companyName} no controla la disponibilidad ni las políticas de proveedores
            externos. Fallas, demoras o pérdidas originadas en integraciones ajenas a nuestra
            infraestructura principal de SmartLogix no son imputables a {LEGAL.brandName}, salvo falla directa de nuestro
            conector documentado.
          </p>
        </LegalNotice>
      </>
    ),
  },
  {
    id: "tarifas",
    title: "Tarifas y facturación",
    content: (
      <>
        <p>
          Planes de pago según tabla publicada o propuesta comercial. Impuestos no incluidos salvo
          indicación contraria. Mora: intereses legales y posible suspensión tras quince (15) días de
          atraso, con aviso al correo registrado.
        </p>
        <p>
          Los <strong>reembolsos serán evaluados caso a caso</strong>, especialmente ante fallas
          graves atribuibles a {LEGAL.companyName} no resueltas en plazo razonable. No hay reembolso
          automático por períodos ya facturados sin causa fundada.
        </p>
      </>
    ),
  },
  {
    id: "sla",
    title: "Disponibilidad (SLA)",
    content: (
      <>
        <p>
          Objetivo de disponibilidad mensual: <strong>99%</strong>, excluyendo mantenimiento
          programado (aviso con 48 h cuando sea posible), fuerza mayor y fallas de telecomunicaciones
          o proveedores externos de infraestructura y conectividad.
        </p>
        <p>
          Respaldos y recuperación: ver{" "}
          <Link href="/legal/seguridad">Seguridad de la plataforma</Link>.
        </p>
      </>
    ),
  },
  {
    id: "soporte",
    title: "Soporte",
    content: (
      <>
        <LegalKeyPoints
          items={[
            "Canal: contacto@smartlogix.cl (asunto con nombre de la PYME).",
            `Horario: ${SUPPORT_SLA.schedule}.`,
            `Primera respuesta orientativa: ${SUPPORT_SLA.firstResponse}.`,
            `Incidentes críticos de seguridad: seguridad@smartlogix.cl (${SUPPORT_SLA.securityPriority}).`,
          ]}
        />
        <p>
          El soporte cubre uso de la Plataforma, no consultoría logística ni configuración de
          sistemas externos del Cliente.
        </p>
      </>
    ),
  },
  {
    id: "cierre",
    title: "Suspensión y cierre de cuenta",
    content: (
      <>
        <p>Podemos suspender o terminar el acceso si:</p>
        <ul>
          <li>Hay incumplimiento material no corregido en diez (10) días.</li>
          <li>Existe riesgo de seguridad o fraude.</li>
          <li>Lo exige una autoridad competente.</li>
          <li>El Cliente inicia liquidación concursal.</li>
        </ul>
        <p>
          En suspensión por causa del Cliente, informamos motivo y canal de revisión en{" "}
          <a href={`mailto:${LEGAL.legalEmail}`}>{LEGAL.legalEmail}</a>.
        </p>
        <LegalHighlight>
          Tras el cierre, el Cliente tiene <strong>30 días</strong> para exportar datos en formatos
          estándar. Después aplicamos eliminación o anonimización conforme a retención legal y
          backups.
        </LegalHighlight>
      </>
    ),
  },
  {
    id: "responsabilidad",
    title: "Limitación de responsabilidad",
    content: (
      <>
        <p>
          Responsabilidad máxima acumulada de {LEGAL.companyName}: el monto pagado en los doce (12)
          meses previos al reclamo, o <strong>cien (100) UF</strong> en planes gratuitos o de
          evaluación.
        </p>
        <p>
          No respondemos por lucro cesante, pérdida de datos por mala configuración del Cliente ni
          por decisiones operativas basadas en reportes de la Plataforma sin verificación propia.
        </p>
      </>
    ),
  },
  {
    id: "propiedad",
    title: "Propiedad intelectual",
    content: (
      <p>
        {LEGAL.brandName}, su software, marca, documentación, interfaces y componentes visuales son
        propiedad de {LEGAL.companyName} o sus licenciantes. Este contrato no transfiere derechos de
        propiedad intelectual al Cliente, salvo la licencia de uso descrita en el objeto del servicio.
      </p>
    ),
  },
  {
    id: "uso-razonable",
    title: "Uso razonable de la plataforma",
    content: (
      <p>
        {LEGAL.companyName} podrá aplicar <strong>límites técnicos razonables</strong> de uso (por
        ejemplo, volumen de solicitudes, automatización o patrones de abuso) para proteger la
        estabilidad, seguridad y experiencia de todos los clientes en el entorno multi-tenant.
      </p>
    ),
  },
  {
    id: "modificaciones",
    title: "Cambios al contrato",
    content: (
      <p>
        Publicamos versiones en los{" "}
        <Link href="/legal/terminos">términos</Link> con fecha y número. Cambios materiales: aviso
        con quince (15) días al administrador de la cuenta. Uso
        continuado implica aceptación; el Cliente puede terminar antes de la vigencia del cambio.
      </p>
    ),
  },
  {
    id: "ley",
    title: "Ley y jurisdicción",
    content: (
      <>
        <p>
          Leyes de la República de {LEGAL.country}. Controversias ante los{" "}
          <strong>tribunales ordinarios de justicia de Santiago</strong>, sin perjuicio de mediación
          previa de buena fe.
        </p>
        <p>
          Notificaciones: {LEGAL.companyName} ·{" "}
          <a href={`mailto:${LEGAL.legalEmail}`}>{LEGAL.legalEmail}</a>
        </p>
      </>
    ),
  },
];
