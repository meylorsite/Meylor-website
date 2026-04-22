'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminJobs() {
  return (
    <AdminCrud
      resource="jobs"
      title="Job Posts"
      fields={[
        { key: 'title', label: 'Title', bilingual: true, required: true, showInTable: true },
        { key: 'slug', label: 'Slug', required: true, showInTable: true },
        { key: 'description', label: 'Description', bilingual: true, type: 'textarea' },
        { key: 'department', label: 'Department', bilingual: true, showInTable: true },
        { key: 'type', label: 'Job Type', bilingual: true },
        { key: 'location', label: 'Location', bilingual: true },
        { key: 'requirements', label: 'Requirements', bilingual: true, type: 'array' },
        { key: 'qualifications', label: 'Qualifications', bilingual: true, type: 'array' },
        { key: 'benefits', label: 'Benefits', bilingual: true, type: 'array' },
        { key: 'salaryRange', label: 'Salary Range' },
        { key: 'experienceRequired', label: 'Experience Required' },
        { key: 'isOpen', label: 'Open', type: 'boolean', defaultValue: true, showInTable: true },
        { key: 'order', label: 'Order', type: 'number' },
      ]}
    />
  );
}
