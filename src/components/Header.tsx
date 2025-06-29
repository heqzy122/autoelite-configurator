// src/components/Header.tsx

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCompareStore } from "@/store/compareStore";
import { supabase } from "@/lib/supabaseClient";
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";

const logoMap: { [key: string]: string } = {
    Audi: "/logos/audi.svg",
    BMW: "/logos/bmw.svg",
    Cupra: "/logos/cupra.png",
    Hyundai: "/logos/hyundai.png",
    Jaguar: "/logos/jaguar.png",
    Maserati: "/logos/maserati.png",
    Mercedes: "/logos/mercedes.png",
    Mini: "/logos/mini.png",
    Porsche: "/logos/porsche.png",
    Renault: "/logos/renault.png",
    Tesla: "/logos/tesla.png",
    Toyota: "/logos/toyota.png",
    Volkswagen: "/logos/vw.png",
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { selectedCars, searchTerm, setSearchTerm, garageItemCount, setGarageItemCount } = useCompareStore();
  const [isClient, setIsClient] = useState(false);
  const [marcas, setMarcas] = useState<string[]>([]);
  
  const { userId } = useAuth();

  useEffect(() => {
    setIsClient(true);
    
    const fetchMarcas = async () => {
      const { data, error } = await supabase.from("modelos").select("marca");
      if (error) {
        console.error("Error fetching marcas:", error);
      } else if (data) {
        const uniqueMarcas = [...new Set(data.map(item => item.marca))].sort();
        setMarcas(uniqueMarcas);
      }
    };
    fetchMarcas();

    const fetchGarageCount = async () => {
        if (userId) {
            // AQUÍ ESTÁ LA LÍNEA CORREGIDA
            const { count, error } = await supabase
                .from('garaje')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            if (error) {
                console.error("Error fetching garage count:", error);
                setGarageItemCount(0);
            } else {
                setGarageItemCount(count || 0);
            }
        } else {
            setGarageItemCount(0); 
        }
    };
    fetchGarageCount();

  }, [userId, setGarageItemCount]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-gray-900 shadow-lg sticky top-0 z-30">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-md text-gray-300 hover:bg-gray-700" aria-label="Abrir menú">
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <Link href="/" className="text-2xl font-bold text-green-600">AutoElite</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/comparar" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Comparar coches ({isClient ? selectedCars.length : 0})
              </Link>
              
              <Link href="/garaje" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Mi Garaje {isClient && userId && `(${garageItemCount})`}
              </Link>

              <SignedOut>
                <Link href="/sign-in" className="text-green-500 hover:text-green-400 p-2 rounded-full transition-colors" title="Iniciar Sesión">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </Link>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </nav>
      </header>

      {/* Menú Lateral */}
      <div style={{ backgroundColor: isMenuOpen ? 'rgba(31, 41, 55, 0.6)' : 'transparent', backdropFilter: isMenuOpen ? 'blur(4px)' : 'none', pointerEvents: isMenuOpen ? 'auto' : 'none' }} className={`fixed inset-0 z-40 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsMenuOpen(false)}>
        <div className={`fixed top-0 left-0 h-full w-72 bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="p-5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-green-600">Menú</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-2" aria-label="Cerrar menú">
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="mb-4">
                <input type="text" placeholder="Buscar por marca, modelo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-100 placeholder:text-gray-400 bg-gray-700" />
              </div>
              <nav className="flex flex-col space-y-1">
                <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Marcas</p>
                {marcas.map((marca) => (
                  <Link key={marca} href={`/marca/${marca}`} className="text-gray-200 block px-3 py-2 text-base rounded-md hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>
                    <span className="flex items-center gap-x-3">
                      {logoMap[marca] && (<Image src={logoMap[marca]} alt={`Logo de ${marca}`} width={24} height={24} />)}
                      {marca}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
        </div>
      </div>
    </>
  );
}