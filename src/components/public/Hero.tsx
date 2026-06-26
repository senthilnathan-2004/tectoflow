'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  data: {
    headline: string;
    subheadline: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    imageUrl?: string;
    stats?: { label: string; value: string }[];
  };
}

export default function Hero({ data }: HeroProps) {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section
      className="relative overflow-hidden pt-36 pb-24 md:pt-48 md:pb-36 border-b border-border flex items-center justify-center min-h-[90vh] md:min-h-screen"
      style={
        data.imageUrl
          ? {
              backgroundImage: `url(${data.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'scroll',
            }
          : {}
      }
    >
      {data.imageUrl ? (
        <div className="absolute inset-0 bg-bg/30 backdrop-blur-[1px] transition-colors duration-300" />
      ) : (
        <>
          {/* Decorative ambient glowing blobs when no image is loaded */}
          <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] opacity-70" />
          <div className="absolute top-1/3 right-1/4 -z-10 h-[30rem] w-[30rem] translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/15 blur-[160px] opacity-60" />
        </>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="space-y-8"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex rounded-full bg-primary/15 px-4 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
              {data.subheadline || 'Next-Gen Agency'}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl leading-[1.1] max-w-3xl mx-auto"
          >
            {data.headline}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-lg text-text-secondary leading-relaxed font-semibold mx-auto"
          >
            {data.description}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <Link
              href={data.primaryCtaLink || '#contact'}
              className="group flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-primary/95 transition shadow-md"
            >
              {data.primaryCtaText || 'Get a Quote'}{' '}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
            </Link>
            <Link
              href={data.secondaryCtaLink || '#projects'}
              className="rounded-full border border-border bg-surface/50 px-6 py-3.5 text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-surface transition"
            >
              {data.secondaryCtaText || 'Our Work'}
            </Link>
          </motion.div>

          {/* Achievements row */}
          {data.stats && data.stats.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 border-t border-border/80 pt-8 mt-12 max-w-2xl mx-auto"
            >
              {data.stats.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-2xl font-extrabold text-text-primary sm:text-3xl">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-text-secondary font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
