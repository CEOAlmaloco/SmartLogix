"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { TextField } from "@/components/ui/TextField";
import styles from "../dashboard.module.css";

type OrderStatus = "pending" | "approved" | "dispatched" | "cancelled";

type OrderItem = {
	id: string;
	customer_name?: string;
	customer_email?: string;
	total?: number;
	status?: OrderStatus;
	notes?: string | null;
	created_at?: string;
};

type OrdersResponse = {
	data?: OrderItem[];
	message?: string;
};

type CreateOrderForm = {
	customerName: string;
	customerEmail: string;
	total: string;
	notes: string;
};

const INITIAL_FORM: CreateOrderForm = {
	customerName: "",
	customerEmail: "",
	total: "",
	notes: "",
};

const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
	pending: ["approved", "cancelled"],
	approved: ["dispatched", "cancelled"],
	dispatched: [],
	cancelled: [],
};

function formatCurrency(value: number | undefined) {
	return new Intl.NumberFormat("es-CL", {
		style: "currency",
		currency: "CLP",
		maximumFractionDigits: 0,
	}).format(Number(value ?? 0));
}

function canDeleteOrder(status: OrderStatus) {
	return status === "pending" || status === "cancelled";
}

function statusClass(status: OrderStatus | undefined, classes: typeof styles) {
	if (status === "approved") return `${classes.badge} ${classes.approved}`;
	if (status === "dispatched") return `${classes.badge} ${classes.dispatched}`;
	if (status === "cancelled") return `${classes.badge} ${classes.cancelled}`;
	return `${classes.badge} ${classes.pending}`;
}

export default function OrderDashboardPage() {
	const [orders, setOrders] = useState<OrderItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [formData, setFormData] = useState<CreateOrderForm>(INITIAL_FORM);
	const [notice, setNotice] = useState<{ variant: "success" | "error"; message: string } | null>(null);
	const [nextStatuses, setNextStatuses] = useState<Record<string, OrderStatus>>({});
	const [error, setError] = useState<string | null>(null);

	const loadOrders = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch("/api/orders", {
				cache: "no-store",
				credentials: "include",
			});
			const json = (await response.json()) as OrdersResponse;

			if (!response.ok) {
				throw new Error(json.message ?? "No fue posible obtener pedidos");
			}

			const nextOrders = Array.isArray(json.data) ? json.data : [];
			setOrders(nextOrders);
			setNextStatuses((prev) => {
				const updated: Record<string, OrderStatus> = {};
				nextOrders.forEach((order) => {
					const status = (order.status ?? "pending") as OrderStatus;
					const previousChoice = prev[order.id];
					const options = ORDER_TRANSITIONS[status];
					updated[order.id] =
						previousChoice && options.includes(previousChoice)
							? previousChoice
							: options[0] ?? status;
				});
				return updated;
			});
		} catch (requestError: unknown) {
			setError(
				requestError instanceof Error
					? requestError.message
					: "Error inesperado al cargar pedidos"
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadOrders();
	}, [loadOrders]);

	const onCreateOrder = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setNotice(null);

		if (!formData.customerName.trim() || !formData.customerEmail.trim() || !formData.total.trim()) {
			setNotice({ variant: "error", message: "Nombre, email y total son obligatorios" });
			return;
		}

		try {
			setSubmitting(true);
			const response = await fetch("/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					customerName: formData.customerName.trim(),
					customerEmail: formData.customerEmail.trim(),
					total: Number(formData.total),
					notes: formData.notes.trim() ? formData.notes.trim() : undefined,
				}),
			});
			const json = (await response.json()) as { message?: string };

			if (!response.ok) {
				throw new Error(json.message ?? "No fue posible crear el pedido");
			}

			setNotice({ variant: "success", message: "Pedido creado correctamente" });
			setIsCreateOpen(false);
			setFormData(INITIAL_FORM);
			await loadOrders();
		} catch (requestError: unknown) {
			setNotice({
				variant: "error",
				message:
					requestError instanceof Error
						? requestError.message
						: "Error inesperado al crear pedido",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const onChangeStatus = async (order: OrderItem) => {
		const currentStatus = (order.status ?? "pending") as OrderStatus;
		const nextStatus = nextStatuses[order.id];

		if (!nextStatus || !ORDER_TRANSITIONS[currentStatus].includes(nextStatus)) {
			setNotice({ variant: "error", message: "Selecciona una transición válida" });
			return;
		}

		try {
			setSubmitting(true);
			setNotice(null);
			const response = await fetch(`/api/orders/${order.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ status: nextStatus }),
			});
			const json = (await response.json()) as { message?: string };

			if (!response.ok) {
				throw new Error(json.message ?? "No fue posible actualizar estado");
			}

			setNotice({ variant: "success", message: "Estado actualizado correctamente" });
			await loadOrders();
		} catch (requestError: unknown) {
			setNotice({
				variant: "error",
				message:
					requestError instanceof Error
						? requestError.message
						: "Error inesperado al actualizar estado",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const onDeleteOrder = async (order: OrderItem) => {
		const status = (order.status ?? "pending") as OrderStatus;
		if (!canDeleteOrder(status)) {
			setNotice({ variant: "error", message: "No se puede eliminar un pedido en curso" });
			return;
		}

		const confirmed = window.confirm("¿Eliminar este pedido? Esta acción no se puede deshacer.");
		if (!confirmed) return;

		try {
			setSubmitting(true);
			setNotice(null);
			const response = await fetch(`/api/orders/${order.id}`, {
				method: "DELETE",
				credentials: "include",
			});
			const json = (await response.json()) as { message?: string };

			if (!response.ok) {
				throw new Error(json.message ?? "No fue posible eliminar el pedido");
			}

			setNotice({ variant: "success", message: "Pedido eliminado correctamente" });
			await loadOrders();
		} catch (requestError: unknown) {
			setNotice({
				variant: "error",
				message:
					requestError instanceof Error
						? requestError.message
						: "Error inesperado al eliminar pedido",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const title = useMemo(() => {
		if (loading) return "Cargando pedidos...";
		return `Pedidos (${orders.length})`;
	}, [loading, orders.length]);

	return (
		<section className={styles.panel}>
			<div className={styles.pageToolbar}>
				<div>
					<h2>{title}</h2>
					<p>Gestiona pedidos y sus transiciones de estado según reglas operativas.</p>
				</div>
				<div className={styles.toolbarActions}>
					<Button type="button" onClick={() => setIsCreateOpen(true)}>
						Nuevo pedido
					</Button>
				</div>
			</div>

			{error ? <StatusMessage variant="error" message={error} /> : null}
			{notice ? <StatusMessage variant={notice.variant} message={notice.message} /> : null}

			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>ID (corto)</th>
							<th>Cliente</th>
							<th>Email</th>
							<th>Total</th>
							<th>Estado</th>
							<th>Notas</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order.id}>
								<td>{order.id.slice(0, 8)}</td>
								<td>{order.customer_name ?? "Sin nombre"}</td>
								<td>{order.customer_email ?? "Sin email"}</td>
								<td>{formatCurrency(order.total)}</td>
								<td>
									<span className={statusClass(order.status, styles)}>{order.status ?? "pending"}</span>
								</td>
								<td>{order.notes?.trim() ? order.notes : "-"}</td>
								<td>
									{ORDER_TRANSITIONS[(order.status ?? "pending") as OrderStatus].length > 0 ? (
										<div className={styles.rowActions}>
											<select
												className={styles.selectField}
												value={nextStatuses[order.id] ?? order.status ?? "pending"}
												onChange={(event) => {
													const value = event.target.value as OrderStatus;
													setNextStatuses((prev) => ({ ...prev, [order.id]: value }));
												}}
											>
												{ORDER_TRANSITIONS[(order.status ?? "pending") as OrderStatus].map((status) => (
													<option key={status} value={status}>
														{status}
													</option>
												))}
											</select>
											<button
												type="button"
												className={`${styles.tableActionBtn} ${styles.tableActionEdit}`}
												onClick={() => void onChangeStatus(order)}
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
										disabled={!canDeleteOrder((order.status ?? "pending") as OrderStatus)}
										title={
											canDeleteOrder((order.status ?? "pending") as OrderStatus)
												? "Eliminar pedido"
												: "No se puede eliminar un pedido en curso"
										}
										onClick={() => void onDeleteOrder(order)}
									>
										Eliminar
									</button>
								</td>
							</tr>
						))}
						{!loading && orders.length === 0 ? (
							<tr>
								<td colSpan={7}>No hay pedidos registrados todavía.</td>
							</tr>
						) : null}
					</tbody>
				</table>
			</div>

			<Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nuevo pedido">
				<form className={styles.form} onSubmit={onCreateOrder}>
					<TextField
						label="Nombre del cliente"
						value={formData.customerName}
						onChange={(event) =>
							setFormData((prev) => ({ ...prev, customerName: event.target.value }))
						}
						required
					/>
					<TextField
						label="Email del cliente"
						type="email"
						value={formData.customerEmail}
						onChange={(event) =>
							setFormData((prev) => ({ ...prev, customerEmail: event.target.value }))
						}
						required
					/>
					<TextField
						label="Total ($)"
						type="number"
						min={1}
						step={1}
						value={formData.total}
						onChange={(event) => setFormData((prev) => ({ ...prev, total: event.target.value }))}
						required
					/>
					<div className={styles.fieldWrap}>
						<label htmlFor="order-notes">Notas (opcional)</label>
						<textarea
							id="order-notes"
							className={styles.textAreaField}
							value={formData.notes}
							onChange={(event) =>
								setFormData((prev) => ({ ...prev, notes: event.target.value }))
							}
						/>
					</div>
					<div className={styles.formActions}>
						<Button type="submit" loading={submitting}>
							Crear pedido
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