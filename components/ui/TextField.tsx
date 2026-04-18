"use client";

import { InputHTMLAttributes } from "react";
import styles from "./TextField.module.css";

type FieldState = "default" | "error" | "success";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  state?: FieldState;
};

export function TextField({
  label,
  id,
  error,
  className,
  state = "default",
  ...props
}: TextFieldProps) {
  const stateClass =
    state === "error"
      ? styles.inputError
      : state === "success"
        ? styles.inputSuccess
        : "";

  return (
    <label className={styles.wrapper} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <input
        className={`${styles.input} ${stateClass} ${className ?? ""}`.trim()}
        id={id}
        {...props}
      />
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  );
}
