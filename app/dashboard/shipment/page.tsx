"use client"; //para que se ejecute en el navegador y no en el servidor

import { useEffect, useMemo, useState } from "react";
import styles from "../dashboard.module.css";

type ShipmentStatus = "pending" | "in_transit" | "delivered" | "cancelled";

type ShipmentItem = {
  id: string;
  order_id?: string;
  carrier?: string | null;
  tracking_code?: string | null;
  status?: ShipmentStatus;
  estimated_delivery?: string | null;
};

type ShipmentsResponse = {
  data?: ShipmentItem[];
  message?: string;
};

//asignar las clases de css a los estados de envio 
function statusClass(status: ShipmentStatus | undefined, classes: typeof styles) {
  if (status === "in_transit") return `${classes.badge} ${classes.inTransit}`; 
  if (status === "delivered") return `${classes.badge} ${classes.delivered}`;
  if (status === "cancelled") return `${classes.badge} ${classes.cancelled}`;
  return `${classes.badge} ${classes.pending}`;
}

//carga envios desde el backend
export default function ShipmentDashboardPage() {
  const [shipments, setShipments] = useState<ShipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/shipments", {
          cache: "no-store",
          credentials: "include",
        });
        const json = (await response.json()) as ShipmentsResponse;

        if (!response.ok) {
          throw new Error(json.message ?? "No fue posible obtener envios");
        }

        setShipments(Array.isArray(json.data) ? json.data : []);
      } catch (requestError: unknown) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Error inesperado al cargar envios"
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);
 //el memo es para que no se vuelva a renderizar el titulo cada vez que se carga el componente
  const title = useMemo(() => {
    if (loading) return "Cargando envios...";
    return `Envios (${shipments.length})`;
  }, [loading, shipments.length]);

  return (
    <section className={styles.panel}>
      <h2>{title}</h2>
      <p>Modulo conectado al backend de shipments. Aqui se listan los envios activos.</p>
      {error ? <p>{error}</p> : null}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pedido</th>
              <th>Transportista</th>
              <th>Tracking</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id}>
                <td>{shipment.id.slice(0, 8)}</td>
                <td>{shipment.order_id?.slice(0, 8) ?? "-"}</td>
                <td>{shipment.carrier ?? "-"}</td>
                <td>{shipment.tracking_code ?? "-"}</td>
                <td>
                  <span className={statusClass(shipment.status, styles)}>
                    {shipment.status ?? "pending"}
                  </span>
                </td>
              </tr>
            ))}
            {!loading && shipments.length === 0 ? (
              <tr>
                <td colSpan={5}>No hay envios registrados todavia.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}