'use client';

import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  fileId: string;
  onChange: (url: string, fileId: string) => void;
  label?: string;
}

export default function ImageUploader({ value, fileId, onChange, label = 'Upload Image' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const uploaderId = React.useId();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        onChange(data.url, data.fileId);
      } else {
        setError(data.message || 'Failed to upload image.');
      }
    } catch (err) {
      setError('An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!fileId) return;

    if (!confirm('Are you sure you want to delete this image?')) return;

    setUploading(true);
    try {
      const res = await fetch(`/api/upload/${fileId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        onChange('', '');
      } else {
        setError(data.message || 'Failed to delete image.');
      }
    } catch (err) {
      setError('An error occurred while deleting.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>

      {error && (
        <div className="text-xs text-red-500 font-semibold">{error}</div>
      )}

      {value ? (
        <div className="relative inline-block overflow-hidden rounded-lg border border-slate-200 bg-white p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="max-h-40 max-w-full rounded-md object-contain" />
          <button
            type="button"
            onClick={handleDelete}
            disabled={uploading}
            className="absolute right-3 top-3 rounded-full bg-red-600 p-1.5 text-white shadow-md hover:bg-red-700 disabled:opacity-50 transition"
            title="Delete image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex max-w-lg justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-8 hover:border-primary/50 transition">
          <div className="space-y-1 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
            <div className="flex text-sm text-slate-600">
              <label
                htmlFor={uploaderId}
                className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
              >
                <span>{uploading ? 'Uploading...' : 'Upload a file'}</span>
                <input
                  id={uploaderId}
                  name="file-upload"
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  className="sr-only"
                  onChange={handleUpload}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-slate-500 font-medium">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>
      )}
    </div>
  );
}
