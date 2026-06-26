'use client';
 
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
 
interface NavbarProps {
  siteName: string;
  logoUrl?: string;
}
 
export default function Navbar({ siteName, logoUrl }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
 
  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#about' },
    { label: 'Team', href: '#team' },
    { label: 'Portfolio', href: '#projects' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];
 
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/90 backdrop-blur-md border-b border-border/80 py-4 shadow-sm'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-text-primary">
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={siteName} className="h-8 md:h-12 w-auto object-contain shrink-0" />
            )}
            <span className="flex items-center gap-1.5">
              {!logoUrl && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
              {siteName}
            </span>
          </Link>
 
          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
 
          {/* Right side CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {/* CTA */}
            <Link
              href="#contact"
              className="group flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white hover:bg-primary/95 transition shadow-sm"
            >
              Get a Quote <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
 
          {/* Mobile controllers */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-secondary hover:text-text-primary p-1"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
 
      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 1.0, ease: 'easeInOut' }}
            className="mx-4 mt-2 md:hidden overflow-hidden rounded-2xl border border-border bg-surface/95 backdrop-blur-md py-4 px-6 space-y-3 shadow-lg"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-text-secondary hover:text-primary py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full justify-center items-center gap-1.5 rounded-full bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition"
              >
                Get a Quote <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
