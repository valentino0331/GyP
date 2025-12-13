import React from 'react';
import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="bg-red-600 py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          ¿Quieres participar en nuestras encuestas?
        </h2>
        <p className="text-red-100 text-lg max-w-2xl mx-auto mb-8">
          Únete a nuestro panel de encuestados y contribuye con tu opinión 
          a la toma de decisiones importantes en el Perú.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/encuestas" 
            className="bg-white hover:bg-gray-100 text-red-600 font-bold py-3 px-8 transition-colors"
          >
            PARTICIPAR AHORA
          </Link>
          <a 
            href="#contacto" 
            className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-3 px-8 transition-colors"
          >
            MÁS INFORMACIÓN
          </a>
        </div>
      </div>
    </section>
  );
}
