'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminJourney() {
  return (
    <AdminCrud
      resource="journey"
      title="Our Journey"
      fields={[
        { key: 'title', label: 'Title', bilingual: true, required: true, showInTable: true },
        { key: 'description', label: 'Description', bilingual: true, type: 'textarea' },
        { key: 'date', label: 'Date Label', showInTable: true },
        { key: 'beforeImageUrl', label: 'Before Image URL', type: 'url' },
        { key: 'afterImageUrl', label: 'After Image URL', type: 'url' },
        { key: 'order', label: 'Order', type: 'number', showInTable: true },
        { key: 'isVisible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
      ]}
    />
  );
}
