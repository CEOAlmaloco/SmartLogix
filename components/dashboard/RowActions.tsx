"use client";

import { ReactNode } from "react";
import styles from "@/app/(views)/dashboard/dashboard.module.css";

type Props = {
  children?: ReactNode;
  className?: string;
};

export function RowActions({ children, className }: Props) {
  return <div className={`${styles.rowActions} ${className ?? ""}`.trim()}>{children}</div>;
}

export default RowActions;
