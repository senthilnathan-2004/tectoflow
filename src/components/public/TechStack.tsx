'use client';

import React from 'react';
import { Cpu, Globe, Database, Shield, Zap, Sparkles } from 'lucide-react';

export default function TechStack() {
  const techs = [
    { name: 'Next.js', icon: Cpu },
    { name: 'MongoDB', icon: Database },
    { name: 'React', icon: Sparkles },
    { name: 'Tailwind CSS', icon: Globe },
    { name: 'Node.js', icon: Zap },
    { name: 'TypeScript', icon: Shield },
  ];

  return (
    <div className="border-y border-border bg-surface/30 py-8 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Technologies We Master
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {techs.map((tech, i) => {
              const Icon = tech.icon;
              return (
                <div key={i} className="flex items-center gap-2 text-text-secondary grayscale hover:grayscale-0 hover:text-primary transition duration-300">
                  <Icon size={18} className="text-primary" />
                  <span className="text-sm font-semibold tracking-tight">{tech.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
