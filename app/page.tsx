'use client'

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Welcome to SetIA</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Your intelligent data management solution</p>

        {!user ? (
          <a
            className="rounded-full bg-blue-600 text-white px-6 py-3 text-lg font-semibold hover:bg-blue-700 transition-colors"
            href="/api/auth/login"
          >
            Login
          </a>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Image
              src={user.picture ?? "https://via.placeholder.com/100"}
              alt={user.name ?? "User"}
              width={100}
              height={100}
              className="rounded-full"
            />
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">Welcome, {user.name}!</p>
            <a
              className="rounded-full bg-red-600 text-white px-6 py-3 text-lg font-semibold hover:bg-red-700 transition-colors"
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