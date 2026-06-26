import mongoose, { Schema } from 'mongoose';

// --- Helper for Singletons ---
const createSingletonModel = (modelName: string, schema: Schema) => {
  return mongoose.models[modelName] || mongoose.model(modelName, schema);
};

// 1. HeroContent (Singleton)
const HeroContentSchema = new Schema({
  headline: { type: String, default: 'We craft digital flows that scale your business' },
  subheadline: { type: String, default: 'Next-Gen Digital Agency' },
  description: { type: String, default: 'We specialize in Web Development, Cybersecurity, SEO, Deployment/DevOps, and UI/UX Design.' },
  primaryCtaText: { type: String, default: 'Get a Quote' },
  primaryCtaLink: { type: String, default: '#contact' },
  secondaryCtaText: { type: String, default: 'Our Work' },
  secondaryCtaLink: { type: String, default: '#projects' },
  imageUrl: { type: String, default: '' },
  imageFileId: { type: String, default: '' },
  stats: [{
    label: { type: String, required: true },
    value: { type: String, required: true }
  }]
}, { timestamps: true });

export const HeroContent = createSingletonModel('HeroContent', HeroContentSchema);

// 2. AboutContent (Singleton)
const AboutContentSchema = new Schema({
  mission: { type: String, default: 'To empower organizations with robust, modern, and high-performance digital ecosystems.' },
  storyTitle: { type: String, default: 'Our Journey' },
  storyText: { type: String, default: 'Founded with a vision to merge aesthetic excellence with technical rigidity, Tectoflow has grown into a multi-disciplinary powerhouse.' },
  storyImageUrl: { type: String, default: '' },
  storyImageFileId: { type: String, default: '' },
  stats: [{
    label: { type: String, required: true },
    value: { type: String, required: true }
  }]
}, { timestamps: true });

export const AboutContent = createSingletonModel('AboutContent', AboutContentSchema);

// 3. TeamMember
const TeamMemberSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  imageFileId: { type: String, default: '' },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);

// 4. ProcessStep
const ProcessStepSchema = new Schema({
  number: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export const ProcessStep = mongoose.models.ProcessStep || mongoose.model('ProcessStep', ProcessStepSchema);

// 5. Service
const ServiceSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, default: '' },
  icon: { type: String, default: 'Globe' }, // store Lucide icon name
  order: { type: Number, default: 0 }
}, { timestamps: true });

export const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

// 6. Project
const ProjectSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true }, // e.g. Web Development, Security
  shortDescription: { type: String, required: true },
  longDescription: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  imageFileId: { type: String, default: '' },
  techStack: [{ type: String }],
  liveUrl: { type: String, default: '' },
  order: { type: Number, default: 0 },
  gallery: [{
    imageUrl: { type: String },
    imageFileId: { type: String }
  }]
}, { timestamps: true });

export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

// 7. Review
const ReviewSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  avatarFileId: { type: String, default: '' },
  rating: { type: Number, default: 5 },
  text: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

// 8. PricingTier
const PricingTierSchema = new Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  period: { type: String, default: '/month' },
  description: { type: String, default: '' },
  features: [{ type: String }],
  isPopular: { type: Boolean, default: false },
  ctaText: { type: String, default: 'Get Started' },
  ctaLink: { type: String, default: '#contact' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export const PricingTier = mongoose.models.PricingTier || mongoose.model('PricingTier', PricingTierSchema);

// 9. FaqItem
const FaqItemSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export const FaqItem = mongoose.models.FaqItem || mongoose.model('FaqItem', FaqItemSchema);

// 10. BlogPost
const BlogPostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true }, // HTML / Markdown rich text
  coverImageUrl: { type: String, default: '' },
  coverImageFileId: { type: String, default: '' },
  category: { type: String, default: 'General' },
  authorName: { type: String, default: 'Tectoflow Team' },
  authorAvatarUrl: { type: String, default: '' },
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

// 11. ContactSubmission
const ContactSubmissionSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  service: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'responded'], default: 'unread' }
}, { timestamps: true });

export const ContactSubmission = mongoose.models.ContactSubmission || mongoose.model('ContactSubmission', ContactSubmissionSchema);

// 12. NewsletterSubscriber
const NewsletterSubscriberSchema = new Schema({
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

export const NewsletterSubscriber = mongoose.models.NewsletterSubscriber || mongoose.model('NewsletterSubscriber', NewsletterSubscriberSchema);

// 13. SiteSettings (Singleton)
const SiteSettingsSchema = new Schema({
  siteName: { type: String, default: 'Tectoflow' },
  logoUrl: { type: String, default: '' },
  logoFileId: { type: String, default: '' },
  faviconUrl: { type: String, default: '' },
  faviconFileId: { type: String, default: '' },
  defaultTheme: { type: String, enum: ['brand', 'light'], default: 'light' },
  whatsappNumber: { type: String, default: '' },
  contactEmail: { type: String, default: 'hello@tectoflow.com' },
  contactPhone: { type: String, default: '' },
  contactAddress: { type: String, default: '' },
  socialLinks: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    github: { type: String, default: '' }
  },
  smtpNotifyEmail: { type: String, default: '' }
}, { timestamps: true });

export const SiteSettings = createSingletonModel('SiteSettings', SiteSettingsSchema);
