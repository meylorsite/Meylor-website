'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminUsers() {
  return (
    <AdminCrud
      resource="users"
      title="Users"
      fields={[
        { key: 'email', label: 'Email', required: true, showInTable: true },
        { key: 'password', label: 'Password', required: true, showInTable: false },
        { key: 'nameEn', label: 'Name (English)', showInTable: true },
        { key: 'nameAr', label: 'Name (Arabic)' },
        { key: 'role', label: 'Role', type: 'select', options: [
          { value: 'SUPER_ADMIN', label: 'Super Admin' },
          { value: 'ADMIN', label: 'Admin' },
          { value: 'EDITOR', label: 'Editor' },
          { value: 'PARENT', label: 'Parent' },
          { value: 'STUDENT', label: 'Student' },
        ], showInTable: true },
        { key: 'isActive', label: 'Active', type: 'boolean', defaultValue: true, showInTable: true },
      ]}
    />
  );
}
