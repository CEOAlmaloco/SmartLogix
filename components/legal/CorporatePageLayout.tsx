import Link from "next/link";
import { ReactNode } from "react";
import { FooterMinimal } from "@/components/auth/FooterMinimal";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import styles from "./CorporatePageLayout.module.css";

export type CorporateSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type CorporatePageLayoutProps = {
  eyebrow: string;
  title: string;
  lead: string;
  sections: CorporateSection[];
  cta?: { label: string; href: string };
};

export function CorporatePageLayout({
  eyebrow,
  title,
  lead,
  sections,
  cta,
}: CorporatePageLayoutProps) {
  return (
    <main className={styles.page}>
      <section className={`container ${styles.wrap}`}>
        <HomeNavbar />

        <header className={styles.header}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.lead}>{lead}</p>
          {cta ? (
            <Link className={styles.cta} href={cta.href}>
              {cta.label}
            </Link>
          ) : null}
        </header>

        <div className={styles.shell}>
          <aside className={styles.toc} aria-label="Índice">
            <p className={styles.tocLabel}>En esta página</p>
            <nav>
              <ol>
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>
                      <span>{i + 1}.</span> {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className={styles.article}>
            {sections.map((section) => (
              <section key={section.id} id={section.id} className={styles.section}>
                <h2>{section.title}</h2>
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
