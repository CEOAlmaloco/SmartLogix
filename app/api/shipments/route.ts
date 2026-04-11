import { createServiceRoleClient } from "@/lib/supabase/supabaseService";

export async function GET() {
  const supabase = createServiceRoleClient("shipment_schema");
  const { data, error } = await supabase.from("shipments").select("*");

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return Response.json(data);
}
