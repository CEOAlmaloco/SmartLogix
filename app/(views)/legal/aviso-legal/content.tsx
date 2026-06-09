import Link from "next/link";
import type { LegalSection } from "@/components/legal/LegalPageLayout";
import { LEGAL } from "@/config/legal";

export const avisoLegalSections: LegalSection[] = [
  {
    id: "titular",
    title: "Datos identificativos del titular",
    content: (
      <>
        <p>
          En cumplimiento del deber de información, se informa que el titular del sitio web{" "}
          <strong>{LEGAL.brandName}</strong> es {LEGAL.companyName}, con domicilio en Santiago,
          {LEGAL.country}. Correo de contacto:{" "}
          <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>. Consultas legales:{" "}
          <a href={`mailto:${LEGAL.legalEmail}`}>{LEGAL.legalEmail}</a>.
        </p>
      </>
    ),
  },
  {
    id: "objeto-sitio",
    title: "Objeto del sitio web",
    content: (
      <p>
        Este sitio tiene por finalidad ofrecer información comercial sobre el servicio SaaS de
        logística, permitir el registro de organizaciones, el acceso al panel de operación y la
        publicación de documentación legal y corporativa. El uso del sitio implica la aceptación del
        presente aviso y de los documentos enlazados en el pie de página.
      </p>
    ),
  },
  {
    id: "propiedad",
    title: "Propiedad intelectual e industrial",
    content: (
      <>
        <p>
          Los contenidos, diseño, código fuente, marcas, logotipos y bases de datos asociadas al
          sitio son titularidad de {LEGAL.companyName} o de sus licenciantes, y están protegidos por
          la legislación nacional e internacional aplicable.
        </p>
        <p>
          Queda prohibida su reproducción, distribución o transformación sin autorización expresa,
          salvo uso privado no comercial o citas breves con mención de la fuente.
        </p>
      </>
    ),
  },
  {
    id: "responsabilidad",
    title: "Exclusión de responsabilidades",
    content: (
      <>
        <p>
          {LEGAL.companyName} no garantiza la ausencia de interrupciones o errores en el sitio, ni la
          inexistencia de virus u otros elementos lesivos introducidos por terceros ajenos a su
          control. El usuario es responsable de disponer de herramientas adecuadas para detectar
          software malicioso.
        </p>
        <p>
          La información publicada en el blog o en secciones informativas tiene carácter general y
          no constituye asesoría legal, tributaria ni logística vinculante.
        </p>
      </>
    ),
  },
  {
    id: "enlaces",
    title: "Enlaces externos",
    content: (
      <p>
        Los enlaces a sitios de terceros se ofrecen únicamente para conveniencia del usuario.{" "}
        {LEGAL.companyName} no asume responsabilidad por contenidos, políticas o prácticas de dichos
        sitios. Se recomienda leer sus condiciones antes de facilitar datos personales.
      </p>
    ),
  },
  {
    id: "documentos",
    title: "Documentación contractual vinculada",
    content: (
      <p>
        El uso del servicio se rige por los <Link href="/legal/terminos">Términos de servicio</Link>
        , la <Link href="/legal/privacidad">Política de privacidad</Link>, la{" "}
        <Link href="/legal/cookies">Política de cookies</Link> y el presente aviso legal. Para
        verificación de publicación: <Link href="/legal/cumplimiento">Cumplimiento</Link>.
      </p>
    ),
  },
];
