'use client';

import React, { useEffect, useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { Plus, Trash2, Edit2, X, Link as LinkIcon } from 'lucide-react';

interface Project {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  imageFileId: string;
  techStack: string[];
  liveUrl: string;
  order: number;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [techStackInput, setTechStackInput] = useState('');
  const [currentProject, setCurrentProject] = useState<Project>({
    title: '',
    slug: '',
    category: '',
    shortDescription: '',
    longDescription: '',
    imageUrl: '',
    imageFileId: '',
    techStack: [],
    liveUrl: '',
    order: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/projects');
        const json = await res.json();
        if (json.success && json.data) {
          setProjects(json.data);
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
    setCurrentProject({
      title: '',
      slug: '',
      category: 'Web Development',
      shortDescription: '',
      longDescription: '',
      imageUrl: '',
      imageFileId: '',
      techStack: [],
      liveUrl: '',
      order: projects.length,
    });
    setTechStackInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setCurrentProject({ ...project });
    setTechStackInput(project.techStack?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = techStackInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const projectToSave = {
      ...currentProject,
      techStack: tags,
    };

    const isEdit = !!projectToSave._id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/admin/projects?id=${projectToSave._id}` : '/api/admin/projects';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectToSave),
      });
      const json = await res.json();
      if (json.success) {
        if (isEdit) {
          setProjects((prev) => prev.map((p) => (p._id === json.data._id ? json.data : p)));
        } else {
          setProjects((prev) => [...prev, json.data]);
        }
        setIsModalOpen(false);
      } else {
        alert(json.message || 'Failed to save project.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete ${project.title}?`)) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${project._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        if (project.imageFileId) {
          await fetch(`/api/upload/${project.imageFileId}`, { method: 'DELETE' });
        }
        setProjects((prev) => prev.filter((p) => p._id !== project._id));
      } else {
        alert(json.message || 'Failed to delete project.');
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
    setCurrentProject((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Edit and upload portfolio case studies and past delivery records.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1 rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff8557] transition"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500 font-medium">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400 font-medium shadow-sm">
          No projects added yet. Click "Add Project" to upload your first portfolio entry.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:border-primary/30 transition"
            >
              <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.imageUrl || '/placeholder.png'}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                  {project.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{project.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">{project.shortDescription}</p>
                  <div className="flex flex-wrap gap-1 pt-2">
                    {project.techStack?.map((tech) => (
                      <span key={tech} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1.5 text-slate-500 hover:text-slate-800"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    className="p-1.5 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
                {currentProject._id ? 'Edit Project' : 'Add Project'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={currentProject.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={currentProject.slug}
                  onChange={(e) => setCurrentProject({ ...currentProject, slug: generateSlug(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                <select
                  value={currentProject.category}
                  onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="SEO Optimization">SEO Optimization</option>
                  <option value="DevOps & Deployment">DevOps & Deployment</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Short Description</label>
                <textarea
                  required
                  rows={2}
                  value={currentProject.shortDescription}
                  onChange={(e) => setCurrentProject({ ...currentProject, shortDescription: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Detailed Case Study (Markdown)</label>
                <textarea
                  rows={5}
                  value={currentProject.longDescription}
                  onChange={(e) => setCurrentProject({ ...currentProject, longDescription: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                  placeholder="Problem, approach, results narrative..."
                />
              </div>

              <ImageUploader
                label="Cover Image"
                value={currentProject.imageUrl}
                fileId={currentProject.imageFileId}
                onChange={(url, id) => setCurrentProject({ ...currentProject, imageUrl: url, imageFileId: id })}
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, MongoDB, Tailwind CSS"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Live Demo / Repository URL</label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={currentProject.liveUrl}
                  onChange={(e) => setCurrentProject({ ...currentProject, liveUrl: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Display Order</label>
                <input
                  type="number"
                  required
                  value={currentProject.order}
                  onChange={(e) => setCurrentProject({ ...currentProject, order: parseInt(e.target.value) || 0 })}
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
