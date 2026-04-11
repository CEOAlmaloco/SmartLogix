"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/supabaseClient";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const test = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.from("orders").select("*");

      console.log(data, error);
    };

    test();
  }, []);

  return <h1>SmartLogix conectado</h1>;
}
