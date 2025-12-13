'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { useParams, useRouter } from 'next/navigation';
import { FaSpinner, FaCheck, FaArrowLeft, FaArrowRight, FaPaperPlane, FaUser } from 'react-icons/fa';

interface Option {
  id: string;
  text: string;
  displayOrder: number;
}

interface Question {
  id: string;
  text: string;
  type: 'text' | 'single_choice' | 'multiple_choice';
  displayOrder: number;
  options: Option[];
}

interface Survey {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  questions: Question[];
}

interface Answer {
  questionId: string;
  textValue?: string;
  selectedOptionId?: string;
  selectedOptionIds?: string[];
}

export default function ResponderEncuestaPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.id as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Paso -1 = pedir nombre, 0+ = preguntas
  const [currentStep, setCurrentStep] = useState(-1);
  const [participantName, setParticipantName] = useState('');
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  useEffect(() => {
    fetchSurvey();
  }, [surveyId]);

  const fetchSurvey = async () => {
    try {
      const res = await fetch(`/api/surveys/${surveyId}`);
      if (!res.ok) throw new Error('Encuesta no encontrada');
      const data = await res.json();
      
      if (!data.isActive) {
        setError('Esta encuesta no está disponible');
        return;
      }
      
      setSurvey(data);
      
      // Inicializar respuestas
      const initialAnswers: Record<string, Answer> = {};
      data.questions.forEach((q: Question) => {
        initialAnswers[q.id] = {
          questionId: q.id,
          textValue: '',
          selectedOptionId: undefined,
          selectedOptionIds: [],
        };
      });
      setAnswers(initialAnswers);
      
    } catch (err) {
      setError('No pudimos cargar la encuesta');
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        textValue: value,
      },
    }));
  };

  const handleSingleChoice = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOptionId: optionId,
      },
    }));
  };

  const handleMultipleChoice = (questionId: string, optionId: string, checked: boolean) => {
    setAnswers(prev => {
      const currentIds = prev[questionId]?.selectedOptionIds || [];
      const newIds = checked
        ? [...currentIds, optionId]
        : currentIds.filter(id => id !== optionId);
      
      return {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          selectedOptionIds: newIds,
        },
      };
    });
  };

  const isCurrentQuestionAnswered = () => {
    if (!survey) return false;
    const question = survey.questions[currentStep];
    const answer = answers[question.id];
    
    if (question.type === 'text') {
      return answer?.textValue?.trim() !== '';
    } else if (question.type === 'single_choice') {
      return !!answer?.selectedOptionId;
    } else if (question.type === 'multiple_choice') {
      return (answer?.selectedOptionIds?.length || 0) > 0;
    }
    return false;
  };

  const handleSubmit = async () => {
    if (!survey || !participantName.trim()) return;
    
    setSubmitting(true);
    setError('');

    try {
      const formattedAnswers = Object.values(answers).map(a => ({
        questionId: a.questionId,
        textValue: a.textValue || undefined,
        selectedOptionId: a.selectedOptionId || undefined,
        selectedOptionIds: a.selectedOptionIds?.length ? a.selectedOptionIds : undefined,
      }));

      const res = await fetch(`/api/surveys/${surveyId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers: formattedAnswers,
          participantName: participantName.trim()
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al enviar respuestas');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar la encuesta');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-4xl text-teal-600" />
        </div>
        <Footer />
      </main>
    );
  }

  if (error && !survey) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => router.push('/encuestas')}
            className="text-teal-600 underline hover:no-underline"
          >
            Volver a encuestas
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  if (success) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-4xl text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Gracias por participar!
            </h1>
            <p className="text-gray-600 mb-8">
              Tu respuesta ha sido registrada exitosamente. Tu opinión es muy valiosa para nosotros.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/encuestas')}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 transition-colors"
              >
                Ver más encuestas
              </button>
              <button
                onClick={() => router.push('/')}
                className="border border-gray-300 hover:border-teal-600 text-gray-700 hover:text-teal-600 font-bold py-3 px-6 transition-colors"
              >
                Ir al inicio
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!survey) return null;

  const totalQuestions = survey.questions.length;
  // Paso -1 es el nombre, pasos 0+ son las preguntas
  const totalSteps = totalQuestions + 1; // +1 por el paso del nombre
  const displayStep = currentStep + 2; // Para mostrar "Paso 1" cuando currentStep = -1
  const progress = (displayStep / totalSteps) * 100;

  // Pantalla para pedir el nombre del participante
  if (currentStep === -1) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            
            {/* Header de la encuesta */}
            <div className="mb-8">
              <button
                onClick={() => router.push('/encuestas')}
                className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-4 transition-colors"
              >
                <FaArrowLeft />
                Volver a encuestas
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
              {survey.description && (
                <p className="text-gray-600 mt-2">{survey.description}</p>
              )}
            </div>

            {/* Barra de progreso */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Paso 1 de {totalSteps}</span>
                <span>{Math.round(progress)}% completado</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Formulario de nombre */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-teal-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    ¿Cómo te llamas?
                  </h2>
                  <p className="text-gray-500 text-sm">Tu nombre nos ayuda a personalizar la experiencia</p>
                </div>
              </div>

              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-4 bg-white text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Escribe tu nombre aquí..."
                autoFocus
              />
            </div>

            {/* Navegación */}
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(0)}
                disabled={!participantName.trim()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  participantName.trim()
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Comenzar encuesta
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  const currentQuestion = survey.questions[currentStep];

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Header de la encuesta */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/encuestas')}
              className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-4 transition-colors"
            >
              <FaArrowLeft />
              Volver a encuestas
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
            {survey.description && (
              <p className="text-gray-600 mt-2">{survey.description}</p>
            )}
          </div>

          {/* Barra de progreso */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Pregunta {currentStep + 1} de {totalQuestions} (Paso {displayStep} de {totalSteps})</span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Pregunta actual */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {currentQuestion.text}
            </h2>

            {/* Pregunta de texto */}
            {currentQuestion.type === 'text' && (
              <textarea
                value={answers[currentQuestion.id]?.textValue || ''}
                onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-4 bg-white text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Escribe tu respuesta aquí..."
              />
            )}

            {/* Pregunta de opción única */}
            {currentQuestion.type === 'single_choice' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      answers[currentQuestion.id]?.selectedOptionId === option.id
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={answers[currentQuestion.id]?.selectedOptionId === option.id}
                      onChange={() => handleSingleChoice(currentQuestion.id, option.id)}
                      className="w-5 h-5 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-gray-700">{option.text}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Pregunta de opción múltiple */}
            {currentQuestion.type === 'multiple_choice' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-2">Puedes seleccionar múltiples opciones</p>
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id]?.selectedOptionIds?.includes(option.id);
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleMultipleChoice(currentQuestion.id, option.id, e.target.checked)}
                        className="w-5 h-5 text-teal-600 focus:ring-teal-500 rounded"
                      />
                      <span className="text-gray-700">{option.text}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Navegación */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(s => s - 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <FaArrowLeft />
              Anterior
            </button>

            {currentStep < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentStep(s => s + 1)}
                disabled={!isCurrentQuestionAnswered()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  isCurrentQuestionAnswered()
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Siguiente
                <FaArrowRight />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isCurrentQuestionAnswered() || submitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  isCurrentQuestionAnswered() && !submitting
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Enviar respuestas
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
