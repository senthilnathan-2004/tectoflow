'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Review {
  _id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  rating: number;
  text: string;
}

interface ReviewsProps {
  reviews: Review[];
}

export default function Reviews({ reviews }: ReviewsProps) {
  const scrollReveal: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  if (!reviews || reviews.length === 0) return null;

  const doubledReviews = [...reviews, ...reviews];

  return (
    <section className="py-24 border-b border-border bg-bg md:min-h-screen md:flex md:items-center bg-grid-pattern relative overflow-hidden">
      {/* Premium minimal decorations */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="absolute top-10 left-8 md:left-12 text-[10px] font-mono tracking-[0.25em] text-text-secondary/40 select-none">// 06 REVIEWS</div>
      
      {/* Dashed vertical guidelines */}
      <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-border/40 pointer-events-none" />
      <div className="absolute right-8 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-border/40 pointer-events-none" />
      
      {/* Corner coordinate plus marks */}
      <div className="absolute top-6 left-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute top-6 right-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute bottom-6 left-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute bottom-6 right-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>

      {/* Decorative ambient glowing blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/5 blur-[120px] opacity-75 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-[120px] opacity-65 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 w-full relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={scrollReveal}
          className="text-center space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Trust & Feedback</span>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Client Testimonials</h2>
          <p className="text-sm text-text-secondary max-w-lg mx-auto font-medium">
            Hear from industry leaders and companies scaling with Tectoflow.
          </p>
        </motion.div>

        {/* Carousel container with overflow hidden */}
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
              duration: 30,
              repeat: Infinity,
            }}
          >
            {doubledReviews.map((review, i) => (
              <div
                key={`${review._id}-${i}`}
                className="group relative flex-shrink-0 w-[360px] h-[260px] rounded-2xl border border-border bg-surface/30 p-8 hover:border-primary/20 hover:shadow-lg transition duration-300 flex flex-col justify-between"
              >
                {/* Background Quote Motif */}
                <Quote className="absolute right-6 bottom-6 h-16 w-16 text-primary/5 -z-10" />

                <div className="space-y-4">
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={14}
                        fill={index < review.rating ? 'currentColor' : 'none'}
                        className={index < review.rating ? 'text-amber-400' : 'text-border'}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-text-secondary italic leading-relaxed font-medium line-clamp-4">
                    "{review.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-border/80 mt-4">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface border border-border/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={review.avatarUrl || '/placeholder-avatar.png'}
                      alt={review.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary text-sm leading-tight">{review.name}</h4>
                    <p className="text-xs text-text-secondary font-semibold mt-0.5">
                      {review.role} {review.company ? `@ ${review.company}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
