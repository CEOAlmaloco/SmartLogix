"use client";

import styles from "./StatusMessage.module.css";

type StatusMessageProps = {
  variant: "success" | "error";
  message: string;
};

export function StatusMessage({ variant, message }: StatusMessageProps) {
  return <p className={`${styles.message} ${styles[variant]}`}>{message}</p>;
}
