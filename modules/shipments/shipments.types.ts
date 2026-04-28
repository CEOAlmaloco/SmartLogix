export type ShipmentStatus = "pending" | "in_transit" | "delivered" | "cancelled";

export type Shipment = {
  id: string;
  pyme_id: string;
  order_id: string;
  status: ShipmentStatus;
  carrier: string | null;
  tracking_code: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateShipmentInput = {
  orderId: string;
  carrier?: string;
  trackingCode?: string;
  estimatedDelivery?: string;
};

export type UpdateShipmentStatusInput = {
  id: string;
  status: string;
};
