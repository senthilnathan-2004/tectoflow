import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import { Service, SiteSettings } from '@/lib/models';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import CtaBanner from '@/components/public/CtaBanner';
import { Globe, Shield, Search, Cpu, Palette, HelpCircle, ArrowLeft, Check } from 'lucide-react';

export const revalidate = 0;

const iconsMap: Record<string, any> = {
  Globe,
  Shield,
  Search,
  Cpu,
  Palette,
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();

  const [serviceDoc, settingsDoc] = await Promise.all([
    Service.findOne({ slug: slug }),
    SiteSettings.findOne(),
  ]);

  if (!serviceDoc) {
    notFound();
  }

  const service = JSON.parse(JSON.stringify(serviceDoc));
  const settings = JSON.parse(JSON.stringify(settingsDoc)) || {
    siteName: 'Tectoflow',
    logoUrl: '',
    contactEmail: 'hello@tectoflow.com',
  };

  const IconComponent = iconsMap[service.icon] || HelpCircle;

  // Static list of included features as sub-items for polish
  const defaultFeaturesMap: Record<string, string[]> = {
    'web-development': [
      'Custom React/Next.js Architecture',
      'Fully Responsive UI Layout design',
      'Search Engine Optimized Content Rendering',
      'API Integrations & Custom Databases',
      'Secure Authentication and Form Processing'
    ],
    'security': [
      'Vulnerability & Penetration Testing audits',
      'SSL/TLS Configuration and Encryption Checks',
      'Secure Cookie & JWT Authentication setup',
      'Rate-limiting & DDoS Prevention configuration',
      'Database injection shielding'
    ],
    'seo': [
      'Keywords & Performance auditing',
      'Meta tags & dynamic Schema configuration',
      'Google Lighthouse Optimization checks',
      'Dynamic Sitemap & robots.txt output',
      'Backlink profile strategy'
    ],
    'deployment': [
      'AWS / Vercel cloud architecture',
      'Docker container configurations',
      'Github Actions CI/CD pipelines',
      'Load Balancer setup & health checks',
      'Dynamic SSL configuration & CDN setups'
    ],
    'design': [
      'Figma wireframes & component styles',
      'Responsive mobile & desktop prototypes',
      'Theme customization with CSS variables',
      'Micro-animations & transitions guides',
      'Accessibility contrast checks'
    ]
  };

  const features = defaultFeaturesMap[service.slug] || [
    'Fully Managed custom features',
    'Responsive mobile layouts',
    'Vetted high speed codebases',
    'Production ready security profiles',
    'Ongoing support & SLA guides'
  ];

  return (
    <>
      <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />
      
      <main className="pt-28 pb-16 bg-bg flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb & Go Back */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            <Link href="/" className="hover:text-primary transition">Home</Link>
            <span>/</span>
            <Link href="/#services" className="hover:text-primary transition">Services</Link>
            <span>/</span>
            <span className="text-text-primary">{service.title}</span>
          </div>

          <div className="space-y-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IconComponent size={32} />
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
              {service.title}
            </h1>
            
            <p className="text-lg text-text-secondary leading-relaxed font-medium">
              {service.shortDescription}
            </p>
          </div>

          {/* Core Content */}
          <div className="border-t border-border pt-10 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-8 space-y-6">
              <h2 className="text-2xl font-bold text-text-primary">Overview</h2>
              <div className="text-sm text-text-secondary leading-relaxed font-medium whitespace-pre-line space-y-4">
                {service.fullDescription || 'Our agency co-designs and ships premium digital capabilities tailored for your exact scaling phase.'}
              </div>
            </div>

            <div className="md:col-span-4 space-y-6 bg-surface/30 rounded-2xl border border-border p-6 shadow-sm h-fit">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary border-b border-border pb-3">
                What's Included
              </h3>
              
              <ul className="space-y-3">
                {features.map((feat, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-text-secondary font-medium leading-relaxed">
                    <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
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
