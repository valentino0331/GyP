'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaLock, FaEnvelope, FaSpinner, FaArrowLeft } from 'react-icons/fa';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Si ya está autenticado como admin, redirigir a /admin
  useEffect(() => {
    if (status === 'authenticated' && (session?.user as any)?.role === 'admin') {
      router.replace('/admin');
    }
  }, [session, status, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Credenciales inválidas. Verifica tu email y contraseña.');
      } else if (result?.ok) {
        router.replace('/admin');
      }
    } catch {
      setError('Error de conexión. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar spinner mientras carga la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Imagen */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative">
        <Image
          src="/hero-bg.jpg"
          alt="GyP Consultoría"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-12">
          <div className="relative w-16 h-16 mb-6">
            <Image src="/logo.png" alt="GyP Logo" fill className="object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Panel Administrativo
          </h1>
          <p className="text-gray-300 text-lg">
            Acceso exclusivo para administradores de GyP Consultoría.
            Gestiona encuestas, usuarios y reportes.
          </p>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="relative w-12 h-12 mr-3">
              <Image src="/logo.png" alt="GyP Logo" fill className="object-contain" />
            </div>
            <span className="text-2xl font-bold text-gray-900">GyP Consultoría</span>
          </div>

          {/* Volver al inicio */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-6 transition-colors"
          >
            <FaArrowLeft />
            Volver al inicio
          </Link>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                <FaLock className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Acceso Admin</h2>
                <p className="text-gray-500 text-sm">Solo administradores</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'INGRESAR'
                )}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              Este acceso es solo para personal autorizado de GyP Consultoría.
            </p>
          </div>

          {/* Enlace a encuestas públicas */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              ¿Buscas participar en encuestas?
            </p>
            <Link 
              href="/encuestas"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Ver encuestas disponibles →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
