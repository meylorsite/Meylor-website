'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminNewsletter() {
  return (
    <AdminCrud
      resource="newsletter"
      title="Newsletter Subscribers"
      canCreate={false}
      canEdit={false}
      fields={[
        { key: 'email', label: 'Email', showInTable: true },
        { key: 'isActive', label: 'Active', type: 'boolean', showInTable: true },
        { key: 'createdAt', label: 'Subscribed At', showInTable: true },
      ]}
    />
  );
}
