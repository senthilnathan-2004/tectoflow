import React from 'react';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/db';
import { BlogPost, SiteSettings } from '@/lib/models';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function BlogIndexPage() {
  await connectToDatabase();

  const [postDocs, settingsDoc] = await Promise.all([
    BlogPost.find().sort({ createdAt: -1 }),
    SiteSettings.findOne(),
  ]);

  const posts = JSON.parse(JSON.stringify(postDocs)) || [];
  const settings = JSON.parse(JSON.stringify(settingsDoc)) || {
    siteName: 'Tectoflow',
    logoUrl: '',
    contactEmail: 'hello@tectoflow.com',
  };

  return (
    <>
      <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />

      <main className="pt-28 pb-20 bg-bg flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">SEO Marketing & Insights</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary">Tectoflow Blog</h1>
            <p className="text-sm text-text-secondary font-medium">
              Read our technical reports on framework speed optimizations, devops strategies, and cybersecurity vulnerability checks.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center text-text-secondary font-medium py-12">
              No articles published yet. Please configure them in the admin dashboard.
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
                <div
                  key={post._id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface/30 hover:border-primary/20 hover:shadow-lg transition duration-300"
                >
                  <div>
                    <Link href={`/blog/${post.slug}`} className="block relative aspect-video w-full overflow-hidden bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.coverImageUrl || '/placeholder.png'}
                        alt={post.title}
                        className="h-full w-full object-cover group-hover:scale-102 transition duration-500"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-sm">
                        {post.category}
                      </span>
                    </Link>

                    <div className="p-6 space-y-3">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition duration-200 line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed font-medium line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group/btn inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wider"
                    >
                      Read article <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
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
