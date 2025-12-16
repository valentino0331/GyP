'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  // Usar basePath para evitar errores si NEXTAUTH_URL no está configurado
  return (
    <SessionProvider 
      basePath="/api/auth"
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
