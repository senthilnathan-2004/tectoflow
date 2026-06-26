'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Shield, Search, Cpu, Palette, HelpCircle, ArrowRight } from 'lucide-react';

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  icon: string;
}

interface ServicesProps {
  services: Service[];
}

const iconsMap: { [key: string]: any } = {
  Globe,
  Shield,
  Search,
  Cpu,
  Palette,
};

export default function Services({ services }: ServicesProps) {
  const scrollReveal: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section id="services" className="py-24 border-b border-border bg-bg md:min-h-screen md:flex md:items-center bg-grid-pattern relative overflow-hidden">
      {/* Premium minimal decorations */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="absolute top-10 left-8 md:left-12 text-[10px] font-mono tracking-[0.25em] text-text-secondary/40 select-none">// 01 SERVICES</div>
      
      {/* Dashed vertical guidelines */}
      <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-border/40 pointer-events-none" />
      <div className="absolute right-8 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-border/40 pointer-events-none" />
      
      {/* Corner coordinate plus marks */}
      <div className="absolute top-6 left-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute top-6 right-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute bottom-6 left-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute bottom-6 right-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>

      {/* Decorative ambient glowing blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px] opacity-75 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-[30rem] w-[30rem] translate-x-1/2 translate-y-1/2 rounded-full bg-secondary/5 blur-[160px] opacity-65 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 w-full relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={scrollReveal}
          className="text-center space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Capabilities</span>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Our Digital Services</h2>
          <p className="text-sm text-text-secondary max-w-lg mx-auto font-medium">
            Robust development, high-security operations, SEO-focused growth and dynamic brand designs.
          </p>
        </motion.div>

        {services.length === 0 ? (
          <div className="text-center text-text-secondary font-medium">
            No capabilities loaded yet. Please configure them in the admin dashboard.
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {services.slice(0, 3).map((service, i) => {
                const IconComponent = iconsMap[service.icon] || HelpCircle;
                return (
                  <motion.div
                    key={service._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }
                    }}
                    className="group flex flex-col justify-between h-full w-full rounded-xl border border-border bg-surface/30 p-8 hover:border-primary/20 hover:shadow-lg transition duration-300"
                  >
                    <div className="space-y-5">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition duration-300">
                        <IconComponent size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-text-primary leading-tight">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed font-medium">
                        {service.shortDescription}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-border/80">
                      <Link
                        href={`/services/${service.slug}`}
                        className="group/btn inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wider"
                      >
                        Learn more <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {services.length > 3 && (
              <div className="text-center pt-4">
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-6 py-3 text-xs font-bold text-text-primary hover:bg-surface hover:text-primary transition shadow-sm"
                >
                  See All Services <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
