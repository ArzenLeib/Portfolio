'use client'

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 dark:bg-gray-900">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="head_gradient">SetIA</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Manejo Inteligente de Datos</p>

        {!user ? (
          <a
            className="rounded-full button_gradient transition-colors"
            href="/api/auth/login"
          >
            Login
          </a>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <img src={user.picture ?? ""} className='w-24 h-24'  alt=""/>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">Bienvenido, {user.name}!</p>
            <a
              className="rounded-full button_gradient transition-colors"
              href="/api/auth/logout"
            >
              Logout
            </a>
          </div>
        )}
      </main>

      <footer className="mt-16 text-sm text-gray-500 dark:text-gray-400">
        © 2024 SetIA. Coloquio Redes.
      </footer>
    </div>
  );
}