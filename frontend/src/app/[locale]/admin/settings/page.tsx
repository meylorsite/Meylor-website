'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const { accessToken } = useAuthStore();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (accessToken) {
      adminApi.getSettings(accessToken).then((res) => { setSettings(res.data); setLoading(false); }).catch(() => setLoading(false));
    }
  }, [accessToken]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !settings) return;
    setSaving(true);
    try {
      await adminApi.updateSettings(settings, accessToken);
      toast.success('Settings saved');
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="skeleton h-96 rounded-2xl" />;
  if (!settings) return <p className="text-gray-400">Failed to load settings</p>;

  const update = (key: string, value: any) => setSettings({ ...settings, [key]: value });
  const updateSocial = (key: string, value: string) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [key]: value } });

  const textField = (label: string, key: string, dir?: string) => (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input type="text" value={settings[key] || ''} onChange={(e) => update(key, e.target.value)} className="input-field mt-1" dir={dir} />
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary gap-2 text-sm">
          <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* General */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-900">General</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {textField('School Name (EN)', 'schoolNameEn', 'ltr')}
            {textField('School Name (AR)', 'schoolNameAr', 'rtl')}
            {textField('Tagline (EN)', 'taglineEn', 'ltr')}
            {textField('Tagline (AR)', 'taglineAr', 'rtl')}
            {textField('Logo URL', 'logoUrl')}
            {textField('Favicon URL', 'faviconUrl')}
            {textField('Phone', 'phone')}
            {textField('Email', 'email')}
            {textField('Address (EN)', 'addressEn', 'ltr')}
            {textField('Address (AR)', 'addressAr', 'rtl')}
            {textField('Map Embed URL', 'mapUrl')}
          </div>
        </div>

        {/* Social */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Social Links</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {['twitter', 'instagram', 'facebook', 'youtube', 'linkedin', 'snapchat', 'tiktok'].map((s) => (
              <div key={s}>
                <label className="text-sm font-medium capitalize text-gray-700">{s}</label>
                <input type="url" value={settings.socialLinks?.[s] || ''} onChange={(e) => updateSocial(s, e.target.value)} className="input-field mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-900">SEO</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {textField('SEO Title (EN)', 'seoTitleEn', 'ltr')}
            {textField('SEO Title (AR)', 'seoTitleAr', 'rtl')}
            {textField('SEO Description (EN)', 'seoDescriptionEn', 'ltr')}
            {textField('SEO Description (AR)', 'seoDescriptionAr', 'rtl')}
            {textField('SEO Keywords (EN)', 'seoKeywordsEn')}
            {textField('SEO Keywords (AR)', 'seoKeywordsAr')}
            {textField('OG Image URL', 'ogImageUrl')}
          </div>
        </div>
      </form>
    </div>
  );
}
