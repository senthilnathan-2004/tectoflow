'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, CheckCircle2, Inbox, MailOpen } from 'lucide-react';

interface Submission {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  createdAt: string;
}

export default function AdminContacts() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'responded'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/contacts');
        const json = await res.json();
        if (json.success && json.data) {
          setSubmissions(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'read' | 'responded') => {
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmissions((prev) =>
          prev.map((sub) => (sub._id === id ? { ...sub, status } : sub))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;

    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setSubmissions((prev) => prev.filter((sub) => sub._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === 'all') return true;
    return sub.status === filter;
  });

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Contact Inbox</h1>
        <p className="mt-1 text-sm text-slate-500">Read and respond to dynamic client form responses.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-4">
        {(['all', 'unread', 'read', 'responded'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize transition ${
              filter === type
                ? 'bg-primary/10 text-primary'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-slate-500 font-medium">Loading inbox submissions...</div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400 font-medium shadow-sm">
          <Inbox className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          No submissions found matching this category.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((sub) => (
            <div
              key={sub._id}
              className={`rounded-xl border bg-white p-6 shadow-sm hover:border-primary/20 transition ${
                sub.status === 'unread' ? 'border-orange-200 ring-1 ring-orange-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-lg">{sub.name}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        sub.status === 'unread'
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : sub.status === 'read'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Email: <span className="text-slate-600 font-semibold">{sub.email}</span>
                    {sub.phone && (
                      <>
                        {' '}
                        | Phone: <span className="text-slate-600 font-semibold">{sub.phone}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    Service of Interest:{' '}
                    <span className="text-primary font-bold">{sub.service || 'General Inquiries'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {sub.status === 'unread' && (
                    <button
                      onClick={() => handleUpdateStatus(sub._id, 'read')}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition"
                      title="Mark as Read"
                    >
                      <MailOpen size={16} />
                    </button>
                  )}
                  {sub.status !== 'responded' && (
                    <button
                      onClick={() => handleUpdateStatus(sub._id, 'responded')}
                      className="rounded-lg p-2 text-emerald-500 hover:bg-emerald-50 transition"
                      title="Mark as Responded"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                    title="Delete Submission"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600 leading-relaxed font-medium">
                {sub.message}
              </div>

              <div className="mt-2 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Received At: {new Date(sub.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
