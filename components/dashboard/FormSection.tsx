"use client";

import { ReactNode } from "react";
import styles from "@/app/(views)/dashboard/dashboard.module.css";

type Props = {
  header?: ReactNode;
  headerRight?: ReactNode;
  children?: ReactNode;
};

export function FormSection({ header, headerRight, children }: Props) {
  return (
    <div className={styles.sectionBlock}>
      {header ? (
        <div className={styles.sectionHeaderRow}>
          <div className={styles.sectionHeader}>{header}</div>
          {headerRight ? <div>{headerRight}</div> : null}
        </div>
      ) : null}
      <div className={styles.formGrid}>{children}</div>
    </div>
  );
}

export default FormSection;
