'use client';

import React, { useEffect, useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { Save } from 'lucide-react';

interface SiteSettingsData {
  siteName: string;
  logoUrl: string;
  logoFileId: string;
  faviconUrl: string;
  faviconFileId: string;
  defaultTheme: 'brand' | 'light';
  whatsappNumber: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    github: string;
  };
  smtpNotifyEmail: string;
}

export default function AdminSettings() {
  const [data, setData] = useState<SiteSettingsData>({
    siteName: 'Tectoflow',
    logoUrl: '',
    logoFileId: '',
    faviconUrl: '',
    faviconFileId: '',
    defaultTheme: 'brand',
    whatsappNumber: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      github: '',
    },
    smtpNotifyEmail: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/settings');
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: 'Site settings updated successfully!', type: 'success' });
      } else {
        setMessage({ text: json.message || 'Failed to update settings.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An error occurred.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-slate-500 font-medium">Loading settings...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Site Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Configure global metadata, contact details, social links, logo and favicon images.</p>
      </div>

      {message.text && (
        <div
          className={`rounded-lg border p-4 text-sm font-semibold text-center ${
            message.type === 'success'
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
              : 'border-red-500/20 bg-red-500/10 text-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Site Name</label>
            <input
              type="text"
              required
              value={data.siteName}
              onChange={(e) => setData({ ...data, siteName: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Default Theme Mode</label>
            <select
              value={data.defaultTheme}
              onChange={(e) => setData({ ...data, defaultTheme: e.target.value as 'brand' | 'light' })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
            >
              <option value="brand">Brand (Dark Mode with Orange + Blue Accents)</option>
              <option value="light">Light Mode (White/Off-White Background)</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ImageUploader
            label="Agency Logo"
            value={data.logoUrl}
            fileId={data.logoFileId}
            onChange={(url, id) => setData({ ...data, logoUrl: url, logoFileId: id })}
          />

          <ImageUploader
            label="Favicon Logo"
            value={data.faviconUrl}
            fileId={data.faviconFileId}
            onChange={(url, id) => setData({ ...data, faviconUrl: url, faviconFileId: id })}
          />
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Contact Details</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Public Contact Email</label>
              <input
                type="email"
                value={data.contactEmail}
                onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Public Phone Number</label>
              <input
                type="text"
                value={data.contactPhone}
                onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Address</label>
              <input
                type="text"
                value={data.contactAddress}
                onChange={(e) => setData({ ...data, contactAddress: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">WhatsApp Float Number / Link</label>
              <input
                type="text"
                placeholder="e.g. 1234567890 (no country code symbol or spaces)"
                value={data.whatsappNumber}
                onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Inbox Notification Override Email</label>
              <input
                type="email"
                placeholder="Defaults to NOTIFY_EMAIL env var"
                value={data.smtpNotifyEmail}
                onChange={(e) => setData({ ...data, smtpNotifyEmail: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Social Media Links</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {Object.keys(data.socialLinks).map((platform) => (
              <div key={platform}>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 capitalize">{platform}</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={(data.socialLinks as any)[platform]}
                  onChange={(e) =>
                    setData({
                      ...data,
                      socialLinks: {
                        ...data.socialLinks,
                        [platform]: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#ff8557] focus:outline-none disabled:opacity-50 transition"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
