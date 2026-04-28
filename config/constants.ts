/**
 * Constantes globales del proyecto.
 * Cada modulo deberia importar de aqui en lugar de hardcodear strings.
 */

export const SUPABASE_SCHEMAS = {
  PUBLIC: "public",
  INVENTORY: "inventory_schema",
  ORDER: "order_schema",
  SHIPMENT: "shipment_schema",
} as const;

export const ORDER_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  DISPATCHED: "dispatched",
  CANCELLED: "cancelled",
} as const;

export const SHIPMENT_STATUS = {
  PENDING: "pending",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const PYME_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
} as const;

export const INVENTORY = {
  LOW_STOCK_THRESHOLD: 5,
  SKU_MAX_LENGTH: 50,
} as const;

export const PYME = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 80,
} as const;
