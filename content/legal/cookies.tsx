import Link from "next/link";
import type { LegalSection } from "@/components/legal/LegalPageLayout";
import { LEGAL } from "@/config/legal";

export const cookiesPreamble = (
  <p>
    Qué cookies y almacenamiento local utiliza {LEGAL.brandName}, con qué finalidad y cómo gestionar
    el consentimiento. Complementa la{" "}
    <Link href="/legal/privacidad">Política de privacidad</Link>.
  </p>
);

export const cookiesSections: LegalSection[] = [
  {
    id: "alcance",
    title: "Ámbito de aplicación",
    content: (
      <>
        <p>Aplica al sitio público, autenticación y panel de PYME. En cada contexto:</p>
        <ul>
          <li>
            <strong>Sitio público:</strong> consentimiento y analítica opcional del sitio.
          </li>
          <li>
            <strong>Login:</strong> sesión y tokens de acceso.
          </li>
          <li>
            <strong>Panel autenticado:</strong> sesión activa, seguridad y registros técnicos; sin
            publicidad.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "tipos",
    title: "Tipos utilizados",
    content: (
      <>
        <p>
          Usamos cookies, <strong>localStorage</strong> y almacenamiento de sesión para preferencias
          y operación segura. No vendemos perfiles publicitarios ni hacemos remarketing.
        </p>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Finalidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Necesarias</td>
              <td>Autenticación (Supabase), sesión, integridad del panel</td>
              <td>
                <span className="legal-badge legal-badge--active">Activo</span>
              </td>
            </tr>
            <tr>
              <td>Seguridad</td>
              <td>Prevención de abuso y accesos no autorizados</td>
              <td>
                <span className="legal-badge legal-badge--active">Activo</span>
              </td>
            </tr>
            <tr>
              <td>Preferencias</td>
              <td>Elección de consentimiento en el banner</td>
              <td>
                <span className="legal-badge legal-badge--active">Activo</span>
              </td>
            </tr>
            <tr>
              <td>Analítica</td>
              <td>Métricas agregadas de uso, rendimiento y errores</td>
              <td>
                <span className="legal-badge legal-badge--optional">Opcional</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          La analítica solo se activa si la autoriza en el banner. Herramientas posibles: Vercel Analytics,
          PostHog. No usamos Google Analytics ni cookies de publicidad comportamental.
        </p>
      </>
    ),
  },
  {
    id: "consentimiento",
    title: "Consentimiento",
    content: (
      <>
        <p>
          El banner inferior ofrece <strong>OK</strong> (aceptar todas), <strong>Mostrar detalles</strong>{" "}
          (panel con pestañas Consentimiento, Detalles y Acerca de las cookies) y, dentro del panel,{" "}
          <strong>Solo esenciales</strong> o personalización por categoría. Las cookies necesarias y
          de seguridad no requieren consentimiento adicional.
        </p>
        <p>
          La analítica y las preferencias opcionales solo se activan si las autoriza en
          «Personalizar» o con «Aceptar todas». Puede revocar eliminando datos del sitio en su
          navegador y recargando, o escribiendo a{" "}
          <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>.
        </p>
      </>
    ),
  },
  {
    id: "terceros",
    title: "Servicios de terceros",
    content: (
      <p>
        Proveedores integrados (autenticación, hosting, monitoreo) pueden usar cookies técnicas
        propias. Enlaces externos desde el blog o recursos informativos quedan bajo responsabilidad
        del sitio de destino.
      </p>
    ),
  },
  {
    id: "otros",
    title: "Gestión y señales del navegador",
    content: (
      <>
        <p>
          Puede gestionar cookies desde la configuración de su navegador. Desactivar cookies de
          sesión puede impedir el acceso al panel.
        </p>
        <p>
          El sitio no responde de forma diferenciada a señales «Do Not Track» distintas del banner de
          consentimiento de SmartLogix.
        </p>
        <p>
          Cambios materiales se publican aquí y en el banner. Vinculado:{" "}
          <Link href="/legal/privacidad">Privacidad</Link> ·{" "}
          <Link href="/legal/terminos">Términos</Link>.
        </p>
      </>
    ),
  },
];
