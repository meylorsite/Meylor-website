'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminGallery() {
  return (
    <AdminCrud
      resource="gallery"
      title="Gallery Activities"
      fields={[
        { key: 'title', label: 'Title', bilingual: true, required: true, showInTable: true },
        { key: 'slug', label: 'Slug', required: true, showInTable: true },
        { key: 'description', label: 'Description', bilingual: true, type: 'textarea' },
        { key: 'date', label: 'Date', type: 'date', showInTable: true },
        { key: 'location', label: 'Location', bilingual: true, showInTable: true },
        { key: 'isInsideSchool', label: 'Inside School', type: 'boolean', defaultValue: true },
        { key: 'coverImageUrl', label: 'Cover Image URL', type: 'url' },
        { key: 'media', label: 'Photos & Videos', type: 'media-gallery' },
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'isVisible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
      ]}
    />
  );
}
