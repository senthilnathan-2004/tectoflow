'use client';

import React, { useEffect, useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { Plus, Trash2, Edit2, X, Eye } from 'lucide-react';

interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImageFileId: string;
  category: string;
  authorName: string;
  publishedAt: string;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImageUrl: '',
    coverImageFileId: '',
    category: 'Tech Stack',
    authorName: 'Tectoflow Team',
    publishedAt: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/blog');
        const json = await res.json();
        if (json.success && json.data) {
          setPosts(json.data);
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
    setCurrentPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImageUrl: '',
      coverImageFileId: '',
      category: 'Tech Stack',
      authorName: 'Tectoflow Team',
      publishedAt: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setCurrentPost({
      ...post,
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!currentPost._id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/admin/blog?id=${currentPost._id}` : '/api/admin/blog';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPost),
      });
      const json = await res.json();
      if (json.success) {
        if (isEdit) {
          setPosts((prev) => prev.map((p) => (p._id === json.data._id ? json.data : p)));
        } else {
          setPosts((prev) => [...prev, json.data]);
        }
        setIsModalOpen(false);
      } else {
        alert(json.message || 'Failed to save blog post.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blog?id=${post._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        if (post.coverImageFileId) {
          await fetch(`/api/upload/${post.coverImageFileId}`, { method: 'DELETE' });
        }
        setPosts((prev) => prev.filter((p) => p._id !== post._id));
      } else {
        alert(json.message || 'Failed to delete blog post.');
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
    setCurrentPost((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Blog Posts</h1>
          <p className="mt-1 text-sm text-slate-500">Create, edit, and publish SEO content marketing articles.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1 rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff8557] transition"
        >
          <Plus size={16} /> Add Blog Post
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500 font-medium">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400 font-medium shadow-sm">
          No articles created yet. Click "Add Blog Post" to publish your first content marketing copy.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-primary/30 transition"
            >
              <div className="flex items-start gap-4">
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImageUrl || '/placeholder.png'}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                    {post.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{post.title}</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Published by {post.authorName} on {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => openEditModal(post)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(post)}
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
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                {currentPost._id ? 'Edit Blog Post' : 'Add Blog Post'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Post Title</label>
                <input
                  type="text"
                  required
                  value={currentPost.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={currentPost.slug}
                    onChange={(e) => setCurrentPost({ ...currentPost, slug: generateSlug(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                  <select
                    value={currentPost.category}
                    onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="SEO Marketing">SEO Marketing</option>
                    <option value="DevOps & Deploy">DevOps & Deploy</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Agency News">Agency News</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Author Name</label>
                  <input
                    type="text"
                    required
                    value={currentPost.authorName}
                    onChange={(e) => setCurrentPost({ ...currentPost, authorName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Publish Date</label>
                  <input
                    type="date"
                    required
                    value={currentPost.publishedAt}
                    onChange={(e) => setCurrentPost({ ...currentPost, publishedAt: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Excerpt / Brief Summary</label>
                <textarea
                  required
                  rows={2}
                  value={currentPost.excerpt}
                  onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Post Content (HTML/Markdown)</label>
                <textarea
                  required
                  rows={8}
                  value={currentPost.content}
                  onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition font-mono"
                  placeholder="<p>Write your HTML or text content here...</p>"
                />
              </div>

              <ImageUploader
                label="Cover Image"
                value={currentPost.coverImageUrl}
                fileId={currentPost.coverImageFileId}
                onChange={(url, id) => setCurrentPost({ ...currentPost, coverImageUrl: url, coverImageFileId: id })}
              />

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
                  Save Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
