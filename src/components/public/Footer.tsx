'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
import { Facebook, Twitter, Linkedin, Instagram, Github } from '@/components/SocialIcons';

interface FooterProps {
  siteName: string;
  logoUrl?: string;
  tagline?: string;
  contactEmail?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
  };
}

export default function Footer({ siteName, logoUrl, tagline, contactEmail, socialLinks }: FooterProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMsg('');
    setError(false);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();
      if (json.success) {
        setMsg(json.message);
        setEmail('');
      } else {
        setMsg(json.message);
        setError(true);
      }
    } catch (err) {
      setMsg('Something went wrong.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const platforms = [
    { key: 'facebook', icon: Facebook },
    { key: 'twitter', icon: Twitter },
    { key: 'linkedin', icon: Linkedin },
    { key: 'instagram', icon: Instagram },
    { key: 'github', icon: Github },
  ];

  return (
    <footer className="border-t border-border bg-bg py-16 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-border/80">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <span className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-3">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={siteName} className="h-8 w-auto object-contain shrink-0" />
              ) : (
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              )}
              {siteName}
            </span>
            <p className="text-text-secondary leading-relaxed font-medium">
              {tagline || 'Next-Gen Digital Agency offering premium engineering, security audits, and performance marketing.'}
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="#services" className="text-text-secondary hover:text-primary transition font-medium">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#process" className="text-text-secondary hover:text-primary transition font-medium">
                  Process
                </Link>
              </li>
              <li>
                <Link href="#projects" className="text-text-secondary hover:text-primary transition font-medium">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-text-secondary hover:text-primary transition font-medium">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Capabilities links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Capabilities</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="#services" className="text-text-secondary hover:text-primary transition font-medium">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-text-secondary hover:text-primary transition font-medium">
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-text-secondary hover:text-primary transition font-medium">
                  SEO Optimization
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-text-secondary hover:text-primary transition font-medium">
                  DevOps / Deploy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs text-text-secondary font-medium leading-relaxed">
              Subscribe to get updates on design trends, tech updates, and vulnerability warnings.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-border bg-surface/50 px-3 py-2 text-xs text-text-primary focus:border-primary focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-primary p-2 text-white hover:bg-primary/95 disabled:opacity-50 transition"
              >
                <Send size={14} />
              </button>
            </form>
            {msg && (
              <p className={`text-[10px] font-bold ${error ? 'text-red-500' : 'text-emerald-500'}`}>
                {msg}
              </p>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 mt-1">
          <p className="text-xs text-text-secondary font-medium">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>

          {/* Social Links */}
          {socialLinks && (
            <div className="flex gap-4">
              {platforms.map((plat) => {
                const url = (socialLinks as any)[plat.key];
                if (!url) return null;
                const Icon = plat.icon;
                return (
                  <a
                    key={plat.key}
                    href={url}
                    target="_blank"
                    className="text-text-secondary hover:text-primary transition"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
