"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./dashboard.module.css";

type OrderStatus = "pending" | "approved" | "dispatched" | "cancelled";

type OrderItem = {
  id: string;
  created_at?: string;
  status?: OrderStatus;
};

type OrdersResponse = {
  data?: OrderItem[];
  message?: string;
  code?: string;
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/orders", {
          cache: "no-store",
          credentials: "include",
        });
        const json = (await response.json()) as OrdersResponse;

        if (!response.ok) {
          throw new Error(json.message ?? "No fue posible obtener los pedidos");
        }

        setOrders(Array.isArray(json.data) ? json.data : []);
      } catch (requestError: unknown) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Error inesperado al cargar overview";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const todayOrders = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return orders.filter((order) => String(order.created_at ?? "").slice(0, 10) === today)
      .length;
  }, [orders]);

  const pendingOrders = useMemo(
    () => orders.filter((order) => (order.status ?? "pending") === "pending").length,
    [orders]
  );

  return (
    <div className="d-grid gap-3">
      <section className={styles.panel}>
        <h2>Overview de operacion</h2>
        <p>
          Desde aqui ves el pulso del negocio y navegas a cada modulo. Inventory y Shipments
          quedaran activos cuando sus servicios esten implementados.
        </p>

        {error ? <p>{error}</p> : null}

        <div className={styles.statsGrid}>
          <article>
            <strong>{loading ? "..." : orders.length}</strong>
            <span>Pedidos totales</span>
          </article>
          <article>
            <strong>{loading ? "..." : todayOrders}</strong>
            <span>Pedidos hoy</span>
          </article>
          <article>
            <strong>{loading ? "..." : pendingOrders}</strong>
            <span>Alertas de stock (aprox.)</span>
          </article>
        </div>
      </section>

      <section className="row g-3">
        <div className="col-12 col-md-4">
          <article className={styles.moduleCard}>
            <h3>Orders</h3>
            <p>Modulo disponible hoy para listar, crear y actualizar estado de pedidos.</p>
            <div className={styles.moduleLink}>
              <Link href="/dashboard/order" className="btn btn-sm btn-outline-secondary">
                Ir a Orders
              </Link>
            </div>
          </article>
        </div>

        <div className="col-12 col-md-4">
          <article className={styles.moduleCard}>
            <h3>Inventory</h3>
            <p>Proximamente: este modulo se activara cuando el backend de inventario este listo.</p>
            <div className={styles.moduleLink}>
              <Link href="/dashboard/inventory" className="btn btn-sm btn-outline-secondary">
                Ver estado
              </Link>
            </div>
          </article>
        </div>

        <div className="col-12 col-md-4">
          <article className={styles.moduleCard}>
            <h3>Shipments</h3>
            <p>Proximamente: este modulo se activara cuando el backend de envios este listo.</p>
            <div className={styles.moduleLink}>
              <Link href="/dashboard/shipment" className="btn btn-sm btn-outline-secondary">
                Ver estado
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
