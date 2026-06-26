'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, Users, Download } from 'lucide-react';

interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
}

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/subscribers');
        const json = await res.json();
        if (json.success && json.data) {
          setSubscribers(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    try {
      const res = await fetch(`/api/admin/subscribers?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setSubscribers((prev) => prev.filter((sub) => sub._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      ['Email,Subscribed At'].concat(
        subscribers.map((sub) => `"${sub.email}","${new Date(sub.createdAt).toLocaleString()}"`)
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tectoflow_newsletter_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Newsletter Subscribers</h1>
          <p className="mt-1 text-sm text-slate-500">View list of emails registered via the footer newsletter input.</p>
        </div>
        {subscribers.length > 0 && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Download size={14} /> Export CSV
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-sm text-slate-500 font-medium">Loading subscribers...</div>
      ) : subscribers.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400 font-medium shadow-sm">
          <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          No email subscribers registered yet.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <tr>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Subscribed On</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {subscribers.map((sub) => (
                <tr key={sub._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">{sub.email}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="text-red-500 hover:text-red-700 p-1.5"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
