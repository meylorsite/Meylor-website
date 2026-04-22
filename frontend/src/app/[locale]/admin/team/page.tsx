'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminTeam() {
  return (
    <AdminCrud
      resource="team"
      title="Team Members"
      fields={[
        { key: 'name', label: 'Name', bilingual: true, required: true, showInTable: true },
        { key: 'role', label: 'Role / Position', bilingual: true, required: true, showInTable: true },
        { key: 'bio', label: 'Bio', bilingual: true, type: 'textarea' },
        { key: 'imageUrl', label: 'Photo URL', type: 'url' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        {
          key: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          showInTable: true,
          options: [
            { value: 'board', label: 'Board of Directors' },
            { value: 'leadership', label: 'Leadership Team' },
            { value: 'staff', label: 'Staff' },
          ],
        },
        { key: 'order', label: 'Order', type: 'number', showInTable: true },
        { key: 'isVisible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
      ]}
    />
  );
}
