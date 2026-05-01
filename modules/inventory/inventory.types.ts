export type InventoryItem = {
  id: string;
  pyme_id: string;
  name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  warehouse: string;
  created_at: string;
  updated_at: string;
};

export type CreateInventoryItemPayload = {
  name: string;
  sku: string;
  quantity: number;
  unit_price?: number;
  warehouse?: string;
};

export type UpdateInventoryItemPayload = {
  name?: string;
  sku?: string;
  quantity?: number;
  unit_price?: number;
  warehouse?: string;
};
