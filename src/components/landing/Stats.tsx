'use client';

import React, { useState, useEffect, useRef } from 'react';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: StatItem[] = [
  { value: 500, suffix: '+', label: 'Estudios Realizados', description: 'Investigaciones completadas con éxito' },
  { value: 10, suffix: 'K+', label: 'Encuestas Aplicadas', description: 'Recolección de datos a nivel nacional' },
  { value: 98, suffix: '%', label: 'Satisfacción', description: 'Clientes que nos recomiendan' },
  { value: 15, suffix: '+', label: 'Años de Experiencia', description: 'Trayectoria en el mercado peruano' },
];

function AnimatedCounter({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isVisible, value, duration]);

  return (
    <div ref={ref} className="text-5xl md:text-6xl font-bold text-white">
      {count}{suffix}
    </div>
  );
}

export default function Stats() {
  return (
    <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-white font-bold text-lg mt-2">{stat.label}</p>
              <p className="text-teal-100 text-sm mt-1">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
