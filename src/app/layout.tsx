// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // 1. IMPORTAMOS EL HEADER

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoElite Comparador",
  description: "Compara coches de forma fácil y elegante",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Header /> {/* 2. AÑADIMOS EL HEADER AQUÍ */}
        {children}
      </body>
    </html>
  );
}