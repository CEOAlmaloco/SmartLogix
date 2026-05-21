import Link from "next/link";
import styles from "./FooterMinimal.module.css";

export function FooterMinimal() {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <Link className={styles.link} href="/legal/terminos">Términos de servicio</Link>
        <span>·</span>
        <Link className={styles.link} href="/legal/privacidad">Privacidad</Link>
        <span>·</span>
        <Link className={styles.link} href="/legal/cookies">Cookies</Link>
      </div>
      <div style={{ marginTop: 6 }}>© 2026 SmartLogix SpA</div>
    </footer>
  );
}
