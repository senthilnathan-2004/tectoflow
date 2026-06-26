'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, X, Globe, Shield, Search, Cpu, Palette, HelpCircle } from 'lucide-react';

interface Service {
  _id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  order: number;
}

const iconsList = [
  { name: 'Globe', icon: Globe },
  { name: 'Shield', icon: Shield },
  { name: 'Search', icon: Search },
  { name: 'Cpu', icon: Cpu },
  { name: 'Palette', icon: Palette },
];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service>({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    icon: 'Globe',
    order: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/services');
        const json = await res.json();
        if (json.success && json.data) {
          setServices(json.data);
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
    setCurrentService({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      icon: 'Globe',
      order: services.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setCurrentService({ ...service });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!currentService._id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/admin/services?id=${currentService._id}` : '/api/admin/services';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentService),
      });
      const json = await res.json();
      if (json.success) {
        if (isEdit) {
          setServices((prev) => prev.map((s) => (s._id === json.data._id ? json.data : s)));
        } else {
          setServices((prev) => [...prev, json.data]);
        }
        setIsModalOpen(false);
      } else {
        alert(json.message || 'Failed to save service.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (service: Service) => {
    if (!confirm(`Are you sure you want to delete ${service.title}?`)) return;

    try {
      const res = await fetch(`/api/admin/services?id=${service._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setServices((prev) => prev.filter((s) => s._id !== service._id));
      } else {
        alert(json.message || 'Failed to delete service.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setCurrentService((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Services</h1>
          <p className="mt-1 text-sm text-slate-500">Add, edit, or delete the services offered by Tectoflow.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1 rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff8557] transition"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500 font-medium">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400 font-medium shadow-sm">
          No services created yet. Click "Add Service" to get started.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const IconComponent = iconsList.find((i) => i.name === service.icon)?.icon || HelpCircle;
            return (
              <div
                key={service._id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-primary/30 transition"
              >
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{service.title}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">/{service.slug}</p>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-3">{service.shortDescription}</p>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => openEditModal(service)}
                    className="p-1.5 text-slate-500 hover:text-slate-800"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(service)}
                    className="p-1.5 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                {currentService._id ? 'Edit Service' : 'Add Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={currentService.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={currentService.slug}
                  onChange={(e) => setCurrentService({ ...currentService, slug: generateSlug(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Icon Type</label>
                <select
                  value={currentService.icon}
                  onChange={(e) => setCurrentService({ ...currentService, icon: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                >
                  {iconsList.map((ico) => (
                    <option key={ico.name} value={ico.name}>
                      {ico.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Short Description</label>
                <textarea
                  required
                  rows={2}
                  value={currentService.shortDescription}
                  onChange={(e) => setCurrentService({ ...currentService, shortDescription: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Full Description (Markdown/Details)</label>
                <textarea
                  rows={5}
                  value={currentService.fullDescription}
                  onChange={(e) => setCurrentService({ ...currentService, fullDescription: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  placeholder="Details shown on the service detail page..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Display Order</label>
                <input
                  type="number"
                  required
                  value={currentService.order}
                  onChange={(e) => setCurrentService({ ...currentService, order: parseInt(e.target.value) || 0 })}
                  className="w-24 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
