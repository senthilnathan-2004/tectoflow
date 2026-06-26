import React from 'react';
import PageLoader from '@/components/public/PageLoader';
import { connectToDatabase } from '@/lib/db';
import {
  HeroContent,
  AboutContent,
  TeamMember,
  ProcessStep,
  Service,
  Project,
  Review,
  PricingTier,
  FaqItem,
  BlogPost,
  SiteSettings,
} from '@/lib/models';
import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import Services from '@/components/public/Services';
import About from '@/components/public/About';
import Process from '@/components/public/Process';
import Projects from '@/components/public/Projects';
import Reviews from '@/components/public/Reviews';
import Pricing from '@/components/public/Pricing';
import FAQ from '@/components/public/FAQ';
import BlogSection from '@/components/public/BlogSection';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';
import WhatsAppFloat from '@/components/public/WhatsAppFloat';

import { seedDatabase } from '@/lib/seed';

// Ensure data is freshly fetched on every page load
export const revalidate = 0;

// Helper to convert Mongoose documents to plain objects (removes _id and circular/non-serializable types)
function toPlainObject(doc: any) {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc));
}

export default async function Home() {
  await connectToDatabase();
  await seedDatabase();

  // Fetch all CMS content in parallel
  const [
    heroDoc,
    aboutDoc,
    teamDocs,
    processDocs,
    serviceDocs,
    projectDocs,
    reviewDocs,
    pricingDocs,
    faqDocs,
    blogDocs,
    settingsDoc,
  ] = await Promise.all([
    HeroContent.findOne(),
    AboutContent.findOne(),
    TeamMember.find().sort({ order: 1 }),
    ProcessStep.find().sort({ order: 1 }),
    Service.find().sort({ order: 1 }),
    Project.find().sort({ order: 1 }),
    Review.find().sort({ order: 1 }),
    PricingTier.find().sort({ order: 1 }),
    FaqItem.find().sort({ order: 1 }),
    BlogPost.find().sort({ createdAt: -1 }),
    SiteSettings.findOne(),
  ]);

  const siteSettings = toPlainObject(settingsDoc) || {
    siteName: 'Tectoflow',
    logoUrl: '',
    contactEmail: 'hello@tectoflow.com',
    whatsappNumber: '',
    socialLinks: { facebook: '', twitter: '', linkedin: '', instagram: '', github: '' },
  };

  const heroData = toPlainObject(heroDoc) || {
    headline: 'We craft digital flows that scale your business',
    subheadline: 'Next-Gen Digital Agency',
    description: 'We specialize in Web Development, Cybersecurity, SEO, DevOps/Deployment, and UI/UX Design.',
    primaryCtaText: 'Get a Quote',
    primaryCtaLink: '#contact',
    secondaryCtaText: 'Our Work',
    secondaryCtaLink: '#projects',
    imageUrl: '',
    stats: [
      { label: 'Completed Projects', value: '150+' },
      { label: 'Satisfaction Rating', value: '98%' },
      { label: 'Active Engineers', value: '25+' }
    ],
  };

  const aboutData = toPlainObject(aboutDoc) || {
    mission: 'To empower organizations with robust, modern, and high-performance digital ecosystems.',
    storyTitle: 'Our Journey',
    storyText: 'Founded with a vision to merge aesthetic excellence with technical rigidity, Tectoflow has grown into a multi-disciplinary powerhouse.',
    storyImageUrl: '',
    stats: [
      { label: 'Years Active', value: '6+' },
      { label: 'Countries Served', value: '12+' }
    ],
  };

  const team = toPlainObject(teamDocs) || [];
  const steps = toPlainObject(processDocs) || [];
  const services = toPlainObject(serviceDocs) || [];
  const projects = toPlainObject(projectDocs) || [];
  const reviews = toPlainObject(reviewDocs) || [];
  const pricing = toPlainObject(pricingDocs) || [];
  const faqs = toPlainObject(faqDocs) || [];
  const posts = toPlainObject(blogDocs) || [];

  return (
    <PageLoader>
      <Navbar siteName={siteSettings.siteName} logoUrl={siteSettings.logoUrl} />
      <main className="relative flex-1">
        <Hero data={heroData} />
        <Services services={services} />
        <Process steps={steps} />
        <About about={aboutData} team={team} />
        <Projects projects={projects} />
        <Reviews reviews={reviews} />
        <Pricing tiers={pricing} />
        <FAQ faqs={faqs} />
        <BlogSection posts={posts} />
        <Contact settings={siteSettings} />
      </main>
      <Footer
        siteName={siteSettings.siteName}
        logoUrl={siteSettings.logoUrl}
        contactEmail={siteSettings.contactEmail}
        socialLinks={siteSettings.socialLinks}
      />
      <WhatsAppFloat number={siteSettings.whatsappNumber} />
    </PageLoader>
  );
}
