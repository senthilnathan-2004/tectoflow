'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

interface FaqItem {
  _id?: string;
  question: string;
  answer: string;
  order: number;
}

export default function AdminFaq() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<FaqItem>({
    question: '',
    answer: '',
    order: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/faq');
        const json = await res.json();
        if (json.success && json.data) {
          setFaqs(json.data);
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
    setCurrentFaq({
      question: '',
      answer: '',
      order: faqs.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FaqItem) => {
    setCurrentFaq({ ...faq });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!currentFaq._id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/admin/faq?id=${currentFaq._id}` : '/api/admin/faq';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentFaq),
      });
      const json = await res.json();
      if (json.success) {
        if (isEdit) {
          setFaqs((prev) => prev.map((f) => (f._id === json.data._id ? json.data : f)));
        } else {
          setFaqs((prev) => [...prev, json.data]);
        }
        setIsModalOpen(false);
      } else {
        alert(json.message || 'Failed to save FAQ.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (faq: FaqItem) => {
    if (!confirm('Are you sure you want to delete this FAQ item?')) return;

    try {
      const res = await fetch(`/api/admin/faq?id=${faq._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setFaqs((prev) => prev.filter((f) => f._id !== faq._id));
      } else {
        alert(json.message || 'Failed to delete FAQ.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage FAQ</h1>
          <p className="mt-1 text-sm text-slate-500">Add, edit, or delete Frequently Asked Questions.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1 rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff8557] transition"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500 font-medium">Loading FAQ...</div>
      ) : faqs.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400 font-medium shadow-sm">
          No FAQ items created yet. Click "Add FAQ" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq._id}
              className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-primary/30 transition"
            >
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">Q: {faq.question}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">A: {faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => openEditModal(faq)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(faq)}
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
                {currentFaq._id ? 'Edit FAQ Item' : 'Add FAQ Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={currentFaq.question}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Answer</label>
                <textarea
                  required
                  rows={4}
                  value={currentFaq.answer}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Display Order</label>
                <input
                  type="number"
                  required
                  value={currentFaq.order}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, order: parseInt(e.target.value) || 0 })}
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
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
