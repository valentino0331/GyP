'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';
import { FaClipboardList, FaUsers, FaClock, FaArrowRight, FaSpinner } from 'react-icons/fa';

interface Survey {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  responseCount: number;
}

export default function EncuestasPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const res = await fetch('/api/surveys?active=true');
      if (!res.ok) throw new Error('Error al cargar encuestas');
      const data = await res.json();
      setSurveys(data);
    } catch (err) {
      setError('No pudimos cargar las encuestas. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-16 px-4">
        <div className="container mx-auto text-center">
          <FaClipboardList className="text-5xl text-white/80 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Encuestas Disponibles
          </h1>
          <p className="text-teal-100 max-w-2xl mx-auto">
            Tu opinión es importante. Participa en nuestras encuestas y ayúdanos 
            a generar información valiosa para la toma de decisiones.
          </p>
        </div>
      </section>

      {/* Lista de encuestas */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          
          {loading && (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando encuestas...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchSurveys}
                className="mt-4 text-red-700 underline hover:no-underline"
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && surveys.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FaClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-700 mb-2">
                No hay encuestas disponibles
              </h2>
              <p className="text-gray-500">
                En este momento no hay encuestas activas. Vuelve pronto.
              </p>
            </div>
          )}

          {!loading && !error && surveys.length > 0 && (
            <div className="space-y-4">
              {surveys.map((survey) => (
                <div 
                  key={survey.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          {survey.title}
                        </h2>
                        {survey.description && (
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {survey.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaUsers className="text-teal-600" />
                            {survey.responseCount} participantes
                          </span>
                          <span className="flex items-center gap-1">
                            <FaClock className="text-teal-600" />
                            {formatDate(survey.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <Link
                        href={`/encuestas/${survey.id}`}
                        className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 transition-colors group"
                      >
                        Participar
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info adicional */}
          <div className="mt-12 bg-teal-50 rounded-lg p-6">
            <h3 className="font-bold text-teal-800 mb-2">¿Por qué participar?</h3>
            <ul className="text-teal-700 space-y-2 text-sm">
              <li>✓ Tus respuestas son anónimas y confidenciales</li>
              <li>✓ Contribuyes a estudios de importancia nacional</li>
              <li>✓ Ayudas a empresas e instituciones a tomar mejores decisiones</li>
              <li>✓ Participas en sorteos y beneficios exclusivos</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
