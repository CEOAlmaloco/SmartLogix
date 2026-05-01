import { createServiceRoleClient } from "@/lib/supabase/server";

const SCHEMA = "shipment_schema";

export const ShipmentsRepository = {
  async findAll(pymeId: string) {
    const db = createServiceRoleClient(SCHEMA);
    const { data, error } = await db
      .from("shipment")
      .select("*")
      .eq("pyme_id", pymeId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(
    pymeId: string,
    payload: {
      order_id: string;
      carrier?: string;
      tracking_code?: string;
      estimated_delivery?: string;
    }
  ) {
    const db = createServiceRoleClient(SCHEMA);
    const { data, error } = await db
      .from("shipment")
      .insert({ ...payload, pyme_id: pymeId, status: "pending" })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatus(
    id: string,
    pymeId: string,
    payload: {
      status: string;
      delivered_at?: string;
    }
  ) {
    const db = createServiceRoleClient(SCHEMA);
    const { data, error } = await db
      .from("shipment")
      .update(payload)
      .eq("id", id)
      .eq("pyme_id", pymeId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string, pymeId: string) {
    const db = createServiceRoleClient(SCHEMA);
    const { data, error } = await db
      .from("shipment")
      .delete()
      .eq("id", id)
      .eq("pyme_id", pymeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
