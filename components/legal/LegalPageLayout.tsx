import { ReactNode } from "react";
import { HomeFooter } from "@/components/home/HomeFooter";
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
  contactEmail: string;
  highlights: string[];
  sections: LegalSection[];
  /**
   * When false, hide the aside (table of contents) and render only the
   * stacked cards. Useful for single-card legal pages that must feel formal.
   */
  showAside?: boolean;
};

export function LegalPageLayout({
  eyebrow,
  title,
  summary,
  updatedAt,
  contactEmail,
  highlights,
  sections,
  showAside = true,
}: LegalPageLayoutProps) {
  return (
    <>
      <main className={styles.page}>
        <section className="container py-4 py-lg-5">
          <HomeNavbar />

          <header className={styles.hero}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.summary}>{summary}</p>
            <p className={styles.heroMeta}>Actualizado: {updatedAt}</p>

            <div className={styles.highlights}>
              {highlights.map((highlight) => (
                <span key={highlight} className={styles.pill}>
                  {highlight}
                </span>
              ))}
            </div>
          </header>

          {showAside === false ? (
            <div className={styles.cards}>
              {sections.map((section) => (
                <article id={section.id} key={section.id} className={styles.card}>
                  <h2>{section.title}</h2>
                  {section.content}
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.layout}>
              <aside className={styles.asideCard}>
                <h2 className={styles.asideTitle}>Contenido</h2>
                <nav aria-label="Secciones legales">
                  <ul className={styles.quickLinks}>
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a href={`#${section.id}`}>{section.title}</a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className={styles.contact}>
                  Consultas legales: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </div>
              </aside>

              <div className={styles.cards}>
                {sections.map((section) => (
                  <article id={section.id} key={section.id} className={styles.card}>
                    <h2>{section.title}</h2>
                    {section.content}
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <HomeFooter />
    </>
  );
}
