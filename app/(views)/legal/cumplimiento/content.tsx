import Link from "next/link";
import type { LegalSection } from "@/components/legal/LegalPageLayout";
import { ComplianceChecker } from "@/components/legal/ComplianceChecker";
import { LEGAL } from "@/config/legal";

export const cumplimientoPreamble = (
  <p>
    Guía para validar que la documentación legal y corporativa de {LEGAL.brandName} está publicada y
    operativa. Herramienta de revisión interna; no sustituye asesoría legal formal.
  </p>
);

export const cumplimientoSections: LegalSection[] = [
  {
    id: "marco",
    title: "Marco de referencia",
    content: (
      <>
        <p>
          Las organizaciones que contratan SaaS B2B suelen exigir evidencia de: (1) condiciones
          contractuales claras; (2) tratamiento de datos personales conforme a la Ley N° 19.628; (3)
          transparencia en cookies y tecnologías de seguimiento; (4) canales de contacto y reclamos;
          (5) medidas de seguridad razonables. Este sitio centraliza esa documentación en el pie de
          página global y en rutas dedicadas bajo <code>/legal</code> y <code>/about</code>.
        </p>
        <p>
          Documentación principal:{" "}
          <Link href="/legal/terminos">Términos</Link>,{" "}
          <Link href="/legal/privacidad">Privacidad</Link>,{" "}
          <Link href="/legal/cookies">Cookies</Link>,{" "}
          <Link href="/legal/seguridad">Seguridad</Link> (compliance técnico),{" "}
          <Link href="/legal/aviso-legal">Aviso legal</Link>.
        </p>
      </>
    ),
  },
  {
    id: "publicaciones",
    title: "Publicaciones obligatorias en el sitio",
    content: (
      <>
        <p>Antes de exponer el producto al público general, confirme que existen y son accesibles:</p>
        <ol>
          <li>
            <strong>Términos de servicio</strong> — contrato SaaS con definiciones, SLA orientativo,
            suspensión y ley chilena.
          </li>
          <li>
            <strong>Política de privacidad</strong> — categorías de datos, finalidades, derechos
            ARCO y encargados.
          </li>
          <li>
            <strong>Política de cookies</strong> — coherente con el banner de consentimiento visible
            en todas las páginas.
          </li>
          <li>
            <strong>Aviso legal</strong> — titular del sitio y limitaciones de responsabilidad del
            portal informativo.
          </li>
          <li>
            <strong>Páginas corporativas</strong> — Quiénes somos, Contacto y Blog con contenido
            profesional y datos de contacto verificables.
          </li>
          <li>
            <strong>Registro de PYME</strong> — checkbox de aceptación con enlaces a términos,
            privacidad y cookies.
          </li>
          <li>
            <strong>Footer global</strong> — enlaces a todas las rutas anteriores en todas las
            vistas (home, auth, panel).
          </li>
        </ol>
      </>
    ),
  },
  {
    id: "verificacion-automatica",
    title: "Verificación automática en este entorno",
    content: (
      <>
        <p>
          La herramienta siguiente ejecuta comprobaciones no destructivas contra las rutas
          publicadas, valida la presencia de enlaces legales en el footer y revisa si existe registro
          local de consentimiento de cookies. Úsela después de cada despliegue a staging o antes de
          una demo con cliente enterprise.
        </p>
        <ComplianceChecker />
      </>
    ),
  },
  {
    id: "checklist-manual",
    title: "Checklist manual pre-producción",
    content: (
      <>
        <p>Marque cada ítem con su equipo legal y de producto:</p>
        <ul>
          <li>Revisión externa de términos y privacidad por abogado chileno especializado.</li>
          <li>Registro de tratamiento de datos (si aplica) y contratos con subencargados cloud.</li>
          <li>Texto del banner de cookies alineado con cookies realmente desplegadas.</li>
          <li>Correos legal@, privacidad@ y contacto@ monitoreados por personas designadas.</li>
          <li>Página de suspensión de cuenta con motivo y canal de apelación (flujo operativo).</li>
          <li>Procedimiento de respuesta a incidentes documentado y probado (último simulacro &lt; 12 meses).</li>
          <li>Política interna de retención y borrado coherente con lo publicado al Cliente.</li>
        </ul>
      </>
    ),
  },
  {
    id: "evidencias",
    title: "Evidencias recomendadas para auditoría",
    content: (
      <>
        <p>Conserve para solicitudes de clientes o reguladores:</p>
        <ul>
          <li>Capturas de pantalla del footer y del registro con fecha.</li>
          <li>Export del resultado de esta página de verificación.</li>
          <li>Versiones archivadas de documentos legales (PDF o commit git etiquetado).</li>
          <li>Registros de aceptación de términos en base de datos (<code>terms_accepted_at</code>).</li>
        </ul>
        <p>
          Contacto para coordinar auditorías:{" "}
          <a href={`mailto:${LEGAL.legalEmail}`}>{LEGAL.legalEmail}</a>.
        </p>
      </>
    ),
  },
];
