import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import { BlogPost, SiteSettings } from '@/lib/models';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

export const revalidate = 0;

export default async function BlogPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();

  const [postDoc, settingsDoc] = await Promise.all([
    BlogPost.findOne({ slug: slug }),
    SiteSettings.findOne(),
  ]);

  if (!postDoc) {
    notFound();
  }

  const post = JSON.parse(JSON.stringify(postDoc));
  const settings = JSON.parse(JSON.stringify(settingsDoc)) || {
    siteName: 'Tectoflow',
    logoUrl: '',
    contactEmail: 'hello@tectoflow.com',
  };

  return (
    <>
      <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />

      <main className="pt-28 pb-20 bg-bg flex-1">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb & Go Back */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            <Link href="/" className="hover:text-primary transition">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary transition">Blog</Link>
            <span>/</span>
            <span className="text-text-primary">Article</span>
          </div>

          {/* Cover Image */}
          {post.coverImageUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Header Metadata */}
          <div className="space-y-4 border-b border-border pb-6">
            <span className="inline-flex rounded bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary uppercase tracking-wider">
              {post.category}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-text-secondary">
              <span className="flex items-center gap-1">
                <User size={14} className="text-primary" /> {post.authorName || 'Tectoflow Team'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-primary" /> {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div
            className="prose prose-slate max-w-none text-sm text-text-secondary leading-relaxed font-medium space-y-6 whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="pt-10 border-t border-border">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Blog
            </Link>
          </div>
        </article>
      </main>

      <Footer
        siteName={settings.siteName}
        contactEmail={settings.contactEmail}
        socialLinks={settings.socialLinks}
      />
    </>
  );
}
