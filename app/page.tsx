"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.from("orders").select("*");

      console.log(data, error);
    };

    test();
  }, []);

  return <h1>SmartLogix conectado</h1>;
}
