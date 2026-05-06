import { HomeBenefits } from "@/components/home/HomeBenefits";
import { HomeCTA } from "@/components/home/HomeCTA";
import { HomeFlow } from "@/components/home/HomeFlow";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className="container py-4 py-lg-5">
        <HomeNavbar />
        <HomeHero />
        <HomeBenefits />
        <HomeFlow />
        <HomeCTA />
      </section>
    </main>
  );
}
