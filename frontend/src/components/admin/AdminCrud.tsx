'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, X, Eye, EyeOff, GripVertical, ImagePlus, Check, FileText, Download, Calendar } from 'lucide-react';

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
  const { locale } = useParams() as { locale: string };
  const isAr = locale === 'ar';
  const { accessToken } = useAuthStore();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewing, setViewing] = useState<any>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFrom, setExportFrom] = useState('');
  const [exportTo, setExportTo] = useState('');
  const [exporting, setExporting] = useState(false);

  // ---- Arabic label dictionaries ---------------------------------------
  const LABEL_AR: Record<string, string> = {
    'Title': 'العنوان',
    'Name': 'الاسم',
    'Role': 'الدور',
    'Role / Position': 'المنصب',
    'Email': 'البريد الإلكتروني',
    'Phone': 'الهاتف',
    'Slug': 'المعرّف (Slug)',
    'Order': 'الترتيب',
    'Visible': 'ظاهر',
    'Active': 'نشط',
    'Approved': 'معتمد',
    'Published': 'منشور',
    'Open': 'مفتوح',
    'Category': 'التصنيف',
    'Description': 'الوصف',
    'Content': 'المحتوى',
    'Message': 'الرسالة',
    'Subject': 'الموضوع',
    'Rating (1-5)': 'التقييم (1-5)',
    'Image URL': 'رابط الصورة',
    'Cover Image URL': 'رابط صورة الغلاف',
    'Avatar URL': 'رابط الصورة الشخصية',
    'Photo URL': 'رابط الصورة',
    'Logo URL': 'رابط الشعار',
    'Icon URL': 'رابط الأيقونة',
    'Before Image URL': 'رابط الصورة قبل',
    'After Image URL': 'رابط الصورة بعد',
    'Date': 'التاريخ',
    'Date of Birth': 'تاريخ الميلاد',
    'Gender': 'الجنس',
    'Grade': 'الصف',
    'Grade Range': 'نطاق الصفوف',
    'Age Range': 'الفئة العمرية',
    'Class Size': 'حجم الفصل',
    'Curriculum': 'المنهج',
    'Schedule': 'الجدول الزمني',
    'Highlights': 'أبرز الملامح',
    'Extracurriculars': 'الأنشطة اللاصفية',
    'Features': 'المميزات',
    'What is Included': 'ما يشمله',
    'Not Included': 'لا يشمل',
    'Price': 'السعر',
    'Currency': 'العملة',
    'Period': 'المدة',
    'Popular Badge': 'شارة الأكثر طلباً',
    'Registration Fee': 'رسوم التسجيل',
    'Installment Plan': 'خطة التقسيط',
    'Requirements': 'المتطلبات',
    'Qualifications': 'المؤهلات',
    'Benefits': 'المزايا',
    'Department': 'القسم',
    'Job Type': 'نوع الوظيفة',
    'Location': 'الموقع',
    'Salary Range': 'نطاق الراتب',
    'Experience Required': 'الخبرة المطلوبة',
    'Bio': 'نبذة',
    'Status': 'الحالة',
    'Priority': 'الأولوية',
    'Details': 'التفاصيل',
    'Ticket Number': 'رقم التذكرة',
    'Admin Notes': 'ملاحظات الإدارة',
    'Attachment Link': 'رابط المرفق',
    'Years of Experience': 'سنوات الخبرة',
    'CV Link': 'رابط السيرة الذاتية',
    'Photos & Videos': 'الصور والفيديوهات',
    'Inside School': 'داخل المدرسة',
    'Parent Name': 'اسم ولي الأمر',
    'Parent Email': 'بريد ولي الأمر',
    'Parent Phone': 'هاتف ولي الأمر',
    'Student Name (EN)': 'اسم الطالب (إنجليزي)',
    'Student Name (AR)': 'اسم الطالب (عربي)',
    'Package': 'الباقة',
    'Previous School': 'المدرسة السابقة',
    'Medical Conditions': 'الحالات الصحية',
    'Relationship': 'صلة القرابة',
    'Nationality': 'الجنسية',
    'National ID': 'رقم الهوية',
    'Read': 'مقروء',
    'Read More': 'اقرأ المزيد',
    'Question': 'السؤال',
    'Answer': 'الإجابة',
    'Current Grade': 'الصف الحالي',
    'Submitted By (Email)': 'إيميل مقدّم المراجعة',
    'Name (English)': 'الاسم (إنجليزي)',
    'Name (Arabic)': 'الاسم (عربي)',
  };

  const localizeLabel = (label: string): string => {
    if (!isAr) return label;
    // Strip bilingual suffix before lookup
    const base = label.replace(/\s*\((EN|AR)\)\s*$/i, '').trim();
    const translated = LABEL_AR[base] || LABEL_AR[label];
    if (!translated) return label;
    // Re-append suffix if it was stripped
    const suffixMatch = label.match(/\s*\((EN|AR)\)\s*$/i);
    if (suffixMatch) {
      const suffix = suffixMatch[1].toUpperCase();
      return `${translated} (${suffix === 'EN' ? 'إنجليزي' : 'عربي'})`;
    }
    return translated;
  };

  const TITLE_AR: Record<string, string> = {
    'Programs': 'البرامج',
    'News': 'الأخبار',
    'Gallery Activities': 'أنشطة المعرض',
    'Testimonials': 'المراجعات',
    'Facilities': 'المرافق',
    'Team Members': 'أعضاء الفريق',
    'Job Posts': 'الوظائف',
    'Pricing Packages': 'باقات الأسعار',
    'Sections': 'الأقسام',
    'FAQs': 'الأسئلة الشائعة',
    'Stats': 'الإحصائيات',
    'Journey': 'رحلتنا',
    'Users': 'المستخدمون',
    'Contact Messages': 'الرسائل',
    'Complaint Tickets': 'الشكاوى',
    'Job Applications': 'طلبات التوظيف',
    'Admission Applications': 'طلبات القبول',
    'Newsletter Subscribers': 'المشتركون',
    'Admissions': 'القبول والتسجيل',
    'Contacts': 'الرسائل',
    'Complaints': 'الشكاوى',
    'Applications': 'طلبات التوظيف',
    'Newsletter': 'النشرة البريدية',
    'Journey Items': 'عناصر الرحلة',
    'Stats Counters': 'عدادات الإحصائيات',
    'Site Settings': 'إعدادات الموقع',
  };
  const localizeTitle = (t: string) => (isAr ? TITLE_AR[t] || t : t);

  // Debounce the search input so we don't hit the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setLoadError(null);
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '20');
    params.set('sort', sort);
    if (search) params.set('search', search);

    // Retry on transient failures (Render free-tier cold starts can take 30-50s
    // to wake the API, which may error out the first call). 3 tries, 2s gap.
    let lastErr: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await adminApi.getAll(resource, accessToken, params.toString());
        setItems(res.data || []);
        setPagination(res.pagination);
        setLoadError(null);
        setLoading(false);
        return;
      } catch (err: any) {
        lastErr = err;
        const msg = err?.message || '';
        // Don't retry on auth / client errors
        if (/401|403|404/.test(msg)) break;
        if (attempt < 2) await new Promise((r) => setTimeout(r, 2000));
      }
    }

    const msg = lastErr?.message || '';
    setLoadError(msg || (isAr ? 'فشل الاتصال بالخادم' : 'Server connection failed'));
    setLoading(false);
  }, [accessToken, resource, page, search, sort, isAr]);

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
        toast.success(isAr ? 'تم التحديث بنجاح' : 'Updated successfully');
      } else {
        await adminApi.create(resource, formData, accessToken);
        toast.success(isAr ? 'تم الإنشاء بنجاح' : 'Created successfully');
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || (isAr ? 'فشل الحفظ' : 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    try {
      await adminApi.remove(resource, id, accessToken);
      toast.success(isAr ? 'تم الحذف بنجاح' : 'Deleted successfully');
      setDeleteConfirm(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || (isAr ? 'فشل الحذف' : 'Delete failed'));
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
      toast.error(isAr ? 'فشل التحديث' : 'Update failed');
    }
  };

  const toggleApproval = async (item: any) => {
    if (!accessToken) return;
    try {
      await adminApi.update(resource, item._id, { isApproved: !item.isApproved }, accessToken);
      toast.success(
        item.isApproved
          ? (isAr ? 'تم إلغاء الموافقة' : 'Approval revoked')
          : (isAr ? 'تمت الموافقة — ظاهر على الموقع' : 'Approved — now visible on site')
      );
      fetchData();
    } catch {
      toast.error(isAr ? 'فشل التحديث' : 'Update failed');
    }
  };

  const formatCellForCSV = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.map((v) => (typeof v === 'object' ? JSON.stringify(v) : String(v))).join(' | ');
    if (typeof value === 'object') {
      // Mongoose populated ObjectId
      if (value._id) {
        return String(value.titleEn || value.nameEn || value.email || value._id);
      }
      return JSON.stringify(value);
    }
    const str = String(value);
    if (/^\d{4}-\d{2}-\d{2}T/.test(str)) {
      const d = new Date(str);
      if (!isNaN(d.getTime())) return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    }
    return str;
  };

  const csvEscape = (s: string) => {
    if (s == null) return '';
    const v = String(s);
    if (/[",\n\r]/.test(v)) return '"' + v.replace(/"/g, '""') + '"';
    return v;
  };

  const downloadExport = async () => {
    if (!accessToken) return;
    setExporting(true);
    try {
      // Fetch ALL items (paginate if needed; backend returns up to ~200 per page w/o limit, fallback to repeated calls)
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('limit', '5000'); // large enough for a school
      const res = await adminApi.getAll(resource, accessToken, params.toString());
      let rows: any[] = Array.isArray(res.data) ? res.data : (res.data?.applications || res.data?.items || []);

      // Filter by date range (createdAt or publishedAt or date)
      if (exportFrom || exportTo) {
        const from = exportFrom ? new Date(exportFrom).getTime() : 0;
        const to = exportTo ? new Date(exportTo).getTime() + 86400000 : Infinity; // inclusive of end day
        rows = rows.filter((r: any) => {
          const raw = r.createdAt || r.publishedAt || r.date || r.updatedAt;
          const t = raw ? new Date(raw).getTime() : 0;
          return t >= from && t <= to;
        });
      }

      if (rows.length === 0) {
        toast.error(isAr ? 'لا توجد سجلات تطابق النطاق المختار' : 'No records match the selected range');
        return;
      }

      // Build columns from field definitions + common meta fields
      // NOTE: CSV column headers stay English for Excel compatibility.
      const columnKeys: string[] = [];
      const columnLabels: string[] = [];
      fields.forEach((f) => {
        if (f.key === 'password') return;
        if (f.bilingual) {
          columnKeys.push(`${f.key}En`);
          columnLabels.push(`${f.label} (EN)`);
          columnKeys.push(`${f.key}Ar`);
          columnLabels.push(`${f.label} (AR)`);
        } else {
          columnKeys.push(f.key);
          columnLabels.push(f.label);
        }
      });
      // Always include timestamps
      if (!columnKeys.includes('createdAt')) {
        columnKeys.push('createdAt');
        columnLabels.push('Submitted At');
      }

      const header = columnLabels.map(csvEscape).join(',');
      const body = rows
        .map((row) => columnKeys.map((k) => csvEscape(formatCellForCSV(row[k]))).join(','))
        .join('\n');

      // BOM for Excel UTF-8 compatibility (Arabic support)
      const csv = '﻿' + header + '\n' + body;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const fromStr = exportFrom || 'all';
      const toStr = exportTo || 'all';
      a.href = url;
      a.download = `${resource}-${fromStr}-to-${toStr}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(
        isAr
          ? `تم تصدير ${rows.length} سجل`
          : `Exported ${rows.length} record${rows.length === 1 ? '' : 's'}`
      );
      setExportOpen(false);
    } catch (e: any) {
      toast.error(e.message || (isAr ? 'فشل التصدير' : 'Export failed'));
    } finally {
      setExporting(false);
    }
  };

  const tableFields = fields.filter((f) => f.showInTable !== false).slice(0, 5);

  const renderFieldInput = (field: Field) => {
    if (field.bilingual) {
      return (
        <div key={field.key} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{localizeLabel(field.label)}</label>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <span className="text-xs text-gray-400">{isAr ? 'إنجليزي' : 'English'}</span>
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
              <span className="text-xs text-gray-400">{isAr ? 'عربي' : 'Arabic'}</span>
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
            <label className="text-sm font-medium text-gray-700">{localizeLabel(field.label)}</label>
            <button
              type="button"
              onClick={addMediaItem}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-accent px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/5"
            >
              <ImagePlus className="h-3.5 w-3.5" /> {isAr ? 'إضافة صورة/فيديو' : 'Add Photo/Video'}
            </button>
          </div>
          {mediaItems.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-400">
              {isAr
                ? 'لا توجد عناصر وسائط بعد. اضغط "إضافة صورة/فيديو" للبدء.'
                : 'No media items yet. Click "Add Photo/Video" to begin.'}
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
                      title={isAr ? 'تحريك لأعلى' : 'Move up'}
                    >
                      <GripVertical className="h-3.5 w-3.5 rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === mediaItems.length - 1}
                      className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-30"
                      title={isAr ? 'تحريك لأسفل' : 'Move down'}
                    >
                      <GripVertical className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMediaItem(index)}
                      className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-danger"
                      title={isAr ? 'إزالة' : 'Remove'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <span className="text-xs text-gray-400">{isAr ? 'الرابط' : 'URL'}</span>
                    <input
                      type="url"
                      value={item.url || ''}
                      onChange={(e) => updateMediaItem(index, 'url', e.target.value)}
                      placeholder="https://..."
                      className="input-field"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">{isAr ? 'النوع' : 'Type'}</span>
                    <select
                      value={item.type || 'image'}
                      onChange={(e) => updateMediaItem(index, 'type', e.target.value)}
                      className="input-field"
                      title={isAr ? 'النوع' : 'Media type'}
                    >
                      <option value="image">{isAr ? 'صورة' : 'Image'}</option>
                      <option value="video">{isAr ? 'فيديو' : 'Video'}</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">{isAr ? 'الترتيب' : 'Order'}</span>
                    <input
                      type="number"
                      value={item.order ?? index}
                      onChange={(e) => updateMediaItem(index, 'order', parseInt(e.target.value) || 0)}
                      className="input-field"
                      title={isAr ? 'الترتيب' : 'Order'}
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">{isAr ? 'التعليق (إنجليزي)' : 'Caption (English)'}</span>
                    <input
                      type="text"
                      value={item.captionEn || ''}
                      onChange={(e) => updateMediaItem(index, 'captionEn', e.target.value)}
                      className="input-field"
                      dir="ltr"
                      placeholder={isAr ? 'تعليق إنجليزي' : 'English caption'}
                    />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">{isAr ? 'التعليق (عربي)' : 'Caption (Arabic)'}</span>
                    <input
                      type="text"
                      value={item.captionAr || ''}
                      onChange={(e) => updateMediaItem(index, 'captionAr', e.target.value)}
                      className="input-field"
                      dir="rtl"
                      placeholder={isAr ? 'تعليق عربي' : 'Arabic caption'}
                    />
                  </div>
                </div>
                {item.url && item.type === 'image' && (
                  <div className="mt-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
        <label className="text-sm font-medium text-gray-700">{localizeLabel(field.label)}</label>
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
            <option value="">{isAr ? 'اختر...' : 'Select...'}</option>
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
            <span className="text-sm text-gray-600">{localizeLabel(field.label)}</span>
          </label>
        ) : field.type === 'number' ? (
          <input
            type="number"
            value={formData[field.key] ?? 0}
            onChange={(e) => setFormData({ ...formData, [field.key]: parseFloat(e.target.value) || 0 })}
            className="input-field"
            dir="ltr"
          />
        ) : field.type === 'url' ? (
          <input
            type="url"
            value={formData[field.key] || ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            className="input-field"
            dir="ltr"
          />
        ) : field.type === 'date' ? (
          <input
            type="date"
            value={formData[field.key] || ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            className="input-field"
            dir="ltr"
          />
        ) : (
          <input
            type="text"
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
        <h1 className="text-2xl font-bold text-gray-900">{localizeTitle(title)}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400`} />
            <input
              type="text"
              placeholder={isAr ? 'بحث...' : 'Search...'}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={`w-48 rounded-lg border border-gray-300 py-2 ${isAr ? 'pr-9 pl-8' : 'pl-9 pr-8'} text-sm focus:border-accent focus:outline-none sm:w-56`}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className={`absolute ${isAr ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100`}
                title={isAr ? 'مسح' : 'Clear'}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm focus:border-accent focus:outline-none"
            title={isAr ? 'الترتيب' : 'Sort'}
          >
            <option value="-createdAt">{isAr ? 'الأحدث أولاً' : 'Newest first'}</option>
            <option value="createdAt">{isAr ? 'الأقدم أولاً' : 'Oldest first'}</option>
            <option value="order">{isAr ? 'الترتيب (تصاعدي)' : 'Order (asc)'}</option>
            <option value="-order">{isAr ? 'الترتيب (تنازلي)' : 'Order (desc)'}</option>
            <option value="nameEn">{isAr ? 'الاسم أ–ي' : 'Name A–Z'}</option>
            <option value="-nameEn">{isAr ? 'الاسم ي–أ' : 'Name Z–A'}</option>
            <option value="titleEn">{isAr ? 'العنوان أ–ي' : 'Title A–Z'}</option>
            <option value="-titleEn">{isAr ? 'العنوان ي–أ' : 'Title Z–A'}</option>
          </select>
          <button
            type="button"
            onClick={() => setExportOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-primary hover:text-primary"
          >
            <Download className="h-4 w-4" /> {isAr ? 'تصدير' : 'Export'}
          </button>
          {canCreate && !readOnly && (
            <button onClick={openCreate} className="btn-primary gap-2 text-sm">
              <Plus className="h-4 w-4" /> {isAr ? 'إضافة جديد' : 'Add New'}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="relative w-full overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              {tableFields.map((f) => (
                <th key={f.key} className={`whitespace-nowrap px-4 py-3 ${isAr ? 'text-right' : 'text-left'} font-medium text-gray-500`}>
                  {localizeLabel(f.label)}
                </th>
              ))}
              <th className={`sticky ${isAr ? 'left-0' : 'right-0'} whitespace-nowrap bg-gray-50 px-4 py-3 ${isAr ? 'text-left' : 'text-right'} font-medium text-gray-500`}>
                {isAr ? 'الإجراءات' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={tableFields.length + 1} className="px-4 py-3"><div className="skeleton h-6 w-full" /></td></tr>
              ))
            ) : loadError ? (
              <tr>
                <td colSpan={tableFields.length + 1} className="px-4 py-16 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
                      <X className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {isAr ? 'تعذّر تحميل البيانات' : 'Could not load data'}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {isAr
                        ? 'قد يكون الخادم في وضع السكون. انتظر ثوانٍ وأعد المحاولة.'
                        : 'The server may be waking up. Wait a few seconds and retry.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => fetchData()}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                    >
                      {isAr ? 'إعادة المحاولة' : 'Retry'}
                    </button>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={tableFields.length + 1} className="px-4 py-12 text-center text-gray-400">{isAr ? 'لا توجد عناصر' : 'No items found'}</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50">
                  {tableFields.map((f) => {
                    let display: any = '';
                    if (f.bilingual) {
                      display = isAr
                        ? (item[`${f.key}Ar`] || item[`${f.key}En`] || '')
                        : (item[`${f.key}En`] || item[`${f.key}Ar`] || '');
                    } else if (f.type === 'boolean') {
                      display = item[f.key] ? '✓' : '✗';
                    } else if (f.type === 'date' || /At$|date$/i.test(f.key)) {
                      const v = item[f.key];
                      if (v) {
                        const d = new Date(v);
                        display = isNaN(d.getTime())
                          ? String(v)
                          : d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                      }
                    } else {
                      const v = item[f.key];
                      // Auto-detect ISO date strings
                      if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
                        const d = new Date(v);
                        display = isNaN(d.getTime())
                          ? v
                          : d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
                    <div className={`flex items-center ${isAr ? 'justify-start' : 'justify-end'} gap-1`}>
                      <button
                        type="button"
                        onClick={() => setViewing(item)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary"
                        title={isAr ? 'عرض التفاصيل' : 'View details'}
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      {'isApproved' in item ? (
                        <button
                          type="button"
                          onClick={() => toggleApproval(item)}
                          className={`rounded-lg p-2 ${item.isApproved ? 'text-success hover:bg-success/10' : 'text-amber hover:bg-amber/10'}`}
                          title={item.isApproved
                            ? (isAr ? 'معتمد — اضغط للإلغاء' : 'Approved — click to revoke')
                            : (isAr ? 'قيد المراجعة — اضغط للموافقة' : 'Pending — click to approve')}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      ) : null}
                      {'isVisible' in item || 'isPublished' in item || 'isOpen' in item ? (
                        <button
                          type="button"
                          onClick={() => toggleVisibility(item)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          title={isAr ? 'تبديل الظهور' : 'Toggle visibility'}
                        >
                          {(item.isVisible ?? item.isPublished ?? item.isOpen) ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      ) : null}
                      {canEdit && !readOnly && (
                        <button
                          onClick={() => openEdit(item)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-accent"
                          title={isAr ? 'تعديل' : 'Edit'}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && !readOnly && (
                        <button
                          onClick={() => setDeleteConfirm(item._id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-danger"
                          title={isAr ? 'حذف' : 'Delete'}
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
          <span>
            {isAr
              ? `صفحة ${pagination.page} من ${pagination.pages} (الإجمالي ${pagination.total})`
              : `Page ${pagination.page} of ${pagination.pages} (${pagination.total} total)`}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="rounded-lg border px-3 py-1 disabled:opacity-50">
              {isAr ? 'السابق' : 'Prev'}
            </button>
            <button onClick={() => setPage(Math.min(pagination.pages, page + 1))} disabled={page >= pagination.pages} className="rounded-lg border px-3 py-1 disabled:opacity-50">
              {isAr ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-20">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? (isAr ? 'تعديل' : 'Edit') : (isAr ? 'إضافة' : 'Create')} {localizeTitle(title)}
              </h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
              {fields.map(renderFieldInput)}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={saving} className="btn-primary text-sm">
                  {saving
                    ? (isAr ? 'جارِ الحفظ...' : 'Saving...')
                    : editing
                      ? (isAr ? 'تحديث' : 'Update')
                      : (isAr ? 'إنشاء' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (() => {
        const target = items.find((it) => it._id === deleteConfirm);
        const labelField = tableFields.find((f) => f.showInTable !== false) || fields[0];
        const entityLabel = target
          ? (labelField?.bilingual
              ? (isAr
                  ? (target[`${labelField.key}Ar`] || target[`${labelField.key}En`])
                  : (target[`${labelField.key}En`] || target[`${labelField.key}Ar`]))
              : target[labelField.key]) || target.name || target.email || target.title || (isAr ? 'هذا العنصر' : 'this item')
          : (isAr ? 'هذا العنصر' : 'this item');
        const resourceSingular = title.endsWith('s') ? title.slice(0, -1) : title;
        const resourceSingularLocalized = localizeTitle(resourceSingular);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
              <Trash2 className="mx-auto mb-4 h-12 w-12 text-danger" />
              <h3 className="text-lg font-bold text-gray-900">
                {isAr ? `حذف ${resourceSingularLocalized}؟` : `Delete ${resourceSingular}?`}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">&ldquo;{String(entityLabel).slice(0, 60)}&rdquo;</span>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {isAr ? 'لا يمكن التراجع عن هذا الإجراء.' : 'This action cannot be undone.'}
              </p>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-lg border border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="button" onClick={() => handleDelete(deleteConfirm)} className="flex-1 rounded-lg bg-danger py-2 text-sm font-semibold text-white hover:bg-danger/90">
                  {isAr ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* View Details Modal */}
      {viewing && (() => {
        const entries: { label: string; value: any; wide?: boolean }[] = [];
        fields.forEach((f) => {
          if (f.key === 'password') return;
          if (f.bilingual) {
            entries.push({ label: `${f.label} (EN)`, value: viewing[`${f.key}En`], wide: f.type === 'textarea' });
            entries.push({ label: `${f.label} (AR)`, value: viewing[`${f.key}Ar`], wide: f.type === 'textarea' });
          } else if (f.type === 'media-gallery') {
            entries.push({ label: f.label, value: viewing[f.key], wide: true });
          } else {
            entries.push({ label: f.label, value: viewing[f.key], wide: f.type === 'textarea' });
          }
        });
        if (viewing.createdAt) entries.push({ label: isAr ? 'تاريخ الإرسال' : 'Submitted At', value: viewing.createdAt });
        if (viewing.updatedAt) entries.push({ label: isAr ? 'آخر تحديث' : 'Last Updated', value: viewing.updatedAt });

        const renderValue = (val: any, field: Field | undefined) => {
          if (val === null || val === undefined || val === '') return <span className="text-gray-300">—</span>;
          if (typeof val === 'boolean') return <span className={val ? 'text-success' : 'text-gray-400'}>{val ? (isAr ? 'نعم' : 'Yes') : (isAr ? 'لا' : 'No')}</span>;
          if (Array.isArray(val)) {
            if (field?.type === 'media-gallery') {
              return (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {val.map((m: any, i: number) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                      {m.type === 'image' && m.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.url} alt={m.captionEn || ''} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">{m.type || 'file'}</div>
                      )}
                    </div>
                  ))}
                </div>
              );
            }
            return <span>{val.join(', ')}</span>;
          }
          if (typeof val === 'object') {
            if (val._id) return <span>{val.titleEn || val.nameEn || val.email || val._id}</span>;
            return <span className="text-xs text-gray-500">{JSON.stringify(val)}</span>;
          }
          const str = String(val);
          if (/^\d{4}-\d{2}-\d{2}T/.test(str)) {
            const d = new Date(str);
            if (!isNaN(d.getTime())) return <span>{d.toLocaleString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>;
          }
          if (/^https?:\/\//.test(str)) return <a href={str} target="_blank" rel="noopener noreferrer" className="break-all text-accent hover:underline" dir="ltr">{str}</a>;
          return <span className="whitespace-pre-wrap">{str}</span>;
        };

        return (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-12">
            <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 p-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{isAr ? 'التفاصيل' : 'Details'}</h2>
                  <p className="text-xs text-gray-400" dir="ltr">ID: {viewing._id}</p>
                </div>
                <button type="button" onClick={() => setViewing(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" title={isAr ? 'إغلاق' : 'Close'}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto p-5">
                <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  {entries.map((e, i) => {
                    const field = fields.find((f) => f.label === e.label || f.label + ' (EN)' === e.label || f.label + ' (AR)' === e.label);
                    return (
                      <div key={i} className={e.wide ? 'sm:col-span-2' : ''}>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">{localizeLabel(e.label)}</dt>
                        <dd className="mt-1 text-sm text-gray-800">{renderValue(e.value, field)}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-gray-100 p-4">
                {canEdit && !readOnly && (
                  <button
                    type="button"
                    onClick={() => { const item = viewing; setViewing(null); openEdit(item); }}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Pencil className="h-4 w-4" /> {isAr ? 'تعديل' : 'Edit'}
                  </button>
                )}
                <button type="button" onClick={() => setViewing(null)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Export Modal */}
      {exportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Download className="h-5 w-5 text-primary" /> {isAr ? 'تصدير كـ CSV' : 'Export to CSV'}
              </h2>
              <button type="button" onClick={() => setExportOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" title={isAr ? 'إغلاق' : 'Close'}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <p className="text-xs text-gray-500">
                {isAr
                  ? `تصدير ${localizeTitle(title)} كملف CSV (يُفتح في Excel). اترك التواريخ فارغة لتصدير كل السجلات.`
                  : `Export ${title.toLowerCase()} as a CSV file (opens in Excel). Leave dates empty to export everything.`}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="export-from" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <Calendar className="mr-1 inline h-3 w-3" /> {isAr ? 'من' : 'From'}
                  </label>
                  <input
                    id="export-from"
                    type="date"
                    value={exportFrom}
                    onChange={(e) => setExportFrom(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label htmlFor="export-to" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <Calendar className="mr-1 inline h-3 w-3" /> {isAr ? 'إلى' : 'To'}
                  </label>
                  <input
                    id="export-to"
                    type="date"
                    value={exportTo}
                    onChange={(e) => setExportTo(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => { setExportFrom(''); setExportTo(''); }}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  {isAr ? 'كل الفترات' : 'All time'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    const start = new Date(now.getFullYear(), now.getMonth(), 1);
                    setExportFrom(start.toISOString().slice(0, 10));
                    setExportTo(now.toISOString().slice(0, 10));
                  }}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  {isAr ? 'هذا الشهر' : 'This month'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    const start = new Date(now);
                    start.setDate(start.getDate() - 30);
                    setExportFrom(start.toISOString().slice(0, 10));
                    setExportTo(now.toISOString().slice(0, 10));
                  }}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  {isAr ? 'آخر 30 يوم' : 'Last 30 days'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 p-4">
              <button type="button" onClick={() => setExportOpen(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={downloadExport}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {exporting
                  ? (isAr ? 'جارِ التوليد…' : 'Generating…')
                  : (isAr ? 'تنزيل CSV' : 'Download CSV')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
