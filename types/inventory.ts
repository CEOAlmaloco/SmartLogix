export type InventoryItem = {
  id: string;
  pyme_id: string;
  name: string;
  sku: string;
  quantity: number;
  warehouse: string;
  is_active: boolean; //permite soft delete sin romper relaciones
  created_at: string;
  updated_at: string;
};

export type CreateInventoryItemPayload = {
  name: string;
  sku: string;
  quantity: number;
  warehouse?: string;
};

export type UpdateInventoryItemPayload = {
  name?: string;
  sku?: string;
  quantity?: number;
  warehouse?: string;
};