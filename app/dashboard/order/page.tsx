"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { TextField } from "@/components/ui/TextField";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import styles from "../dashboard.module.css";

type OrderStatus = "pending" | "approved" | "dispatched" | "cancelled";

type InventoryItem = {
	id: string;
	name: string;
	sku: string;
	quantity: number;
	unit_price?: number;
	warehouse: string;
	created_at: string;
};

type OrderLine = {
	id: string;
	order_id: string;
	item_sku: string;
	item_name?: string;
	quantity: number;
	unit_price: number;
};

type OrderItemRecord = {
	id: string;
	customer_name?: string;
	customer_email?: string;
	total?: number;
	status?: OrderStatus;
	notes?: string | null;
	created_at?: string;
	updated_at?: string;
	items_count?: number;
	items?: OrderLine[];
};

type OrdersResponse = {
	data?: OrderItemRecord[];
	message?: string;
};

type InventoryResponse = {
	data?: InventoryItem[];
	message?: string;
};

type CreateOrderForm = {
	customerName: string;
	customerEmail: string;
	notes: string;
};

type SelectedOrderItem = {
	sku: string;
	name: string;
	quantity: number;
	unitPrice: number;
	stock: number;
};

const INITIAL_FORM: CreateOrderForm = {
	customerName: "",
	customerEmail: "",
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

function formatDateTime(value?: string) {
	if (!value) return "-";
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return "-";
	return parsed.toLocaleString("es-CL", {
		dateStyle: "short",
		timeStyle: "short",
	});
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
	const [orders, setOrders] = useState<OrderItemRecord[]>([]);
	const [inventory, setInventory] = useState<InventoryItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingInventory, setLoadingInventory] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<OrderItemRecord | null>(null);
	const [itemSelectorOpen, setItemSelectorOpen] = useState(false);
	const [itemDrafts, setItemDrafts] = useState<Record<string, { quantity: string; unitPrice: string }>>({});
	const [formData, setFormData] = useState<CreateOrderForm>(INITIAL_FORM);
	const [notice, setNotice] = useState<{ variant: "success" | "error"; message: string } | null>(null);
	const [nextStatuses, setNextStatuses] = useState<Record<string, OrderStatus>>({});
	const [error, setError] = useState<string | null>(null);
	const [selectedItems, setSelectedItems] = useState<SelectedOrderItem[]>([]);

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
				requestError instanceof Error ? requestError.message : "Error inesperado al cargar pedidos"
			);
		} finally {
			setLoading(false);
		}
	}, []);

	const loadInventory = useCallback(async () => {
		try {
			setLoadingInventory(true);
			const response = await fetch("/api/inventory", {
				cache: "no-store",
				credentials: "include",
			});
			const json = (await response.json()) as InventoryResponse;

			if (!response.ok) {
				throw new Error(json.message ?? "No fue posible obtener inventario");
			}

			const list = (Array.isArray(json.data) ? json.data : []).filter((item) => Number(item.quantity) > 0);
			setInventory(list);

			// Pre-fill itemDrafts with unit_price from inventory so price is not editable by operator
			const initialDrafts: Record<string, { quantity: string; unitPrice: string }> = {};
			list.forEach((it) => {
				initialDrafts[it.sku] = {
					quantity: "1",
					unitPrice: typeof it.unit_price === "number" ? String(it.unit_price) : "",
				};
			});
			setItemDrafts(initialDrafts);
		} catch (requestError: unknown) {
			setNotice({
				variant: "error",
				message:
					requestError instanceof Error ? requestError.message : "Error inesperado al cargar inventario",
			});
		} finally {
			setLoadingInventory(false);
		}
	}, []);

	useEffect(() => {
		void loadOrders();
	}, [loadOrders]);

	const resetCreateForm = () => {
		setFormData(INITIAL_FORM);
		setSelectedItems([]);
		setItemDrafts({});
		setItemSelectorOpen(false);
	};

	const openCreateModal = async () => {
		setNotice(null);
		resetCreateForm();
		setIsCreateOpen(true);
		await loadInventory();
	};

	const computedTotal = useMemo(
		() => selectedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
		[selectedItems]
	);

	const onAddSelectedItem = (inventoryItem: InventoryItem) => {
		// Price now comes from inventory.unit_price and is not editable by operator
		const draft = itemDrafts[inventoryItem.sku] ?? { quantity: "1", unitPrice: "" };
		const quantity = Number(draft.quantity);
		const unitPrice = Number(inventoryItem.unit_price ?? 0);

		if (!Number.isInteger(quantity) || quantity <= 0) {
			setNotice({ variant: "error", message: `La cantidad de ${inventoryItem.sku} debe ser mayor a 0` });
			return;
		}
		if (quantity > inventoryItem.quantity) {
			setNotice({
				variant: "error",
				message: `La cantidad de ${inventoryItem.sku} no puede superar el stock disponible`,
			});
			return;
		}
		if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
			setNotice({ variant: "error", message: `El precio unitario de ${inventoryItem.sku} no es válido en inventario` });
			return;
		}

		setNotice(null);
		setSelectedItems((prev) => {
			const existing = prev.find((line) => line.sku === inventoryItem.sku);
			if (!existing) {
				return [
					...prev,
					{
						sku: inventoryItem.sku,
						name: inventoryItem.name,
						quantity,
						unitPrice,
						stock: inventoryItem.quantity,
					},
				];
			}

			return prev.map((line) =>
				line.sku === inventoryItem.sku
					? {
						...line,
						quantity: quantity,
						unitPrice: existing.unitPrice,
					}
					: line
			);
		});
	};

	const onRemoveSelectedItem = (sku: string) => {
		setSelectedItems((prev) => prev.filter((line) => line.sku !== sku));
	};

	const onCreateOrder = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setNotice(null);

		if (!formData.customerName.trim() || !formData.customerEmail.trim()) {
			setNotice({ variant: "error", message: "Nombre y email son obligatorios" });
			return;
		}

		if (selectedItems.length === 0) {
			setNotice({ variant: "error", message: "Debes agregar al menos un ítem al pedido" });
			return;
		}

		try {
			setSubmitting(true);
			const response = await fetch("/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					customer_name: formData.customerName.trim(),
					customer_email: formData.customerEmail.trim(),
					notes: formData.notes.trim() ? formData.notes.trim() : undefined,
					total: computedTotal,
					items: selectedItems.map((item) => ({
						sku: item.sku,
						quantity: item.quantity,
						unit_price: item.unitPrice,
					})),
				}),
			});
			const json = (await response.json()) as { message?: string };

			if (!response.ok) {
				throw new Error(json.message ?? "No fue posible crear el pedido");
			}

			setNotice({ variant: "success", message: "Pedido creado correctamente" });
			setIsCreateOpen(false);
			resetCreateForm();
			await loadOrders();
		} catch (requestError: unknown) {
			setNotice({
				variant: "error",
				message:
					requestError instanceof Error ? requestError.message : "Error inesperado al crear pedido",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const onChangeStatus = async (order: OrderItemRecord) => {
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

			setNotice({
				variant: "success",
				message: nextStatus === "approved" ? "Pedido aprobado. Stock actualizado." : "Estado actualizado correctamente",
			});
			await loadOrders();
		} catch (requestError: unknown) {
			setNotice({
				variant: "error",
				message:
					requestError instanceof Error ? requestError.message : "Error inesperado al actualizar estado",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const onDeleteOrder = async (order: OrderItemRecord) => {
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
					requestError instanceof Error ? requestError.message : "Error inesperado al eliminar pedido",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const openOrderDetail = (order: OrderItemRecord) => {
		setSelectedOrder(order);
	};

	const title = useMemo(() => {
		if (loading) return "Cargando pedidos...";
		return `Pedidos (${orders.length})`;
	}, [loading, orders.length]);

	return (
		<DashboardPanel
			title={title}
			subtitle={"Gestiona pedidos con detalle de ítems, aprobación y trazabilidad operativa."}
			actions={<Button type="button" onClick={() => void openCreateModal()}>Nuevo pedido</Button>}
		>

			{error ? <StatusMessage variant="error" message={error} /> : null}
			{notice ? <StatusMessage variant={notice.variant} message={notice.message} /> : null}

			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>ID (corto)</th>
							<th>Cliente</th>
							<th>Email</th>
							<th>Ítems</th>
							<th>Total</th>
							<th>Estado</th>
							<th>Notas</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => {
							const itemsCount = Number(order.items_count ?? order.items?.length ?? 0);
							return (
								<tr key={order.id} onClick={() => openOrderDetail(order)} className={styles.clickableRow}>
									<td>{order.id.slice(0, 8)}</td>
									<td>{order.customer_name ?? "Sin nombre"}</td>
									<td>{order.customer_email ?? "Sin email"}</td>
									<td>{itemsCount > 0 ? `${itemsCount} productos` : "—"}</td>
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
													onClick={(event) => event.stopPropagation()}
													onMouseDown={(event) => event.stopPropagation()}
													onChange={(event) => {
														event.stopPropagation();
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
													onClick={(event) => {
														event.stopPropagation();
														void onChangeStatus(order);
													}}
													disabled={submitting}
												>
													Cambiar estado
												</button>
											</div>
										) : (
											<button type="button" className={styles.tableActionBtn} disabled onClick={(event) => event.stopPropagation()}>
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
											onClick={(event) => {
												event.stopPropagation();
												void onDeleteOrder(order);
											}}
										>
											Eliminar
										</button>
									</td>
								</tr>
							);
						})}
						{!loading && orders.length === 0 ? (
							<tr>
								<td colSpan={8}>No hay pedidos registrados todavía.</td>
							</tr>
						) : null}
					</tbody>
				</table>
			</div>

			<Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nuevo pedido">
				<form className={styles.form} onSubmit={onCreateOrder}>
					<div className={styles.sectionBlock}>
						<div className={styles.sectionHeader}>Datos del cliente</div>
						<div className={styles.formGrid}>
							<TextField
								label="Nombre del cliente"
								value={formData.customerName}
								onChange={(event) => setFormData((prev) => ({ ...prev, customerName: event.target.value }))}
								required
							/>
							<TextField
								label="Email del cliente"
								type="email"
								value={formData.customerEmail}
								onChange={(event) => setFormData((prev) => ({ ...prev, customerEmail: event.target.value }))}
								required
							/>
						</div>
						<div className={styles.fieldWrap}>
							<label htmlFor="order-notes">Notas (opcional)</label>
							<textarea
								id="order-notes"
								className={styles.textAreaField}
								value={formData.notes}
								onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
								placeholder="Pedido generado en demo en vivo"
							/>
						</div>
					</div>

					<div className={styles.sectionBlock}>
						<div className={styles.sectionHeaderRow}>
							<div className={styles.sectionHeader}>Ítems del pedido</div>
							<Button type="button" variant="soft" onClick={() => setItemSelectorOpen((value) => !value)}>
								+ Agregar ítem
							</Button>
						</div>

						{itemSelectorOpen ? (
							<div className={styles.pickerCard}>
								{loadingInventory ? <p className={styles.loadingText}>Cargando inventario...</p> : null}
								{!loadingInventory ? (
									<div className={styles.tableWrap}>
										<table className={styles.table}>
											<thead>
												<tr>
													<th>Producto</th>
													<th>SKU</th>
													<th>Stock</th>
													<th>Qty</th>
													<th>Precio unit.</th>
													<th>Acción</th>
												</tr>
											</thead>
											<tbody>
												{inventory.map((item) => {
													const draft = itemDrafts[item.sku] ?? { quantity: "1", unitPrice: "" };
													return (
														<tr key={item.id}>
															<td>{item.name}</td>
															<td>{item.sku}</td>
															<td>{item.quantity} u.</td>
															<td>
																<input
																	className={styles.inlineNumberInput}
																	type="number"
																	min={1}
																	max={item.quantity}
																	value={draft.quantity}
																	onChange={(event) =>
																		setItemDrafts((prev) => ({
																			...prev,
																			[item.sku]: {
																				quantity: event.target.value,
																				unitPrice: prev[item.sku]?.unitPrice ?? "",
																			},
																		}))
																	}
																/>
															</td>
															<td>{formatCurrency(item.unit_price)}</td>
															<td>
																<button
																	type="button"
																	className={`${styles.tableActionBtn} ${styles.tableActionEdit}`}
																	onClick={() => onAddSelectedItem(item)}
																>
																	Agregar
																</button>
															</td>
														</tr>
													);
												})}
												{inventory.length === 0 ? (
													<tr>
														<td colSpan={6}>No hay productos con stock disponible.</td>
													</tr>
												) : null}
											</tbody>
										</table>
									</div>
								) : null}
							</div>
						) : null}

						<div className={styles.selectedItemsList}>
							{selectedItems.map((item) => (
								<div key={item.sku} className={styles.selectedItemRow}>
									<div>
										<strong>{item.name}</strong>
										<div>{item.sku}</div>
									</div>
									<div>
										{item.quantity} x {formatCurrency(item.unitPrice)} = {formatCurrency(item.quantity * item.unitPrice)}
									</div>
									<button type="button" className={styles.tableActionBtn} onClick={() => onRemoveSelectedItem(item.sku)}>
										🗑
									</button>
								</div>
							))}

							<div className={styles.totalBar}>
								<strong>Total calculado automáticamente:</strong>
								<strong>{formatCurrency(computedTotal)}</strong>
							</div>
						</div>
					</div>

					<div className={styles.formActions}>
						<Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
							Cancelar
						</Button>
						<Button type="submit" loading={submitting}>
							Crear pedido
						</Button>
					</div>
				</form>
			</Modal>

			<Modal
				open={Boolean(selectedOrder)}
				onClose={() => setSelectedOrder(null)}
				title={`Pedido #${selectedOrder?.id.slice(0, 8) ?? ""}`}
			>
				{selectedOrder ? (
					<div className={styles.detailPanel}>
						<p><strong>Cliente:</strong> {selectedOrder.customer_name ?? "Sin nombre"} — {selectedOrder.customer_email ?? "Sin email"}</p>
						<p><strong>Estado:</strong> <span className={statusClass(selectedOrder.status, styles)}>{selectedOrder.status ?? "pending"}</span></p>
						<p><strong>Notas:</strong> {selectedOrder.notes?.trim() ? selectedOrder.notes : "-"}</p>

						<div className={styles.sectionHeader}>Ítems</div>
						<div className={styles.detailItems}>
							{selectedOrder.items?.length ? (
								selectedOrder.items.map((item) => (
									<div key={item.id} className={styles.detailItemRow}>
										<div>
											<strong>{item.item_name ?? item.item_sku}</strong>
											<div>Cantidad: {item.quantity}</div>
											<div>SKU: {item.item_sku}</div>
										</div>
										<div>{formatCurrency(item.unit_price)} c/u</div>
										<div>{formatCurrency(item.quantity * item.unit_price)}</div>
									</div>
								))
							) : (
								<p>No hay ítems registrados para este pedido.</p>
							)}
						</div>

						<div className={styles.detailMetaGrid}>
							<p><strong>Total:</strong> {formatCurrency(selectedOrder.total)}</p>
							<p><strong>Creado:</strong> {formatDateTime(selectedOrder.created_at)}</p>
							<p><strong>Actualizado:</strong> {formatDateTime(selectedOrder.updated_at)}</p>
						</div>
					</div>
				) : null}
			</Modal>
		</DashboardPanel>
	);
}