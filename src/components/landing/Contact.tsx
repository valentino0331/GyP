'use client';

import React, { useState, useCallback } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaSpinner, FaCheckCircle, FaExclamationCircle, FaCalendarAlt } from 'react-icons/fa';
import { 
  validateRequired, 
  validateEmail, 
  validatePhone, 
  validateDate,
  validateMinLength,
  validateOnlyLetters,
  validateContactForm,
  type ContactFormData 
} from '@/lib/validations';

interface FormErrors {
  nombre?: string;
  empresa?: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  asunto?: string;
  mensaje?: string;
}

export default function Contact() {
  // Estado del formulario
  const [formData, setFormData] = useState<ContactFormData>({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    asunto: '',
    mensaje: ''
  });

  // Estado de errores de validación
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Maneja cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Para el teléfono, solo permitir números
    if (name === 'telefono') {
      const cleanValue = value.replace(/\D/g, '').slice(0, 9);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
    } 
    // Para la fecha, formatear automáticamente
    else if (name === 'fechaNacimiento') {
      let cleanValue = value.replace(/\D/g, '');
      if (cleanValue.length >= 2) {
        cleanValue = cleanValue.slice(0, 2) + '/' + cleanValue.slice(2);
      }
      if (cleanValue.length >= 5) {
        cleanValue = cleanValue.slice(0, 5) + '/' + cleanValue.slice(5);
      }
      cleanValue = cleanValue.slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpiar error del campo cuando el usuario escribe
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Valida un campo individual al perder foco
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    let result;
    switch (name) {
      case 'nombre':
        result = validateRequired(value, 'nombre');
        if (result.isValid) {
          result = validateOnlyLetters(value, 'nombre');
          if (result.isValid) {
            result = validateMinLength(value, 2, 'nombre');
          }
        }
        break;
      case 'empresa':
        result = validateRequired(value, 'empresa');
        if (result.isValid) {
          result = validateMinLength(value, 2, 'empresa');
        }
        break;
      case 'email':
        result = validateEmail(value);
        break;
      case 'telefono':
        result = validatePhone(value);
        break;
      case 'fechaNacimiento':
        result = validateDate(value);
        break;
      case 'asunto':
        result = validateRequired(value, 'asunto');
        if (result.isValid) {
          result = validateMinLength(value, 5, 'asunto');
        }
        break;
      case 'mensaje':
        result = validateRequired(value, 'mensaje');
        if (result.isValid) {
          result = validateMinLength(value, 10, 'mensaje');
        }
        break;
    }

    if (result && !result.isValid) {
      setErrors(prev => ({ ...prev, [name]: result.error }));
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    // Marcar todos los campos como tocados
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    // Validar todo el formulario
    const validation = validateContactForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        throw new Error(data.error || 'Error al enviar el mensaje');
      }

      setSubmitSuccess(true);
      // Limpiar formulario
      setFormData({
        nombre: '',
        empresa: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        asunto: '',
        mensaje: ''
      });
      setTouched({});
      setErrors({});

    } catch (error: any) {
      setSubmitError(error.message || 'Error al enviar el mensaje. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función renderizadora de campo con error
  const renderInputField = (
    name: keyof ContactFormData,
    placeholder: string,
    options?: {
      type?: string;
      maxLength?: number;
      icon?: React.ReactNode;
    }
  ) => {
    const { type = 'text', maxLength: maxLen, icon } = options || {};
    
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxLength={maxLen}
          required
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
          className={`w-full px-4 py-3 border transition-colors focus:outline-none ${
            icon ? 'pl-10' : ''
          } ${
            errors[name] && touched[name]
              ? 'border-red-500 bg-red-50 focus:border-red-500'
              : 'border-gray-300 focus:border-teal-600'
          }`}
        />
        {errors[name] && touched[name] && (
          <div id={`${name}-error`} className="flex items-center gap-1 mt-1 text-red-600 text-sm">
            <FaExclamationCircle className="w-3 h-3" />
            {errors[name]}
          </div>
        )}
      </div>
    );
  };

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

            {/* Indicadores de validación */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-3">Requisitos del formulario:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Todos los campos son obligatorios</li>
                <li>• Teléfono: exactamente 9 dígitos</li>
                <li>• Fecha: formato dd/mm/yyyy (año entre 1900 y {new Date().getFullYear()})</li>
                <li>• Email: formato válido</li>
              </ul>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Envíenos un mensaje
            </h3>

            {/* Mensaje de éxito */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg flex items-center gap-3">
                <FaCheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.</span>
              </div>
            )}

            {/* Mensaje de error general */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center gap-3">
                <FaExclamationCircle className="w-5 h-5 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInputField('nombre', 'Nombre completo *', { maxLength: 100 })}
                {renderInputField('empresa', 'Empresa *', { maxLength: 100 })}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInputField('email', 'Email *', { 
                  type: 'email', 
                  icon: <FaEnvelope className="w-4 h-4" /> 
                })}
                {renderInputField('telefono', 'Teléfono (9 dígitos) *', { 
                  maxLength: 9,
                  icon: <FaPhone className="w-4 h-4" />
                })}
              </div>

              {renderInputField('fechaNacimiento', 'Fecha de nacimiento (dd/mm/yyyy) *', {
                maxLength: 10,
                icon: <FaCalendarAlt className="w-4 h-4" />
              })}

              {renderInputField('asunto', 'Asunto *', { maxLength: 200 })}
              
              {/* Campo de mensaje (textarea) */}
              <div className="relative">
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Cuéntenos sobre su proyecto de investigación... *"
                  rows={4}
                  maxLength={1000}
                  required
                  aria-invalid={!!errors.mensaje}
                  aria-describedby={errors.mensaje ? 'mensaje-error' : undefined}
                  className={`w-full px-4 py-3 border transition-colors focus:outline-none resize-none ${
                    errors.mensaje && touched.mensaje
                      ? 'border-red-500 bg-red-50 focus:border-red-500'
                      : 'border-gray-300 focus:border-teal-600'
                  }`}
                ></textarea>
                <div className="flex justify-between items-center mt-1">
                  {errors.mensaje && touched.mensaje ? (
                    <div id="mensaje-error" className="flex items-center gap-1 text-red-600 text-sm">
                      <FaExclamationCircle className="w-3 h-3" />
                      {errors.mensaje}
                    </div>
                  ) : (
                    <span></span>
                  )}
                  <span className="text-xs text-gray-500">
                    {formData.mensaje.length}/1000 caracteres
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold py-3 px-6 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'ENVIAR MENSAJE'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                * Campos obligatorios
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
