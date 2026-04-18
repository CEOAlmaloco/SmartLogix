import Link from "next/link";
import { ReactNode } from "react";
import styles from "./AuthPageLayout.module.css";

type AuthPageLayoutProps = {
  title: string;
  subtitle: string;
  helperText: string;
  children: ReactNode;
};

export function AuthPageLayout({ title, subtitle, helperText, children }: AuthPageLayoutProps) {
  return (
    <main className={styles.page}>
      <section className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <span className={styles.badge}>SmartLogix Platform</span>
          <h1>Logística inteligente para eCommerce</h1>
          <p>
            Plataforma para inventario, pedidos y envíos con arquitectura desacoplada,
            escalable y segura para PYMEs.
          </p>
          <ul>
            <li>Inventario sincronizado en tiempo real</li>
            <li>Trazabilidad completa de pedidos</li>
            <li>Coordinación de envíos y transportistas</li>
          </ul>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formCard}>
          <span className={styles.eyebrow}>{subtitle}</span>
          <h2>{title}</h2>
          <p className={styles.helper}>{helperText}</p>
          {children}
          <p className={styles.homeLink}>
            <Link href="/">Volver al inicio</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
