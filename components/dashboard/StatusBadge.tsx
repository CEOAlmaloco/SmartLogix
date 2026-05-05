"use client";

import styles from "@/app/(views)/dashboard/dashboard.module.css";

type Props = {
  variant?: string;
  children?: React.ReactNode;
  className?: string;
};

function mapVariant(v?: string) {
  if (!v) return "pending";
  if (v === "in_transit") return "inTransit";
  return v;
}

export function StatusBadge({ variant, children, className }: Props) {
  const key = mapVariant(variant);
  return <span className={`${styles.badge} ${styles[key as keyof typeof styles] ?? ""} ${className ?? ""}`.trim()}>{children}</span>;
}

export default StatusBadge;
