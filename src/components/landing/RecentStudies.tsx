'use client';

import React from 'react';
import Image from 'next/image';

const studies = [
  {
    category: 'OPINIÓN PÚBLICA',
    date: '05.12.25',
    title: 'Percepción ciudadana sobre gestión municipal 2025',
    description: 'Estudio sobre la evaluación de los ciudadanos respecto a la gestión de gobiernos locales.',
    image: '/study-opinion.jpg',
    tag: 'ENCUESTA',
  },
  {
    category: 'CONSUMO',
    date: '28.11.25',
    title: 'Hábitos de consumo digital en millennials',
    description: 'Análisis del comportamiento de compra online en la generación millennial.',
    image: '/study-market.jpg',
    tag: 'INVESTIGACIÓN',
  },
  {
    category: 'MERCADO',
    date: '15.11.25',
    title: 'Tendencias del sector retail para 2026',
    description: 'Proyecciones y oportunidades en el mercado minorista peruano.',
    image: '/study-retail.jpg',
    tag: 'INFORME',
  },
];

const insights = [
  {
    percentage: '72%',
    text: 'de consumidores prefiere marcas con propósito social',
    source: 'Estudio de Marca 2025',
  },
  {
    percentage: '45%',
    text: 'incremento en compras online vs. 2024',
    source: 'Monitor de E-commerce',
  },
  {
    percentage: '8/10',
    text: 'peruanos considera importante la sostenibilidad',
    source: 'Barómetro Ambiental',
  },
];

export default function RecentStudies() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
              Lo Último de GyP
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Estudios Recientes
            </h2>
          </div>
          <a 
            href="#" 
            className="mt-4 md:mt-0 text-teal-600 font-bold text-sm hover:underline"
          >
            VER TODOS LOS ESTUDIOS →
          </a>
        </div>

        {/* Grid de estudios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {studies.map((study, index) => (
            <article 
              key={index} 
              className="group cursor-pointer"
            >
              <div className="relative h-48 mb-4 overflow-hidden">
                <Image
                  src={study.image}
                  alt={study.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-teal-600 text-white text-xs font-bold px-2 py-1">
                    {study.tag}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="text-teal-600 font-bold">{study.category}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{study.date}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-teal-600 transition-colors">
                {study.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {study.description}
              </p>
            </article>
          ))}
        </div>

        {/* Insights destacados */}
        <div className="bg-gray-900 p-8 md:p-12">
          <div className="text-center mb-8">
            <span className="text-teal-500 font-bold text-sm uppercase tracking-wider">
              Insights Destacados
            </span>
            <h3 className="text-2xl font-bold text-white mt-2">
              Datos que Importan
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className="text-center p-6 border border-gray-700 hover:border-teal-500 transition-colors"
              >
                <p className="text-4xl md:text-5xl font-bold text-teal-500 mb-2">
                  {insight.percentage}
                </p>
                <p className="text-gray-300 mb-3">
                  {insight.text}
                </p>
                <p className="text-gray-500 text-sm">
                  {insight.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
