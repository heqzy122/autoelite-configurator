// src/components/Footer.tsx

import Link from 'next/link';

// Iconos SVG para las redes sociales
const socialIcons = {
  twitter: (
    <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
    </svg>
  ),
  instagram: (
    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
    </svg>
  ),
  linkedin: (
    <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
      <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
      <circle cx="4" cy="4" r="2" stroke="none"></circle>
    </svg>
  ),
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400">
      <div className="container mx-auto py-8 px-5 flex flex-wrap flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 mb-8 sm:mb-0 text-center sm:text-left">
          <h2 className="title-font font-bold text-white tracking-widest text-lg mb-3">AutoElite</h2>
          <nav className="list-none mb-4">
            <li><Link href="/catalogo" className="hover:text-white">Catálogo</Link></li>
            <li><Link href="/comparar" className="hover:text-white">Comparador</Link></li>
          </nav>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 mb-8 sm:mb-0 text-center sm:text-left">
          <h2 className="title-font font-bold text-white tracking-widest text-lg mb-3">SECCIONES</h2>
          <nav className="list-none mb-4">
            <li><a href="#" className="hover:text-white">Sobre Nosotros</a></li>
            <li><a href="#" className="hover:text-white">Contacto</a></li>
          </nav>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 mb-8 sm:mb-0 text-center sm:text-left">
           <h2 className="title-font font-bold text-white tracking-widest text-lg mb-3">LEGAL</h2>
          <nav className="list-none mb-4">
            <li><a href="#" className="hover:text-white">Política de Privacidad</a></li>
            <li><a href="#" className="hover:text-white">Términos de Uso</a></li>
          </nav>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 lg:w-2/5 mb-8 sm:mb-0 sm:pl-8 text-center sm:text-left">
           <h2 className="title-font font-bold text-white tracking-widest text-lg mb-3">NO TE PIERDAS NADA</h2>
           <p className="mb-4">Suscríbete a nuestra newsletter para recibir las últimas novedades.</p>
           <div className="flex flex-col sm:flex-row gap-2">
            <input type="email" placeholder="tu.email@ejemplo.com" className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-100 placeholder:text-gray-500 bg-gray-800 flex-grow"/>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">Suscribirse</button>
           </div>
        </div>
      </div>
      <div className="bg-gray-800 bg-opacity-50">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} AutoElite —
            <a href="https://twitter.com/knyttneve" rel="noopener noreferrer" className="text-gray-600 ml-1" target="_blank">@autoelite</a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
            <a href="#" className="text-gray-500 hover:text-white">{socialIcons.twitter}</a>
            <a href="#" className="ml-3 text-gray-500 hover:text-white">{socialIcons.instagram}</a>
            <a href="#" className="ml-3 text-gray-500 hover:text-white">{socialIcons.linkedin}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}