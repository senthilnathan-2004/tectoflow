'use client';

import React, { useEffect, useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { Github, Linkedin, Twitter } from '@/components/SocialIcons';

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  imageFileId: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  order: number;
}

interface AboutData {
  mission: string;
  storyTitle: string;
  storyText: string;
  storyImageUrl: string;
  storyImageFileId: string;
  stats: { label: string; value: string }[];
}

export default function AdminAbout() {
  const [aboutData, setAboutData] = useState<AboutData>({
    mission: '',
    storyTitle: '',
    storyText: '',
    storyImageUrl: '',
    storyImageFileId: '',
    stats: [],
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAbout, setSavingAbout] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Modal / Form state for team member CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember>({
    name: '',
    role: '',
    bio: '',
    imageUrl: '',
    imageFileId: '',
    socialLinks: { github: '', linkedin: '', twitter: '' },
    order: 0,
  });
  const [savingMember, setSavingMember] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [aboutRes, teamRes] = await Promise.all([
          fetch('/api/admin/about'),
          fetch('/api/admin/team'),
        ]);

        const aboutJson = await aboutRes.json();
        const teamJson = await teamRes.json();

        if (aboutJson.success && aboutJson.data) {
          setAboutData(aboutJson.data);
        }
        if (teamJson.success && teamJson.data) {
          setTeamMembers(teamJson.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAbout(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: 'About section updated successfully!', type: 'success' });
      } else {
        setMessage({ text: json.message || 'Failed to update about details.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An error occurred.', type: 'error' });
    } finally {
      setSavingAbout(false);
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMember(false);
    
    const isEdit = !!currentMember._id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/admin/team?id=${currentMember._id}` : '/api/admin/team';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentMember),
      });
      const json = await res.json();
      if (json.success) {
        if (isEdit) {
          setTeamMembers((prev) => prev.map((m) => (m._id === json.data._id ? json.data : m)));
        } else {
          setTeamMembers((prev) => [...prev, json.data]);
        }
        setIsModalOpen(false);
      } else {
        alert(json.message || 'Failed to save team member.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMember = async (member: TeamMember) => {
    if (!confirm(`Are you sure you want to delete ${member.name}?`)) return;

    try {
      // First delete from DB
      const res = await fetch(`/api/admin/team?id=${member._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        // If image exists, clean up from ImageKit
        if (member.imageFileId) {
          await fetch(`/api/upload/${member.imageFileId}`, { method: 'DELETE' });
        }
        setTeamMembers((prev) => prev.filter((m) => m._id !== member._id));
      } else {
        alert(json.message || 'Failed to delete team member.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setCurrentMember({
      name: '',
      role: '',
      bio: '',
      imageUrl: '',
      imageFileId: '',
      socialLinks: { github: '', linkedin: '', twitter: '' },
      order: teamMembers.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setCurrentMember({ ...member });
    setIsModalOpen(true);
  };

  const addStat = () => {
    setAboutData((prev) => ({
      ...prev,
      stats: [...prev.stats, { label: '', value: '' }],
    }));
  };

  const removeStat = (index: number) => {
    setAboutData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  };

  const updateStat = (index: number, field: 'label' | 'value', val: string) => {
    setAboutData((prev) => {
      const newStats = [...prev.stats];
      newStats[index] = { ...newStats[index], [field]: val };
      return { ...prev, stats: newStats };
    });
  };

  if (loading) return <div className="text-sm text-slate-500 font-medium">Loading about and team details...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage About Section & Team</h1>
        <p className="mt-1 text-sm text-slate-500">Edit agency biography details, counter statistics and employee cards.</p>
      </div>

      {message.text && (
        <div
          className={`rounded-lg border p-4 text-sm font-semibold text-center ${
            message.type === 'success'
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
              : 'border-red-500/20 bg-red-500/10 text-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* About content singleton editor */}
      <form onSubmit={handleSaveAbout} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Story & Mission</h2>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Mission Statement</label>
          <textarea
            required
            rows={2}
            value={aboutData.mission}
            onChange={(e) => setAboutData({ ...aboutData, mission: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Story Title</label>
            <input
              type="text"
              required
              value={aboutData.storyTitle}
              onChange={(e) => setAboutData({ ...aboutData, storyTitle: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Story Content</label>
            <textarea
              required
              rows={5}
              value={aboutData.storyText}
              onChange={(e) => setAboutData({ ...aboutData, storyText: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none transition"
            />
          </div>
        </div>

        <ImageUploader
          label="Story Image"
          value={aboutData.storyImageUrl}
          fileId={aboutData.storyImageFileId}
          onChange={(url, id) => setAboutData({ ...aboutData, storyImageUrl: url, storyImageFileId: id })}
        />

        {/* Stats Row Counter Indicators */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-900">Stats Row Indicators</h3>
            <button
              type="button"
              onClick={addStat}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition"
            >
              <Plus size={14} /> Add Counter
            </button>
          </div>

          {aboutData.stats?.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium">No stats indicators added yet.</p>
          ) : (
            <div className="space-y-3">
              {aboutData.stats?.map((stat, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="e.g. 50+"
                      value={stat.value}
                      required
                      onChange={(e) => updateStat(i, 'value', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-primary focus:outline-none transition text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="e.g. Team Members"
                      value={stat.label}
                      required
                      onChange={(e) => updateStat(i, 'label', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-primary focus:outline-none transition text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStat(i)}
                    className="text-red-500 hover:text-red-700 p-1.5"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={savingAbout}
            className="flex items-center gap-2 rounded-lg bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#ff8557] focus:outline-none disabled:opacity-50 transition"
          >
            <Save size={16} />
            {savingAbout ? 'Saving...' : 'Save About Section'}
          </button>
        </div>
      </form>

      {/* Team members CRUD listing */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Team Members</h2>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1 rounded-lg bg-[#FF6B35] px-4 py-2 text-xs font-semibold text-white hover:bg-[#ff8557] transition"
          >
            <Plus size={14} /> Add Team Member
          </button>
        </div>

        {teamMembers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-medium">
            No team members added yet. Add one above!
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {teamMembers.map((member) => (
              <div key={member._id} className="relative rounded-lg border border-slate-200 p-4 space-y-3">
                <div className="aspect-square w-full rounded-md bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.imageUrl || '/placeholder.png'} alt={member.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{member.name}</h4>
                  <p className="text-xs text-primary font-semibold">{member.role}</p>
                </div>
                <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(member)}
                    className="p-1 text-slate-500 hover:text-slate-800"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form for Team Members */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                {currentMember._id ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={currentMember.name}
                  onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Role</label>
                <input
                  type="text"
                  required
                  value={currentMember.role}
                  onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={currentMember.bio}
                  onChange={(e) => setCurrentMember({ ...currentMember, bio: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
                />
              </div>

              <ImageUploader
                label="Avatar / Portrait"
                value={currentMember.imageUrl}
                fileId={currentMember.imageFileId}
                onChange={(url, id) => setCurrentMember({ ...currentMember, imageUrl: url, imageFileId: id })}
              />

              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Social Links</h4>
                <div className="grid gap-3 grid-cols-3">
                  <div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mb-1"><Github size={12} /> GitHub</span>
                    <input
                      type="text"
                      placeholder="URL"
                      value={currentMember.socialLinks.github}
                      onChange={(e) => setCurrentMember({
                        ...currentMember,
                        socialLinks: { ...currentMember.socialLinks, github: e.target.value }
                      })}
                      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs focus:border-primary focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mb-1"><Linkedin size={12} /> LinkedIn</span>
                    <input
                      type="text"
                      placeholder="URL"
                      value={currentMember.socialLinks.linkedin}
                      onChange={(e) => setCurrentMember({
                        ...currentMember,
                        socialLinks: { ...currentMember.socialLinks, linkedin: e.target.value }
                      })}
                      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs focus:border-primary focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mb-1"><Twitter size={12} /> Twitter</span>
                    <input
                      type="text"
                      placeholder="URL"
                      value={currentMember.socialLinks.twitter}
                      onChange={(e) => setCurrentMember({
                        ...currentMember,
                        socialLinks: { ...currentMember.socialLinks, twitter: e.target.value }
                      })}
                      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs focus:border-primary focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Display Order</label>
                <input
                  type="number"
                  required
                  value={currentMember.order}
                  onChange={(e) => setCurrentMember({ ...currentMember, order: parseInt(e.target.value) || 0 })}
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
                  disabled={savingMember}
                  className="rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff8557]"
                >
                  {savingMember ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
