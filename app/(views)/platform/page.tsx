"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { StatusMessage } from "@/components/ui/StatusMessage";
import styles from "../dashboard/dashboard.module.css";
import platformStyles from "./platform.module.css";

type PlatformMetrics = {
  total_pymes: number;
  active_pymes: number;
  suspended_pymes: number;
  pending_review_pymes: number;
  total_orders: number;
  total_shipments: number;
  total_inventory_items: number;
};

type ApiResponse<T> = {
  data?: T;
  message?: string;
  code?: string;
};

function MetricCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <article className={platformStyles.metricCard}>
      <p className={platformStyles.metricLabel}>{label}</p>
      <div className={platformStyles.metricValue}>{value}</div>
      <p className={platformStyles.metricHint}>{hint}</p>
    </article>
  );
}

export default function PlatformOverviewPage() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/platform/metrics", {
          cache: "no-store",
          credentials: "include",
        });

        const json = (await response.json()) as ApiResponse<PlatformMetrics>;

        if (!response.ok) {
          throw new Error(json.message ?? "No fue posible obtener métricas globales");
        }

        setMetrics(json.data ?? null);
      } catch (requestError: unknown) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Error inesperado al cargar métricas"
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <DashboardPanel
      title="Overview global"
      subtitle="Visibilidad operativa sobre la plataforma, sus PYMEs y los volúmenes transaccionales acumulados."
      actionsClassName={platformStyles.toolbarActions}
      actions={<Link href="/platform/pymes" className={`btn ${styles.navBtn}`}>Ver PYMEs</Link>}
    >
      {error ? <StatusMessage variant="error" message={error} /> : null}

      <div className={platformStyles.metricsGrid}>
        <MetricCard label="Total PYMEs" value={loading ? "..." : metrics?.total_pymes ?? 0} hint="Empresas registradas en la plataforma" />
        <MetricCard label="PYMEs activas" value={loading ? "..." : metrics?.active_pymes ?? 0} hint="Operación habilitada para dueños y equipos" />
        <MetricCard label="PYMEs suspendidas" value={loading ? "..." : metrics?.suspended_pymes ?? 0} hint="Empresas con acceso temporalmente bloqueado" />
        <MetricCard label="En revisión" value={loading ? "..." : metrics?.pending_review_pymes ?? 0} hint="PYMEs pendientes de validación interna" />
        <MetricCard label="Pedidos totales" value={loading ? "..." : metrics?.total_orders ?? 0} hint="Pedidos procesados en toda la plataforma" />
        <MetricCard label="Items inventario" value={loading ? "..." : metrics?.total_inventory_items ?? 0} hint="Productos activos en inventarios de las PYMEs" />
        <MetricCard label="Envíos totales" value={loading ? "..." : metrics?.total_shipments ?? 0} hint="Despachos registrados en la plataforma" />
      </div>
    </DashboardPanel>
  );
}