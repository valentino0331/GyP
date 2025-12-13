'use client';

import React, { useState, useEffect, useRef } from 'react';

// Datos de ejemplo para los gráficos
const satisfactionData = [
  { label: 'Muy Satisfecho', value: 65, color: 'bg-green-500' },
  { label: 'Satisfecho', value: 25, color: 'bg-blue-500' },
  { label: 'Neutral', value: 7, color: 'bg-yellow-500' },
  { label: 'Insatisfecho', value: 3, color: 'bg-red-500' },
];

const trendData = [
  { month: 'Ene', value: 65 },
  { month: 'Feb', value: 72 },
  { month: 'Mar', value: 68 },
  { month: 'Abr', value: 78 },
  { month: 'May', value: 82 },
  { month: 'Jun', value: 75 },
  { month: 'Jul', value: 88 },
  { month: 'Ago', value: 85 },
  { month: 'Sep', value: 90 },
  { month: 'Oct', value: 87 },
  { month: 'Nov', value: 92 },
  { month: 'Dic', value: 95 },
];

const sectorData = [
  { sector: 'Retail', value: 28 },
  { sector: 'Servicios', value: 24 },
  { sector: 'Financiero', value: 18 },
  { sector: 'Consumo', value: 15 },
  { sector: 'Tecnología', value: 10 },
  { sector: 'Otros', value: 5 },
];

function AnimatedBar({ value, color, delay = 0 }: { value: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(value), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} className="h-8 bg-gray-200 rounded-sm overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-1000 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function TrendChart() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const maxValue = Math.max(...trendData.map(d => d.value));

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

  return (
    <div ref={ref} className="h-48 flex items-end justify-between gap-1">
      {trendData.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div className="w-full flex-1 flex items-end">
            <div
              className="w-full bg-teal-500 hover:bg-teal-600 transition-all duration-500 ease-out rounded-t-sm"
              style={{
                height: isVisible ? `${(item.value / maxValue) * 100}%` : '0%',
                transitionDelay: `${index * 50}ms`,
              }}
            />
          </div>
          <span className="text-xs text-gray-500 mt-2">{item.month}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart() {
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

  // Calcular ángulos para el donut
  let currentAngle = 0;
  const segments = sectorData.map((item, index) => {
    const angle = (item.value / 100) * 360;
    const segment = {
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: ['#0d9488', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6', '#6b7280'][index],
    };
    currentAngle += angle;
    return segment;
  });

  return (
    <div ref={ref} className="flex items-center justify-center gap-8">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {segments.map((segment, index) => {
            const startAngle = (segment.startAngle * Math.PI) / 180;
            const endAngle = (segment.endAngle * Math.PI) / 180;
            const largeArc = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
            
            const x1 = 50 + 40 * Math.cos(startAngle);
            const y1 = 50 + 40 * Math.sin(startAngle);
            const x2 = 50 + 40 * Math.cos(endAngle);
            const y2 = 50 + 40 * Math.sin(endAngle);

            return (
              <path
                key={index}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={segment.color}
                className="transition-all duration-1000"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${index * 100}ms`,
                }}
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">100%</span>
        </div>
      </div>
      <div className="space-y-2">
        {sectorData.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: ['#0d9488', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6', '#6b7280'][index] }}
            />
            <span className="text-gray-600">{item.sector}</span>
            <span className="font-bold text-gray-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Charts() {
  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
            Datos en Acción
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Resultados que Hablan
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Visualiza el impacto de nuestras investigaciones a través de datos reales 
            y métricas que demuestran la calidad de nuestro trabajo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfico de Satisfacción */}
          <div className="bg-white p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-1">Satisfacción del Cliente</h3>
            <p className="text-gray-500 text-sm mb-6">Resultados del último estudio</p>
            <div className="space-y-4">
              {satisfactionData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-bold text-gray-900">{item.value}%</span>
                  </div>
                  <AnimatedBar value={item.value} color={item.color} delay={index * 150} />
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico de Tendencia */}
          <div className="bg-white p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-1">Índice de Confianza</h3>
            <p className="text-gray-500 text-sm mb-6">Evolución mensual 2025</p>
            <TrendChart />
          </div>

          {/* Gráfico Donut */}
          <div className="bg-white p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-1">Estudios por Sector</h3>
            <p className="text-gray-500 text-sm mb-6">Distribución de clientes</p>
            <DonutChart />
          </div>
        </div>
      </div>
    </section>
  );
}
