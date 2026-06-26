import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import { Project, SiteSettings } from '@/lib/models';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import CtaBanner from '@/components/public/CtaBanner';
import { ArrowLeft, ExternalLink, Calendar, Tag, Layers } from 'lucide-react';

export const revalidate = 0;

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();

  const [projectDoc, settingsDoc] = await Promise.all([
    Project.findOne({ slug: slug }),
    SiteSettings.findOne(),
  ]);

  if (!projectDoc) {
    notFound();
  }

  const project = JSON.parse(JSON.stringify(projectDoc));
  const settings = JSON.parse(JSON.stringify(settingsDoc)) || {
    siteName: 'Tectoflow',
    logoUrl: '',
    contactEmail: 'hello@tectoflow.com',
  };

  return (
    <>
      <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />

      <main className="pt-28 pb-16 bg-bg flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb & Go Back */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            <Link href="/" className="hover:text-primary transition">Home</Link>
            <span>/</span>
            <Link href="/#projects" className="hover:text-primary transition">Projects</Link>
            <span>/</span>
            <span className="text-text-primary">{project.title}</span>
          </div>

          {/* Hero Image */}
          {project.imageUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.imageUrl}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Title & Metadata Headers */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-border pb-6">
            <div className="space-y-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                {project.category}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
                {project.title}
              </h1>
            </div>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary/95 transition shadow-sm w-fit"
              >
                Visit Live Site <ExternalLink size={14} />
              </a>
            )}
          </div>

          {/* Case Study Details Columns */}
          <div className="grid gap-10 md:grid-cols-12">
            {/* Main Narrative */}
            <div className="md:col-span-8 space-y-6">
              <h2 className="text-xl font-bold text-text-primary">Case Study Overview</h2>
              <p className="text-base text-text-secondary leading-relaxed font-semibold">
                {project.shortDescription}
              </p>
              <div className="text-sm text-text-secondary leading-relaxed font-medium whitespace-pre-line space-y-4">
                {project.longDescription || 'This project showcase describes how Tectoflow co-designed and launched a high-performance software application.'}
              </div>
            </div>

            {/* Sidebar Meta */}
            <div className="md:col-span-4 space-y-6 bg-surface/30 rounded-2xl border border-border p-6 shadow-sm h-fit">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary border-b border-border pb-3">
                Project Details
              </h3>

              <div className="space-y-4">
                {/* Category */}
                <div className="flex items-start gap-3">
                  <Tag size={16} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Service Used</h4>
                    <p className="text-xs font-semibold text-text-primary mt-0.5">{project.category}</p>
                  </div>
                </div>

                {/* Tech Stack tags */}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Layers size={16} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Tech Stack</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.map((tech: string) => (
                          <span key={tech} className="rounded bg-surface px-2 py-0.5 text-[10px] text-text-secondary border border-border font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <CtaBanner />
        </div>
      </main>

      <Footer
        siteName={settings.siteName}
        contactEmail={settings.contactEmail}
        socialLinks={settings.socialLinks}
      />
    </>
  );
}
