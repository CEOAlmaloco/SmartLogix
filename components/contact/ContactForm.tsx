"use client";

import { FormEvent, useState } from "react";
import { CONTACT_REASONS, CONTACT_SUBMIT_LABELS, type ContactReason } from "@/config/contact";
import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { TextField } from "@/components/ui/TextField";
import styles from "./ContactForm.module.css";

type Feedback = { type: "success" | "error"; message: string } | null;

export function ContactForm({ defaultReason = "demo" }: { defaultReason?: string }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState(defaultReason);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const submitLabel =
    reason in CONTACT_SUBMIT_LABELS
      ? CONTACT_SUBMIT_LABELS[reason as ContactReason]
      : "Enviar mensaje";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, email, reason, message }),
      });

      const data = (await res.json().catch(() => null)) as {
        message?: string;
        mode?: string;
        mailto?: string;
      } | null;

      if (!res.ok) {
        throw new Error(data?.message ?? "No fue posible enviar el mensaje");
      }

      if (data?.mode === "mailto" && data.mailto) {
        window.location.href = data.mailto;
      }

      setFeedback({
        type: "success",
        message: data?.message ?? "Mensaje enviado correctamente.",
      });

      if (data?.mode === "email") {
        setName("");
        setCompany("");
        setEmail("");
        setMessage("");
      }
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Error inesperado",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="contact-form" className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <TextField
          id="contact-name"
          label="Nombre"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          autoComplete="name"
        />
        <TextField
          id="contact-company"
          label="Empresa"
          name="company"
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Nombre de la PYME"
          autoComplete="organization"
        />
      </div>

      <TextField
        id="contact-email"
        label="Correo"
        name="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="empresa@correo.com"
        autoComplete="email"
      />

      <label className={styles.selectWrap} htmlFor="contact-reason">
        <span className={styles.selectLabel}>Motivo</span>
        <select
          id="contact-reason"
          name="reason"
          className={styles.select}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        >
          {CONTACT_REASONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.textareaWrap} htmlFor="contact-message">
        <span className={styles.selectLabel}>Mensaje</span>
        <textarea
          id="contact-message"
          name="message"
          className={styles.textarea}
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Cuéntanos volumen de pedidos, canales de venta o qué necesitas resolver…"
        />
      </label>

      {feedback ? <StatusMessage variant={feedback.type} message={feedback.message} /> : null}

      <Button type="submit" loading={loading} className={styles.submit}>
        {submitLabel}
      </Button>

      <p className={styles.hint}>
        Horario de atención comercial: lunes a viernes, 09:00–18:00 (Chile).
      </p>
    </form>
  );
}
