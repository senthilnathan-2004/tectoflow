'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  category: string;
  publishedAt: string;
}

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const scrollReveal: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  if (!posts || posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 border-b border-border bg-bg/50 md:min-h-screen md:flex md:items-center bg-grid-pattern relative overflow-hidden">
      {/* Premium minimal decorations */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="absolute top-10 left-8 md:left-12 text-[10px] font-mono tracking-[0.25em] text-text-secondary/40 select-none">// 09 LATEST NEWS</div>
      
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
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollReveal}
            className="space-y-3 max-w-lg"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Content Marketing</span>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Latest Articles</h2>
            <p className="text-sm text-text-secondary font-medium">
              Read our latest updates on framework speed, web design guidelines, and devops delivery.
            </p>
          </motion.div>

          {posts.length > 3 && (
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wider"
            >
              View all posts <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
            </Link>
          )}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {posts.slice(0, 3).map((post, i) => (
            <motion.div
              key={post._id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }
              }}
              className="group flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl border border-border bg-surface/30 hover:border-primary/20 hover:shadow-lg transition duration-300"
            >
              <div>
                <Link href={`/blog/${post.slug}`} className="block relative aspect-video w-full overflow-hidden bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImageUrl || '/placeholder.png'}
                    alt={post.title}
                    className="h-full w-full object-cover group-hover:scale-102 transition duration-500"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-sm">
                    {post.category}
                  </span>
                </Link>

                <div className="p-6 space-y-3">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition duration-200 line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed font-medium line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 mt-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group/btn inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wider"
                >
                  Read article <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
