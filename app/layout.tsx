import type { Metadata } from "next";
import { Sora, Space_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { CookieConsent } from "@/components/legal/CookieConsent";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartLogix",
  description: "Plataforma inteligente para la gestión logística de eCommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${sora.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="app-root">
        <div className="app-main">{children}</div>
        <CookieConsent />
      </body>
    </html>
  );
}
