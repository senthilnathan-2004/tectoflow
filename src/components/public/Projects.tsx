'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  imageUrl: string;
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const scrollReveal: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section id="projects" className="py-24 border-b border-border bg-bg/50 md:min-h-screen md:flex md:items-center bg-grid-pattern relative overflow-hidden">
      {/* Premium minimal decorations */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="absolute top-10 left-8 md:left-12 text-[10px] font-mono tracking-[0.25em] text-text-secondary/40 select-none">// 05 PORTFOLIO</div>
      
      {/* Dashed vertical guidelines */}
      <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-border/40 pointer-events-none" />
      <div className="absolute right-8 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-border/40 pointer-events-none" />
      
      {/* Corner coordinate plus marks */}
      <div className="absolute top-6 left-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute top-6 right-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute bottom-6 left-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute bottom-6 right-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>

      {/* Decorative ambient glowing blobs */}
      <div className="absolute top-1/4 right-1/4 -z-10 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px] opacity-75 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-secondary/5 blur-[120px] opacity-65 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 w-full relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollReveal}
            className="space-y-3 max-w-lg"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Case Studies</span>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Selected Work</h2>
            <p className="text-sm text-text-secondary font-medium">
              Explore how we design and deploy scalable digital applications for global companies.
            </p>
          </motion.div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center text-text-secondary font-medium py-8">
            No portfolio projects added yet. Please configure them in the admin dashboard.
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid gap-8 sm:grid-cols-2 items-stretch">
              {projects.slice(0, 2).map((project, i) => (
                <motion.div
                  key={project._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.15 }}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }
                  }}
                  className="group flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl border border-border bg-surface/30 hover:border-primary/20 hover:shadow-xl transition duration-300"
                >
                  <Link href={`/projects/${project.slug}`} className="block relative aspect-video w-full overflow-hidden bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.imageUrl || '/placeholder.png'}
                      alt={project.title}
                      className="h-full w-full object-cover group-hover:scale-102 transition duration-500"
                    />
                    {/* Category Pill Overlay */}
                    <span className="absolute left-4 top-4 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {project.category}
                    </span>
                  </Link>

                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition duration-200">
                          <Link href={`/projects/${project.slug}`}>
                            {project.title}
                          </Link>
                        </h3>
                        <Link
                          href={`/projects/${project.slug}`}
                          className="text-text-secondary group-hover:text-primary transition"
                        >
                          <ArrowUpRight size={20} />
                        </Link>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed font-medium line-clamp-3">
                        {project.shortDescription}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {projects.length > 2 && (
              <div className="text-center pt-4">
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-6 py-3 text-xs font-bold text-text-primary hover:bg-surface hover:text-primary transition shadow-sm"
                >
                  See All Projects <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
