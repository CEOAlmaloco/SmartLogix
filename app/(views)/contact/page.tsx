import Link from "next/link";
import { FooterMinimal } from "@/components/auth/FooterMinimal";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactIcon } from "@/components/contact/ContactIcon";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import {
  CONTACT_CHANNELS,
  CONTACT_REASONS,
  CONTACT_SLA,
} from "@/config/contact";
import { LEGAL } from "@/config/legal";
import styles from "./contact.module.css";

type ContactPageProps = {
  searchParams?: { motivo?: string };
};

function resolveDefaultReason(motivo?: string) {
  if (motivo && CONTACT_REASONS.some((r) => r.value === motivo)) {
    return motivo;
  }
  return "demo";
}

export default function ContactPage({ searchParams }: ContactPageProps) {
  const defaultReason = resolveDefaultReason(searchParams?.motivo);

  return (
    <main className={styles.page}>
      <section className={`container ${styles.wrap}`}>
        <HomeNavbar />

        <header className={styles.hero}>
          <p className={styles.eyebrow}>Hablemos</p>
          <h1>Contacto</h1>
          <p className={styles.lead}>
            Estamos disponibles para ayudar a PYMEs a centralizar logística,
            inventario y operaciones de eCommerce. Cuéntanos tu caso y te
            respondemos con un plan claro — sin fricción.
          </p>
        </header>

        <div className={styles.layout}>
          <section className={styles.mainCard} id="ventas">
            <div className={styles.sectionHead}>
              <ContactIcon name="mail" />
              <h2>Ventas y alianzas</h2>
            </div>
            <p>
              Solicita una demo, conoce planes o explora integraciones. Ideal si
              aún no eres cliente y quieres evaluar SmartLogix con tu equipo.
            </p>
            <div className={styles.ctaRow}>
              <Link
                className={styles.ctaPrimary}
                href="/contact?motivo=demo#contact-form"
              >
                Solicitar demo
              </Link>
              <Link
                className={styles.ctaGhost}
                href="/contact?motivo=ventas#contact-form"
              >
                Contactar ventas
              </Link>
            </div>
            <ContactForm defaultReason={defaultReason} />
          </section>

          <aside className={styles.side}>
            <section className={styles.sideCard} id="soporte">
              <div className={styles.sectionHead}>
                <ContactIcon name="support" />
                <h2>Soporte y otros canales</h2>
              </div>
              <p className={styles.sideIntro}>
                Si ya eres cliente o el tema es técnico/legal, usa el canal
                directo:
              </p>
              <ul className={styles.channelList}>
                {CONTACT_CHANNELS.map((channel) => (
                  <li key={channel.id}>
                    <span className={styles.channelIcon}>
                      <ContactIcon name={channel.icon} />
                    </span>
                    <div>
                      <span className={styles.channelLabel}>
                        {channel.label}
                      </span>
                      <a href={`mailto:${channel.email}`}>{channel.email}</a>
                      <span className={styles.channelHint}>{channel.hint}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.sideCard} id="tiempos">
              <div className={styles.sectionHead}>
                <ContactIcon name="clock" />
                <h2>Tiempos de respuesta</h2>
              </div>
              <table className={styles.slaTable}>
                <tbody>
                  {CONTACT_SLA.map((row) => (
                    <tr key={row.area}>
                      <th>{row.area}</th>
                      <td>{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={styles.statusNote}>
                Próximamente: página pública de estado y uptime. Incidentes
                críticos:{" "}
                <a href="mailto:seguridad@smartlogix.cl">
                  seguridad@smartlogix.cl
                </a>
              </p>
            </section>

            <section className={styles.sideCard} id="oficina">
              <h2 className={styles.sideTitle}>Domicilio</h2>
              <p>
                {LEGAL.companyName}
                <br />
                Región Metropolitana, Santiago, {LEGAL.country}
                <br />
                <em>
                  Atención presencial solo con cita previa acordada por correo.
                </em>
              </p>
            </section>
          </aside>
        </div>
      </section>
      <FooterMinimal />
    </main>
  );
}
