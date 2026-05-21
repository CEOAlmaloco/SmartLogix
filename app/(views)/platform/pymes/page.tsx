"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { Modal } from "@/components/ui/Modal";
import { StatusMessage } from "@/components/ui/StatusMessage";
import styles from "../../dashboard/dashboard.module.css";
import platformStyles from "../platform.module.css";

type PymeStatus = "active" | "suspended" | "pending_review";

type PymeSummary = {
  id: string;
  name: string;
  owner_id: string;
  status: PymeStatus;
  user_count: number;
  created_at: string;
  suspended_at: string | null;
  suspended_reason: string | null;
};

type PymeDetail = PymeSummary & {
  users: Array<{ user_id: string; role: string; created_at: string }>;
};

type ApiResponse<T> = {
  data?: T;
  message?: string;
  code?: string;
};

function statusClass(status: PymeStatus) {
  if (status === "active") return `${styles.badge} ${styles.approved}`;
  if (status === "suspended") return `${styles.badge} ${styles.cancelled}`;
  return `${styles.badge} ${styles.pending}`;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
}

export default function PlatformPymesPage() {
  const [pymes, setPymes] = useState<PymeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PymeStatus>("all");
  const [detailTarget, setDetailTarget] = useState<PymeDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/platform/pymes", { cache: "no-store", credentials: "include" });
        const json = (await response.json()) as ApiResponse<PymeSummary[]>;

        if (!response.ok) {
          throw new Error(json.message ?? "No fue posible obtener las PYMEs");
        }

        setPymes(Array.isArray(json.data) ? json.data : []);
      } catch (requestError: unknown) {
        setError(requestError instanceof Error ? requestError.message : "Error inesperado al cargar PYMEs");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return pymes.filter((pyme) => {
      const matchesStatus = statusFilter === "all" ? true : pyme.status === statusFilter;
      const matchesSearch = !needle ? true : pyme.name.toLowerCase().includes(needle);
      return matchesStatus && matchesSearch;
    });
  }, [pymes, search, statusFilter]);

  const openDetail = async (pymeId: string) => {
    try {
      setDetailLoading(true);
      const response = await fetch(`/api/platform/pymes/${pymeId}`, { cache: "no-store", credentials: "include" });
      const json = (await response.json()) as ApiResponse<PymeDetail>;

      if (!response.ok) {
        throw new Error(json.message ?? "No fue posible obtener el detalle");
      }

      setDetailTarget(json.data ?? null);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Error inesperado al abrir la PYME");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <DashboardPanel
      title="PYMEs registradas"
      subtitle="Listado y control del estado operativo de cada empresa conectada a SmartLogix."
      actions={
        <div className={platformStyles.actionGrid}>
          <Link href="/platform" className={`btn ${styles.navBtn}`}>Volver al overview</Link>
        </div>
      }
    >
      {error ? <StatusMessage variant="error" message={error} /> : null}

      <div className={platformStyles.filterBar}>
        <input
          className={platformStyles.filterField}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre de PYME"
        />
        <select className={platformStyles.filterField} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | PymeStatus)}>
          <option value="all">Todos los estados</option>
          <option value="active">Activas</option>
          <option value="suspended">Suspendidas</option>
          <option value="pending_review">En revisión</option>
        </select>
        <div className={platformStyles.filterField} aria-hidden>
          {filtered.length} de {pymes.length} resultados
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Owner ID</th>
              <th>Estado</th>
              <th>Usuarios</th>
              <th>Registrada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((pyme) => (
              <tr key={pyme.id}>
                <td>{pyme.name}</td>
                <td>{pyme.owner_id.slice(0, 8)}</td>
                <td><span className={statusClass(pyme.status)}>{pyme.status}</span></td>
                <td>{pyme.user_count}</td>
                <td>{formatDate(pyme.created_at)}</td>
                <td>
                  <div className={styles.rowActions}>
                    <button type="button" className={`${styles.tableActionBtn} ${styles.tableActionEdit}`} onClick={() => void openDetail(pyme.id)}>
                      Ver
                    </button>
                    <Link href={`/platform/pymes/${pyme.id}`} className={`btn ${styles.tableActionBtn}`}>
                      Gestionar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>No hay PYMEs que coincidan con el filtro actual.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Modal open={Boolean(detailTarget) || detailLoading} onClose={() => setDetailTarget(null)} title={detailTarget?.name ?? "Detalle de PYME"}>
        {detailLoading ? <p className={platformStyles.emptyState}>Cargando detalle...</p> : null}
        {detailTarget ? (
          <div className={platformStyles.detailGrid}>
            <div className={platformStyles.detailCard}>
              <h3>Información</h3>
              <ul className={platformStyles.detailList}>
                <li><strong>ID</strong><span>{detailTarget.id}</span></li>
                <li><strong>Owner ID</strong><span>{detailTarget.owner_id}</span></li>
                <li><strong>Estado</strong><span><span className={statusClass(detailTarget.status)}>{detailTarget.status}</span></span></li>
                <li><strong>Registrada</strong><span>{formatDate(detailTarget.created_at)}</span></li>
                <li><strong>Suspensión</strong><span>{detailTarget.status === "suspended" ? `${formatDate(detailTarget.suspended_at)} · ${detailTarget.suspended_reason ?? "Sin motivo"}` : "No aplica"}</span></li>
              </ul>
            </div>

            <div className={platformStyles.detailCard}>
              <h3>Usuarios</h3>
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
                    {detailTarget.users.map((user) => (
                      <tr key={user.user_id}>
                        <td>{user.user_id.slice(0, 8)}</td>
                        <td>{user.role}</td>
                        <td>{formatDate(user.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </DashboardPanel>
  );
}