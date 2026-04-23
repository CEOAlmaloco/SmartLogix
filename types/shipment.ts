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

//crea un nuevo envio asignado a la id de la misma pyme con datos iniciales con estado pending desde el inicio 
export type CreateShipmentInput = { 
  orderId: string;
  carrier?: string; 
  trackingCode?: string; 
  estimatedDelivery?: string; 
};

//la logica es asi 
//pending -> in_transit/cancelled
//in_transit -> delivered/cancelled. al pasar a delivered se registra delivered_at.
export type UpdateShipmentStatusInput = {
  id: string; 
  status: string; 
};
