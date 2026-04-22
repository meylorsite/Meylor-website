'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, X, Eye, EyeOff, GripVertical, ImagePlus } from 'lucide-react';

interface Field {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'url' | 'array' | 'date' | 'media-gallery';
  options?: { value: string; label: string }[];
  required?: boolean;
  bilingual?: boolean;
  showInTable?: boolean;
  defaultValue?: any;
}

interface AdminCrudProps {
  resource: string;
  title: string;
  fields: Field[];
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  readOnly?: boolean;
}

export default function AdminCrud({
  resource,
  title,
  fields,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  readOnly = false,
}: AdminCrudProps) {
  const { accessToken } = useAuthStore();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '20');
      if (search) params.set('search', search);
      const res = await adminApi.getAll(resource, accessToken, params.toString());
      setItems(res.data || []);
      setPagination(res.pagination);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [accessToken, resource, page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getDefaultFormData = () => {
    const data: any = {};
    fields.forEach((f) => {
      if (f.bilingual) {
        data[`${f.key}En`] = f.defaultValue || '';
        data[`${f.key}Ar`] = f.defaultValue || '';
      } else if (f.type === 'array' || f.type === 'media-gallery') {
        data[f.key] = f.defaultValue || [];
      } else if (f.type === 'boolean') {
        data[f.key] = f.defaultValue ?? true;
      } else if (f.type === 'number') {
        data[f.key] = f.defaultValue ?? 0;
      } else {
        data[f.key] = f.defaultValue || '';
      }
    });
    return data;
  };

  const openCreate = () => {
    setEditing(null);
    setFormData(getDefaultFormData());
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    const data: any = {};
    fields.forEach((f) => {
      if (f.bilingual) {
        data[`${f.key}En`] = item[`${f.key}En`] || '';
        data[`${f.key}Ar`] = item[`${f.key}Ar`] || '';
      } else if (f.type === 'array' || f.type === 'media-gallery') {
        data[f.key] = item[f.key] || [];
      } else {
        data[f.key] = item[f.key] ?? '';
      }
    });
    setFormData(data);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    setSaving(true);
    try {
      if (editing) {
        await adminApi.update(resource, editing._id, formData, accessToken);
        toast.success('Updated successfully');
      } else {
        await adminApi.create(resource, formData, accessToken);
        toast.success('Created successfully');
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    try {
      await adminApi.remove(resource, id, accessToken);
      toast.success('Deleted successfully');
      setDeleteConfirm(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const toggleVisibility = async (item: any) => {
    if (!accessToken) return;
    const field = 'isVisible' in item ? 'isVisible' : 'isPublished' in item ? 'isPublished' : 'isOpen' in item ? 'isOpen' : null;
    if (!field) return;
    try {
      await adminApi.update(resource, item._id, { [field]: !item[field] }, accessToken);
      fetchData();
    } catch {
      toast.error('Update failed');
    }
  };

  const tableFields = fields.filter((f) => f.showInTable !== false).slice(0, 5);

  const renderFieldInput = (field: Field) => {
    if (field.bilingual) {
      return (
        <div key={field.key} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{field.label}</label>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <span className="text-xs text-gray-400">English</span>
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[`${field.key}En`] || ''}
                  onChange={(e) => setFormData({ ...formData, [`${field.key}En`]: e.target.value })}
                  rows={3}
                  className="input-field"
                  dir="ltr"
                />
              ) : (
                <input
                  type="text"
                  value={formData[`${field.key}En`] || ''}
                  onChange={(e) => setFormData({ ...formData, [`${field.key}En`]: e.target.value })}
                  className="input-field"
                  dir="ltr"
                />
              )}
            </div>
            <div>
              <span className="text-xs text-gray-400">Arabic</span>
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[`${field.key}Ar`] || ''}
                  onChange={(e) => setFormData({ ...formData, [`${field.key}Ar`]: e.target.value })}
                  rows={3}
                  className="input-field"
                  dir="rtl"
                />
              ) : (
                <input
                  type="text"
                  value={formData[`${field.key}Ar`] || ''}
                  onChange={(e) => setFormData({ ...formData, [`${field.key}Ar`]: e.target.value })}
                  className="input-field"
                  dir="rtl"
                />
              )}
            </div>
          </div>
        </div>
      );
    }

    if (field.type === 'media-gallery') {
      const mediaItems: any[] = formData[field.key] || [];

      const addMediaItem = () => {
        setFormData({
          ...formData,
          [field.key]: [...mediaItems, { url: '', type: 'image', captionEn: '', captionAr: '', order: mediaItems.length }],
        });
      };

      const removeMediaItem = (index: number) => {
        const updated = mediaItems.filter((_: any, i: number) => i !== index).map((item: any, i: number) => ({ ...item, order: i }));
        setFormData({ ...formData, [field.key]: updated });
      };

      const updateMediaItem = (index: number, key: string, value: any) => {
        const updated = mediaItems.map((item: any, i: number) => (i === index ? { ...item, [key]: value } : item));
        setFormData({ ...formData, [field.key]: updated });
      };

      const moveItem = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= mediaItems.length) return;
        const updated = [...mediaItems];
        [updated[index], updated[target]] = [updated[target], updated[index]];
        setFormData({ ...formData, [field.key]: updated.map((item: any, i: number) => ({ ...item, order: i })) });
      };

      return (
        <div key={field.key} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">{field.label}</label>
            <button
              type="button"
              onClick={addMediaItem}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-accent px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/5"
            >
              <ImagePlus className="h-3.5 w-3.5" /> Add Photo/Video
            </button>
          </div>
          {mediaItems.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-400">
              No media items yet. Click &quot;Add Photo/Video&quot; to begin.
            </div>
          )}
          <div className="space-y-3">
            {mediaItems.map((item: any, index: number) => (
              <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">#{index + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-30"
                      title="Move up"
                    >
                      <GripVertical className="h-3.5 w-3.5 rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === mediaItems.length - 1}
                      className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-30"
                      title="Move down"
                    >
                      <GripVertical className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMediaItem(index)}
                      className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-danger"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <span className="text-xs text-gray-400">URL</span>
                    <input
                      type="url"
                      value={item.url || ''}
                      onChange={(e) => updateMediaItem(index, 'url', e.target.value)}
                      placeholder="https://..."
                      className="input-field"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Type</span>
                    <select
                      value={item.type || 'image'}
                      onChange={(e) => updateMediaItem(index, 'type', e.target.value)}
                      className="input-field"
                      title="Media type"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Order</span>
                    <input
                      type="number"
                      value={item.order ?? index}
                      onChange={(e) => updateMediaItem(index, 'order', parseInt(e.target.value) || 0)}
                      className="input-field"
                      title="Order"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Caption (English)</span>
                    <input
                      type="text"
                      value={item.captionEn || ''}
                      onChange={(e) => updateMediaItem(index, 'captionEn', e.target.value)}
                      className="input-field"
                      dir="ltr"
                      placeholder="English caption"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Caption (Arabic)</span>
                    <input
                      type="text"
                      value={item.captionAr || ''}
                      onChange={(e) => updateMediaItem(index, 'captionAr', e.target.value)}
                      className="input-field"
                      dir="rtl"
                      placeholder="Arabic caption"
                    />
                  </div>
                </div>
                {item.url && item.type === 'image' && (
                  <div className="mt-3">
                    <img src={item.url} alt={item.captionEn || 'Preview'} className="h-20 w-20 rounded-lg object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={field.key} className="space-y-1">
        <label className="text-sm font-medium text-gray-700">{field.label}</label>
        {field.type === 'textarea' ? (
          <textarea
            value={formData[field.key] || ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            rows={3}
            className="input-field"
          />
        ) : field.type === 'select' ? (
          <select
            value={formData[field.key] || ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            className="input-field"
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : field.type === 'boolean' ? (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData[field.key]}
              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-600">{field.label}</span>
          </label>
        ) : field.type === 'number' ? (
          <input
            type="number"
            value={formData[field.key] ?? 0}
            onChange={(e) => setFormData({ ...formData, [field.key]: parseFloat(e.target.value) || 0 })}
            className="input-field"
          />
        ) : (
          <input
            type={field.type === 'url' ? 'url' : field.type === 'date' ? 'date' : 'text'}
            value={formData[field.key] || ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            className="input-field"
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          {canCreate && !readOnly && (
            <button onClick={openCreate} className="btn-primary gap-2 text-sm">
              <Plus className="h-4 w-4" /> Add New
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              {tableFields.map((f) => (
                <th key={f.key} className="px-4 py-3 text-left font-medium text-gray-500">
                  {f.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={tableFields.length + 1} className="px-4 py-3"><div className="skeleton h-6 w-full" /></td></tr>
              ))
            ) : items.length === 0 ? (
              <tr><td colSpan={tableFields.length + 1} className="px-4 py-12 text-center text-gray-400">No items found</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50">
                  {tableFields.map((f) => {
                    let display: any = '';
                    if (f.bilingual) {
                      display = item[`${f.key}En`] || item[`${f.key}Ar`] || '';
                    } else if (f.type === 'boolean') {
                      display = item[f.key] ? '✓' : '✗';
                    } else if (f.type === 'date' || /At$|date$/i.test(f.key)) {
                      const v = item[f.key];
                      if (v) {
                        const d = new Date(v);
                        display = isNaN(d.getTime()) ? String(v) : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                      }
                    } else {
                      const v = item[f.key];
                      // Auto-detect ISO date strings
                      if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
                        const d = new Date(v);
                        display = isNaN(d.getTime()) ? v : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                      } else {
                        display = String(v ?? '');
                      }
                    }
                    // Mask password column entirely
                    if (f.key === 'password') display = '••••••••';
                    return (
                      <td key={f.key} className="max-w-[200px] truncate px-4 py-3 text-gray-700">
                        {display}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {'isVisible' in item || 'isPublished' in item || 'isOpen' in item ? (
                        <button
                          onClick={() => toggleVisibility(item)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          title="Toggle visibility"
                        >
                          {(item.isVisible ?? item.isPublished ?? item.isOpen) ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      ) : null}
                      {canEdit && !readOnly && (
                        <button
                          onClick={() => openEdit(item)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-accent"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && !readOnly && (
                        <button
                          onClick={() => setDeleteConfirm(item._id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-danger"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Page {pagination.page} of {pagination.pages} ({pagination.total} total)</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="rounded-lg border px-3 py-1 disabled:opacity-50">Prev</button>
            <button onClick={() => setPage(Math.min(pagination.pages, page + 1))} disabled={page >= pagination.pages} className="rounded-lg border px-3 py-1 disabled:opacity-50">Next</button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-20">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editing ? `Edit ${title}` : `Create ${title}`}</h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
              {fields.map(renderFieldInput)}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary text-sm">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <Trash2 className="mx-auto mb-4 h-12 w-12 text-danger" />
            <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
            <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-lg border border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 rounded-lg bg-danger py-2 text-sm font-semibold text-white hover:bg-danger/90">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
