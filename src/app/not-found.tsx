'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b0f19] px-4 text-center">
      <span className="text-8xl font-extrabold tracking-tight text-slate-800">404</span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Page Not Found</h1>
      <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex rounded-full bg-[#FF6B35] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#ff8557] transition shadow-md"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
