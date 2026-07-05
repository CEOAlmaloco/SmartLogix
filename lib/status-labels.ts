export type OrderStatus = "pending" | "approved" | "dispatched" | "cancelled";
export type ShipmentStatus = "pending" | "in_transit" | "delivered" | "cancelled";
export type PymeStatus = "active" | "suspended" | "pending_review";

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	pending: "Pendiente",
	approved: "Aprobado",
	dispatched: "Despachado",
	cancelled: "Cancelado",
};

const SHIPMENT_STATUS_LABELS: Record<ShipmentStatus, string> = {
	pending: "Pendiente",
	in_transit: "En tránsito",
	delivered: "Entregado",
	cancelled: "Cancelado",
};

const PYME_STATUS_LABELS: Record<PymeStatus, string> = {
	active: "Activa",
	suspended: "Suspendida",
	pending_review: "En revisión",
};

export function getOrderStatusLabel(status?: string | null) {
	return ORDER_STATUS_LABELS[(status ?? "pending") as OrderStatus] ?? String(status ?? "Pendiente");
}

export function getShipmentStatusLabel(status?: string | null) {
	return SHIPMENT_STATUS_LABELS[(status ?? "pending") as ShipmentStatus] ?? String(status ?? "Pendiente");
}

export function getPymeStatusLabel(status?: string | null) {
	return PYME_STATUS_LABELS[(status ?? "pending_review") as PymeStatus] ?? String(status ?? "En revisión");
}