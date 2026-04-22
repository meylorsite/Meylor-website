'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminContacts() {
  return (
    <AdminCrud
      resource="contacts"
      title="Contact Messages"
      canCreate={false}
      fields={[
        { key: 'name', label: 'Name', showInTable: true },
        { key: 'email', label: 'Email', showInTable: true },
        { key: 'phone', label: 'Phone' },
        { key: 'subject', label: 'Subject', showInTable: true },
        { key: 'message', label: 'Message', type: 'textarea', showInTable: true },
        { key: 'isRead', label: 'Read', type: 'boolean', showInTable: true },
      ]}
    />
  );
}
