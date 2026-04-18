"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoutButton } from "./LogoutButton";
import styles from "./MobileMenu.module.css";

type MobileMenuProps = {
  pymeName: string;
};

export function MobileMenu({ pymeName }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={`btn ${styles.toggleBtn}`}
        aria-label="Abrir menu de navegacion"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={styles.burger} aria-hidden />
      </button>

      <button
        type="button"
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        aria-hidden={!open}
        aria-label="Cerrar menu"
        onClick={closeMenu}
      />

      <aside className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <p className={styles.drawerKicker}>Menu</p>
          <h2>{pymeName}</h2>
        </div>

        <div className={styles.menuList}>
          <Link href="/dashboard" className={`btn ${styles.menuLink}`} onClick={closeMenu}>
            Overview
          </Link>
          <Link href="/dashboard/order" className={`btn ${styles.menuLink}`} onClick={closeMenu}>
            Orders
          </Link>
          <Link href="/dashboard/inventory" className={`btn ${styles.menuLink}`} onClick={closeMenu}>
            Inventory
          </Link>
          <Link href="/dashboard/shipment" className={`btn ${styles.menuLink}`} onClick={closeMenu}>
            Shipments
          </Link>
        </div>

        <div className={styles.drawerFooter}>
          <LogoutButton className={styles.drawerLogout} />
        </div>
      </aside>
    </div>
  );
}
