'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, Send, HelpCircle } from 'lucide-react';

interface ContactProps {
  settings: {
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      github?: string;
    };
  };
}

export default function Contact({ settings }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Web Development');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please provide a valid email';
    }
    if (!message.trim()) errs.message = 'Message is required';
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, service, message }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setError(json.message || 'Failed to submit form.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 border-b border-border bg-bg/50 md:min-h-screen md:flex md:items-center bg-grid-pattern relative overflow-hidden">
      {/* Premium minimal decorations */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="absolute top-10 left-8 md:left-12 text-[10px] font-mono tracking-[0.25em] text-text-secondary/40 select-none">// 10 CONTACT</div>
      
      {/* Dashed vertical guidelines */}
      <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-border/40 pointer-events-none" />
      <div className="absolute right-8 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-border/40 pointer-events-none" />
      
      {/* Corner coordinate plus marks */}
      <div className="absolute top-6 left-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute top-6 right-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute bottom-6 left-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>
      <div className="absolute bottom-6 right-6 text-primary/30 font-mono text-[10px] pointer-events-none select-none">+</div>

      {/* Decorative ambient glowing blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/5 blur-[120px] opacity-75 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-[30rem] w-[30rem] translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-[160px] opacity-65 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 items-stretch">
          {/* Form Column */}
          <div className="bg-surface/30 rounded-2xl border border-border p-8 md:p-10 shadow-sm flex flex-col justify-between h-full">
            {success ? (
              <div className="text-center py-12 space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 border border-emerald-200">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">Message Sent!</h3>
                <p className="text-sm text-text-secondary max-w-md mx-auto font-medium">
                  Thank you for reaching out. We have logged your request and our delivery architect will contact you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 rounded-full border border-border bg-bg px-6 py-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">Get a Quote</h3>
                  <p className="text-sm text-text-secondary mt-1 font-medium">
                    Fill out our brief form and describe your project goals.
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-xs font-semibold text-red-500">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Your Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full rounded-lg border bg-surface/50 px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/50 focus:border-primary focus:outline-none transition ${
                          validationErrors.name ? 'border-red-500' : 'border-border'
                        }`}
                        placeholder="e.g. John Doe"
                      />
                      {validationErrors.name && (
                        <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full rounded-lg border bg-surface/50 px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/50 focus:border-primary focus:outline-none transition ${
                          validationErrors.email ? 'border-red-500' : 'border-border'
                        }`}
                        placeholder="john@company.com"
                      />
                      {validationErrors.email && (
                        <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-lg border border-border bg-surface/50 px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/50 focus:border-primary focus:outline-none transition"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Service Interest</label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full rounded-lg border border-border bg-surface/50 px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none transition"
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="SEO Optimization">SEO Optimization</option>
                        <option value="DevOps & Deployment">DevOps & Deployment</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Other Project">Other / General</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Describe Project Goals</label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`w-full rounded-lg border bg-surface/50 px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/50 focus:border-primary focus:outline-none transition ${
                        validationErrors.message ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Please summarize details, tech preferences, and timeline goals..."
                    />
                    {validationErrors.message && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center items-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/95 disabled:opacity-50 transition shadow-sm"
                  >
                    <Send size={16} />
                    {loading ? 'Sending Request...' : 'Send Message'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Details Column Styled as Card */}
          <div className="bg-surface/30 rounded-2xl border border-border p-8 md:p-10 shadow-sm flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Get In Touch</span>
                <h3 className="text-3xl font-bold tracking-tight text-text-primary">Let's Discuss Your Project</h3>
                <p className="text-sm text-text-secondary font-medium leading-relaxed">
                  Connect with our team to perform a tech diagnostic check and review your project roadmap requirements.
                </p>
              </div>

              <div className="space-y-6 pt-6 border-t border-border/60">
                {settings.contactEmail && (
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Email Us</h4>
                      <a href={`mailto:${settings.contactEmail}`} className="text-sm font-semibold text-text-primary hover:text-primary transition mt-1 block">
                        {settings.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {settings.contactPhone && (
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                      <Phone size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Call Us</h4>
                      <p className="text-sm font-semibold text-text-primary mt-1 block">
                        {settings.contactPhone}
                      </p>
                    </div>
                  </div>
                )}

                {settings.contactAddress && (
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Office</h4>
                      <p className="text-sm font-semibold text-text-primary mt-1 block leading-relaxed">
                        {settings.contactAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
