import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { MobileMenu } from "@/components/dashboard/MobileMenu";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { FooterMinimal } from "@/components/auth/FooterMinimal";
import { getPlatformAdmin } from "@/lib/auth";
import styles from "../dashboard/dashboard.module.css";

type PlatformLayoutProps = {
  children: ReactNode;
};

export default async function PlatformLayout({ children }: PlatformLayoutProps) {
  const { admin, response } = await getPlatformAdmin();

  if (response || !admin) {
    redirect("/auth/login");
  }

  return (
    <>
      <main className={styles.page}>
        <div className="container py-4 py-lg-5">
          <header className={`${styles.topbar} d-flex align-items-center justify-content-between`}>
            <div>
              <Link href="/" className={styles.kicker}>
                SmartLogix
              </Link>
              <h1 className={styles.title}>Panel de plataforma</h1>
              <p className={styles.pymeName}>Administración global de la operación</p>
            </div>

            <div className={`${styles.desktopNav} d-flex gap-2 flex-wrap`}>
              <Link href="/platform" className={`btn ${styles.navBtn}`}>
                Overview
              </Link>
              <Link href="/platform/pymes" className={`btn ${styles.navBtn}`}>
                PYMEs
              </Link>
              <LogoutButton />
            </div>

            <div className={styles.mobileNav}>
              <MobileMenu
                title="Plataforma"
                links={[
                  { href: "/platform", label: "Overview" },
                  { href: "/platform/pymes", label: "PYMEs" },
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