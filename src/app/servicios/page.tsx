import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Presentation from '@/components/landing/Presentation';
import Methodology from '@/components/landing/Methodology';
import Image from 'next/image';

// Forzar renderizado dinámico para evitar errores de build
export const dynamic = 'force-dynamic';

export default function ServiciosPage() {
  return (
    <main className="bg-white">
      <Header />
      
      {/* Hero de la página */}
      <section className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/data-analysis.jpg"
            alt="Servicios de Investigación"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="text-teal-500 font-bold text-sm uppercase tracking-wider">
            GyP Consultoría
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Nuestros Servicios
          </h1>
          <p className="text-gray-300 mt-4 max-w-xl">
            Soluciones integrales de investigación para entender mercados, 
            consumidores y la opinión pública.
          </p>
        </div>
      </section>

      <Presentation />
      <Methodology />
      
      {/* CTA */}
      <section className="bg-teal-600 py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            ¿Necesitas un estudio personalizado?
          </h2>
          <p className="text-teal-100 mb-6">
            Contáctanos y diseñaremos la metodología perfecta para tu proyecto.
          </p>
          <a 
            href="/contacto" 
            className="inline-block bg-white text-teal-600 font-bold py-3 px-8 hover:bg-gray-100 transition-colors"
          >
            SOLICITAR COTIZACIÓN
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
