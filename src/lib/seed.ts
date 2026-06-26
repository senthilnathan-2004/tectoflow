import { connectToDatabase } from './db';
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
} from './models';

export async function seedDatabase() {
  await connectToDatabase();

  // 1. Check if Service has any documents, if not, perform seeding
  const serviceCount = await Service.countDocuments();
  if (serviceCount > 0) {
    console.log('Database already has data. Skipping seed.');
    return;
  }

  console.log('Seeding database with premium mock data...');

  // Site Settings
  await SiteSettings.deleteMany({});
  await SiteSettings.create({
    siteName: 'Tectoflow',
    logoUrl: '',
    defaultTheme: 'brand',
    whatsappNumber: '1234567890',
    contactEmail: 'hello@tectoflow.com',
    contactPhone: '+1 (555) 019-2834',
    contactAddress: '100 Pine Street, San Francisco, CA 94111',
    socialLinks: {
      facebook: 'https://facebook.com/tectoflow',
      twitter: 'https://twitter.com/tectoflow',
      linkedin: 'https://linkedin.com/company/tectoflow',
      instagram: 'https://instagram.com/tectoflow',
      github: 'https://github.com/tectoflow',
    },
  });

  // Hero Content
  await HeroContent.deleteMany({});
  await HeroContent.create({
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
      { label: 'Active Engineers', value: '25+' },
    ],
  });

  // About Content
  await AboutContent.deleteMany({});
  await AboutContent.create({
    mission: 'To empower organizations with robust, modern, and high-performance digital ecosystems.',
    storyTitle: 'Our Journey',
    storyText: 'Founded with a vision to merge aesthetic excellence with technical rigidity, Tectoflow has grown into a multi-disciplinary powerhouse. We work closely with our partners to ensure clean code, rapid deployments, and reliable security.',
    storyImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    stats: [
      { label: 'Years Active', value: '6+' },
      { label: 'Countries Served', value: '12+' },
    ],
  });

  // Services
  await Service.deleteMany({});
  await Service.create([
    {
      title: 'Web Development',
      slug: 'web-development',
      shortDescription: 'We build high-performance React and Next.js web applications with outstanding user experience and SEO optimization.',
      fullDescription: 'Custom React & Next.js applications featuring serverless architectures, responsive layouts, dynamic API routing, and high lighthouse performance.',
      icon: 'Globe',
      order: 1,
    },
    {
      title: 'Cybersecurity',
      slug: 'cybersecurity',
      shortDescription: 'Enterprise-grade penetration testing, zero-trust configurations, secure authentication protocols, and encryption standard audits.',
      fullDescription: 'We build end-to-end data security structures, OAuth integrations, zero-trust authentication protocols, and regular penetration testing runs.',
      icon: 'Shield',
      order: 2,
    },
    {
      title: 'SEO & Growth Marketing',
      slug: 'seo',
      shortDescription: 'Increase your organic traffic through meticulous technical audits, core web vitals speed optimization, and search rankings.',
      fullDescription: 'Enhance your indexation velocity, clean up schema markup, analyze keyword competition, and boost core web vitals values.',
      icon: 'Search',
      order: 3,
    },
    {
      title: 'DevOps & Deployment',
      slug: 'devops',
      shortDescription: 'Automated CI/CD workflows, secure Kubernetes orchestrations, auto-scaling server configurations, and multi-region deployment.',
      fullDescription: 'We design GitOps delivery patterns, Docker configurations, infrastructure-as-code scripts, and high availability systems.',
      icon: 'Cpu',
      order: 4,
    },
    {
      title: 'UI/UX Brand Design',
      slug: 'ui-ux-design',
      shortDescription: 'High-fidelity wireframes, interactive user flows, comprehensive design systems, and beautiful micro-animations.',
      fullDescription: 'We design gorgeous responsive interfaces, construct layout prototypes, outline user persona flows, and assemble unified styles.',
      icon: 'Palette',
      order: 5,
    },
  ]);

  // Projects
  await Project.deleteMany({});
  await Project.create([
    {
      title: 'Aether Finance Dashboard',
      slug: 'aether-finance',
      category: 'Web Development',
      shortDescription: 'A high-speed DeFi analytics platform built with Next.js and Tailwind, offering real-time token tracking and responsive chart UI.',
      longDescription: 'A comprehensive financial dashboard that visualizes crypto holdings and real-time market data across multiple chains.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      techStack: ['Next.js', 'TypeScript', 'TailwindCSS', 'Recharts'],
      liveUrl: 'https://aether.tectoflow.com',
      order: 1,
    },
    {
      title: 'Sentinel Vault Storage',
      slug: 'sentinel-vault',
      category: 'Cybersecurity',
      shortDescription: 'Zero-trust cloud storage framework employing WebAuthn physical security keys, client-side encryption, and activity audits.',
      longDescription: 'Secure storage workspace offering military-grade client-side encryption and granular file permission governance panels.',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      techStack: ['React', 'WebAuthn', 'Node.js', 'MongoDB'],
      liveUrl: 'https://sentinel.tectoflow.com',
      order: 2,
    },
    {
      title: 'OmniSearch Technical SEO',
      slug: 'omnisearch-seo',
      category: 'SEO',
      shortDescription: 'Refactored server rendering structure and site indexing maps for an e-commerce giant, boosting organic visits by 300%.',
      longDescription: 'Technical SEO overhaul resulting in faster indexing times, higher keyword rankings, and enhanced mobile search experiences.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      techStack: ['Next.js', 'Google Search Console', 'Screaming Frog'],
      liveUrl: 'https://omnisearch.tectoflow.com',
      order: 3,
    },
    {
      title: 'KubeFlow GitOps Delivery',
      slug: 'kubeflow-cd',
      category: 'DevOps',
      shortDescription: 'Designed a fully automated Kubernetes deployment pipeline with ArgoCD, decreasing cycle lead time by 90% across services.',
      longDescription: 'Automated infrastructure delivery workflow built to manage staging, testing, and production rollover deployments safely.',
      imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80',
      techStack: ['Kubernetes', 'ArgoCD', 'Terraform', 'GitHub Actions'],
      liveUrl: 'https://kubeflow.tectoflow.com',
      order: 4,
    },
  ]);

  // Team Members
  await TeamMember.deleteMany({});
  await TeamMember.create([
    {
      name: 'Sarah Connor',
      role: 'CEO & Co-founder',
      bio: 'Leading agency growth and client partnerships with 10+ years of project management and development background.',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      socialLinks: {
        github: 'https://github.com/sarahconnor',
        linkedin: 'https://linkedin.com/in/sarahconnor',
        twitter: 'https://twitter.com/sarahconnor',
      },
      order: 1,
    },
    {
      name: 'David Chen',
      role: 'Lead System Architect',
      bio: 'Ex-Google software engineer specializing in container orchestration, microservices topology, and systems optimization.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      socialLinks: {
        github: 'https://github.com/davidchen',
        linkedin: 'https://linkedin.com/in/davidchen',
        twitter: 'https://twitter.com/davidchen',
      },
      order: 2,
    },
    {
      name: 'Elena Rostova',
      role: 'Head of UI/UX',
      bio: 'Creating smooth, accessible, and high-fidelity design languages. Highly focused on interactions and motion design.',
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      socialLinks: {
        github: 'https://github.com/elenarostova',
        linkedin: 'https://linkedin.com/in/elenarostova',
        twitter: 'https://twitter.com/elenarostova',
      },
      order: 3,
    },
  ]);

  // Process Steps
  await ProcessStep.deleteMany({});
  await ProcessStep.create([
    {
      number: 1,
      title: 'Discovery',
      description: 'We align on project specifications, product user flows, and clear baseline metrics.',
      order: 1,
    },
    {
      number: 2,
      title: 'Architecture',
      description: 'Our engineers construct database schemas, cluster topologies, and interactive designs.',
      order: 2,
    },
    {
      number: 3,
      title: 'Development',
      description: 'We code components with strong type checks, CI/CD validations, and full testing suites.',
      order: 3,
    },
    {
      number: 4,
      title: 'Audit',
      description: 'Comprehensive vulnerability scans, page latency reports, and quality checks.',
      order: 4,
    },
    {
      number: 5,
      title: 'Launch',
      description: 'Zero-downtime deployment to secure multi-region cloud infrastructures.',
      order: 5,
    },
  ]);

  // Reviews
  await Review.deleteMany({});
  await Review.create([
    {
      name: 'Marcus Aurelius',
      role: 'Chief Technology Officer',
      company: 'Meditation App',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      text: 'Tectoflow completely refactored our deployment process. Deployment times went down to seconds, and stability is flawless.',
      order: 1,
    },
    {
      name: 'Ada Lovelace',
      role: 'Director of Engineering',
      company: 'Analytical Engine Co',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      text: 'The Next.js web application built by Tectoflow is beautiful, extremely fast, and passes all web accessibility audits.',
      order: 2,
    },
    {
      name: 'Nikola Tesla',
      role: 'Founder',
      company: 'Alternating Labs',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      text: 'Their cybersecurity review uncovered critical entry points that we patched before launch. A reliable engineering partner.',
      order: 3,
    },
  ]);

  // Pricing Tiers
  await PricingTier.deleteMany({});
  await PricingTier.create([
    {
      name: 'Startup Plan',
      price: '$1,499',
      period: '/month',
      description: 'Essential engineering resource for fast-moving early stage products.',
      features: ['Single React/Next.js app', 'Technical SEO setup', 'Standard cloud deployment', 'Slack channel communication'],
      isPopular: false,
      ctaText: 'Get Started',
      ctaLink: '#contact',
      order: 1,
    },
    {
      name: 'Growth Plan',
      price: '$3,499',
      period: '/month',
      description: 'Full-scale multi-disciplinary development and continuous security updates.',
      features: ['Dynamic Next.js apps & databases', 'Advanced SEO & indexing velocity', 'DevOps orchestration (K8s)', 'Penetration audits & security patches', 'Dedicated technical lead support'],
      isPopular: true,
      ctaText: 'Choose Growth',
      ctaLink: '#contact',
      order: 2,
    },
    {
      name: 'Enterprise Plan',
      price: 'Custom',
      period: '/month',
      description: 'Bespoke engineering teams built for complex infrastructure demands.',
      features: ['Multi-region cluster topology', 'Compliance-ready auditing', 'Bespoke web & mobile apps', '24/7 incident response SLA', 'Unlimited support seating'],
      isPopular: false,
      ctaText: 'Contact Us',
      ctaLink: '#contact',
      order: 3,
    },
  ]);

  // FAQ Items
  await FaqItem.deleteMany({});
  await FaqItem.create([
    {
      question: 'What technologies do you specialize in?',
      answer: 'We build predominantly with React, Next.js, Node.js, and TypeScript, deploying on AWS, Google Cloud, and Vercel.',
      order: 1,
    },
    {
      question: 'How long does a typical project take?',
      answer: 'Simple landing pages and single-page apps deploy in 2-4 weeks. Complex enterprise dashboards, database integrations, and multi-service migrations typically range from 2-3 months.',
      order: 2,
    },
    {
      question: 'Do you offer post-launch maintenance?',
      answer: 'Yes, we provide monthly SLAs covering software dependency updates, continuous security monitoring, cloud health checks, and minor feature additions.',
      order: 3,
    },
    {
      question: 'How do we communicate during development?',
      answer: 'We set up dedicated Slack channels for async talk, schedule weekly video calls, and provide staging environment deployments for transparency.',
      order: 4,
    },
  ]);

  // Blog Posts
  await BlogPost.deleteMany({});
  await BlogPost.create([
    {
      title: 'The Future of Next.js 16 Development',
      slug: 'future-nextjs-16',
      excerpt: 'Next-gen static routing, server action concurrency, and advanced bundle optimization pipelines for zero-latency web application layouts.',
      content: '<p>Next.js 16 introduces powerful improvements to server rendering speeds, bundle chunk splitting, and data caching structures.</p>',
      coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      category: 'Development',
      authorName: 'Tectoflow Team',
      publishedAt: new Date(),
    },
    {
      title: 'Hardening Kubernetes Clusters for Production',
      slug: 'hardening-kubernetes',
      excerpt: 'Essential checklists for securing Docker daemons, configuring namespace policies, and network communication in enterprise deployments.',
      content: '<p>Securing microservices deployments requires close auditing of cluster network policies, read-only root filesystems, and key vault configurations.</p>',
      coverImageUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80',
      category: 'Security',
      authorName: 'Tectoflow Team',
      publishedAt: new Date(Date.now() - 86400000 * 2),
    },
    {
      title: 'Designing for Zero Latency User Interface Feedback',
      excerpt: 'Applying micro-interactions, optimistic updates, and component skeleton layouts to maximize user interaction responsiveness.',
      content: '<p>A user interface that feels alive requires immediate interactive reactions, state predictions, and smooth animations.</p>',
      slug: 'designing-zero-latency-ui',
      coverImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      category: 'Design',
      authorName: 'Tectoflow Team',
      publishedAt: new Date(Date.now() - 86400000 * 5),
    },
  ]);

  console.log('Seeding successfully completed!');
}
