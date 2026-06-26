'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

interface WhatsAppFloatProps {
  number?: string;
}

export default function WhatsAppFloat({ number }: WhatsAppFloatProps) {
  if (!number) return null;

  // Clean the number (remove non-digits)
  const cleanNumber = number.replace(/\D/g, '');
  if (!cleanNumber) return null;

  const url = `https://wa.me/${cleanNumber}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all duration-300"
      title="Contact us on WhatsApp"
    >
      <MessageSquare size={24} className="fill-white/10" />
    </a>
  );
}
