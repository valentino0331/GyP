'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/servicios', label: 'Servicios' },
    { href: '/estudios', label: 'Estudios' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/clientes', label: 'Clientes' },
    { href: '/contacto', label: 'Contacto' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="GyP Logo" fill className="object-contain" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-gray-900">GyP</span>
              <span className="text-sm text-gray-500 block -mt-1">Consultoría</span>
            </div>
          </Link>
          
          {/* Navegación Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-gray-700 hover:text-teal-600 font-medium text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Botón Participar - Va directo a encuestas */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/encuestas" 
              className="hidden sm:block bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-2 px-5 transition-colors"
            >
              PARTICIPAR
            </Link>
            
            {/* Menú móvil */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 p-2"
            >
              {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-teal-600 hover:bg-gray-50 font-medium py-3 px-4 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                href="/encuestas" 
                onClick={() => setIsMenuOpen(false)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 mt-2 text-center"
              >
                PARTICIPAR
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
