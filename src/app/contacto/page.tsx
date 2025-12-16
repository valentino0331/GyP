import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Contact from '@/components/landing/Contact';
import Image from 'next/image';

// Forzar renderizado dinámico para evitar errores de build
export const dynamic = 'force-dynamic';

export default function ContactoPage() {
  return (
    <main className="bg-white">
      <Header />
      
      {/* Hero de la página */}
      <section className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/survey-people.jpg"
            alt="Contáctanos"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="text-teal-500 font-bold text-sm uppercase tracking-wider">
            Hablemos
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Contáctanos
          </h1>
          <p className="text-gray-300 mt-4 max-w-xl">
            Estamos listos para ayudarte a obtener la información que necesitas.
          </p>
        </div>
      </section>

      <Contact />

      {/* Mapa o ubicación */}
      <section className="bg-gray-100 py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-300 h-64 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600 font-bold">📍 Lima, Perú</p>
                <p className="text-gray-500 text-sm mt-2">
                  Próximamente integración con Google Maps
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
