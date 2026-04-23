import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/middleware/auth";
// Importación corregida apuntando al servicio que acabamos de arreglar
import { createServiceRoleClient } from "@/lib/supabase/supabaseService";
import { MobileMenu } from "./_components/MobileMenu";
import { LogoutButton } from "./_components/LogoutButton";
import styles from "./dashboard.module.css";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  let pymeName = "PYME";

  // 1. Verificamos autenticación (con el bypass de desarrollo que activamos)
  const auth = await getAuthenticatedUser();
  
  // Si hay error en auth o no tenemos pymeId, para afuera
  if (auth.response || !auth.pymeId) {
    redirect("/auth/login");
  }

  // 2. Obtener el nombre de la PYME usando el cliente de servicio
  try {
    const db = createServiceRoleClient("public"); // La tabla 'pyme' siempre suele ser public
    const { data, error } = await db
      .from("pyme")
      .select("name")
      .eq("id", auth.pymeId)
      .single();

    if (error) {
      console.error("❌ Error cargando nombre de PYME:", error.message);
    } else if (data?.name) {
      pymeName = data.name;
    }
  } catch (err) {
    console.error("🔥 Error crítico en Layout:", err);
  }

  return (
    <main className={styles.page}>
      <div className="container py-4 py-lg-5">
        <header className={`${styles.topbar} d-flex align-items-center justify-content-between`}>
          <div>
            <p className={styles.kicker}>SmartLogix</p>
            <h1 className={styles.title}>Panel de operaciones</h1>
            <p className={styles.pymeName}>{pymeName}</p>
          </div>

          <div className={`${styles.desktopNav} d-flex gap-2 flex-wrap`}>
            <Link href="/dashboard" className={`btn ${styles.navBtn}`}>
              Overview
            </Link>
            <Link href="/dashboard/order" className={`btn ${styles.navBtn}`}>
              Orders
            </Link>
            <Link href="/dashboard/inventory" className={`btn ${styles.navBtn}`}>
              Inventory
            </Link>
            <Link href="/dashboard/shipment" className={`btn ${styles.navBtn}`}>
              Shipments
            </Link>
            <LogoutButton />
          </div>

          <div className={styles.mobileNav}>
            <MobileMenu pymeName={pymeName} />
          </div>
        </header>

        <section className={styles.content}>{children}</section>
      </div>
    </main>
  );
}