import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Image from 'next/image';
import { db } from '@/lib/db';

// Forzar renderizado dinámico para obtener datos frescos siempre
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Función para obtener el contenido de la base de datos
async function getContent() {
  try {
    const result = await db.query('SELECT * FROM site_content ORDER BY section_key');
    const contentMap: Record<string, any> = {};
    
    for (const row of result.rows) {
      const content = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
      contentMap[row.section_key] = content;
    }
    
    return contentMap;
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
}

// Obtener servicios de la BD
async function getServices() {
  try {
    const result = await db.query(
      'SELECT * FROM services WHERE is_visible = true ORDER BY display_order'
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export default async function ServiciosPage() {
  const content = await getContent();
  const servicesFromDB = await getServices();
  
  const pageData = content?.servicios_page || {};
  
  // Servicios por defecto
  const defaultServices = [
    {
      title: 'Encuestas',
      description: 'Diseño y aplicación de encuestas cuantitativas para medir opinión pública, satisfacción del cliente y comportamiento del consumidor.',
      color: 'bg-red-600',
    },
    {
      title: 'Sondeos de Opinión',
      description: 'Estudios rápidos para capturar el pulso de la sociedad sobre temas de actualidad, política y tendencias sociales.',
      color: 'bg-blue-600',
    },
    {
      title: 'Investigación de Mercados',
      description: 'Análisis profundo de mercados, competencia, segmentación y posicionamiento para la toma de decisiones estratégicas.',
      color: 'bg-green-600',
    },
    {
      title: 'Estudios Cualitativos',
      description: 'Focus groups, entrevistas a profundidad y etnografía para entender motivaciones, percepciones y comportamientos.',
      color: 'bg-purple-600',
    },
  ];
  
  const colors = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600', 'bg-pink-600'];
  
  const services = servicesFromDB.length > 0 
    ? servicesFromDB.map((s: any, i: number) => ({ ...s, color: colors[i % colors.length] }))
    : defaultServices;
  
  const defaultAreas = [
    'Consumidores y Marcas',
    'Ciudadanos y Opinión Pública',
    'Clientes y Colaboradores',
    'Sector Público',
    'Salud y Bienestar',
    'Medios y Comunicación',
  ];

  return (
    <main className="bg-white">
      <Header />
      
      {/* Hero de la página */}
      <section className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src={pageData.heroImage || "/data-analysis.jpg"}
            alt="Servicios de Investigación"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="text-teal-500 font-bold text-sm uppercase tracking-wider">
            {pageData.heroSubtitle || 'GyP Consultoría'}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
            {pageData.heroTitle || 'Nuestros Servicios'}
          </h1>
          <p className="text-gray-300 mt-4 max-w-xl">
            {pageData.heroDescription || 'Soluciones integrales de investigación para entender mercados, consumidores y la opinión pública.'}
          </p>
        </div>
      </section>

      {/* Servicios */}
      <section className="bg-white py-16 px-4">
        <div className="container mx-auto">
          <div className="mb-12">
            <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
              {pageData.servicesTag || 'Nuestros Servicios'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              {pageData.servicesTitle || 'Soluciones de Investigación'}
            </h2>
            <p className="text-gray-600 max-w-2xl">
              {pageData.servicesDescription || 'Proporcionamos información confiable para una verdadera comprensión de la sociedad, los mercados y las personas.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {services.map((servicio: any, index: number) => (
              <div 
                key={index} 
                className="border border-gray-200 p-6 hover:shadow-lg transition-shadow group"
              >
                <div className={`${servicio.color || colors[index % colors.length]} w-1 h-12 mb-4`}></div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                  {servicio.title || servicio.titulo}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {servicio.description || servicio.descripcion}
                </p>
              </div>
            ))}
          </div>

          {/* Áreas de especialización */}
          <div className="bg-gray-900 text-white p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-teal-500 font-bold text-sm uppercase tracking-wider">
                  {pageData.areasTag || 'Áreas de Especialización'}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
                  {pageData.areasTitle || 'Conocimiento en diversos sectores'}
                </h3>
                <p className="text-gray-400">
                  {pageData.areasDescription || 'Nuestro equipo cuenta con experiencia en múltiples industrias y sectores para ofrecer insights relevantes y accionables.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(pageData.areas || defaultAreas).map((area: any, index: number) => (
                  <div 
                    key={index}
                    className="bg-gray-800 px-4 py-3 text-sm font-medium hover:bg-teal-600 transition-colors cursor-default"
                  >
                    {typeof area === 'string' ? area : area.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metodología */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
              {pageData.methodologyTag || 'Nuestra Metodología'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              {pageData.methodologyTitle || 'Proceso de Trabajo'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Diagnóstico', desc: 'Entendemos tus necesidades y objetivos de investigación' },
              { step: '02', title: 'Diseño', desc: 'Creamos la metodología ideal para tu proyecto' },
              { step: '03', title: 'Ejecución', desc: 'Recolectamos datos con los más altos estándares' },
              { step: '04', title: 'Análisis', desc: 'Entregamos insights accionables y recomendaciones' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-teal-600 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-teal-600 py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {pageData.ctaTitle || '¿Necesitas un estudio personalizado?'}
          </h2>
          <p className="text-teal-100 mb-6">
            {pageData.ctaDescription || 'Contáctanos y diseñaremos la metodología perfecta para tu proyecto.'}
          </p>
          <a 
            href="/contacto" 
            className="inline-block bg-white text-teal-600 font-bold py-3 px-8 hover:bg-gray-100 transition-colors"
          >
            {pageData.ctaButton || 'SOLICITAR COTIZACIÓN'}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
