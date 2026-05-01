"use client";

import { ReactNode } from "react";
import styles from "@/app/dashboard/dashboard.module.css";

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
};

export function DashboardPanel({ title, subtitle, actions, children }: Props) {
  return (
    <section className={styles.panel}>
      <div className={styles.pageToolbar}>
        <div>
          {title ? <h2>{title}</h2> : null}
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        <div className={styles.toolbarActions}>{actions}</div>
      </div>

      {children}
    </section>
  );
}

export default DashboardPanel;
