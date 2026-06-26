'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  User,
  GitCommit,
  Briefcase,
  FolderGit2,
  Star,
  DollarSign,
  HelpCircle,
  BookOpen,
  Settings,
  Mail,
  Users,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Hero Section', href: '/admin/hero', icon: Sparkles },
  { label: 'About Section', href: '/admin/about', icon: User },
  { label: 'Process steps', href: '/admin/process', icon: GitCommit },
  { label: 'Services', href: '/admin/services', icon: Briefcase },
  { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Pricing', href: '/admin/pricing', icon: DollarSign },
  { label: 'FAQ', href: '/admin/faq', icon: HelpCircle },
  { label: 'Blog', href: '/admin/blog', icon: BookOpen },
  { label: 'Contacts Inbox', href: '/admin/contacts', icon: Mail },
  { label: 'Subscribers', href: '/admin/subscribers', icon: Users },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col lg:h-full">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6">
          <Link href="/admin" className="text-xl font-bold tracking-tight text-slate-900">
            Tectoflow <span className="text-sm font-semibold text-primary">Admin</span>
          </Link>
        </div>
        <nav className="space-y-1 p-4 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition mt-6"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Sidebar - Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex w-64 flex-col border-r border-slate-200 bg-white p-4">
            <div className="flex h-12 items-center justify-between border-b border-slate-200 mb-4">
              <Link href="/admin" className="text-xl font-bold tracking-tight text-slate-900">
                Tectoflow Admin
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-slate-800">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1 flex-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition mt-6"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-600 hover:text-slate-900 lg:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 transition"
            >
              View Live Website
            </Link>
            <div className="h-6 w-[1px] bg-slate-200" />
            <span className="text-sm font-medium text-slate-700">Administrator</span>
          </div>
        </header>

        {/* Dynamic page container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
