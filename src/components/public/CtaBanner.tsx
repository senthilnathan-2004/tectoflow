'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="py-20 border-b border-border bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
          Ready to scale your digital presence?
        </h2>
        <p className="text-sm text-text-secondary max-w-xl mx-auto font-medium leading-relaxed">
          Let's co-design, deploy, and secure your high-performance software application.
        </p>
        <div className="pt-2">
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/95 transition shadow-md"
          >
            Get Started Today <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>
    </section>
  );
}
