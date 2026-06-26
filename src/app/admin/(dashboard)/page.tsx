'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, FolderGit2, Star, Users, ArrowRight } from 'lucide-react';

interface Stats {
  contacts: number;
  projects: number;
  reviews: number;
  subscribers: number;
}

interface Submission {
  _id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  createdAt: string;
}

export default function AdminDashboardHome() {
  const [stats, setStats] = useState<Stats>({ contacts: 0, projects: 0, reviews: 0, subscribers: 0 });
  const [recentContacts, setRecentContacts] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contactsRes, projectsRes, reviewsRes, subsRes] = await Promise.all([
          fetch('/api/admin/contacts'),
          fetch('/api/admin/projects'),
          fetch('/api/admin/reviews'),
          fetch('/api/admin/subscribers'),
        ]);

        const contacts = await contactsRes.json();
        const projects = await projectsRes.json();
        const reviews = await reviewsRes.json();
        const subscribers = await subsRes.json();

        setStats({
          contacts: contacts.data?.length || 0,
          projects: projects.data?.length || 0,
          reviews: reviews.data?.length || 0,
          subscribers: subscribers.data?.length || 0,
        });

        setRecentContacts(contacts.data?.slice(0, 5) || []);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-white border border-slate-200" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-white border border-slate-200" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Submissions', value: stats.contacts, icon: Mail, color: 'text-orange-500 bg-orange-50' },
    { label: 'Total Projects', value: stats.projects, icon: FolderGit2, color: 'text-blue-500 bg-blue-50' },
    { label: 'Total Reviews', value: stats.reviews, icon: Star, color: 'text-yellow-500 bg-yellow-50' },
    { label: 'Subscribers', value: stats.subscribers, icon: Users, color: 'text-emerald-500 bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome to your site administration control panel.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${card.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Contact Submissions Preview */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900">Recent Contact Submissions</h2>
          <Link
            href="/admin/contacts"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition"
          >
            View Inbox <ArrowRight size={16} />
          </Link>
        </div>

        {recentContacts.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            No contact submissions received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-500">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-700">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Received At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {recentContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4">{contact.email}</td>
                    <td className="px-6 py-4">{contact.service || 'General Inquiry'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          contact.status === 'unread'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : contact.status === 'read'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
