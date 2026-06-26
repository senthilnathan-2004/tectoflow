import React from 'react';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/db';
import { Service, SiteSettings } from '@/lib/models';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { Globe, Shield, Search, Cpu, Palette, HelpCircle, ArrowRight, Home } from 'lucide-react';

export const revalidate = 0;

const iconsMap: { [key: string]: any } = {
  Globe,
  Shield,
  Search,
  Cpu,
  Palette,
};

function toPlainObject(doc: any) {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc));
}

export default async function ServicesPage() {
  await connectToDatabase();

  const [servicesDocs, settingsDoc] = await Promise.all([
    Service.find().sort({ order: 1 }),
    SiteSettings.findOne(),
  ]);

  const services = toPlainObject(servicesDocs) || [];
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
            <span className="text-xs font-bold uppercase tracking-wider text-primary">All Capabilities</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">Our Full Suite of Digital Services</h1>
            <p className="text-base text-text-secondary leading-relaxed font-medium">
              We design, build, optimize, and support robust enterprise digital platforms.
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
          {services.length === 0 ? (
            <div className="text-center text-text-secondary font-medium py-12">
              No services found.
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {services.map((service: any, i: number) => {
                const IconComponent = iconsMap[service.icon] || HelpCircle;
                return (
                  <div
                    key={service._id}
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
                  </div>
                );
              })}
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
