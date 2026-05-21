import Image from "next/image";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import styles from "./HomeNavbar.module.css";

export async function HomeNavbar() {
  const auth = await getAuthenticatedUser();
  const isLoggedIn = Boolean(auth.user) && !auth.response;
  const actionHref = auth.isPlatformAdmin ? "/platform" : "/dashboard";
  const actionLabel = auth.isPlatformAdmin ? "Ir a plataforma" : "Ir al panel";

  return (
    <div className={`${styles.inner} d-flex align-items-center justify-content-between`}>
      <Link href="/" className={styles.brandLink} aria-label="Ir a la página principal de SmartLogix">
        <Image
          src="/brand/sl_icon.png"
          alt=""
          width={50}
          height={50}
          className={styles.logoImage}
          priority
        />
        <span className={styles.logoText}>SmartLogix</span>
      </Link>

      <div className="d-flex gap-2">
        {isLoggedIn ? (
          <Link href={actionHref} className={`btn ${styles.btnPrimary}`}>
            {actionLabel}
          </Link>
        ) : (
          <>
            <Link href="/auth/login" className={`btn ${styles.btnGhost}`}>
              Iniciar sesión
            </Link>
            <Link href="/auth/register" className={`btn ${styles.btnPrimary}`}>
              Crear cuenta
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
