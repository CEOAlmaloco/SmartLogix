import Link from "next/link";
import styles from "./HomeNavbar.module.css";

export function HomeNavbar() {
  return (
    <header className={`${styles.navbar} d-flex align-items-center justify-content-between`}>
        
      <span className={styles.logoText}>SmartLogix</span>


      <div className="d-flex gap-2">
        <Link href="/auth/login" className={`btn ${styles.btnGhost}`}>
          Iniciar sesión
        </Link>
        <Link href="/auth/register" className={`btn ${styles.btnPrimary}`}>
          Crear cuenta
        </Link>
      </div>
    </header>
  );
}
