'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminFAQs() {
  return (
    <AdminCrud
      resource="faqs"
      title="FAQs"
      fields={[
        { key: 'question', label: 'Question', bilingual: true, required: true, showInTable: true },
        { key: 'answer', label: 'Answer', bilingual: true, type: 'textarea', required: true },
        { key: 'category', label: 'Category', defaultValue: 'general', showInTable: true },
        { key: 'order', label: 'Order', type: 'number', showInTable: true },
        { key: 'isVisible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
      ]}
    />
  );
}
