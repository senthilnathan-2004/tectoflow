'use client';

import React, { useEffect, useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { Plus, Trash2, Edit2, X, Star } from 'lucide-react';

interface Review {
  _id?: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  avatarFileId: string;
  rating: number;
  text: string;
  order: number;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review>({
    name: '',
    role: '',
    company: '',
    avatarUrl: '',
    avatarFileId: '',
    rating: 5,
    text: '',
    order: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/reviews');
        const json = await res.json();
        if (json.success && json.data) {
          setReviews(json.data);
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
    setCurrentReview({
      name: '',
      role: '',
      company: '',
      avatarUrl: '',
      avatarFileId: '',
      rating: 5,
      text: '',
      order: reviews.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (review: Review) => {
    setCurrentReview({ ...review });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!currentReview._id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/admin/reviews?id=${currentReview._id}` : '/api/admin/reviews';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentReview),
      });
      const json = await res.json();
      if (json.success) {
        if (isEdit) {
          setReviews((prev) => prev.map((r) => (r._id === json.data._id ? json.data : r)));
        } else {
          setReviews((prev) => [...prev, json.data]);
        }
        setIsModalOpen(false);
      } else {
        alert(json.message || 'Failed to save review.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (review: Review) => {
    if (!confirm(`Are you sure you want to delete ${review.name}'s testimonial?`)) return;

    try {
      const res = await fetch(`/api/admin/reviews?id=${review._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        if (review.avatarFileId) {
          await fetch(`/api/upload/${review.avatarFileId}`, { method: 'DELETE' });
        }
        setReviews((prev) => prev.filter((r) => r._id !== review._id));
      } else {
        alert(json.message || 'Failed to delete review.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Testimonials</h1>
          <p className="mt-1 text-sm text-slate-500">Edit, add, or delete client review quotes and star ratings.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1 rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff8557] transition"
        >
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500 font-medium">Loading testimonials...</div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400 font-medium shadow-sm">
          No testimonials added yet. Click "Add Testimonial" to create your first client review.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-primary/30 transition"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < review.rating ? 'currentColor' : 'none'}
                      className={i < review.rating ? 'text-amber-400' : 'text-slate-200'}
                    />
                  ))}
                </div>

                <p className="text-sm text-slate-600 italic">"{review.text}"</p>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={review.avatarUrl || '/placeholder-avatar.png'}
                      alt={review.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {review.role} {review.company ? `@ ${review.company}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 mt-6">
                <button
                  onClick={() => openEditModal(review)}
                  className="p-1.5 text-slate-500 hover:text-slate-800"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(review)}
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
                {currentReview._id ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={currentReview.name}
                  onChange={(e) => setCurrentReview({ ...currentReview, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    value={currentReview.role}
                    onChange={(e) => setCurrentReview({ ...currentReview, role: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Company</label>
                  <input
                    type="text"
                    value={currentReview.company}
                    onChange={(e) => setCurrentReview({ ...currentReview, company: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Star Rating</label>
                <select
                  value={currentReview.rating}
                  onChange={(e) => setCurrentReview({ ...currentReview, rating: parseInt(e.target.value) || 5 })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Testimonial Quote</label>
                <textarea
                  required
                  rows={4}
                  value={currentReview.text}
                  onChange={(e) => setCurrentReview({ ...currentReview, text: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <ImageUploader
                label="Client Avatar"
                value={currentReview.avatarUrl}
                fileId={currentReview.avatarFileId}
                onChange={(url, id) => setCurrentReview({ ...currentReview, avatarUrl: url, avatarFileId: id })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Display Order</label>
                  <input
                    type="number"
                    required
                    value={currentReview.order}
                    onChange={(e) => setCurrentReview({ ...currentReview, order: parseInt(e.target.value) || 0 })}
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
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
