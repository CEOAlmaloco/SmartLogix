import { createServiceRoleClient } from "@/lib/supabase/server";
import type { PlatformMetrics, PymeDetail, PymeSummary, UpdatePymePayload } from "./platform.types";

type PymeRow = {
  id: string;
  name: string;
  owner_id: string;
  status: PymeSummary["status"];
  created_at: string;
  suspended_at: string | null;
  suspended_reason: string | null;
};

type PymeUserRow = {
  pyme_id: string;
  user_id: string;
  role: string;
  created_at: string;
};

export const PlatformRepository = {
  async findAllPymes(): Promise<PymeSummary[]> {
    const db = createServiceRoleClient("public");

    const [{ data: pymeRows, error: pymeError }, { data: userRows, error: userError }] =
      await Promise.all([
        db.from("pyme").select("id, name, owner_id, status, created_at, suspended_at, suspended_reason").order("created_at", { ascending: false }),
        db.from("pyme_user").select("pyme_id, user_id, role, created_at"),
      ]);

    if (pymeError) throw pymeError;
    if (userError) throw userError;

    const usersByPyme = new Map<string, PymeUserRow[]>();
    (userRows ?? []).forEach((row) => {
      const candidate = row as PymeUserRow;
      const current = usersByPyme.get(candidate.pyme_id) ?? [];
      current.push(candidate);
      usersByPyme.set(candidate.pyme_id, current);
    });

    return ((pymeRows ?? []) as PymeRow[]).map((row) => ({
      ...row,
      user_count: usersByPyme.get(row.id)?.length ?? 0,
    }));
  },

  async findPymeById(pymeId: string): Promise<PymeDetail | null> {
    const db = createServiceRoleClient("public");

    const [{ data: pyme, error: pymeError }, { data: users, error: usersError }] = await Promise.all([
      db.from("pyme").select("id, name, owner_id, status, created_at, suspended_at, suspended_reason").eq("id", pymeId).maybeSingle(),
      db.from("pyme_user").select("user_id, role, created_at").eq("pyme_id", pymeId).order("created_at", { ascending: true }),
    ]);

    if (pymeError) throw pymeError;
    if (usersError) throw usersError;
    if (!pyme) return null;

    const userRows = (users ?? []) as Array<{ user_id: string; role: string; created_at: string }>;

    return {
      ...(pyme as PymeRow),
      user_count: userRows.length,
      users: userRows,
    };
  },

  async findPymeUsers(pymeId: string) {
    const db = createServiceRoleClient("public");
    const { data, error } = await db
      .from("pyme_user")
      .select("user_id, role, created_at")
      .eq("pyme_id", pymeId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Array<{ user_id: string; role: string; created_at: string }>;
  },

  async updatePymeStatus(pymeId: string, payload: UpdatePymePayload) {
    const db = createServiceRoleClient("public");

    const updateData: Record<string, unknown> = { status: payload.status };

    if (payload.status === "suspended") {
      updateData.suspended_at = new Date().toISOString();
      updateData.suspended_reason = payload.suspended_reason;
    } else {
      updateData.suspended_at = null;
      updateData.suspended_reason = null;
    }

    const { data, error } = await db
      .from("pyme")
      .update(updateData)
      .eq("id", pymeId)
      .select("id, name, owner_id, status, created_at, suspended_at, suspended_reason")
      .single();

    if (error) throw error;

    const users = await this.findPymeUsers(pymeId);

    return {
      ...(data as PymeRow),
      user_count: users.length,
      users,
    } as PymeDetail;
  },

  async getMetrics(): Promise<PlatformMetrics> {
    const publicDb = createServiceRoleClient("public");
    const orderDb = createServiceRoleClient("order_schema");
    const inventoryDb = createServiceRoleClient("inventory_schema");
    const shipmentDb = createServiceRoleClient("shipment_schema");

    const [pymesRes, ordersRes, inventoryRes, shipmentsRes] = await Promise.all([
      publicDb.from("pyme").select("status"),
      orderDb.from("purchase_order").select("id", { count: "exact", head: true }),
      inventoryDb.from("item").select("id", { count: "exact", head: true }),
      shipmentDb.from("shipment").select("id", { count: "exact", head: true }),
    ]);

    const pymes = (pymesRes.data ?? []) as Array<{ status: string }>;

    return {
      total_pymes: pymes.length,
      active_pymes: pymes.filter((pyme) => pyme.status === "active").length,
      suspended_pymes: pymes.filter((pyme) => pyme.status === "suspended").length,
      pending_review_pymes: pymes.filter((pyme) => pyme.status === "pending_review").length,
      total_orders: ordersRes.count ?? 0,
      total_shipments: shipmentsRes.count ?? 0,
      total_inventory_items: inventoryRes.count ?? 0,
    };
  },
};