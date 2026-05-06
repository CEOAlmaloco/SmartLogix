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

export type OrderItem = {
  id: string;
  order_id: string;
  item_sku: string;
  item_name?: string;
  quantity: number;
  unit_price: number;
};

export type OrderItemInput = {
  sku: string;
  quantity: number;
  unitPrice: number;
};

export type OrderWithItems = Order & {
  items_count: number;
  items: OrderItem[];
};

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  total: number;
  notes?: string;
  items: OrderItemInput[];
};

export type UpdateOrderStatusInput = {
  id: string;
  status: string;
};
