import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: {
      schema: "order_schema",
    },
  }
);

export async function GET() {
  const { data, error } = await supabase.from("orders").select("*");

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return Response.json(data);
}
