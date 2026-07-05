"use client";
import Image from "next/image";
import Link from "next/link";
import { FOOTER_HOME, LEGAL, type FooterLink } from "@/config/legal";
import styles from "./HomeFooter.module.css";

function FooterColumn({
  title,
  ariaLabel,
  links,
}: {
  title: string;
  ariaLabel: string;
  links: readonly FooterLink[];
}) {
  return (
    <div>
      <div className={styles.colTitle}>{title}</div>
      <nav className={styles.links} aria-label={ariaLabel}>
        {links.map((link) => (
          <Link key={link.href} className={styles.link} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logoRow}>
              <Image src="/brand/sl_icon.png" alt={LEGAL.brandName} width={40} height={40} priority />
              <span className={styles.logoText}>{LEGAL.brandName}</span>
            </div>
            <div>La plataforma logística para PYMEs de eCommerce.</div>
            <div>Gestiona inventario, pedidos y envíos desde un solo lugar.</div>
            <a className={styles.contactEmail} href={`mailto:${LEGAL.contactEmail}`}>
              {LEGAL.contactEmail}
            </a>
          </div>

          <FooterColumn title="Producto" ariaLabel="Producto" links={FOOTER_HOME.producto} />
          <FooterColumn title="Legal" ariaLabel="Legal" links={FOOTER_HOME.legal} />
          <FooterColumn title="Empresa" ariaLabel="Empresa" links={FOOTER_HOME.empresa} />
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.stageNotice}>{LEGAL.stageNotice}</p>
          <p className={styles.copyright}>
            © {LEGAL.copyrightYear} {LEGAL.companyName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
