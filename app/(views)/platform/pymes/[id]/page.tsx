"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { getPymeStatusLabel } from "@/lib/status-labels";
import styles from "../../../dashboard/dashboard.module.css";
import platformStyles from "../../platform.module.css";

type PymeStatus = "active" | "suspended" | "pending_review";

type PymeDetail = {
  id: string;
  name: string;
  owner_id: string;
  status: PymeStatus;
  user_count: number;
  created_at: string;
  suspended_at: string | null;
  suspended_reason: string | null;
  users: Array<{ user_id: string; role: string; created_at: string }>;
};

type ApiResponse<T> = {
  data?: T;
  message?: string;
  code?: string;
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
}

function statusClass(status: PymeStatus) {
  if (status === "active") return `${styles.badge} ${styles.approved}`;
  if (status === "suspended") return `${styles.badge} ${styles.cancelled}`;
  return `${styles.badge} ${styles.pending}`;
}

const TRANSITIONS: Record<PymeStatus, PymeStatus[]> = {
  active: ["pending_review", "suspended"],
  pending_review: ["active", "suspended"],
  suspended: ["active"],
};

export default function PlatformPymeDetailPage() {
  const params = useParams<{ id: string }>();
  const pymeId = params.id;

  const [detail, setDetail] = useState<PymeDetail | null>(null);
  const [users, setUsers] = useState<Array<{ user_id: string; role: string; created_at: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ variant: "success" | "error"; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [detailResponse, usersResponse] = await Promise.all([
        fetch(`/api/platform/pymes/${pymeId}`, { cache: "no-store", credentials: "include" }),
        fetch(`/api/platform/pymes/${pymeId}/users`, { cache: "no-store", credentials: "include" }),
      ]);

      const detailJson = (await detailResponse.json()) as ApiResponse<PymeDetail>;
      const usersJson = (await usersResponse.json()) as ApiResponse<Array<{ user_id: string; role: string; created_at: string }>>;

      if (!detailResponse.ok) {
        throw new Error(detailJson.message ?? "No fue posible cargar el detalle de la PYME");
      }

      if (!usersResponse.ok) {
        throw new Error(usersJson.message ?? "No fue posible cargar los usuarios de la PYME");
      }

      setDetail(detailJson.data ?? null);
      setUsers(Array.isArray(usersJson.data) ? usersJson.data : []);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Error inesperado al cargar la PYME");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pymeId]);

  const actionStatusOptions = useMemo(() => {
    const currentStatus = detail?.status ?? "pending_review";
    return TRANSITIONS[currentStatus];
  }, [detail?.status]);

  const updateStatus = async (status: PymeStatus, suspendedReason?: string) => {
    try {
      setSubmitting(true);
      setNotice(null);

      const response = await fetch(`/api/platform/pymes/${pymeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status,
          suspended_reason: suspendedReason,
        }),
      });

      const json = (await response.json()) as ApiResponse<PymeDetail>;

      if (!response.ok) {
        throw new Error(json.message ?? "No fue posible actualizar la PYME");
      }

      setNotice({ variant: "success", message: "Estado de PYME actualizado correctamente" });
      setShowSuspendModal(false);
      setSuspendReason("");
      await loadData();
    } catch (requestError: unknown) {
      setNotice({
        variant: "error",
        message: requestError instanceof Error ? requestError.message : "Error inesperado al actualizar la PYME",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardPanel
      title={detail?.name ?? (loading ? "Cargando PYME..." : "Detalle de PYME")}
      subtitle="Gestión del estado operativo de la empresa y revisión de los usuarios vinculados."
      actionsClassName={platformStyles.toolbarActions}
      actions={<Link href="/platform/pymes" className={`btn ${styles.navBtn}`}>Volver a PYMEs</Link>}
    >
      {error ? <StatusMessage variant="error" message={error} /> : null}
      {notice ? <StatusMessage variant={notice.variant} message={notice.message} /> : null}

      {detail ? (
        <div className={platformStyles.detailGrid}>
          <div className={platformStyles.detailCard}>
            <h3>Información general</h3>
            <ul className={platformStyles.detailList}>
              <li><strong>ID</strong><span>{detail.id}</span></li>
              <li><strong>Owner ID</strong><span>{detail.owner_id}</span></li>
              <li><strong>Estado</strong><span><span className={statusClass(detail.status)}>{getPymeStatusLabel(detail.status)}</span></span></li>
              <li><strong>Registrada</strong><span>{formatDate(detail.created_at)}</span></li>
              <li><strong>Usuarios</strong><span>{users.length}</span></li>
              <li><strong>Suspensión</strong><span>{detail.status === "suspended" ? `${formatDate(detail.suspended_at)} · ${detail.suspended_reason ?? "Sin motivo"}` : "No aplica"}</span></li>
            </ul>
          </div>

          <div className={platformStyles.detailCard}>
            <h3>Acciones</h3>
            <p>El estado actual determina las transiciones permitidas para la PYME.</p>
            <div className={platformStyles.actionGrid}>
              {actionStatusOptions.includes("pending_review") ? (
                <Button type="button" variant="soft" onClick={() => void updateStatus("pending_review")} loading={submitting}>
                  Marcar en revisión
                </Button>
              ) : null}

              {actionStatusOptions.includes("active") ? (
                <Button type="button" onClick={() => void updateStatus("active")} loading={submitting}>
                  Reactivar PYME
                </Button>
              ) : null}

              {actionStatusOptions.includes("suspended") ? (
                <Button type="button" variant="soft" onClick={() => setShowSuspendModal(true)} disabled={submitting}>
                  Suspender PYME
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className={platformStyles.detailCard} style={{ marginTop: "1rem" }}>
        <h3>Usuarios de la PYME</h3>
        <div className={platformStyles.usersTableWrap}>
          <table className={platformStyles.usersTable}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Rol</th>
                <th>Miembro desde</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.role}</td>
                  <td>{formatDate(user.created_at)}</td>
                </tr>
              ))}
              {!loading && users.length === 0 ? (
                <tr>
                  <td colSpan={3}>No hay usuarios registrados para esta PYME.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showSuspendModal} onClose={() => setShowSuspendModal(false)} title="Suspender PYME">
        <div className={platformStyles.supportText}>
          La suspensión requiere un motivo obligatorio y puede revertirse posteriormente desde este mismo panel.
        </div>
        <div className={styles.form}>
          <div className={styles.fieldWrap}>
            <label htmlFor="suspend-reason">Motivo</label>
            <textarea
              id="suspend-reason"
              className={styles.textAreaField}
              value={suspendReason}
              onChange={(event) => setSuspendReason(event.target.value)}
              placeholder="Incumplimiento de términos de uso"
            />
          </div>
          <div className={styles.formActions}>
            <Button type="button" variant="soft" onClick={() => void updateStatus("suspended", suspendReason.trim())} loading={submitting}>
              Confirmar suspensión
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowSuspendModal(false)} disabled={submitting}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardPanel>
  );
}