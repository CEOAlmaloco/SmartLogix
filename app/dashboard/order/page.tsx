"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../dashboard.module.css";

type OrderStatus = "pending" | "approved" | "dispatched" | "cancelled";

type OrderItem = {
	id: string;
	customer_name?: string;
	customer_email?: string;
	total?: number;
	status?: OrderStatus;
	created_at?: string;
};

type OrdersResponse = {
	data?: OrderItem[];
	message?: string;
};

function statusClass(status: OrderStatus | undefined, classes: typeof styles) {
	if (status === "approved") return `${classes.badge} ${classes.approved}`;
	if (status === "dispatched") return `${classes.badge} ${classes.dispatched}`;
	if (status === "cancelled") return `${classes.badge} ${classes.cancelled}`;
	return `${classes.badge} ${classes.pending}`;
}

export default function OrderDashboardPage() {
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
					throw new Error(json.message ?? "No fue posible obtener pedidos");
				}

				setOrders(Array.isArray(json.data) ? json.data : []);
			} catch (requestError: unknown) {
				setError(
					requestError instanceof Error
						? requestError.message
						: "Error inesperado al cargar pedidos"
				);
			} finally {
				setLoading(false);
			}
		};

		void load();
	}, []);

	const title = useMemo(() => {
		if (loading) return "Cargando pedidos...";
		return `Pedidos (${orders.length})`;
	}, [loading, orders.length]);

	return (
		<section className={styles.panel}>
			<h2>{title}</h2>
			<p>Módulo conectado al backend de orders. Aquí ves el listado actual de pedidos.</p>
			{error ? <p>{error}</p> : null}

			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>ID</th>
							<th>Cliente</th>
							<th>Total</th>
							<th>Estado</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order.id}>
								<td>{order.id.slice(0, 8)}</td>
								<td>
									{order.customer_name ?? "Sin nombre"}
									<br />
									<small>{order.customer_email ?? "Sin email"}</small>
								</td>
								<td>${Number(order.total ?? 0).toFixed(2)}</td>
								<td>
									<span className={statusClass(order.status, styles)}>{order.status ?? "pending"}</span>
								</td>
							</tr>
						))}
						{!loading && orders.length === 0 ? (
							<tr>
								<td colSpan={4}>No hay pedidos registrados todavía.</td>
							</tr>
						) : null}
					</tbody>
				</table>
			</div>
		</section>
	);
}