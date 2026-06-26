'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PricingTier {
  _id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
  ctaLink: string;
}

interface PricingProps {
  tiers: PricingTier[];
}

export default function Pricing({ tiers }: PricingProps) {
  const scrollReveal: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  if (!tiers || tiers.length === 0) return null;

  return (
    <section id="pricing" className="py-24 border-b border-border bg-bg/50 md:min-h-screen md:flex md:items-center bg-grid-pattern relative overflow-hidden">
      {/* Premium minimal decorations */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="absolute top-10 left-8 md:left-12 text-[10px] font-mono tracking-[0.25em] text-text-secondary/40 select-none">// 07 PRICING</div>
      
      {/* Dashed vertical guidelines */}
      <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-border/40 pointer-events-none" />
      <div className="absolute right-8 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-border/40 pointer-events-none" />
      
      {/* Corner coordinate plus marks */}
      <div className="absolute top-6 left-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute top-6 right-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute bottom-6 left-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute bottom-6 right-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>

      {/* Decorative ambient glowing blobs */}
      <div className="absolute top-1/4 right-1/4 -z-10 h-[30rem] w-[30rem] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[160px] opacity-75 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-secondary/5 blur-[120px] opacity-65 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 w-full relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={scrollReveal}
          className="text-center space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Transparent Pricing</span>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Service Packages</h2>
          <p className="text-sm text-text-secondary max-w-lg mx-auto font-medium">
            Pick a tiered agency service plan optimized for your current scaling phase.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier._id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }
              }}
              className={`group flex flex-col justify-between rounded-2xl border p-8 shadow-sm hover:shadow-lg transition duration-300 relative ${
                tier.isPopular ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-surface/30'
              }`}
            >
              {tier.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#FF6B35] px-3.5 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-text-primary leading-tight">{tier.name}</h3>
                  <p className="text-xs text-text-secondary mt-1 font-medium">{tier.description}</p>
                </div>

                <div className="flex items-baseline text-text-primary">
                  <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                  <span className="ml-1 text-sm text-text-secondary font-medium">{tier.period}</span>
                </div>

                <ul className="space-y-3 border-t border-border/80 pt-6">
                  {tier.features?.map((feat, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm text-text-secondary font-medium">
                      <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 border-t border-border/60 mt-8">
                <Link
                  href={tier.ctaLink || '#contact'}
                  className={`block w-full text-center rounded-lg py-3 text-sm font-semibold transition ${
                    tier.isPopular
                      ? 'bg-primary text-white hover:bg-primary/95 shadow-md'
                      : 'border border-border bg-surface/50 text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`}
                >
                  {tier.ctaText || 'Get Started'}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
