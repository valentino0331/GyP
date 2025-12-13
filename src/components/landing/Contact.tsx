import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Contact() {
  return (
    <section id="contacto" className="bg-white py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div>
            <span className="text-teal-600 font-bold text-sm uppercase tracking-wider">
              Contacto
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
              ¿Necesita realizar un estudio?
            </h2>
            <p className="text-gray-600 mb-8">
              Contáctenos para discutir sus necesidades de investigación. 
              Nuestro equipo está listo para ayudarle a obtener la información 
              que necesita para tomar mejores decisiones.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-teal-600 p-3 text-white">
                  <FaPhone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Teléfono</p>
                  <p className="text-gray-600">+51 XXX XXX XXX</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-teal-600 p-3 text-white">
                  <FaEnvelope className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Email</p>
                  <p className="text-gray-600">contacto@gypconsultoria.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-teal-600 p-3 text-white">
                  <FaMapMarkerAlt className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Ubicación</p>
                  <p className="text-gray-600">Lima, Perú</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Envíenos un mensaje
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="w-full px-4 py-3 border border-gray-300 focus:border-teal-600 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Empresa"
                  className="w-full px-4 py-3 border border-gray-300 focus:border-teal-600 focus:outline-none transition-colors"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 focus:border-teal-600 focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Asunto"
                className="w-full px-4 py-3 border border-gray-300 focus:border-teal-600 focus:outline-none transition-colors"
              />
              <textarea
                placeholder="Cuéntenos sobre su proyecto de investigación..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 focus:border-teal-600 focus:outline-none transition-colors resize-none"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 transition-colors"
              >
                ENVIAR MENSAJE
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
