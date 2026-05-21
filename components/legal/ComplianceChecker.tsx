"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  COMPLIANCE_REQUIRED_ROUTES,
  FOOTER_HOME,
  LEGAL,
} from "@/config/legal";
import { hasStoredCookieConsent } from "@/lib/cookies/consent";
import styles from "./ComplianceChecker.module.css";

type RouteStatus = {
  href: string;
  ok: boolean;
  status?: number;
};

type CheckItem = {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
};

export function ComplianceChecker() {
  const [routes, setRoutes] = useState<RouteStatus[]>([]);
  const [cookieOk, setCookieOk] = useState<boolean | null>(null);
  const [footerLinksOk, setFooterLinksOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const results: RouteStatus[] = [];
      for (const href of COMPLIANCE_REQUIRED_ROUTES) {
        try {
          const res = await fetch(href, { method: "HEAD", cache: "no-store" });
          results.push({ href, ok: res.ok, status: res.status });
        } catch {
          try {
            const res = await fetch(href, { cache: "no-store" });
            results.push({ href, ok: res.ok, status: res.status });
          } catch {
            results.push({ href, ok: false });
          }
        }
      }

      let consent = false;
      try {
        consent = hasStoredCookieConsent();
      } catch {
        consent = false;
      }

      const footerOk = FOOTER_HOME.legal.every(
        (link) => document.querySelector(`footer a[href="${link.href}"]`) !== null,
      );

      if (!cancelled) {
        setRoutes(results);
        setCookieOk(consent);
        setFooterLinksOk(footerOk);
        setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const routeChecksOk = routes.length > 0 && routes.every((r) => r.ok);

  const items: CheckItem[] = [
    {
      id: "routes",
      label: "Páginas legales y corporativas accesibles",
      ok: routeChecksOk,
      detail: loading
        ? "Comprobando rutas…"
        : routes.every((r) => r.ok)
          ? `${routes.length} rutas respondieron correctamente.`
          : `${routes.filter((r) => !r.ok).length} ruta(s) con error.`,
    },
    {
      id: "footer",
      label: "Enlaces legales en footer (home o simple)",
      ok: footerLinksOk === true,
      detail:
        footerLinksOk === null
          ? "Comprobando footer…"
          : footerLinksOk
            ? "Términos, privacidad, cookies y seguridad accesibles desde el pie de página (home)."
            : "Faltan enlaces legales en el footer de la home. Revise la sección Legal.",
    },
    {
      id: "cookies",
      label: "Banner de consentimiento de cookies",
      ok: cookieOk === true,
      detail:
        cookieOk === null
          ? "—"
          : cookieOk
            ? "Preferencia guardada en este navegador."
            : 'Aún no hay consentimiento. Usa OK o Mostrar detalles en el banner inferior de cookies.',
    },
    {
      id: "contact",
      label: "Canales de contacto publicados",
      ok: true,
      detail: `${LEGAL.contactEmail} · ${LEGAL.legalEmail}`,
    },
  ];

  const allOk = items.every((i) => i.ok) && !loading;

  return (
    <div className={styles.wrap}>
      <div className={`${styles.summary} ${allOk ? styles.summaryOk : styles.summaryWarn}`}>
        {loading
          ? "Ejecutando verificación automática…"
          : allOk
            ? "Cumplimiento técnico básico: OK en este entorno."
            : "Hay ítems pendientes. Revisa el detalle y corrige antes de publicar."}
      </div>

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <span className={item.ok ? styles.badgeOk : styles.badgeFail}>
              {item.ok ? "OK" : "Pendiente"}
            </span>
            <div>
              <strong>{item.label}</strong>
              <p className={styles.detail}>{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      {!loading && routes.length > 0 ? (
        <details className={styles.details}>
          <summary>Detalle por ruta ({routes.length})</summary>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ruta</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r) => (
                <tr key={r.href}>
                  <td>
                    <Link href={r.href}>{r.href}</Link>
                  </td>
                  <td>{r.ok ? `OK (${r.status ?? "—"})` : `Error (${r.status ?? "—"})`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      ) : null}

      <p className={styles.note}>
        Esta página es una herramienta interna de revisión. No sustituye asesoría legal ni una
        auditoría formal. Documentación de referencia: Ley 19.628 (protección de datos personales
        en Chile) y políticas publicadas en este sitio.
      </p>
    </div>
  );
}
