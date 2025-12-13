'use client';

import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Briefing',
    description: 'Definimos objetivos, alcance y metodología junto al cliente.',
  },
  {
    number: '02',
    title: 'Diseño',
    description: 'Creamos instrumentos de investigación validados y confiables.',
  },
  {
    number: '03',
    title: 'Campo',
    description: 'Recolectamos datos con encuestadores capacitados y supervisados.',
  },
  {
    number: '04',
    title: 'Análisis',
    description: 'Procesamos y analizamos la información con rigor metodológico.',
  },
  {
    number: '05',
    title: 'Entrega',
    description: 'Presentamos resultados con insights accionables.',
  },
];

const methodologies = [
  {
    title: 'Encuestas Cuantitativas',
    items: ['Cara a cara', 'Telefónicas (CATI)', 'Online', 'Mixtas'],
  },
  {
    title: 'Estudios Cualitativos',
    items: ['Focus Groups', 'Entrevistas a profundidad', 'Etnografía', 'Mystery Shopper'],
  },
  {
    title: 'Análisis Especializados',
    items: ['Tracking de marca', 'NPS', 'Segmentación', 'Análisis predictivo'],
  },
];

export default function Methodology() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
            Cómo Trabajamos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Metodología de Trabajo
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Un proceso estructurado que garantiza la calidad y confiabilidad 
            de cada estudio que realizamos.
          </p>
        </div>

        {/* Timeline de pasos */}
        <div className="relative mb-16">
          {/* Línea conectora */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gray-200"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="relative z-10 mx-auto w-24 h-24 bg-white border-4 border-teal-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-teal-600">{step.number}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tipos de metodología */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {methodologies.map((method, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-6 border-t-4 border-teal-600"
            >
              <h3 className="font-bold text-gray-900 text-lg mb-4">{method.title}</h3>
              <ul className="space-y-2">
                {method.items.map((item, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-teal-600 rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
