import { HomeBenefits } from "./_components/home/HomeBenefits";
import { HomeCTA } from "./_components/home/HomeCTA";
import { HomeFlow } from "./_components/home/HomeFlow";
import { HomeHero } from "./_components/home/HomeHero";
import { HomeNavbar } from "./_components/home/HomeNavbar";
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
