'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface ProcessStep {
  _id?: string;
  number: number;
  title: string;
  description: string;
  order: number;
}

export default function AdminProcess() {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<ProcessStep>({
    number: 1,
    title: '',
    description: '',
    order: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/process');
        const json = await res.json();
        if (json.success && json.data) {
          setSteps(json.data);
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
    setCurrentStep({
      number: steps.length + 1,
      title: '',
      description: '',
      order: steps.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (step: ProcessStep) => {
    setCurrentStep({ ...step });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!currentStep._id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/admin/process?id=${currentStep._id}` : '/api/admin/process';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentStep),
      });
      const json = await res.json();
      if (json.success) {
        if (isEdit) {
          setSteps((prev) => prev.map((s) => (s._id === json.data._id ? json.data : s)));
        } else {
          setSteps((prev) => [...prev, json.data]);
        }
        setIsModalOpen(false);
      } else {
        alert(json.message || 'Failed to save process step.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (step: ProcessStep) => {
    if (!confirm(`Are you sure you want to delete step ${step.number}: ${step.title}?`)) return;

    try {
      const res = await fetch(`/api/admin/process?id=${step._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setSteps((prev) => prev.filter((s) => s._id !== step._id));
      } else {
        alert(json.message || 'Failed to delete process step.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-sm text-slate-500 font-medium">Loading process timeline steps...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Process Timeline</h1>
          <p className="mt-1 text-sm text-slate-500">Configure the chronological step-by-step agency delivery strategy.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1 rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff8557] transition"
        >
          <Plus size={16} /> Add Step
        </button>
      </div>

      {steps.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400 font-medium shadow-sm">
          No workflow steps created yet. Click "Add Step" to build your timeline.
        </div>
      ) : (
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step._id}
              className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-primary/30 transition"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-lg">
                  {step.number}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(step)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(step)}
                  className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
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
          <div className="w-full max-w-lg rounded-xl bg-white p-6 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                {currentStep._id ? 'Edit Process Step' : 'Add Process Step'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Step Number</label>
                  <input
                    type="number"
                    required
                    value={currentStep.number}
                    onChange={(e) => setCurrentStep({ ...currentStep, number: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Display Order</label>
                  <input
                    type="number"
                    required
                    value={currentStep.order}
                    onChange={(e) => setCurrentStep({ ...currentStep, order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={currentStep.title}
                  onChange={(e) => setCurrentStep({ ...currentStep, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={currentStep.description}
                  onChange={(e) => setCurrentStep({ ...currentStep, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
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
                  Save Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
