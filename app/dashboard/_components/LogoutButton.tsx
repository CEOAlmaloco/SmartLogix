"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseAuthBrowserClient } from "@/lib/supabase/supabaseAuthBrowserClient";
import styles from "./LogoutButton.module.css";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      const supabase = getSupabaseAuthBrowserClient();
      await supabase.auth.signOut();

      await fetch("/api/auth/logout", {
        method: "POST",
      }).catch(() => null);

      router.replace("/auth/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`btn ${styles.logoutBtn} ${className ?? ""}`.trim()}
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
