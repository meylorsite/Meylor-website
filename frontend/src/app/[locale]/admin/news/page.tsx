'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminNews() {
  return (
    <AdminCrud
      resource="news"
      title="News & Events"
      fields={[
        { key: 'title', label: 'Title', bilingual: true, required: true, showInTable: true },
        { key: 'slug', label: 'Slug', required: true, showInTable: true },
        { key: 'excerpt', label: 'Excerpt', bilingual: true, type: 'textarea' },
        { key: 'content', label: 'Content', bilingual: true, type: 'textarea' },
        { key: 'imageUrl', label: 'Image URL', type: 'url' },
        { key: 'category', label: 'Category', bilingual: true, showInTable: true },
        { key: 'publishedAt', label: 'Published Date', type: 'date', showInTable: true },
        { key: 'isPublished', label: 'Published', type: 'boolean', defaultValue: true, showInTable: true },
      ]}
    />
  );
}
