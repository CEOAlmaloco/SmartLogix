"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./HomeFooter.module.css";

export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logoRow}>
              <Image src="/brand/sl_icon.png" alt="SmartLogix" width={40} height={40} priority />
              <span className={styles.logoText}>SmartLogix</span>
            </div>
            <div className={styles.tagline}>La plataforma logística para PYMEs de eCommerce.</div>
            <div>Gestiona inventario, pedidos y envíos desde un solo lugar.</div>
            <div style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>contacto@smartlogix.cl</div>
          </div>

          <div>
            <div className={styles.colTitle}>Producto</div>
            <nav className={styles.links} aria-label="Producto">
              <Link className={styles.link} href="/#features">Funcionalidades</Link>
              <Link className={styles.link} href="/#pricing">Precios</Link>
              <Link className={styles.link} href="/#integrations">Integraciones</Link>
              <Link className={styles.link} href="/legal/seguridad">Seguridad</Link>
            </nav>
          </div>

          <div>
            <div className={styles.colTitle}>Legal</div>
            <nav className={styles.links} aria-label="Legal">
              <Link className={styles.link} href="/legal/terminos">Términos de servicio</Link>
              <Link className={styles.link} href="/legal/privacidad">Política de privacidad</Link>
              <Link className={styles.link} href="/legal/cookies">Política de cookies</Link>
            </nav>
          </div>

          <div>
            <div className={styles.colTitle}>Empresa</div>
            <nav className={styles.links} aria-label="Empresa">
              <Link className={styles.link} href="/about">Nosotros</Link>
              <Link className={styles.link} href="/contact">Contacto</Link>
            </nav>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div>© 2026 SmartLogix SpA. Todos los derechos reservados.</div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div>contacto@smartlogix.cl</div>
            <div className={styles.socials}>
              <a className={styles.socialLink} href="TODO" target="_blank" rel="noreferrer">SOCIAL1</a>
              <a className={styles.socialLink} href="TODO" target="_blank" rel="noreferrer">SOCIAL2</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
