import Link from "next/link";
import { FOOTER_MINIMAL_LINKS, LEGAL } from "@/config/legal";
import styles from "./FooterMinimal.module.css";

export function FooterMinimal() {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        {FOOTER_MINIMAL_LINKS.map((link, index) => (
          <span key={link.href} className={styles.item}>
            {index > 0 ? <span className={styles.sep} aria-hidden>·</span> : null}
            <Link className={styles.link} href={link.href}>
              {link.label}
            </Link>
          </span>
        ))}
      </div>
      <p className={styles.stageNotice}>{LEGAL.stageNotice}</p>
      <div className={styles.copy}>
        © {LEGAL.copyrightYear} {LEGAL.companyName}
      </div>
    </footer>
  );
}
