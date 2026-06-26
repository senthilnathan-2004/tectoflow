'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Github, Linkedin, Twitter } from '@/components/SocialIcons';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

interface AboutProps {
  about: {
    mission: string;
    storyTitle: string;
    storyText: string;
    storyImageUrl?: string;
    stats?: { label: string; value: string }[];
  };
  team: TeamMember[];
}

export default function About({ about, team }: AboutProps) {
  const scrollReveal: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <>
      <section id="about" className="py-24 border-b border-border bg-bg md:min-h-screen md:flex md:items-center bg-grid-pattern relative overflow-hidden">
        {/* Premium minimal decorations */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <div className="absolute top-10 left-8 md:left-12 text-[10px] font-mono tracking-[0.25em] text-text-secondary/40 select-none">// 03 ABOUT STORY</div>
        
        {/* Dashed vertical guidelines */}
        <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-border/40 pointer-events-none" />
        <div className="absolute right-8 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-border/40 pointer-events-none" />
        
        {/* Corner coordinate plus marks */}
        <div className="absolute top-6 left-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
        <div className="absolute top-6 right-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
        <div className="absolute bottom-6 left-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
        <div className="absolute bottom-6 right-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>

        {/* Decorative ambient glowing blobs */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/5 blur-[160px] opacity-75 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-[120px] opacity-65 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24 w-full relative z-10">
        {/* Mission Banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={scrollReveal}
          className="text-center max-w-4xl mx-auto space-y-4"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Our Mission</span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary leading-relaxed">
            "{about.mission || 'To empower organizations with robust, modern, and high-performance digital ecosystems.'}"
          </h2>
        </motion.div>

        {/* Story Section */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollReveal}
            className="space-y-6"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Agency Story</span>
            <h3 className="text-3xl font-bold tracking-tight text-text-primary">{about.storyTitle}</h3>
            <p className="text-text-secondary leading-relaxed font-medium text-base whitespace-pre-line">
              {about.storyText}
            </p>

            {/* In-section stats summary */}
            {about.stats && about.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border/80">
                {about.stats.map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-3xl font-extrabold text-text-primary">{stat.value}</p>
                    <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollReveal}
            className="flex justify-center"
          >
            {about.storyImageUrl ? (
              <div className="relative overflow-hidden rounded-2xl border border-border/80 shadow-xl w-full max-w-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={about.storyImageUrl}
                  alt="Tectoflow HQ"
                  className="h-[360px] w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-[360px] w-full max-w-md items-center justify-center rounded-2xl border border-border border-dashed bg-surface/30">
                <p className="text-xs text-text-secondary font-medium">Upload story illustration in admin panel.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>

    {team && team.length > 0 && (
      <section id="team" className="py-24 border-b border-border bg-bg/50 md:min-h-screen md:flex md:items-center bg-grid-pattern relative overflow-hidden">
        {/* Premium minimal decorations */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <div className="absolute top-10 left-8 md:left-12 text-[10px] font-mono tracking-[0.25em] text-text-secondary/40 select-none">// 04 THE TEAM</div>
        
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

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 w-full relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={scrollReveal}
              className="text-center space-y-3"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Founders & Minds</span>
              <h3 className="text-3xl font-bold tracking-tight text-text-primary">Meet Our Team</h3>
              <p className="text-sm text-text-secondary max-w-xl mx-auto font-medium">
                A structured group of digital experts committed to pushing architectural boundaries.
              </p>
            </motion.div>

            <div className="space-y-12">
              <div className="grid gap-8 lg:grid-cols-2 items-stretch">
                {team.slice(0, 2).map((member, i) => (
                  <motion.div
                    key={member._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }
                    }}
                    className="group bg-surface/30 rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-stretch w-full"
                  >
                    {/* Photo */}
                    <div className="relative w-full md:w-2/5 aspect-[4/5] bg-surface shrink-0 overflow-hidden">
                      {member.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-5xl">
                          {member.name.charAt(0) || "T"}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-8 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-bold text-lg sm:text-xl text-text-primary mb-1">{member.name}</h3>
                        <p className="text-primary font-medium text-xs sm:text-sm mb-3">{member.role}</p>
                        {member.bio && (
                          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6 line-clamp-4">
                            {member.bio}
                          </p>
                        )}
                      </div>

                      {member.socialLinks && (
                        <div className="flex gap-3 justify-start pt-4 border-t border-border/80 mt-4">
                          {member.socialLinks.github && (
                            <a href={member.socialLinks.github} target="_blank" className="text-text-secondary hover:text-text-primary transition">
                              <Github size={16} />
                            </a>
                          )}
                          {member.socialLinks.linkedin && (
                            <a href={member.socialLinks.linkedin} target="_blank" className="text-text-secondary hover:text-text-primary transition">
                              <Linkedin size={16} />
                            </a>
                          )}
                          {member.socialLinks.twitter && (
                            <a href={member.socialLinks.twitter} target="_blank" className="text-text-secondary hover:text-text-primary transition">
                              <Twitter size={16} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {team.length > 2 && (
                <div className="text-center pt-4">
                  <Link
                    href="/about"
                    className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-6 py-3 text-xs font-bold text-text-primary hover:bg-surface hover:text-primary transition shadow-sm"
                  >
                    See All Team <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
