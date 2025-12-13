'use client';

import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de suscripción
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="bg-gray-900 py-12 px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">
              Mantente Informado
            </h3>
            <p className="text-gray-400">
              Recibe nuestros últimos estudios e insights directamente en tu correo.
            </p>
          </div>

          {subscribed ? (
            <div className="bg-green-600 text-white px-6 py-3 font-medium">
              ¡Gracias por suscribirte!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                required
                className="flex-1 md:w-64 px-4 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 transition-colors whitespace-nowrap"
              >
                SUSCRIBIRSE
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
