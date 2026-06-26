'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProcessStep {
  _id: string;
  number: number;
  title: string;
  description: string;
}

interface ProcessProps {
  steps: ProcessStep[];
}

export default function Process({ steps }: ProcessProps) {
  const scrollReveal: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  if (!steps || steps.length === 0) return null;

  const doubledSteps = [...steps, ...steps];

  return (
    <section id="process" className="py-24 border-b border-border bg-bg/50 relative overflow-hidden md:min-h-screen md:flex md:items-center bg-grid-pattern">
      {/* Premium minimal decorations */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="absolute top-10 left-8 md:left-12 text-[10px] font-mono tracking-[0.25em] text-text-secondary/40 select-none">// 02 PROCESS</div>
      
      {/* Dashed vertical guidelines */}
      <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-border/40 pointer-events-none" />
      <div className="absolute right-8 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-border/40 pointer-events-none" />
      
      {/* Corner coordinate plus marks */}
      <div className="absolute top-6 left-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute top-6 right-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute bottom-6 left-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute bottom-6 right-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>

      {/* Decorative ambient glowing blobs */}
      <div className="absolute top-1/3 right-1/4 -z-10 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px] opacity-75 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-secondary/5 blur-[120px] opacity-65 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 w-full relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={scrollReveal}
          className="text-center space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Execution Model</span>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">How We Work</h2>
          <p className="text-sm text-text-secondary max-w-lg mx-auto font-medium">
            Our step-by-step blueprint from discovery down to support, optimizing delivery velocity.
          </p>
        </motion.div>

        {/* Timeline Carousel container with overflow hidden within the max-w container */}
        <div className="relative overflow-hidden py-4">
          {/* Faders */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-8 pr-8 w-max"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              ease: "linear",
              duration: 25,
              repeat: Infinity,
            }}
          >
            {doubledSteps.map((step, i) => (
              <div
                key={`${step._id}-${i}`}
                className="group relative flex-shrink-0 w-[360px] h-[240px] rounded-2xl border border-border bg-surface/30 p-8 hover:border-primary/30 hover:shadow-lg transition duration-300 flex flex-col justify-between items-start text-left"
              >
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 font-extrabold text-base shadow-inner group-hover:scale-105 transition duration-300">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-text-primary text-lg leading-tight mb-2 tracking-tight group-hover:text-primary transition duration-200">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-medium line-clamp-3">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
