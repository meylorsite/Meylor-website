'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminFacilities() {
  return (
    <AdminCrud
      resource="facilities"
      title="Facilities"
      fields={[
        { key: 'title', label: 'Title', bilingual: true, required: true, showInTable: true },
        { key: 'description', label: 'Description', bilingual: true, type: 'textarea' },
        { key: 'imageUrl', label: 'Image URL', type: 'url', showInTable: true },
        { key: 'iconUrl', label: 'Icon URL', type: 'url' },
        { key: 'order', label: 'Order', type: 'number', showInTable: true },
        { key: 'isVisible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
      ]}
    />
  );
}
