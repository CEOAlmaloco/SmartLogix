import styles from "./HomeBenefits.module.css";

export function HomeBenefits() {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>Ventajas para tu operación</h2>
        <p>
          Mejora la eficiencia diaria de tu equipo y entrega una experiencia más confiable a tus clientes.
        </p>
      </header>

      <div className="row g-3">
        <div className="col-12 col-md-6 col-xl-3">
          <article className={styles.card}>
            <h3>Visibilidad total</h3>
            <p>Seguimiento de cada pedido desde su ingreso hasta la entrega final.</p>
          </article>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <article className={styles.card}>
            <h3>Menos quiebres</h3>
            <p>Control de stock por bodega para evitar sobreventa y retrasos.</p>
          </article>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <article className={styles.card}>
            <h3>Despacho rápido</h3>
            <p>Priorización y flujo de preparación para cumplir fechas prometidas.</p>
          </article>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <article className={styles.card}>
            <h3>Decisiones claras</h3>
            <p>Indicadores en tiempo real para actuar antes de que aparezcan incidentes.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
