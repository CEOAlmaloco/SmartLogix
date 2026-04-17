import { createServiceRoleClient } from "@/lib/supabase/supabaseService";

export async function GET() {
  const supabase = createServiceRoleClient("order_schema");
  const { data, error } = await supabase.from("purchase_order").select("*");

  if (error) {
    console.error(`Conexión con Supabase fallida: ${error.message}`)
    return new Response(JSON.stringify({ connected: false, error: error.message }), { status: 500 });
  }

  console.log("Conexión con supabase exitosa!")
  return new Response(JSON.stringify({connected: true, items: data}), {status: 200});
}
