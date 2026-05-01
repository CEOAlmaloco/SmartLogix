"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { TextField } from "@/components/ui/TextField";
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

type OrdersResponse = {
  data?: Array<{
    id: string;
    customer_name?: string;
    total?: number;
    status?: "pending" | "approved" | "dispatched" | "cancelled";
  }>;
  message?: string;
};

type ShipmentForm = {
  orderId: string;
  carrier: string;
  trackingCode: string;
  estimatedDelivery: string;
};

const SHIPMENT_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  pending: ["in_transit", "cancelled"],
  in_transit: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

function defaultEstimatedDelivery() {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return date.toISOString().slice(0, 10);
}

function formatOrderLabel(customerName: string | undefined, total: number | undefined) {
  const formatted = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(total ?? 0));

  return `${customerName ?? "Cliente sin nombre"} - ${formatted}`;
}

function canDeleteShipment(status: ShipmentStatus) {
  return status === "pending";
}

function statusClass(status: ShipmentStatus | undefined, classes: typeof styles) {
  if (status === "in_transit") return `${classes.badge} ${classes.inTransit}`;
  if (status === "delivered") return `${classes.badge} ${classes.delivered}`;
  if (status === "cancelled") return `${classes.badge} ${classes.cancelled}`;
  return `${classes.badge} ${classes.pending}`;
}

export default function ShipmentDashboardPage() {
  const [shipments, setShipments] = useState<ShipmentItem[]>([]);
  const [approvedOrders, setApprovedOrders] = useState<Array<{ id: string; label: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [nextStatuses, setNextStatuses] = useState<Record<string, ShipmentStatus>>({});
  const [notice, setNotice] = useState<{ variant: "success" | "error"; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ShipmentForm>({
    orderId: "",
    carrier: "",
    trackingCode: "",
    estimatedDelivery: defaultEstimatedDelivery(),
  });

  const loadShipments = useCallback(async () => {
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

      const list = Array.isArray(json.data) ? json.data : [];
      setShipments(list);
      setNextStatuses((prev) => {
        const updated: Record<string, ShipmentStatus> = {};
        list.forEach((shipment) => {
          const status = (shipment.status ?? "pending") as ShipmentStatus;
          const transitions = SHIPMENT_TRANSITIONS[status];
          const previousChoice = prev[shipment.id];
          updated[shipment.id] =
            previousChoice && transitions.includes(previousChoice)
              ? previousChoice
              : transitions[0] ?? status;
        });
        return updated;
      });
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Error inesperado al cargar envios"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadApprovedOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/orders", {
        cache: "no-store",
        credentials: "include",
      });
      const json = (await response.json()) as OrdersResponse;

      if (!response.ok) {
        throw new Error(json.message ?? "No fue posible cargar pedidos aprobados");
      }

      const options = (Array.isArray(json.data) ? json.data : [])
        .filter((order) => order.status === "approved")
        .map((order) => ({
          id: order.id,
          label: formatOrderLabel(order.customer_name, order.total),
        }));

      setApprovedOrders(options);
      setFormData((prev) => ({
        ...prev,
        orderId: prev.orderId || options[0]?.id || "",
      }));
    } catch (requestError: unknown) {
      setNotice({
        variant: "error",
        message:
          requestError instanceof Error
            ? requestError.message
            : "Error inesperado al cargar pedidos aprobados",
      });
    }
  }, []);

  useEffect(() => {
    void loadShipments();
  }, [loadShipments]);

  const title = useMemo(() => {
    if (loading) return "Cargando envios...";
    return `Envios (${shipments.length})`;
  }, [loading, shipments.length]);

  const openCreateModal = async () => {
    setNotice(null);
    setIsCreateOpen(true);
    await loadApprovedOrders();
  };

  const handleCreateShipment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (!formData.orderId) {
      setNotice({ variant: "error", message: "Debes seleccionar un pedido aprobado" });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderId: formData.orderId,
          carrier: formData.carrier.trim() || undefined,
          trackingCode: formData.trackingCode.trim() || undefined,
          estimatedDelivery: formData.estimatedDelivery,
        }),
      });
      const json = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(json.message ?? "No fue posible crear envio");
      }

      setNotice({ variant: "success", message: "Envio creado correctamente" });
      setIsCreateOpen(false);
      setFormData({
        orderId: "",
        carrier: "",
        trackingCode: "",
        estimatedDelivery: defaultEstimatedDelivery(),
      });
      await loadShipments();
    } catch (requestError: unknown) {
      setNotice({
        variant: "error",
        message:
          requestError instanceof Error
            ? requestError.message
            : "Error inesperado al crear envio",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onChangeStatus = async (shipment: ShipmentItem) => {
    const currentStatus = (shipment.status ?? "pending") as ShipmentStatus;
    const nextStatus = nextStatuses[shipment.id];

    if (!nextStatus || !SHIPMENT_TRANSITIONS[currentStatus].includes(nextStatus)) {
      setNotice({ variant: "error", message: "Selecciona una transición válida" });
      return;
    }

    try {
      setSubmitting(true);
      setNotice(null);
      const response = await fetch(`/api/shipments/${shipment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(json.message ?? "No fue posible actualizar el estado del envio");
      }

      setNotice({ variant: "success", message: "Estado de envío actualizado" });
      await loadShipments();
    } catch (requestError: unknown) {
      setNotice({
        variant: "error",
        message:
          requestError instanceof Error
            ? requestError.message
            : "Error inesperado al actualizar estado de envio",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onDeleteShipment = async (shipment: ShipmentItem) => {
    const status = (shipment.status ?? "pending") as ShipmentStatus;
    if (!canDeleteShipment(status)) {
      setNotice({ variant: "error", message: "No se puede eliminar este envío" });
      return;
    }

    const confirmed = window.confirm("¿Eliminar este envío? Esta acción no se puede deshacer.");
    if (!confirmed) return;

    try {
      setSubmitting(true);
      setNotice(null);
      const response = await fetch(`/api/shipments/${shipment.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(json.message ?? "No fue posible eliminar el envío");
      }

      setNotice({ variant: "success", message: "Envío eliminado correctamente" });
      await loadShipments();
    } catch (requestError: unknown) {
      setNotice({
        variant: "error",
        message:
          requestError instanceof Error
            ? requestError.message
            : "Error inesperado al eliminar envío",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.pageToolbar}>
        <div>
          <h2>{title}</h2>
          <p>Gestiona envíos vinculados a pedidos aprobados y su ciclo logístico.</p>
        </div>
        <div className={styles.toolbarActions}>
          <Button type="button" onClick={() => void openCreateModal()}>
            Nuevo envío
          </Button>
        </div>
      </div>

      {error ? <StatusMessage variant="error" message={error} /> : null}
      {notice ? <StatusMessage variant={notice.variant} message={notice.message} /> : null}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pedido</th>
              <th>Transportista</th>
              <th>Tracking</th>
              <th>Entrega estimada</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id}>
                <td>{shipment.id.slice(0, 8)}</td>
                <td>{shipment.order_id?.slice(0, 8) ?? "-"}</td>
                <td>{shipment.carrier ?? "-"}</td>
                <td>{shipment.tracking_code ?? "-"}</td>
                <td>{shipment.estimated_delivery ?? "-"}</td>
                <td>
                  <span className={statusClass(shipment.status, styles)}>
                    {shipment.status ?? "pending"}
                  </span>
                </td>
                <td>
                  {SHIPMENT_TRANSITIONS[(shipment.status ?? "pending") as ShipmentStatus]
                    .length > 0 ? (
                    <div className={styles.rowActions}>
                      <select
                        className={styles.selectField}
                        value={nextStatuses[shipment.id] ?? shipment.status ?? "pending"}
                        onChange={(event) => {
                          const value = event.target.value as ShipmentStatus;
                          setNextStatuses((prev) => ({ ...prev, [shipment.id]: value }));
                        }}
                      >
                        {SHIPMENT_TRANSITIONS[(shipment.status ?? "pending") as ShipmentStatus].map(
                          (status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          )
                        )}
                      </select>
                      <button
                        type="button"
                        className={`${styles.tableActionBtn} ${styles.tableActionEdit}`}
                        onClick={() => void onChangeStatus(shipment)}
                        disabled={submitting}
                      >
                        Cambiar estado
                      </button>
                    </div>
                  ) : (
                    <button type="button" className={styles.tableActionBtn} disabled>
                      Sin transición
                    </button>
                  )}
                  <button
                    type="button"
                    className={`${styles.tableActionBtn} ${styles.tableActionDelete}`}
                    disabled={!canDeleteShipment((shipment.status ?? "pending") as ShipmentStatus)}
                    title={
                      canDeleteShipment((shipment.status ?? "pending") as ShipmentStatus)
                        ? "Eliminar envío"
                        : "No se puede eliminar este envío"
                    }
                    onClick={() => void onDeleteShipment(shipment)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!loading && shipments.length === 0 ? (
              <tr>
                <td colSpan={7}>No hay envios registrados todavia.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nuevo envío">
        <form className={styles.form} onSubmit={handleCreateShipment}>
          <div className={styles.fieldWrap}>
            <label htmlFor="shipment-order">Pedido asociado</label>
            <select
              id="shipment-order"
              className={styles.selectField}
              value={formData.orderId}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, orderId: event.target.value }))
              }
              required
            >
              {approvedOrders.length === 0 ? <option value="">Sin pedidos aprobados</option> : null}
              {approvedOrders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.label}
                </option>
              ))}
            </select>
          </div>
          <TextField
            label="Transportista"
            value={formData.carrier}
            onChange={(event) => setFormData((prev) => ({ ...prev, carrier: event.target.value }))}
            required
          />
          <TextField
            label="Código de tracking"
            value={formData.trackingCode}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, trackingCode: event.target.value }))
            }
            required
          />
          <TextField
            label="Entrega estimada"
            type="date"
            value={formData.estimatedDelivery}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, estimatedDelivery: event.target.value }))
            }
            required
          />
          <div className={styles.formActions}>
            <Button type="submit" loading={submitting}>
              Crear envío
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}