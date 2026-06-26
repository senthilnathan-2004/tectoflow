import React from 'react';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/db';
import { Project, SiteSettings } from '@/lib/models';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { ArrowUpRight, Home } from 'lucide-react';

export const revalidate = 0;

function toPlainObject(doc: any) {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc));
}

export default async function ProjectsPage() {
  await connectToDatabase();

  const [projectDocs, settingsDoc] = await Promise.all([
    Project.find().sort({ order: 1 }),
    SiteSettings.findOne(),
  ]);

  const projects = toPlainObject(projectDocs) || [];
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Case Studies</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">Our Selected Portfolio Work</h1>
            <p className="text-base text-text-secondary leading-relaxed font-medium">
              Explore how we design and deploy scalable digital applications for companies globally.
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

          {/* Grid */}
          {projects.length === 0 ? (
            <div className="text-center text-text-secondary font-medium py-12">
              No projects found.
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 items-stretch">
              {projects.map((project: any, i: number) => (
                <div
                  key={project._id}
                  className="group flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl border border-border bg-surface/30 hover:border-primary/20 hover:shadow-xl transition duration-300"
                >
                  <Link href={`/projects/${project.slug}`} className="block relative aspect-video w-full overflow-hidden bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.imageUrl || '/placeholder.png'}
                      alt={project.title}
                      className="h-full w-full object-cover group-hover:scale-102 transition duration-500"
                    />
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
                </div>
              ))}
            </div>
          )}
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
