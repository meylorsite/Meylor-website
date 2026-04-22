'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminSections() {
  return (
    <AdminCrud
      resource="sections"
      title="Sections"
      fields={[
        { key: 'key', label: 'Key', required: true, showInTable: true },
        { key: 'title', label: 'Title', bilingual: true, showInTable: true },
        { key: 'subtitle', label: 'Subtitle', bilingual: true },
        { key: 'content', label: 'Content', bilingual: true, type: 'textarea' },
        { key: 'imageUrl', label: 'Image URL', type: 'url' },
        { key: 'ctaText', label: 'CTA Text', bilingual: true },
        { key: 'ctaLink', label: 'CTA Link', type: 'url' },
        { key: 'page', label: 'Page', type: 'select', options: [
          { value: 'home', label: 'Home' },
          { value: 'about', label: 'About' },
          { value: 'admissions', label: 'Admissions' },
        ], showInTable: true },
        { key: 'order', label: 'Order', type: 'number', showInTable: true },
        { key: 'isVisible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
      ]}
    />
  );
}
