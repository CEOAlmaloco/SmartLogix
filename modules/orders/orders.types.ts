export type OrderStatus = "pending" | "approved" | "dispatched" | "cancelled";

export type Order = {
  id: string;
  pyme_id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  notes: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  total: number;
  notes?: string;
};

export type UpdateOrderStatusInput = {
  id: string;
  status: string;
};
