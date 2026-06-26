'use client';

import React, { useEffect, useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { Plus, Trash2, Save } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
}

interface HeroData {
  headline: string;
  subheadline: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  imageUrl: string;
  imageFileId: string;
  stats: Stat[];
}

export default function AdminHero() {
  const [data, setData] = useState<HeroData>({
    headline: '',
    subheadline: '',
    description: '',
    primaryCtaText: '',
    primaryCtaLink: '',
    secondaryCtaText: '',
    secondaryCtaLink: '',
    imageUrl: '',
    imageFileId: '',
    stats: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/hero');
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
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: 'Hero content updated successfully!', type: 'success' });
      } else {
        setMessage({ text: json.message || 'Failed to update content.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An error occurred.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const addStat = () => {
    setData((prev) => ({
      ...prev,
      stats: [...prev.stats, { label: '', value: '' }],
    }));
  };

  const removeStat = (index: number) => {
    setData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  };

  const updateStat = (index: number, field: keyof Stat, val: string) => {
    setData((prev) => {
      const newStats = [...prev.stats];
      newStats[index] = { ...newStats[index], [field]: val };
      return { ...prev, stats: newStats };
    });
  };

  if (loading) return <div className="text-sm text-slate-500 font-medium">Loading hero section configurations...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Hero Section</h1>
        <p className="mt-1 text-sm text-slate-500">Edit the hero headlines, image and statistic indicators.</p>
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
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Headline</label>
            <input
              type="text"
              required
              value={data.headline}
              onChange={(e) => setData({ ...data, headline: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Subheadline</label>
            <input
              type="text"
              required
              value={data.subheadline}
              onChange={(e) => setData({ ...data, subheadline: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Description</label>
            <textarea
              required
              rows={4}
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Primary CTA Text</label>
            <input
              type="text"
              value={data.primaryCtaText}
              onChange={(e) => setData({ ...data, primaryCtaText: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Primary CTA Link</label>
            <input
              type="text"
              value={data.primaryCtaLink}
              onChange={(e) => setData({ ...data, primaryCtaLink: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Secondary CTA Text</label>
            <input
              type="text"
              value={data.secondaryCtaText}
              onChange={(e) => setData({ ...data, secondaryCtaText: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Secondary CTA Link</label>
            <input
              type="text"
              value={data.secondaryCtaLink}
              onChange={(e) => setData({ ...data, secondaryCtaLink: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
            />
          </div>
        </div>

        <ImageUploader
          label="Hero Image / Illustration"
          value={data.imageUrl}
          fileId={data.imageFileId}
          onChange={(url, id) => setData({ ...data, imageUrl: url, imageFileId: id })}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-900">Stats Row Counter Indicators</h3>
            <button
              type="button"
              onClick={addStat}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition"
            >
              <Plus size={14} /> Add Counter
            </button>
          </div>

          {data.stats?.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium">No stats indicators added yet.</p>
          ) : (
            <div className="space-y-3">
              {data.stats?.map((stat, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="e.g. 150+ Projects"
                      value={stat.value}
                      required
                      onChange={(e) => updateStat(i, 'value', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-primary focus:outline-none transition text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="e.g. Completed Tasks"
                      value={stat.label}
                      required
                      onChange={(e) => updateStat(i, 'label', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-primary focus:outline-none transition text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStat(i)}
                    className="text-red-500 hover:text-red-700 p-1.5"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#ff8557] focus:outline-none disabled:opacity-50 transition"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
