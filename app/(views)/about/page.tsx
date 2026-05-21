import Link from "next/link";
import { CorporatePageLayout } from "@/components/legal/CorporatePageLayout";
import { LEGAL } from "@/config/legal";

export default function AboutPage() {
  return (
    <CorporatePageLayout
      eyebrow="Empresa"
      title="Quiénes somos"
      lead="Ayudamos a PYMEs de eCommerce en Chile a profesionalizar su operación logística con software diseñado para equipos pequeños que necesitan control, no complejidad."
      cta={{ label: "Contactar al equipo comercial", href: "/contact" }}
      sections={[
        {
          id: "historia",
          title: "Nuestra historia",
          content: (
            <>
              <p>
                {LEGAL.brandName} surge de la observación recurrente en operaciones de venta online:
                inventario en planillas, pedidos en WhatsApp y envíos sin trazabilidad unificada. En
                2025, un grupo de fundadores con experiencia en retail digital y desarrollo de
                software decidió construir una plataforma única que hablara el idioma de las PYMEs
                chilenas.
              </p>
              <p>
                Hoy acompañamos organizaciones que procesan desde decenas hasta miles de pedidos al
                mes, integrando inventario, órdenes y despachos en un panel web seguro y auditable.
              </p>
            </>
          ),
        },
        {
          id: "mision",
          title: "Misión y visión",
          content: (
            <>
              <p>
                <strong>Misión:</strong> reducir la fricción operativa del eCommerce mediante
                tecnología accesible, segura y escalable.
              </p>
              <p>
                <strong>Visión:</strong> ser la capa logística de referencia para PYMEs en Latinoamérica
                que exportan o venden en marketplaces locales, sin requerir un ERP corporativo.
              </p>
            </>
          ),
        },
        {
          id: "valores",
          title: "Valores",
          content: (
            <ul>
              <li>
                <strong>Claridad operativa</strong> — métricas y estados que cualquier miembro del
                equipo entiende.
              </li>
              <li>
                <strong>Seguridad por diseño</strong> — aislamiento de datos y prácticas documentadas
                en <Link href="/legal/seguridad">Seguridad</Link>.
              </li>
              <li>
                <strong>Cumplimiento</strong> — documentación legal publicada y verificable en{" "}
                <Link href="/legal/cumplimiento">Cumplimiento</Link>.
              </li>
            </ul>
          ),
        },
        {
          id: "equipo",
          title: "Equipo y gobernanza",
          content: (
            <p>
              Operamos con equipos distribuidos en Chile. Las decisiones de producto y seguridad se
              documentan internamente y se reflejan en las actualizaciones de{" "}
              <Link href="/legal/terminos">Términos de servicio</Link> cuando afectan a clientes.
            </p>
          ),
        },
      ]}
    />
  );
}
