"use client";

import { ReactNode } from "react";
import styles from "@/app/(views)/dashboard/dashboard.module.css";

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  actionsClassName?: string;
  children?: ReactNode;
};

export function DashboardPanel({ title, subtitle, actions, actionsClassName, children }: Props) {
  return (
    <section className={styles.panel}>
      <div className={styles.pageToolbar}>
        <div>
          {title ? <h2>{title}</h2> : null}
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        <div className={`${styles.toolbarActions} ${actionsClassName ?? ""}`.trim()}>{actions}</div>
      </div>

      {children}
    </section>
  );
}

export default DashboardPanel;
