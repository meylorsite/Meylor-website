'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminTestimonials() {
  return (
    <AdminCrud
      resource="testimonials"
      title="Testimonials"
      fields={[
        { key: 'name', label: 'Name', bilingual: true, required: true, showInTable: true },
        { key: 'role', label: 'Role', bilingual: true, showInTable: true },
        { key: 'content', label: 'Content', bilingual: true, type: 'textarea', required: true },
        { key: 'avatarUrl', label: 'Avatar URL', type: 'url' },
        { key: 'rating', label: 'Rating (1-5)', type: 'number', defaultValue: 5, showInTable: true },
        { key: 'submitterEmail', label: 'Submitted By (Email)' },
        { key: 'isApproved', label: 'Approved', type: 'boolean', defaultValue: false, showInTable: true },
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'isVisible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
      ]}
    />
  );
}
