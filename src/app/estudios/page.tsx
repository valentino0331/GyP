import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Charts from '@/components/landing/Charts';
import RecentStudies from '@/components/landing/RecentStudies';
import Image from 'next/image';

// Forzar renderizado dinámico para evitar errores de build
export const dynamic = 'force-dynamic';

export default function EstudiosPage() {
  return (
    <main className="bg-white">
      <Header />
      
      {/* Hero de la página */}
      <section className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/charts-screen.jpg"
            alt="Estudios e Investigaciones"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="text-teal-500 font-bold text-sm uppercase tracking-wider">
            Publicaciones
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Estudios y Resultados
          </h1>
          <p className="text-gray-300 mt-4 max-w-xl">
            Explora nuestros estudios más recientes y las tendencias 
            que estamos identificando en el mercado peruano.
          </p>
        </div>
      </section>

      <Charts />
      <RecentStudies />

      {/* Sección de participación */}
      <section className="bg-gray-100 py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Participa en nuestros estudios
            </h2>
            <p className="text-gray-600 mb-6">
              Tu opinión es importante. Participa en nuestras encuestas 
              y ayuda a generar información valiosa.
            </p>
            <a 
              href="/encuestas" 
              className="inline-block bg-teal-600 text-white font-bold py-3 px-8 hover:bg-teal-700 transition-colors"
            >
              VER ENCUESTAS
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
