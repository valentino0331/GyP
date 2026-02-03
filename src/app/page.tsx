import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Newsletter from '@/components/landing/Newsletter';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
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

// Componente Hero simplificado para home
function HomeHero({ content }: { content: any }) {
  const heroData = content?.hero || {};
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroData.image || "/team-meeting.jpg"}
          alt="GyP Consultoría"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30"></div>
      </div>
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-2xl">
          <span className="inline-block bg-teal-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 mb-6">
            {heroData.tag || 'Investigación de Mercados'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {heroData.title || 'Información confiable para mejores decisiones'}
          </h1>
          <p className="text-lg text-gray-200 mb-8 leading-relaxed">
            {heroData.description || 'Encuestas, sondeos de opinión e investigación de mercados para comprender a la sociedad, los mercados y las personas.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/servicios"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 transition-colors text-center"
            >
              NUESTROS SERVICIOS
            </Link>
            <Link
              href="/contacto"
              className="inline-block border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-3 px-8 transition-colors text-center"
            >
              CONTÁCTANOS
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Stats rápidos
function QuickStats({ content }: { content: any }) {
  const statsData = content?.stats || {};
  const defaultStats = [
    { value: '500+', label: 'Estudios' },
    { value: '50+', label: 'Clientes' },
    { value: '10K+', label: 'Encuestas' },
    { value: '15+', label: 'Años' },
  ];
  const stats = statsData.items || defaultStats;
  return (
    <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-10 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat: any, index: number) => (
            <div key={index}>
              <p className="text-4xl font-bold text-white">{stat.value}</p>
              <p className="text-teal-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Sección de descargas
function DownloadSection() {
  const files = [
    { name: '1765646875210-lhikn4.jpg', url: '/uploads/1765646875210-lhikn4.jpg', type: 'image' },
    { name: '1765646890325-il6w10.jpg', url: '/uploads/1765646890325-il6w10.jpg', type: 'image' }
    // Aquí se agregarán más archivos dinámicamente si se implementa backend
  ];
  return (
    <section className="bg-gradient-to-br from-teal-50 to-teal-100 py-14 px-4">
      <div className="container mx-auto max-w-2xl rounded-xl shadow-lg bg-white p-8">
        <h2 className="text-3xl font-extrabold mb-6 text-teal-700 flex items-center gap-2">
          <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 8l-4-4m4 4l4-4" /></svg>
          Descarga de archivos
        </h2>
        <ul className="divide-y divide-teal-100">
          {files.length === 0 ? (
            <li className="text-gray-500 py-6 text-center">No hay archivos disponibles.</li>
          ) : (
            files.map(file => (
              <li key={file.name} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  {file.type === 'image' ? (
                    <img src={file.url} alt={file.name} className="w-12 h-12 object-cover rounded shadow" />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-teal-100 rounded">
                      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 8l-4-4m4 4l4-4" /></svg>
                    </div>
                  )}
                  <span className="font-medium text-gray-800 truncate max-w-[140px]">{file.name}</span>
                </div>
                <a href={file.url} download className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 16a2 2 0 002 2h10a2 2 0 002-2v-4a1 1 0 10-2 0v4H5v-4a1 1 0 10-2 0v4zm7-14a1 1 0 00-1 1v8.586l-2.293-2.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 10-1.414-1.414L11 11.586V3a1 1 0 00-1-1z" /></svg>
                  Descargar
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

// Servicios resumidos con links
function ServicesPreview({ content }: { content: any }) {
  const servicesData = content?.services || {};
  const defaultServices = [
    {
      title: 'Encuestas',
      description: 'Diseño y aplicación de encuestas cuantitativas.',
      href: '/servicios',
    },
    {
      title: 'Sondeos de Opinión',
      description: 'Estudios rápidos sobre temas de actualidad.',
      href: '/servicios',
    },
    {
      title: 'Investigación de Mercados',
      description: 'Análisis profundo de mercados y competencia.',
      href: '/servicios',
    },
    {
      title: 'Estudios Cualitativos',
      description: 'Focus groups y entrevistas a profundidad.',
      href: '/servicios',
    },
  ];
  const services = servicesData.items || defaultServices;
  return (
    <section className="bg-white py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
            {servicesData.tag || 'Servicios'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            {servicesData.title || 'Soluciones de Investigación'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {services.map((service: any, index: number) => (
            <div 
              key={index}
              className="border border-gray-200 p-6 hover:border-teal-500 transition-colors"
            >
              <div className="w-1 h-10 bg-teal-600 mb-4"></div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link 
            href="/servicios" 
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 transition-colors"
          >
            VER TODOS LOS SERVICIOS
          </Link>
        </div>
      </div>
    </section>
  );
}

// Estudios destacados con link
function StudiesPreview({ content }: { content: any }) {
  const studiesData = content?.studies || {};
  return (
    <section className="bg-gray-100 py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-80">
            <Image
              src={studiesData.image || "/charts-screen.jpg"}
              alt="Estudios y Resultados"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
              {studiesData.tag || 'Publicaciones'}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              {studiesData.title || 'Estudios Recientes'}
            </h2>
            <p className="text-gray-600 mb-6">
              {studiesData.description || 'Explora nuestros últimos estudios e investigaciones. Datos actualizados sobre opinión pública, comportamiento del consumidor y tendencias de mercado.'}
            </p>
            <div className="space-y-3 mb-8">
              {(studiesData.highlights || [
                { value: '72%', label: 'prefiere marcas con propósito' },
                { value: '45%', label: 'incremento en compras online' },
              ]).map((highlight: any, index: number) => (
                <div key={index} className="flex items-center">
                  <span className="text-teal-600 font-bold text-2xl mr-3">{highlight.value}</span>
                  <span className="text-gray-600">{highlight.label}</span>
                </div>
              ))}
            </div>
            <Link 
              href="/estudios" 
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 transition-colors"
            >
              VER ESTUDIOS
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA para participar
function ParticipatesCTA({ content }: { content: any }) {
  const ctaData = content?.cta || {};
  return (
    <section className="bg-gray-900 py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-teal-500 font-bold text-sm uppercase tracking-wider">
              {ctaData.tag || 'Únete a nosotros'}
            </span>
            <h2 className="text-3xl font-bold text-white mt-2 mb-4">
              {ctaData.title || '¿Quieres participar en nuestras encuestas?'}
            </h2>
            <p className="text-gray-400 mb-6">
              {ctaData.description || 'Únete a nuestro panel de encuestados y contribuye con tu opinión a la toma de decisiones importantes en el Perú.'}
            </p>
            <Link 
              href="/encuestas" 
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 transition-colors"
            >
              {ctaData.buttonText || 'PARTICIPAR AHORA'}
            </Link>
          </div>
          <div className="relative h-64">
            <Image
              src={ctaData.image || "/survey-people.jpg"}
              alt="Participa en encuestas"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// QuickLinks (puedes ajustar según tu estructura)
function QuickLinks({ content }: { content: any }) {
  const linksData = content?.quicklinks || {};
  const links = linksData.items || [];
  if (!links.length) return null;
  return (
    <section className="bg-white py-10 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {links.map((link: any, idx: number) => (
            <Link
              key={idx}
              href={link.href}
              className="block border border-gray-200 p-6 hover:border-teal-500 transition-colors rounded-lg"
            >
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {link.title}
                </h3>
                <p className="text-gray-500 text-sm">{link.description}</p>
              </div>
              <span className="text-teal-600 text-xl">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Page() {
  const content = await getContent();
  return (
    <main className="bg-white text-gray-800">
      <Header />
      <HomeHero content={content} />
      <QuickStats content={content} />
      <DownloadSection />
      <ServicesPreview content={content} />
      <StudiesPreview content={content} />
      <ParticipatesCTA content={content} />
      <QuickLinks content={content} />
      <Newsletter />
      <Footer />
    </main>
  );
}