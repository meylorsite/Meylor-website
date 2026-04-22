'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminPrograms() {
  return (
    <AdminCrud
      resource="programs"
      title="Programs"
      fields={[
        { key: 'title', label: 'Title', bilingual: true, required: true, showInTable: true },
        { key: 'slug', label: 'Slug', required: true, showInTable: true },
        { key: 'description', label: 'Description', bilingual: true, type: 'textarea' },
        { key: 'gradeRange', label: 'Grade Range', showInTable: true },
        { key: 'ageRange', label: 'Age Range' },
        { key: 'classSize', label: 'Class Size' },
        { key: 'curriculum', label: 'Curriculum Details', bilingual: true, type: 'textarea' },
        { key: 'schedule', label: 'Schedule', bilingual: true },
        { key: 'highlights', label: 'Highlights', bilingual: true, type: 'array' },
        { key: 'extracurriculars', label: 'Extracurriculars', bilingual: true, type: 'array' },
        { key: 'imageUrl', label: 'Image URL', type: 'url' },
        { key: 'iconUrl', label: 'Icon URL', type: 'url' },
        { key: 'order', label: 'Order', type: 'number', showInTable: true },
        { key: 'isVisible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
      ]}
    />
  );
}
