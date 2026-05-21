import Link from "next/link";
import { AppIcon } from "@/components/icons/AppIcon";
import { CorporatePageLayout } from "@/components/legal/CorporatePageLayout";

const ARTICLES = [
  {
    id: "inventario-pyme",
    title: "Cómo estructurar el inventario de una PYME de eCommerce en 2026",
    date: "12 de abril de 2026",
    author: "Equipo Operaciones · SmartLogix",
    excerpt:
      "Guía práctica para pasar de planillas a un modelo con SKU, ubicaciones y políticas de reabastecimiento medibles.",
  },
  {
    id: "trazabilidad-envios",
    title: "Trazabilidad de envíos: indicadores que importan antes de escalar",
    date: "28 de marzo de 2026",
    author: "Equipo Producto · SmartLogix",
    excerpt:
      "OTIF, lead time de despacho y tasa de excepciones: qué medir cuando el volumen duplica sin duplicar el equipo.",
  },
  {
    id: "cumplimiento-datos",
    title: "Checklist de cumplimiento de datos para SaaS logísticos en Chile",
    date: "15 de marzo de 2026",
    author: "Equipo Legal · SmartLogix",
    excerpt:
      "Qué documentación publicar en el sitio y cómo alinear el registro de PYMEs con la Ley 19.628.",
  },
] as const;

export default function BlogPage() {
  return (
    <CorporatePageLayout
      eyebrow="Recursos"
      title="Blog SmartLogix"
      lead="Artículos sobre operaciones, logística y cumplimiento para equipos de eCommerce que buscan madurez operativa sin perder agilidad."
      sections={[
        {
          id: "articulos",
          title: "Últimas publicaciones",
          content: (
            <div>
              {ARTICLES.map((article) => (
                <article
                  key={article.id}
                  id={article.id}
                  style={{
                    marginBottom: "2rem",
                    paddingBottom: "2rem",
                    borderBottom: "1px solid #ebe6df",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "#6b635c" }}>
                    {article.date} · {article.author}
                  </p>
                  <h3 style={{ margin: "0.5rem 0", fontSize: "1.15rem", color: "#1f1a17" }}>
                    {article.title}
                  </h3>
                  <p>{article.excerpt}</p>
                  <p style={{ margin: 0 }}>
                    <Link
                      href={`/blog#${article.id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontWeight: 600,
                      }}
                    >
                      Continuar leyendo
                      <AppIcon name="arrowRight" size={16} aria-hidden />
                    </Link>
                  </p>
                </article>
              ))}
              <p style={{ fontSize: "0.9rem", color: "#6b635c" }}>
                ¿Temas que le gustaría ver? Escríbanos a contacto@smartlogix.cl
              </p>
            </div>
          ),
        },
        {
          id: "legal",
          title: "Aviso editorial",
          content: (
            <p>
              Los contenidos tienen fines informativos y no constituyen asesoría legal ni
              tributaria. Para documentación vinculante consulte{" "}
              <Link href="/legal/terminos">Términos de servicio</Link> y{" "}
              <Link href="/legal/privacidad">Privacidad</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
