import Link from "next/link";
import styles from "./HomeHero.module.css";

export function HomeHero() {
  return (
    <section className="row g-4 g-xl-5 align-items-center mt-2">
      <div className="col-12 col-xl-7">
        <span className={styles.kicker}>Gestion logistica para eCommerce</span>
        <h1 className={styles.title}>Mantiene tus pedidos fluyendo, incluso en dias de alta demanda.</h1>
        <p className={styles.subtitle}>
          SmartLogix te ayuda a reducir retrasos, evitar quiebres de stock y coordinar envios
          con visibilidad completa para tu equipo y tus clientes.
        </p>

        <div className="d-flex flex-wrap gap-2 gap-md-3 mt-4">
          <Link href="/auth/register" className={`btn ${styles.ctaPrimary}`}>
            Probar SmartLogix
          </Link>
          <Link href="/auth/login" className={`btn ${styles.ctaSecondary}`}>
            Ya tengo cuenta
          </Link>
        </div>

        <div className={styles.quickPoints}>
          <span>Menos errores de despacho</span>
          <span>Mayor control de stock</span>
          <span>Mejor experiencia de entrega</span>
        </div>
      </div>

      <div className="col-12 col-xl-5">
        <article className={styles.previewCard}>
          <p className={styles.previewTitle}>Resumen diario</p>
          <div className={styles.metrics}>
            <div>
              <strong>214</strong>
              <span>Pedidos gestionados</span>
            </div>
            <div>
              <strong>97%</strong>
              <span>Entregas en fecha</span>
            </div>
            <div>
              <strong>8</strong>
              <span>Incidencias abiertas</span>
            </div>
          </div>
          <div className={styles.timeline}>
            <div>
              <span>Preparacion</span>
              <em>112</em>
            </div>
            <div>
              <span>Despachado</span>
              <em>86</em>
            </div>
            <div>
              <span>Entregado</span>
              <em>16</em>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
