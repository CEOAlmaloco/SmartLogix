import Link from "next/link";
import styles from "./HomeCTA.module.css";

export function HomeCTA() {
  return (
    <section className={styles.ctaPanel}>
      <div>
        <h2>Tu logistica puede ser una ventaja competitiva</h2>
        <p>
          Comienza hoy y organiza tus operaciones con una plataforma diseñada para crecer junto a tu negocio.
        </p>
      </div>
      <Link href="/auth/register" className={`btn ${styles.ctaButton}`}>
        Crear cuenta gratis
      </Link>
    </section>
  );
}
