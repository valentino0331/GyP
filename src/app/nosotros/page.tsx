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

// Obtener miembros del equipo
async function getTeamMembers() {
  try {
    const result = await db.query(
      'SELECT * FROM team_members WHERE is_visible = true ORDER BY display_order'
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching team:', error);
    return [];
  }
}

export default async function NosotrosPage() {
  const content = await getContent();
  const teamMembers = await getTeamMembers();
  
  const aboutData = content?.about || {};
  const missionVisionData = content?.mission_vision || {};
  const pageData = content?.nosotros_page || {};
  
  // Valores por defecto
  const defaultTeam = [
    { name: 'Director General', position: 'Dirección Estratégica' },
    { name: 'Director de Investigación', position: 'Metodología y Análisis' },
    { name: 'Director de Campo', position: 'Operaciones y Logística' },
  ];
  
  const defaultValues = [
    { title: 'Rigor Metodológico', description: 'Aplicamos estándares de calidad en cada estudio' },
    { title: 'Confidencialidad', description: 'Protegemos la información de nuestros clientes' },
    { title: 'Objetividad', description: 'Resultados imparciales basados en datos' },
    { title: 'Innovación', description: 'Metodologías y tecnología de vanguardia' },
  ];

  return (
    <main className="bg-white">
      <Header />
      
      {/* Hero de la página */}
      <section className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src={pageData.heroImage || "/team-meeting.jpg"}
            alt="Nuestro Equipo"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="text-teal-500 font-bold text-sm uppercase tracking-wider">
            {pageData.heroSubtitle || 'Conócenos'}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
            {pageData.heroTitle || 'Quiénes Somos'}
          </h1>
          <p className="text-gray-300 mt-4 max-w-xl">
            {pageData.heroDescription || 'Un equipo de profesionales comprometidos con la calidad y la excelencia en investigación de mercados.'}
          </p>
        </div>
      </section>

      {/* Sección About */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
                {aboutData.subtitle || 'Sobre GyP'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                {aboutData.title || 'Consultoría e Investigación de Mercados'}
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {aboutData.description || 'GyP Consultoría es una empresa especializada en investigación de mercados y estudios de opinión. Proporcionamos información confiable para una verdadera comprensión de la sociedad, los mercados y las personas.'}
              </p>

              <p className="text-gray-600 leading-relaxed mb-8">
                {aboutData.description2 || 'Nuestro equipo de profesionales experimentados utiliza metodologías rigurosas y tecnología de vanguardia para entregar insights accionables que ayudan a nuestros clientes a tomar mejores decisiones.'}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                {(aboutData.stats || [
                  { value: '15+', label: 'Años de experiencia' },
                  { value: '50+', label: 'Clientes activos' },
                ]).slice(0, 2).map((stat: any, index: number) => (
                  <div key={index} className="border-l-4 border-teal-600 pl-4">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>

              <a
                href="/contacto"
                className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 transition-colors"
              >
                CONTÁCTENOS
              </a>
            </div>

            <div className="relative">
              <div className="relative h-[400px] lg:h-[500px] w-full">
                <Image
                  src={aboutData.image || "/hero-bg-2.jpg"}
                  alt="GyP Consultoría - Equipo de Investigación"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-teal-600 text-white p-6 hidden lg:block">
                <p className="text-3xl font-bold">
                  {aboutData.stats?.[2]?.value || '500+'}
                </p>
                <p className="text-sm">
                  {aboutData.stats?.[2]?.label || 'Estudios realizados'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 px-4">
        <div className="container mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Misión */}
            <div className="bg-teal-600 text-white p-10 md:p-14">
              <span className="text-teal-200 font-bold text-sm uppercase tracking-wider">
                {missionVisionData.mission?.subtitle || 'Nuestra Misión'}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-6">
                {missionVisionData.mission?.title || 'Generar conocimiento para mejores decisiones'}
              </h3>
              <p className="text-teal-100 leading-relaxed">
                {missionVisionData.mission?.description || 'Proporcionar información confiable y oportuna a través de investigaciones rigurosas, contribuyendo al desarrollo de organizaciones y la sociedad.'}
              </p>
            </div>

            {/* Visión */}
            <div className="bg-gray-900 text-white p-10 md:p-14">
              <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">
                {missionVisionData.vision?.subtitle || 'Nuestra Visión'}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-6">
                {missionVisionData.vision?.title || 'Ser referentes en investigación'}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {missionVisionData.vision?.description || 'Consolidarnos como la empresa líder en investigación de mercados y estudios de opinión, reconocida por la calidad y confiabilidad de nuestros estudios.'}
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
            {(missionVisionData.values || defaultValues).map((valor: any, index: number) => (
              <div
                key={index}
                className="border-t-4 border-teal-600 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-2">{valor.title || valor.titulo}</h4>
                <p className="text-gray-600 text-sm">{valor.description || valor.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="bg-white py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
              {pageData.teamSectionSubtitle || 'Nuestro Equipo'}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              {pageData.teamSectionTitle || 'Profesionales Experimentados'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {(teamMembers.length > 0 ? teamMembers : defaultTeam).map((member: any, index: number) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {member.photo_url ? (
                    <Image 
                      src={member.photo_url} 
                      alt={member.name} 
                      width={128} 
                      height={128} 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-4xl text-gray-400">👤</span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.position || member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
