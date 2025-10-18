import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";          // ⬅️ NUEVO
import { ToastProvider } from "@/components/Toast"; // ⬅️ NUEVO

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Autofiltros JC",
  description: "E-commerce de filtros y repuestos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider> {/* ⬅️ Envuelve todo para habilitar los toasts */}
          <Header />
          {/* padding top para evitar que el header tape el contenido */}
          <main className="min-h-[70vh] pt-4 sm:pt-6">{children}</main>
          <Footer /> {/* ⬅️ Footer profesional con datos de la empresa */}
        </ToastProvider>
      </body>
    </html>
  );
}




