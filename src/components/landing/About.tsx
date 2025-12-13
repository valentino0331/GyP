import React from 'react';
import Image from 'next/image';

export default function About() {
  return (
    <section id="nosotros" className="bg-gray-100 py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div>
            <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
              Sobre GyP
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
              Consultoría e Investigación de Mercados
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              <strong className="text-gray-900">GyP Consultoría</strong> es una empresa especializada 
              en investigación de mercados y estudios de opinión. Proporcionamos información 
              confiable para una verdadera comprensión de la sociedad, los mercados y las personas.
            </p>

            <p className="text-gray-600 leading-relaxed mb-8">
              Nuestro equipo de profesionales experimentados utiliza metodologías rigurosas 
              y tecnología de vanguardia para entregar insights accionables que ayudan a 
              nuestros clientes a tomar mejores decisiones.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border-l-4 border-teal-600 pl-4">
                <p className="text-2xl font-bold text-gray-900">15+</p>
                <p className="text-gray-500 text-sm">Años de experiencia</p>
              </div>
              <div className="border-l-4 border-teal-600 pl-4">
                <p className="text-2xl font-bold text-gray-900">50+</p>
                <p className="text-gray-500 text-sm">Clientes activos</p>
              </div>
            </div>

            <a
              href="#contacto"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 transition-colors"
            >
              CONTÁCTENOS
            </a>
          </div>

          {/* Imagen */}
          <div className="relative">
            <div className="relative h-[400px] lg:h-[500px] w-full">
              <Image
                src="/hero-bg-2.jpg"
                alt="GyP Consultoría - Equipo de Investigación"
                fill
                className="object-cover"
              />
            </div>
            {/* Badge */}
            <div className="absolute -bottom-6 -left-6 bg-teal-600 text-white p-6 hidden lg:block">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm">Estudios realizados</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
