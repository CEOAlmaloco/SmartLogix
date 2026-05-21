import Link from "next/link";
import styles from "./HomePricing.module.css";

export function HomePricing() {
  return (
    <section id="pricing" className={styles.section}>
      <header className={styles.header}>
        <h2>Planes</h2>
        <p>
          Evaluación gratuita para PYMEs en Chile. Los planes comerciales se ajustan por volumen de
          pedidos, usuarios y módulos activos.
        </p>
      </header>
      <div className={styles.card}>
        <p>
          <strong>Plan evaluación:</strong> acceso al panel con límites de uso orientados a prueba
          operativa.
        </p>
        <p>
          <strong>Planes pagos:</strong> facturación mensual o anual; condiciones en{" "}
          <Link href="/legal/terminos">Términos y condiciones</Link>.
        </p>
        <Link href="/contact" className={styles.link}>
          Consultar planes y demo comercial
        </Link>
      </div>
    </section>
  );
}
