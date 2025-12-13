import React from 'react';

const servicios = [
  {
    titulo: 'Encuestas',
    descripcion: 'Diseño y aplicación de encuestas cuantitativas para medir opinión pública, satisfacción del cliente y comportamiento del consumidor.',
    color: 'bg-red-600',
  },
  {
    titulo: 'Sondeos de Opinión',
    descripcion: 'Estudios rápidos para capturar el pulso de la sociedad sobre temas de actualidad, política y tendencias sociales.',
    color: 'bg-blue-600',
  },
  {
    titulo: 'Investigación de Mercados',
    descripcion: 'Análisis profundo de mercados, competencia, segmentación y posicionamiento para la toma de decisiones estratégicas.',
    color: 'bg-green-600',
  },
  {
    titulo: 'Estudios Cualitativos',
    descripcion: 'Focus groups, entrevistas a profundidad y etnografía para entender motivaciones, percepciones y comportamientos.',
    color: 'bg-purple-600',
  },
];

const areas = [
  'Consumidores y Marcas',
  'Ciudadanos y Opinión Pública',
  'Clientes y Colaboradores',
  'Sector Público',
  'Salud y Bienestar',
  'Medios y Comunicación',
];

export default function Presentation() {
  return (
    <section id="servicios" className="bg-white py-16 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12">
          <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
            Nuestros Servicios
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Soluciones de Investigación
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Proporcionamos información confiable para una verdadera comprensión 
            de la sociedad, los mercados y las personas.
          </p>
        </div>

        {/* Grid de servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {servicios.map((servicio, index) => (
            <div 
              key={index} 
              className="border border-gray-200 p-6 hover:shadow-lg transition-shadow group"
            >
              <div className={`${servicio.color} w-1 h-12 mb-4`}></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                {servicio.titulo}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {servicio.descripcion}
              </p>
            </div>
          ))}
        </div>

        {/* Áreas de especialización */}
        <div className="bg-gray-900 text-white p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-teal-500 font-bold text-sm uppercase tracking-wider">
                Áreas de Especialización
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
                Conocimiento en diversos sectores
              </h3>
              <p className="text-gray-400">
                Nuestro equipo cuenta con experiencia en múltiples industrias 
                y sectores para ofrecer insights relevantes y accionables.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {areas.map((area, index) => (
                <div 
                  key={index}
                  className="bg-gray-800 px-4 py-3 text-sm font-medium hover:bg-teal-600 transition-colors cursor-default"
                >
                  {area}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
