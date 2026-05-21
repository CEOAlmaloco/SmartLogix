import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import styles from "./page.module.css";

type SuspendedPageProps = {
  searchParams?: {
    reason?: string;
    suspendedAt?: string;
  };
};

function formatDate(value?: string) {
  if (!value) return "No informado";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function SuspendedPage({ searchParams }: SuspendedPageProps) {
  const reason = searchParams?.reason ?? "La PYME fue suspendida temporalmente.";
  const suspendedAt = formatDate(searchParams?.suspendedAt);

  return (
    <AuthPageLayout
      title="Cuenta suspendida"
      subtitle="Acceso restringido"
      helperText="Tu empresa no puede operar en la plataforma hasta que se resuelva la suspensión."
    >
      <div className={styles.card}>
        <p className={styles.label}>Motivo</p>
        <p className={styles.value}>{reason}</p>

        <p className={styles.label} style={{ marginTop: "0.9rem" }}>
          Fecha de suspensión
        </p>
        <p className={styles.value}>{suspendedAt}</p>

        <p className={styles.support}>
          Si necesitas revisar esta situación, contacta al equipo interno de SmartLogix a través de los canales formales de soporte.
        </p>

        <div className={styles.actions}>
          <LogoutButton />
        </div>
      </div>
    </AuthPageLayout>
  );
}