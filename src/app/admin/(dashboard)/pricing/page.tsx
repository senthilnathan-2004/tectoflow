'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

interface PricingTier {
  _id?: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
  ctaLink: string;
  order: number;
}

export default function AdminPricing() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featuresInput, setFeaturesInput] = useState('');
  const [currentTier, setCurrentTier] = useState<PricingTier>({
    name: '',
    price: '',
    period: '/month',
    description: '',
    features: [],
    isPopular: false,
    ctaText: 'Get Started',
    ctaLink: '#contact',
    order: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/pricing');
        const json = await res.json();
        if (json.success && json.data) {
          setTiers(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const openAddModal = () => {
    setCurrentTier({
      name: '',
      price: '',
      period: '/month',
      description: '',
      features: [],
      isPopular: false,
      ctaText: 'Get Started',
      ctaLink: '#contact',
      order: tiers.length,
    });
    setFeaturesInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (tier: PricingTier) => {
    setCurrentTier({ ...tier });
    setFeaturesInput(tier.features?.join('\n') || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const feats = featuresInput
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const tierToSave = {
      ...currentTier,
      features: feats,
    };

    const isEdit = !!tierToSave._id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/admin/pricing?id=${tierToSave._id}` : '/api/admin/pricing';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tierToSave),
      });
      const json = await res.json();
      if (json.success) {
        if (isEdit) {
          setTiers((prev) => prev.map((t) => (t._id === json.data._id ? json.data : t)));
        } else {
          setTiers((prev) => [...prev, json.data]);
        }
        setIsModalOpen(false);
      } else {
        alert(json.message || 'Failed to save pricing tier.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (tier: PricingTier) => {
    if (!confirm(`Are you sure you want to delete the ${tier.name} pricing tier?`)) return;

    try {
      const res = await fetch(`/api/admin/pricing?id=${tier._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setTiers((prev) => prev.filter((t) => t._id !== tier._id));
      } else {
        alert(json.message || 'Failed to delete pricing tier.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Pricing Tiers</h1>
          <p className="mt-1 text-sm text-slate-500">Edit, add, or delete service pricing packages and highlights.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1 rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff8557] transition"
        >
          <Plus size={16} /> Add Package Tier
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500 font-medium">Loading pricing...</div>
      ) : tiers.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400 font-medium shadow-sm">
          No pricing packages created yet. Click "Add Package Tier" to create one.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier._id}
              className={`flex flex-col justify-between rounded-xl border p-6 shadow-sm relative ${
                tier.isPopular ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 bg-white'
              }`}
            >
              {tier.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#FF6B35] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{tier.name}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">{tier.description}</p>
                </div>

                <div className="flex items-baseline text-slate-900">
                  <span className="text-3xl font-extrabold tracking-tight">{tier.price}</span>
                  <span className="ml-1 text-sm text-slate-500">{tier.period}</span>
                </div>

                <ul className="space-y-2 border-t border-slate-100 pt-4">
                  {tier.features?.map((feat, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 mt-6">
                <button
                  onClick={() => openEditModal(tier)}
                  className="p-1.5 text-slate-500 hover:text-slate-800"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(tier)}
                  className="p-1.5 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                {currentTier._id ? 'Edit Pricing Tier' : 'Add Pricing Tier'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Tier Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pro Plan"
                    value={currentTier.name}
                    onChange={(e) => setCurrentTier({ ...currentTier, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Price</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $499"
                    value={currentTier.price}
                    onChange={(e) => setCurrentTier({ ...currentTier, price: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Billing Period</label>
                  <input
                    type="text"
                    placeholder="e.g. /month or one-time"
                    value={currentTier.period}
                    onChange={(e) => setCurrentTier({ ...currentTier, period: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Description Summary</label>
                  <input
                    type="text"
                    placeholder="e.g. Best for growing agencies"
                    value={currentTier.description}
                    onChange={(e) => setCurrentTier({ ...currentTier, description: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Features list (One per line)</label>
                <textarea
                  rows={6}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={currentTier.ctaText}
                    onChange={(e) => setCurrentTier({ ...currentTier, ctaText: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">CTA Link</label>
                  <input
                    type="text"
                    value={currentTier.ctaLink}
                    onChange={(e) => setCurrentTier({ ...currentTier, ctaLink: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={currentTier.isPopular}
                  onChange={(e) => setCurrentTier({ ...currentTier, isPopular: e.target.checked })}
                  className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                />
                <label htmlFor="isPopular" className="text-sm font-semibold text-slate-700">Mark as "Most Popular" / Highlight</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Display Order</label>
                  <input
                    type="number"
                    required
                    value={currentTier.order}
                    onChange={(e) => setCurrentTier({ ...currentTier, order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff8557]"
                >
                  Save Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
