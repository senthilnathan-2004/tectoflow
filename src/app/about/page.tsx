import React from 'react';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/db';
import { AboutContent, TeamMember, SiteSettings } from '@/lib/models';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { Github, Linkedin, Twitter } from '@/components/SocialIcons';
import { ArrowRight, Home } from 'lucide-react';

export const revalidate = 0;

function toPlainObject(doc: any) {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc));
}

export default async function AboutPage() {
  await connectToDatabase();

  const [aboutDoc, teamDocs, settingsDoc] = await Promise.all([
    AboutContent.findOne(),
    TeamMember.find().sort({ order: 1 }),
    SiteSettings.findOne(),
  ]);

  const about = toPlainObject(aboutDoc) || {
    mission: 'To empower organizations with robust, modern, and high-performance digital ecosystems.',
    storyTitle: 'Our Journey',
    storyText: 'Founded with a vision to merge aesthetic excellence with technical rigidity, Tectoflow has grown into a powerhouse.',
    storyImageUrl: '',
    stats: [],
  };
  const team = toPlainObject(teamDocs) || [];
  const siteSettings = toPlainObject(settingsDoc) || {
    siteName: 'Tectoflow',
    logoUrl: '',
    contactEmail: 'hello@tectoflow.com',
    socialLinks: { facebook: '', twitter: '', linkedin: '', instagram: '', github: '' },
  };

  return (
    <>
      <Navbar siteName={siteSettings.siteName} logoUrl={siteSettings.logoUrl} />
      <main className="relative flex-1 pt-32 pb-24 bg-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">About Tectoflow</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">Meet Our Entire Team</h1>
            <p className="text-base text-text-secondary leading-relaxed font-medium">
              We are a team of passionate engineers, designers, and consultants building future-proof digital solutions.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary transition uppercase tracking-wider"
              >
                <Home size={14} /> Back to Home
              </Link>
            </div>
          </div>

          {/* Story / Mission */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center border-b border-border/80 pb-16">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Our Mission & Story</span>
              <h3 className="text-2xl font-bold tracking-tight text-text-primary">{about.storyTitle}</h3>
              <p className="text-text-secondary leading-relaxed font-medium text-sm whitespace-pre-line">
                {about.storyText}
              </p>
              {about.stats && about.stats.length > 0 && (
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border/80">
                  {about.stats.map((stat: any, i: number) => (
                    <div key={i} className="space-y-1">
                      <p className="text-3xl font-extrabold text-text-primary">{stat.value}</p>
                      <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-center">
              {about.storyImageUrl ? (
                <div className="relative overflow-hidden rounded-2xl border border-border/80 shadow-xl w-full max-w-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={about.storyImageUrl}
                    alt="Tectoflow HQ"
                    className="h-[320px] w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-[320px] w-full max-w-md items-center justify-center rounded-2xl border border-border border-dashed bg-surface/30">
                  <p className="text-xs text-text-secondary font-medium">Tectoflow HQ</p>
                </div>
              )}
            </div>
          </div>

          {/* Full Team Grid */}
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Founders & Minds</span>
              <h2 className="text-3xl font-bold tracking-tight text-text-primary">Our Specialists</h2>
            </div>

            {team.length === 0 ? (
              <div className="text-center text-text-secondary font-medium py-12">
                No team members found.
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch">
                {team.map((member: any, i: number) => (
                  <div
                    key={member._id}
                    className="group h-full w-full rounded-xl border border-border bg-surface/40 p-4 hover:border-primary/20 hover:shadow-lg transition flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="aspect-square w-full rounded-lg bg-surface overflow-hidden border border-border/60">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.imageUrl || '/placeholder-avatar.png'}
                          alt={member.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-primary text-base leading-tight">{member.name}</h4>
                        <p className="text-xs text-primary font-bold mt-0.5">{member.role}</p>
                        {member.bio && (
                          <p className="text-xs text-text-secondary mt-2 line-clamp-3 leading-relaxed font-medium">
                            {member.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {member.socialLinks && (
                      <div className="flex gap-3 justify-end pt-3 border-t border-border/80 mt-4">
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
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer
        siteName={siteSettings.siteName}
        contactEmail={siteSettings.contactEmail}
        socialLinks={siteSettings.socialLinks}
      />
    </>
  );
}
