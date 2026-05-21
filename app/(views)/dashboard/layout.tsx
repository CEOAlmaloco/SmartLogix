import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { MobileMenu } from "@/components/dashboard/MobileMenu";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { FooterMinimal } from "@/components/auth/FooterMinimal";
import styles from "./dashboard.module.css";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  let pymeName = "PYME";

  const auth = await getAuthenticatedUser();
  if (!auth.user) {
    redirect("/auth/login");
  }

  if (auth.isPlatformAdmin) {
    redirect("/platform");
  }

  if (auth.pymeStatus === "suspended") {
    const params = new URLSearchParams();

    if (auth.suspendedReason) {
      params.set("reason", auth.suspendedReason);
    }

    if (auth.suspendedAt) {
      params.set("suspendedAt", auth.suspendedAt);
    }

    const query = params.toString();
    redirect(query ? `/auth/suspended?${query}` : "/auth/suspended");
  }

  if (auth.response || !auth.pymeId) {
    redirect("/auth/login");
  }

  try {
    const db = createServiceRoleClient("public"); // La tabla 'pyme' siempre suele ser public
    const { data, error } = await db
      .from("pyme")
      .select("name")
      .eq("id", auth.pymeId)
      .single();

    if (error) {
      console.error("Error cargando nombre de PYME:", error.message);
    } else if (data?.name) {
      pymeName = data.name;
    }
  } catch (err) {
    console.error("Error crítico en Layout:", err);
  }

  return (
    <>
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
                Resumen
              </Link>
              <Link href="/dashboard/inventory" className={`btn ${styles.navBtn}`}>
                Inventario
              </Link>
              <Link href="/dashboard/order" className={`btn ${styles.navBtn}`}>
                Pedidos
              </Link>
              <Link href="/dashboard/shipment" className={`btn ${styles.navBtn}`}>
                Envios
              </Link>
              <LogoutButton />
            </div>

            <div className={styles.mobileNav}>
              <MobileMenu
                title={pymeName}
                links={[
                  { href: "/dashboard", label: "Resumen" },
                  { href: "/dashboard/inventory", label: "Inventario" },
                  { href: "/dashboard/order", label: "Pedidos" },
                  { href: "/dashboard/shipment", label: "Envios" },
                ]}
              />
            </div>
          </header>

          <section className={styles.content}>{children}</section>
        </div>
      </main>

      <FooterMinimal />
    </>
  );
}