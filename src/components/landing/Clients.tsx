'use client';

import React from 'react';

const testimonials = [
  {
    quote: 'GyP nos proporcionó insights valiosos que transformaron nuestra estrategia de marketing. Su metodología rigurosa y profesionalismo son excepcionales.',
    author: 'María García',
    position: 'Gerente de Marketing',
    company: 'Empresa Retail',
  },
  {
    quote: 'La calidad de los datos y la rapidez en la entrega superaron nuestras expectativas. Definitivamente seguiremos trabajando con ellos.',
    author: 'Carlos Mendoza',
    position: 'Director Comercial',
    company: 'Servicios Financieros',
  },
  {
    quote: 'El equipo de GyP demostró un profundo conocimiento del mercado peruano. Sus estudios nos ayudaron a tomar decisiones estratégicas clave.',
    author: 'Ana Torres',
    position: 'CEO',
    company: 'Startup Tecnológica',
  },
];

const sectors = [
  'Retail',
  'Banca y Finanzas',
  'Consumo Masivo',
  'Telecomunicaciones',
  'Salud',
  'Educación',
  'Gobierno',
  'ONG',
];

export default function Clients() {
  return (
    <section className="bg-gray-100 py-16 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
            Clientes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Confían en Nosotros
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Empresas líderes en diversos sectores confían en GyP para 
            sus necesidades de investigación de mercados.
          </p>
        </div>

        {/* Sectores */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {sectors.map((sector, index) => (
            <span 
              key={index}
              className="bg-white px-4 py-2 text-gray-700 text-sm font-medium border border-gray-200 hover:border-teal-500 hover:text-teal-600 transition-colors cursor-default"
            >
              {sector}
            </span>
          ))}
        </div>

        {/* Testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-6 shadow-sm relative"
            >
              {/* Comilla decorativa */}
              <div className="absolute top-4 right-4 text-6xl text-teal-100 font-serif leading-none">
                "
              </div>
              
              <p className="text-gray-600 mb-6 relative z-10">
                "{testimonial.quote}"
              </p>
              
              <div className="border-t border-gray-100 pt-4">
                <p className="font-bold text-gray-900">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.position}</p>
                <p className="text-teal-600 text-sm font-medium">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ¿Listo para obtener insights que impulsen tu negocio?
          </p>
          <a 
            href="/contacto" 
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 transition-colors"
          >
            SOLICITAR COTIZACIÓN
          </a>
        </div>
      </div>
    </section>
  );
}
