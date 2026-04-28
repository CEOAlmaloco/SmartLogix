import { createServiceRoleClient } from "@/lib/supabase/server";

const SCHEMA = "order_schema";
const TABLE = "order";

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
    return data || [];
  },

  async createOrder(
    pymeId: string,
    payload: {
      customerName: string;
      customerEmail: string;
      total: number;
      notes?: string;
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
    return data;
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
};
