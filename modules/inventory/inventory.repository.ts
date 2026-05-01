import { createServiceRoleClient } from "@/lib/supabase/server";

const SCHEMA = "inventory_schema";

export const InventoryRepository = {
  async findAllItems(pymeId: string) {
    const db = createServiceRoleClient(SCHEMA);
    const { data, error } = await db
      .from("item")
      .select("*")
      .eq("pyme_id", pymeId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error en findAllItems:", error.message);
      throw error;
    }
    return data || [];
  },

  async findItemById(id: string, pymeId: string) {
    const db = createServiceRoleClient(SCHEMA);
    const { data, error } = await db
      .from("item")
      .select("*")
      .eq("id", id)
      .eq("pyme_id", pymeId)
      .maybeSingle();

    if (error) {
      console.error("Error en findItemById:", error.message);
      throw error;
    }
    return data;
  },

  async createItem(
    pymeId: string,
    payload: {
      name: string;
      sku: string;
      quantity: number;
      warehouse?: string;
    }
  ) {
    const db = createServiceRoleClient(SCHEMA);

    const { data: existing } = await db
      .from("item")
      .select("id")
      .eq("pyme_id", pymeId)
      .eq("sku", payload.sku)
      .maybeSingle();

    if (existing) {
      const err = new Error("SKU already exists") as Error & {
        code?: string;
        status?: number;
      };
      err.code = "CONFLICT";
      err.status = 409;
      throw err;
    }

    const { data, error } = await db
      .from("item")
      .insert({ ...payload, pyme_id: pymeId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateItem(
    id: string,
    pymeId: string,
    payload: {
      name?: string;
      sku?: string;
      quantity?: number;
      warehouse?: string;
    }
  ) {
    const cleanUpdate = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(cleanUpdate).length === 0) {
      throw new Error("No fields provided for update");
    }

    const db = createServiceRoleClient(SCHEMA);
    const { data, error } = await db
      .from("item")
      .update({
        ...cleanUpdate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("pyme_id", pymeId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error en updateItem:", error.message);
      throw error;
    }
    return data;
  },

  async deleteItem(id: string, pymeId: string) {
    const db = createServiceRoleClient(SCHEMA);
    const { data, error } = await db
      .from("item")
      .delete()
      .eq("id", id)
      .eq("pyme_id", pymeId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error en deleteItem:", error.message);
      throw error;
    }
    return data;
  },
};
