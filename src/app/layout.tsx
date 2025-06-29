// src/app/layout.tsx
    
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
    
const inter = Inter({ subsets: ["latin"] });
    
export const metadata: Metadata = {
  title: "AutoElite Comparador",
  description: "Configura y compara los coches de tus sueños.",
};
    
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // El ClerkProvider ahora envuelve el contenido DENTRO del body
    <ClerkProvider >
      <html lang="es" className="h-full">
        <body className={`${inter.className} flex flex-col min-h-screen bg-gray-900`}>
            <Toaster 
              position="top-center"
              toastOptions={{
                style: {
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}