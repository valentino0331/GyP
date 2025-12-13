import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  const servicios = [
    { label: 'Encuestas', href: '/servicios' },
    { label: 'Sondeos de Opinión', href: '/servicios' },
    { label: 'Investigación de Mercados', href: '/servicios' },
    { label: 'Estudios Cualitativos', href: '/servicios' },
    { label: 'Focus Groups', href: '/servicios' },
  ];

  const empresa = [
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Estudios', href: '/estudios' },
    { label: 'Clientes', href: '/clientes' },
    { label: 'Contacto', href: '/contacto' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-10 h-10 bg-white rounded p-1">
                <Image src="/logo.png" alt="GyP Logo" fill className="object-contain" />
              </div>
              <div>
                <span className="text-lg font-bold">GyP</span>
                <span className="text-sm text-gray-400 block -mt-1">Consultoría</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Investigación de mercados y estudios de opinión. 
              Información confiable para mejores decisiones.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-gray-800 hover:bg-teal-600 p-2 transition-colors">
                <FaFacebook className="h-4 w-4" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-teal-600 p-2 transition-colors">
                <FaLinkedin className="h-4 w-4" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-teal-600 p-2 transition-colors">
                <FaTwitter className="h-4 w-4" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-teal-600 p-2 transition-colors">
                <FaInstagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Servicios</h4>
            <ul className="space-y-2">
              {servicios.map((servicio, index) => (
                <li key={index}>
                  <Link href={servicio.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {servicio.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Empresa</h4>
            <ul className="space-y-2">
              {empresa.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Lima, Perú</li>
              <li>+51 XXX XXX XXX</li>
              <li>contacto@gypconsultoria.com</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} GyP Consultoría. Todos los derechos reservados.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">Términos</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
