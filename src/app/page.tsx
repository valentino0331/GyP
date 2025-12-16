import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Newsletter from '@/components/landing/Newsletter';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// Forzar renderizado dinámico para evitar errores de build
export const dynamic = 'force-dynamic';

// Componente Hero simplificado para home
function HomeHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/team-meeting.jpg"
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
            Investigación de Mercados
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Información confiable para mejores decisiones
          </h1>
          
          <p className="text-lg text-gray-200 mb-8 leading-relaxed">
            Encuestas, sondeos de opinión e investigación de mercados 
            para comprender a la sociedad, los mercados y las personas.
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
function QuickStats() {
  const stats = [
    { value: '500+', label: 'Estudios' },
    { value: '50+', label: 'Clientes' },
    { value: '10K+', label: 'Encuestas' },
    { value: '15+', label: 'Años' },
  ];

  return (
    <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-10 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
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

// Servicios resumidos con links
function ServicesPreview() {
  const services = [
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

  return (
    <section className="bg-white py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
            Servicios
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Soluciones de Investigación
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {services.map((service, index) => (
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
function StudiesPreview() {
  return (
    <section className="bg-gray-100 py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-80">
            <Image
              src="/charts-screen.jpg"
              alt="Estudios y Resultados"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
              Publicaciones
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              Estudios Recientes
            </h2>
            <p className="text-gray-600 mb-6">
              Explora nuestros últimos estudios e investigaciones. 
              Datos actualizados sobre opinión pública, comportamiento 
              del consumidor y tendencias de mercado.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center">
                <span className="text-teal-600 font-bold text-2xl mr-3">72%</span>
                <span className="text-gray-600">prefiere marcas con propósito</span>
              </div>
              <div className="flex items-center">
                <span className="text-teal-600 font-bold text-2xl mr-3">45%</span>
                <span className="text-gray-600">incremento en compras online</span>
              </div>
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
function ParticipatesCTA() {
  return (
    <section className="bg-gray-900 py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-teal-500 font-bold text-sm uppercase tracking-wider">
              Únete a nosotros
            </span>
            <h2 className="text-3xl font-bold text-white mt-2 mb-4">
              ¿Quieres participar en nuestras encuestas?
            </h2>
            <p className="text-gray-400 mb-6">
              Únete a nuestro panel de encuestados y contribuye con tu opinión 
              a la toma de decisiones importantes en el Perú.
            </p>
            <Link 
              href="/encuestas" 
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 transition-colors"
            >
              PARTICIPAR AHORA
            </Link>
          </div>
          <div className="relative h-64">
            <Image
              src="/survey-people.jpg"
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

// Links rápidos
function QuickLinks() {
  const links = [
    { title: 'Nosotros', description: 'Conoce nuestra historia y equipo', href: '/nosotros' },
    { title: 'Clientes', description: 'Empresas que confían en nosotros', href: '/clientes' },
    { title: 'Contacto', description: 'Solicita una cotización', href: '/contacto' },
  ];

  return (
    <section className="bg-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {links.map((link, index) => (
            <Link 
              key={index} 
              href={link.href}
              className="flex items-center justify-between p-6 border border-gray-200 hover:border-teal-500 group transition-colors"
            >
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
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

export default function Home() {
  return (
    <main className="bg-white text-gray-800">
      <Header />
      <HomeHero />
      <QuickStats />
      <ServicesPreview />
      <StudiesPreview />
      <ParticipatesCTA />
      <QuickLinks />
      <Newsletter />
      <Footer />
    </main>
  );
}
