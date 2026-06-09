import Link from "next/link";
import type { LegalSection } from "@/components/legal/LegalPageLayout";
import { LegalHighlight, LegalKeyPoints, LegalNotice } from "@/components/legal/LegalBlocks";
import { LEGAL } from "@/config/legal";

export const privacidadPreamble = (
  <p>
    Cómo {LEGAL.companyName} trata datos personales en {LEGAL.brandName}, conforme a la Ley N° 19.628
    y prácticas de privacidad B2B en la nube. Complementa los{" "}
    <Link href="/legal/terminos">Términos de servicio</Link> y la{" "}
    <Link href="/legal/cookies">Política de cookies</Link>.
  </p>
);

export const privacidadSections: LegalSection[] = [
  {
    id: "responsable",
    title: "Responsable y encargado",
    content: (
      <>
        <p>
          <strong>Responsable del tratamiento (proveedor del SaaS):</strong> {LEGAL.companyName},{" "}
          {LEGAL.country}.
        </p>
        <LegalNotice title="Relación entre SmartLogix y la PYME">
          <p>
            Cuando la PYME ingresa datos de sus clientes finales (compradores, destinatarios), la{" "}
            <strong>PYME actúa como responsable</strong> frente a esas personas y{" "}
            <strong>{LEGAL.companyName} como encargado</strong>, limitado a las instrucciones del
            Cliente y a la operación técnica de la Plataforma.
          </p>
        </LegalNotice>
        <p>
          Contacto para derechos y consultas:{" "}
          <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a> ·{" "}
          <a href={`mailto:${LEGAL.legalEmail}`}>{LEGAL.legalEmail}</a>
        </p>
      </>
    ),
  },
  {
    id: "minimizacion",
    title: "Minimización de datos",
    content: (
      <p>
        {LEGAL.brandName} procura tratar únicamente los datos necesarios para operar la Plataforma,
        prestar el servicio contratado y cumplir obligaciones legales o de seguridad razonables.
      </p>
    ),
  },
  {
    id: "acceso-interno",
    title: "Acceso interno restringido",
    content: (
      <p>
        El acceso interno a datos operativos se limita a personal autorizado de {LEGAL.companyName}{" "}
        que requiera dicha información para soporte, mantenimiento, seguridad o cumplimiento legal,
        bajo confidencialidad y registro de actividad cuando corresponda.
      </p>
    ),
  },
  {
    id: "acceso-contenido",
    title: "Qué no hacemos con sus datos operativos",
    content: (
      <>
        <p>
          <strong>
            {LEGAL.brandName} no accede de forma rutinaria al contenido operativo del Cliente
          </strong>{" "}
          (inventario, pedidos, direcciones u otros registros de negocio) salvo cuando sea necesario
          para:
        </p>
        <LegalKeyPoints
          items={[
            "Soporte técnico solicitado o autorizado por el Cliente.",
            "Cumplimiento de obligaciones legales o requerimientos fundados de autoridad.",
            "Investigación de incidentes de seguridad o abuso de la Plataforma.",
          ]}
        />
        <p>
          El personal con acceso privilegiado está sujeto a confidencialidad y principio de mínimo
          privilegio.
        </p>
      </>
    ),
  },
  {
    id: "categorias",
    title: "Categorías de datos",
    content: (
      <>
        <table>
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Ejemplos</th>
              <th>Origen</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Identificación y cuenta</td>
              <td>Correo, nombre de usuario, rol, organización</td>
              <td>Registro y administración</td>
            </tr>
            <tr>
              <td>Datos de la PYME</td>
              <td>Razón social, RUT, teléfono comercial</td>
              <td>Formulario de alta</td>
            </tr>
            <tr>
              <td>Datos operativos</td>
              <td>SKU, pedidos, direcciones de despacho, estados logísticos</td>
              <td>Uso de la Plataforma (bajo responsabilidad del Cliente)</td>
            </tr>
            <tr>
              <td>Técnicos</td>
              <td>IP, logs de acceso, identificadores de sesión, errores de aplicación</td>
              <td>Infraestructura y seguridad</td>
            </tr>
          </tbody>
        </table>
        <p>
          No solicitamos categorías sensibles de forma intencional. Si el Cliente las incorpora, debe
          contar con base legal propia.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "Finalidades y bases legales",
    content: (
      <>
        <p>Tratamos datos personales para:</p>
        <ul>
          <li>
            <strong>Ejecución contractual:</strong> prestar, mantener y mejorar el servicio
            contratado.
          </li>
          <li>
            <strong>Interés legítimo y seguridad:</strong> autenticación, prevención de fraude,
            segregación multi-tenant y métricas agregadas de producto sin identificación directa.
          </li>
          <li>
            <strong>Obligación legal:</strong> atender requerimientos judiciales o de reguladores.
          </li>
          <li>
            <strong>Soporte:</strong> responder consultas operativas del Cliente.
          </li>
        </ul>
        <LegalHighlight>
          No vendemos ni arrendamos bases de datos personales a terceros con fines comerciales
          independientes.
        </LegalHighlight>
      </>
    ),
  },
  {
    id: "automatizado",
    title: "Decisiones automatizadas",
    content: (
      <p>
        {LEGAL.brandName}{" "}
        <strong>
          no adopta decisiones automatizadas con efectos jurídicos significativos
        </strong>{" "}
        sobre personas naturales. Las reglas de negocio de la PYME son configuradas por
        el propio Cliente.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <p>
        Utilizamos cookies y almacenamiento local según se describe en la{" "}
        <Link href="/legal/cookies">Política de cookies</Link>. No empleamos publicidad
        comportamental.
      </p>
    ),
  },
  {
    id: "conservacion",
    title: "Conservación y eliminación",
    content: (
      <>
        <ul>
          <li>
            <strong>Cuenta activa:</strong> datos mientras exista relación contractual.
          </li>
          <li>
            <strong>Post-terminación:</strong> hasta doce (12) meses para reclamos, auditoría o
            obligación legal; luego eliminación o anonimización.
          </li>
          <li>
            <strong>Logs de seguridad:</strong> rotación orientativa de noventa (90) días.
          </li>
          <li>
            <strong>Backups:</strong> copias incrementales con retención acorde al proveedor cloud;
            se purgan en ciclos automáticos tras la ventana de recuperación.
          </li>
          <li>
            <strong>Retención legal:</strong> bloques mínimos cuando la ley exija conservar
            evidencia.
          </li>
          <li>
            <strong>Anonimización estadística:</strong> registros agregados sin identificar PYMEs ni
            personas, para mejora del servicio y reportes internos.
          </li>
        </ul>
        <p>
          La eliminación en producción puede coexistir temporalmente con residuos en backups hasta el
          siguiente ciclo de purga; aplicamos borrado lógico inmediato en sistemas activos.
        </p>
      </>
    ),
  },
  {
    id: "portabilidad",
    title: "Portabilidad y exportación",
    content: (
      <p>
        El Cliente puede <strong>exportar sus datos</strong> en formatos estándar disponibles en la
        Plataforma mientras la cuenta permanezca activa, y durante el período de gracia tras el
        cierre indicado en los <Link href="/legal/terminos">Términos de servicio</Link>. Esto reduce
        dependencia excesiva del proveedor (“lock-in”) y facilita migración responsable.
      </p>
    ),
  },
  {
    id: "terceros",
    title: "Encargados y transferencias",
    content: (
      <>
        <p>
          Usamos infraestructura cloud administrada (Supabase, hosting en Vercel u equivalentes) con
          acuerdos de encargo, confidencialidad y seguridad. Subencargados fuera de Chile: salvaguardas
          contractuales razonables.
        </p>
        <p>
          Divulgación ante requerimiento fundado de autoridad o para proteger derechos en
          procedimientos legales.
        </p>
      </>
    ),
  },
  {
    id: "incidentes",
    title: "Incidentes de seguridad",
    content: (
      <LegalNotice title="Notificación al Cliente">
        <p>
          Si un incidente de seguridad compromete datos personales y representa un riesgo relevante
          para el Cliente, {LEGAL.companyName} lo notificará{" "}
          <strong>a la brevedad razonable</strong>, indicando la naturaleza del evento, categorías de
          datos potencialmente afectados y medidas de mitigación conocidas al momento de la
          comunicación, en coordinación con la{" "}
          <Link href="/legal/seguridad">Política de seguridad</Link>.
        </p>
      </LegalNotice>
    ),
  },
  {
    id: "derechos",
    title: "Derechos de los titulares",
    content: (
      <>
        <p>
          Puede solicitar acceso, rectificación, cancelación, oposición o bloqueo cuando corresponda.
          Envíe la solicitud a {LEGAL.privacyEmail} con identificación razonable. Plazo de respuesta:
          hasta quince (15) días hábiles, prorrogable una vez si la complejidad lo exige.
        </p>
        <p>
          Si no está conforme, puede recurrir ante la autoridad de protección de datos competente en{" "}
          {LEGAL.country}.
        </p>
      </>
    ),
  },
  {
    id: "seguridad",
    title: "Medidas de seguridad",
    content: (
      <p>
        Aplicamos HTTPS, control de acceso por roles, políticas de contraseñas y Row Level Security
        (aislamiento lógico entre organizaciones). Detalle en{" "}
        <Link href="/legal/seguridad">Seguridad de la plataforma</Link>. Aunque aplicamos medidas
        técnicas y organizativas razonables,{" "}
        <strong>
          ningún sistema puede garantizar seguridad absoluta frente a todas las amenazas existentes
        </strong>
        . Reporte incidentes sospechosos a seguridad@smartlogix.cl.
      </p>
    ),
  },
  {
    id: "audiencia",
    title: "Audiencia del servicio",
    content: (
      <p>
        La Plataforma <strong>no está dirigida a consumidores finales ni menores de edad</strong>,
        sino a organizaciones y usuarios profesionales que operan en nombre de una PYME. Si detectamos
        datos de menores ingresados por error, procederemos a su eliminación diligente.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Actualizaciones",
    content: (
      <p>
        Publicamos revisiones en esta URL con fecha de vigencia. Cambios relevantes: aviso al
        administrador de la cuenta. Revise también la{" "}
        <Link href="/legal/cookies">Política de cookies</Link>.
      </p>
    ),
  },
];
