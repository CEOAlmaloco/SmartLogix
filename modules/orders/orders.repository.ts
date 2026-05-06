import { createServiceRoleClient } from "@/lib/supabase/server";
import type { OrderItemInput, OrderWithItems } from "./orders.types";

const SCHEMA = "order_schema";
const TABLE = "purchase_order";
const INVENTORY_SCHEMA = "inventory_schema";

export const OrdersRepository = {
  async findAllOrders(pymeId: string) {
    const db = createServiceRoleClient(SCHEMA);
    const { data, error } = await db
      .from(TABLE)
      .select("*")
      .eq("pyme_id", pymeId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error en OrdersRepository (findAll):", error.message);
      throw error;
    }

    const orders = (data || []) as OrderWithItems[];
    if (orders.length === 0) return [];

    const orderIds = orders.map((order) => order.id);
    const { data: itemsData, error: itemsError } = await db
      .from("order_item")
      .select("*")
      .in("order_id", orderIds);

    if (itemsError) {
      console.error("Error en OrdersRepository (findAll items):", itemsError.message);
      throw itemsError;
    }

    const skus = [...new Set((itemsData || []).map((item) => item.item_sku))];
    const inventoryDb = createServiceRoleClient(INVENTORY_SCHEMA);
    const { data: inventoryData, error: inventoryError } = await inventoryDb
      .from("item")
      .select("sku, name")
      .eq("pyme_id", pymeId)
      .in("sku", skus.length > 0 ? skus : [""]);

    if (inventoryError) {
      console.error("Error en OrdersRepository (findAll inventory):", inventoryError.message);
      throw inventoryError;
    }

    const skuToName = new Map<string, string>();
    (inventoryData || []).forEach((item) => {
      skuToName.set(item.sku, item.name);
    });

    const groupedItems = new Map<string, OrderWithItems["items"]>();
    (itemsData || []).forEach((item) => {
      const current = groupedItems.get(item.order_id) ?? [];
      current.push({
        ...item,
        item_name: skuToName.get(item.item_sku) ?? item.item_sku,
      });
      groupedItems.set(item.order_id, current);
    });

    return orders.map((order) => ({
      ...order,
      items: groupedItems.get(order.id) ?? [],
      items_count: groupedItems.get(order.id)?.length ?? 0,
    }));
  },

  async createOrder(
    pymeId: string,
    payload: {
      customerName: string;
      customerEmail: string;
      total: number;
      notes?: string;
      items: OrderItemInput[];
    }
  ) {
    const db = createServiceRoleClient(SCHEMA);
    const { data, error } = await db
      .from(TABLE)
      .insert({
        pyme_id: pymeId,
        customer_name: payload.customerName,
        customer_email: payload.customerEmail,
        total: payload.total,
        notes: payload.notes,
        status: "pending",
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error en OrdersRepository (create):", error.message);
      throw error;
    }

    if (!data) {
      return data;
    }

    const orderItemsPayload = payload.items.map((item) => ({
      order_id: data.id,
      item_sku: item.sku,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    }));

    const inventoryDb = createServiceRoleClient(INVENTORY_SCHEMA);
    const { data: inventoryData, error: inventoryError } = await inventoryDb
      .from("item")
      .select("sku, name")
      .eq("pyme_id", pymeId)
      .in("sku", payload.items.map((item) => item.sku));

    if (inventoryError) {
      console.error("Error en OrdersRepository (create inventory):", inventoryError.message);
      await db.from(TABLE).delete().eq("id", data.id).eq("pyme_id", pymeId);
      throw inventoryError;
    }

    const skuToName = new Map<string, string>();
    (inventoryData || []).forEach((item) => {
      skuToName.set(item.sku, item.name);
    });

    const { error: itemError } = await db.from("order_item").insert(orderItemsPayload);
    if (itemError) {
      console.error("Error en OrdersRepository (create items):", itemError.message);
      await db.from(TABLE).delete().eq("id", data.id).eq("pyme_id", pymeId);
      throw itemError;
    }

    return {
      ...data,
      items: orderItemsPayload.map((item) => ({
        ...item,
        item_name: skuToName.get(item.item_sku) ?? item.item_sku,
      })),
      items_count: orderItemsPayload.length,
    };
  },

  async updateOrderStatus(id: string, pymeId: string, status: string) {
    const db = createServiceRoleClient(SCHEMA);
    const { data, error } = await db
      .from(TABLE)
      .update({ status })
      .eq("id", id)
      .eq("pyme_id", pymeId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error en OrdersRepository (updateStatus):", error.message);
      throw error;
    }
    return data;
  },

  async deleteOrder(id: string, pymeId: string) {
    const db = createServiceRoleClient(SCHEMA);
    const { data, error } = await db
      .from(TABLE)
      .delete()
      .eq("id", id)
      .eq("pyme_id", pymeId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error en OrdersRepository (delete):", error.message);
      throw error;
    }

    return data;
  },
};
