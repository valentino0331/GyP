'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  {
    tag: 'ENCUESTA NACIONAL',
    title: 'Percepción ciudadana sobre gestión pública 2025',
    description: 'Nuevo estudio revela las opiniones de los peruanos sobre el desempeño del gobierno.',
    cta: 'LEER ESTUDIO',
    image: '/hero-bg.jpg',
  },
  {
    tag: 'INVESTIGACIÓN DE MERCADO',
    title: 'Tendencias de consumo digital en el Perú',
    description: 'Análisis profundo sobre los cambios en el comportamiento del consumidor peruano.',
    cta: 'VER RESULTADOS',
    image: '/hero-bg-2.jpg',
  },
  {
    tag: 'SONDEO DE OPINIÓN',
    title: 'Índice de confianza empresarial Q4 2025',
    description: 'Medición trimestral sobre expectativas de líderes empresariales.',
    cta: 'CONOCER MÁS',
    image: '/hero-bg.jpg',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="inicio" className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Slides de fondo */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30"></div>
        </div>
      ))}

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-2xl">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                index === currentSlide 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4 absolute'
              }`}
            >
              {index === currentSlide && (
                <>
                  <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 mb-6">
                    {slide.tag}
                  </span>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                    {slide.title}
                  </h1>
                  
                  <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                    {slide.description}
                  </p>
                  
                  <a
                    href="#servicios"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 transition-colors"
                  >
                    {slide.cta}
                  </a>
                </>
              )}
            </div>
          ))}

          {/* Indicadores del slider */}
          <div className="flex gap-2 mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1 transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-12 bg-red-600' 
                    : 'w-6 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
            <div className="py-6 px-4 text-center">
              <p className="text-3xl font-bold text-gray-900">500+</p>
              <p className="text-gray-500 text-sm">Estudios realizados</p>
            </div>
            <div className="py-6 px-4 text-center">
              <p className="text-3xl font-bold text-gray-900">50+</p>
              <p className="text-gray-500 text-sm">Clientes activos</p>
            </div>
            <div className="py-6 px-4 text-center hidden md:block">
              <p className="text-3xl font-bold text-gray-900">10K+</p>
              <p className="text-gray-500 text-sm">Encuestas aplicadas</p>
            </div>
            <div className="py-6 px-4 text-center hidden md:block">
              <p className="text-3xl font-bold text-gray-900">15+</p>
              <p className="text-gray-500 text-sm">Años de experiencia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
