import React from 'react';

const valores = [
  { titulo: 'Rigor Metodológico', descripcion: 'Aplicamos estándares de calidad en cada estudio' },
  { titulo: 'Confidencialidad', descripcion: 'Protegemos la información de nuestros clientes' },
  { titulo: 'Objetividad', descripcion: 'Resultados imparciales basados en datos' },
  { titulo: 'Innovación', descripcion: 'Metodologías y tecnología de vanguardia' },
];

export default function MissionVision() {
  return (
    <section id="mision-vision" className="py-16 px-4">
      {/* Misión y Visión */}
      <div className="container mx-auto mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Misión */}
          <div className="bg-teal-600 text-white p-10 md:p-14">
            <span className="text-teal-200 font-bold text-sm uppercase tracking-wider">
              Nuestra Misión
            </span>
            <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-6">
              Generar conocimiento para mejores decisiones
            </h3>
            <p className="text-teal-100 leading-relaxed">
              Proporcionar información confiable y oportuna a través de investigaciones 
              rigurosas, contribuyendo al desarrollo de organizaciones y la sociedad.
            </p>
          </div>

          {/* Visión */}
          <div className="bg-gray-900 text-white p-10 md:p-14">
            <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">
              Nuestra Visión
            </span>
            <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-6">
              Ser referentes en investigación
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Consolidarnos como la empresa líder en investigación de mercados y 
              estudios de opinión, reconocida por la calidad y confiabilidad de 
              nuestros estudios.
            </p>
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
            Nuestros Valores
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            Principios que nos definen
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valores.map((valor, index) => (
            <div
              key={index}
              className="border-t-4 border-teal-600 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-2">{valor.titulo}</h4>
              <p className="text-gray-600 text-sm">{valor.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
