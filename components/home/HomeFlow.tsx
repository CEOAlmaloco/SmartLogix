import styles from "./HomeFlow.module.css";

export function HomeFlow() {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>Cómo funciona SmartLogix</h2>
        <p>Un flujo simple para mantener control logístico sin tareas manuales repetitivas.</p>
      </header>

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <article className={styles.stepCard}>
            <span>01</span>
            <h3>Recibe y valida</h3>
            <p>El pedido ingresa y se valida automáticamente para evitar errores de proceso.</p>
          </article>
        </div>
        <div className="col-12 col-lg-4">
          <article className={styles.stepCard}>
            <span>02</span>
            <h3>Asigna y prepara</h3>
            <p>Se confirma stock, se define bodega y se prepara despacho en minutos.</p>
          </article>
        </div>
        <div className="col-12 col-lg-4">
          <article className={styles.stepCard}>
            <span>03</span>
            <h3>Despacha y monitorea</h3>
            <p>Tu equipo sigue estados de envío y responde rápido ante incidencias.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
