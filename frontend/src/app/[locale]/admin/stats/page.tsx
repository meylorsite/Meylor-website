'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminStats() {
  return (
    <AdminCrud
      resource="stats"
      title="Stat Counters"
      fields={[
        { key: 'label', label: 'Label', bilingual: true, required: true, showInTable: true },
        { key: 'value', label: 'Value', type: 'number', required: true, showInTable: true },
        { key: 'suffix', label: 'Suffix (+, %, etc)', defaultValue: '+', showInTable: true },
        { key: 'iconUrl', label: 'Icon URL', type: 'url' },
        { key: 'order', label: 'Order', type: 'number', showInTable: true },
        { key: 'isVisible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
      ]}
    />
  );
}
