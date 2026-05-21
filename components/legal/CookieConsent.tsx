"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { LEGAL } from "@/config/legal";
import {
  acceptAllPreferences,
  COOKIE_CATEGORY_META,
  essentialOnlyPreferences,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentPreferences,
} from "@/lib/cookies/consent";
import styles from "./CookieConsent.module.css";

type TabId = "consent" | "details" | "about";

function CategoryToggle({
  categoryId,
  checked,
  onChange,
}: {
  categoryId: "preferences" | "analytics";
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const meta = COOKIE_CATEGORY_META.find((c) => c.id === categoryId);
  if (!meta) return null;

  return (
    <div className={styles.category}>
      <div className={styles.categoryHead}>
        <div>
          <p className={styles.categoryLabel}>{meta.label}</p>
        </div>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-label={`Activar cookies de ${meta.label.toLowerCase()}`}
          />
          <span className={styles.switchTrack} aria-hidden />
        </label>
      </div>
      <p className={styles.categoryDesc}>{meta.description}</p>
    </div>
  );
}

type PanelProps = {
  tab: TabId;
  setTab: (tab: TabId) => void;
  draft: Pick<CookieConsentPreferences, "preferences" | "analytics">;
  setDraft: Dispatch<
    SetStateAction<Pick<CookieConsentPreferences, "preferences" | "analytics">>
  >;
  onEssential: () => void;
  onAcceptAll: () => void;
  onSaveCustom: () => void;
  onOpenDetails: () => void;
  showClose?: boolean;
  onClose?: () => void;
};

function CookiePanel({
  tab,
  setTab,
  draft,
  setDraft,
  onEssential,
  onAcceptAll,
  onSaveCustom,
  onOpenDetails,
  showClose,
  onClose,
}: PanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelTop}>
        <nav className={styles.tabs} aria-label="Secciones de cookies">
          {(
            [
              ["consent", "Consentimiento"],
              ["details", "Detalles"],
              ["about", "Acerca de las cookies"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={tab === id ? styles.tabActive : styles.tab}
              onClick={() => setTab(id)}
              aria-selected={tab === id}
            >
              {label}
            </button>
          ))}
        </nav>
        {showClose && onClose ? (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar detalles"
          >
            <AppIcon name="close" size={22} aria-hidden />
          </button>
        ) : null}
      </div>

      <div className={styles.body}>
        {tab === "consent" ? (
          <>
            <p id="cookie-consent-title" className={styles.title}>
              Uso de cookies
            </p>
            <p id="cookie-consent-desc" className={styles.text}>
              Usamos cookies esenciales para sesión y preferencias, y cookies
              analíticas opcionales para mejorar el servicio. Puedes leer el
              detalle en nuestra{" "}
              <Link href="/legal/cookies">política de cookies</Link>.
            </p>
            <p className={styles.text}>
              Solo se activarán las categorías que autorices. Las cookies
              estrictamente necesarias no requieren permiso adicional.
            </p>
          </>
        ) : null}

        {tab === "details" ? (
          <>
            <p className={styles.title}>Detalles</p>
            <p className={styles.text}>
              Activa o desactiva cada categoría. Las cookies necesarias no
              pueden desactivarse.
            </p>
            <div className={styles.categoryList}>
              <div className={styles.category}>
                <div className={styles.categoryHead}>
                  <p className={styles.categoryLabel}>Necesarias</p>
                  <span className={styles.categoryBadge}>Siempre activas</span>
                </div>
                <p className={styles.categoryDesc}>
                  {
                    COOKIE_CATEGORY_META.find((c) => c.id === "necessary")
                      ?.description
                  }
                </p>
              </div>
              <CategoryToggle
                categoryId="preferences"
                checked={draft.preferences}
                onChange={(v) => setDraft((d) => ({ ...d, preferences: v }))}
              />
              <CategoryToggle
                categoryId="analytics"
                checked={draft.analytics}
                onChange={(v) => setDraft((d) => ({ ...d, analytics: v }))}
              />
              <div className={styles.category}>
                <div className={styles.categoryHead}>
                  <p className={styles.categoryLabel}>Marketing</p>
                  <span className={styles.categoryBadgeMuted}>
                    No utilizamos
                  </span>
                </div>
                <p className={styles.categoryDesc}>
                  {
                    COOKIE_CATEGORY_META.find((c) => c.id === "marketing")
                      ?.description
                  }
                </p>
              </div>
            </div>
          </>
        ) : null}

        {tab === "about" ? (
          <>
            <p className={styles.title}>Acerca de las cookies</p>
            <p className={styles.text}>
              Las cookies son pequeños archivos de texto que las páginas web
              pueden utilizar para hacer más eficiente la experiencia del
              usuario.
            </p>
            <p className={styles.text}>
              La ley afirma que podemos almacenar cookies en su dispositivo si
              son estrictamente necesarias para el funcionamiento de esta
              página. Para todos los demás tipos de cookies necesitamos su
              permiso.
            </p>
            <p className={styles.text}>
              Esta página utiliza distintos tipos de cookies. Algunas son
              colocadas por servicios de terceros que aparecen en nuestras
              páginas (por ejemplo, autenticación y hosting).
            </p>
            <p className={styles.text}>
              En cualquier momento puede cambiar o retirar su consentimiento
              desde esta declaración de cookies o eliminando los datos del sitio
              en su navegador.
            </p>
            <p className={styles.text}>
              Obtenga más información en nuestra{" "}
              <Link href="/legal/privacidad">Política de privacidad</Link> y
              cómo contactarnos en <Link href="/contact">Contacto</Link>. Al
              escribir sobre su consentimiento, indique la fecha de su elección
              y el correo{" "}
              <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>.
            </p>
            <p className={styles.text}>
              <Link href="/legal/cookies">Declaración de cookies completa</Link>
            </p>
          </>
        ) : null}
      </div>

      <div className={styles.footer}>
        {tab === "consent" ? (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onEssential}
            >
              Solo esenciales
            </button>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onOpenDetails}
            >
              Personalizar
            </button>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={onAcceptAll}
            >
              Aceptar todas
            </button>
          </div>
        ) : null}

        {tab === "details" ? (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onEssential}
            >
              Solo necesarias
            </button>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={onSaveCustom}
            >
              Guardar preferencias
            </button>
          </div>
        ) : null}

        {tab === "about" ? (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => setTab("consent")}
            >
              Volver
            </button>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                onOpenDetails();
                setTab("details");
              }}
            >
              Personalizar
            </button>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={onAcceptAll}
            >
              Aceptar todas
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function CookieConsent() {
  const barRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState<TabId>("consent");
  const [draft, setDraft] = useState<
    Pick<CookieConsentPreferences, "preferences" | "analytics">
  >({
    preferences: false,
    analytics: false,
  });

  useEffect(() => {
    if (!readCookieConsent()) setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) {
      document.body.style.paddingBottom = "";
      return;
    }

    const bar = barRef.current;
    if (!bar) return;

    const syncPadding = () => {
      document.body.style.paddingBottom = `${bar.offsetHeight}px`;
    };

    syncPadding();
    const observer = new ResizeObserver(syncPadding);
    observer.observe(bar);
    window.addEventListener("resize", syncPadding);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncPadding);
      document.body.style.paddingBottom = "";
    };
  }, [visible]);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [modalOpen]);

  const closeWith = useCallback((prefs: CookieConsentPreferences) => {
    writeCookieConsent(prefs);
    setModalOpen(false);
    setVisible(false);
  }, []);

  const saveEssential = () => closeWith(essentialOnlyPreferences());
  const saveAll = () => closeWith(acceptAllPreferences());

  const saveCustom = () => {
    closeWith({
      necessary: true,
      preferences: draft.preferences,
      analytics: draft.analytics,
      marketing: false,
      savedAt: new Date().toISOString(),
    });
  };

  const openModal = (initialTab: TabId = "consent") => {
    const stored = readCookieConsent();
    setDraft({
      preferences: stored?.preferences ?? false,
      analytics: stored?.analytics ?? false,
    });
    setTab(initialTab);
    setModalOpen(true);
  };

  if (!visible) return null;

  const panelProps: PanelProps = {
    tab,
    setTab,
    draft,
    setDraft,
    onEssential: saveEssential,
    onAcceptAll: saveAll,
    onSaveCustom: saveCustom,
    onOpenDetails: () => setTab("details"),
  };

  return (
    <>
      {modalOpen ? (
        <div
          className={styles.backdrop}
          role="presentation"
          onClick={() => setModalOpen(false)}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-labelledby="cookie-consent-title"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <CookiePanel
              {...panelProps}
              showClose
              onClose={() => setModalOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <aside
        ref={barRef}
        className={styles.bar}
        role="region"
        aria-label="Consentimiento de cookies"
      >
        <div className={styles.barMain}>
          <p className={styles.barTitle}>Uso de cookies</p>
          <p className={styles.barText}>
            Usamos cookies esenciales para sesión y preferencias, y cookies
            analíticas opcionales para mejorar el servicio. Puedes leer el
            detalle en nuestra{" "}
            <Link href="/legal/cookies">política de cookies</Link>.
          </p>
          <button
            type="button"
            className={styles.detailsLink}
            onClick={() => openModal("consent")}
          >
            Mostrar detalles
          </button>
        </div>
        <div className={styles.barActions}>
          <button type="button" className={styles.btnOk} onClick={saveAll}>
            OK
          </button>
        </div>
      </aside>
    </>
  );
}
