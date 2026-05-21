import { ReactNode } from "react";
import { FooterMinimal } from "@/components/auth/FooterMinimal";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import styles from "./LegalPageLayout.module.css";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  summary: string;
  updatedAt: string;
  version?: string;
  contactEmail: string;
  /** Etiqueta del correo en el encabezado (p. ej. «Contacto de seguridad»). */
  contactLabel?: string;
  sections: LegalSection[];
  /** Texto introductorio antes del primer capítulo (opcional). */
  preamble?: ReactNode;
  /** Nota bajo el índice lateral (opcional). */
  tocNote?: ReactNode;
};

export function LegalPageLayout({
  eyebrow,
  title,
  summary,
  updatedAt,
  version = "1.0",
  contactEmail,
  contactLabel = "Consultas",
  sections,
  preamble,
  tocNote,
}: LegalPageLayoutProps) {
  const defaultTocNote = (
    <>
      Consultas sobre este documento:{" "}
      <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
    </>
  );
  return (
    <main className={styles.page}>
      <section className={`container ${styles.wrap}`}>
        <HomeNavbar />

        <header className={styles.docHeader}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.summary}>{summary}</p>
          <dl className={styles.meta}>
            <div>
              <dt>Versión</dt>
              <dd>{version}</dd>
            </div>
            <div>
              <dt>Última actualización</dt>
              <dd>{updatedAt}</dd>
            </div>
            <div>
              <dt>{contactLabel}</dt>
              <dd>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </dd>
            </div>
          </dl>
        </header>

        <div className={styles.docShell}>
          <aside className={styles.toc} aria-label="Índice del documento">
            <p className={styles.tocLabel}>Índice</p>
            <nav>
              <ol className={styles.tocList}>
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>
                      <span className={styles.tocNum}>{index + 1}.</span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <p className={styles.tocNote}>{tocNote ?? defaultTocNote}</p>
          </aside>

          <article className={styles.document}>
            {preamble ? <div className={styles.preamble}>{preamble}</div> : null}
            {sections.map((section) => (
              <section key={section.id} id={section.id} className={styles.chapter}>
                <h2 className={styles.chapterTitle}>{section.title}</h2>
                <div className={styles.prose}>{section.content}</div>
              </section>
            ))}
          </article>
        </div>
      </section>
      <FooterMinimal />
    </main>
  );
}
