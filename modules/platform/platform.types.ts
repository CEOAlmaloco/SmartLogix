export type PymeStatus = "active" | "suspended" | "pending_review";

export type PymeSummary = {
  id: string;
  name: string;
  owner_id: string;
  status: PymeStatus;
  user_count: number;
  created_at: string;
  suspended_at: string | null;
  suspended_reason: string | null;
};

export type PymeUserSummary = {
  user_id: string;
  role: string;
  created_at: string;
};

export type PymeDetail = PymeSummary & {
  users: PymeUserSummary[];
};

export type PlatformMetrics = {
  total_pymes: number;
  active_pymes: number;
  suspended_pymes: number;
  pending_review_pymes: number;
  total_orders: number;
  total_shipments: number;
  total_inventory_items: number;
};

export type UpdatePymePayload = {
  status: PymeStatus;
  suspended_reason?: string;
};