import { createServiceRoleClient } from "@/lib/supabase/supabaseService";

export async function GET() {
  const supabase = createServiceRoleClient("order_schema");
  const { data, error } = await supabase.from("orders").select("*");

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return Response.json(data);
}
