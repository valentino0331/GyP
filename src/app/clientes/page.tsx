import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Clients from '@/components/landing/Clients';
import Image from 'next/image';

// Forzar renderizado dinámico para evitar errores de build
export const dynamic = 'force-dynamic';

export default function ClientesPage() {
  return (
    <main className="bg-white">
      <Header />
      
      {/* Hero de la página */}
      <section className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/office-work.jpg"
            alt="Nuestros Clientes"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="text-teal-500 font-bold text-sm uppercase tracking-wider">
            Casos de Éxito
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Nuestros Clientes
          </h1>
          <p className="text-gray-300 mt-4 max-w-xl">
            Empresas líderes confían en GyP para sus decisiones estratégicas 
            basadas en datos.
          </p>
        </div>
      </section>

      <Clients />

      <Footer />
    </main>
  );
}
