import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import About from '@/components/landing/About';
import MissionVision from '@/components/landing/MissionVision';
import Image from 'next/image';

export default function NosotrosPage() {
  return (
    <main className="bg-white">
      <Header />
      
      {/* Hero de la página */}
      <section className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/team-meeting.jpg"
            alt="Nuestro Equipo"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="text-teal-500 font-bold text-sm uppercase tracking-wider">
            Conócenos
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Quiénes Somos
          </h1>
          <p className="text-gray-300 mt-4 max-w-xl">
            Un equipo de profesionales comprometidos con la calidad 
            y la excelencia en investigación de mercados.
          </p>
        </div>
      </section>

      <About />
      <MissionVision />

      {/* Equipo */}
      <section className="bg-white py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
              Nuestro Equipo
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Profesionales Experimentados
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Director General', role: 'Dirección Estratégica' },
              { name: 'Director de Investigación', role: 'Metodología y Análisis' },
              { name: 'Director de Campo', role: 'Operaciones y Logística' },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">👤</span>
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
