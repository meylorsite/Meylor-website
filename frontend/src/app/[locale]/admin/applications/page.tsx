'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminApplications() {
  return (
    <AdminCrud
      resource="applications"
      title="Job Applications"
      canCreate={false}
      fields={[
        { key: 'name', label: 'Name', showInTable: true },
        { key: 'email', label: 'Email', showInTable: true },
        { key: 'phone', label: 'Phone', showInTable: true },
        { key: 'yearsOfExperience', label: 'Experience (Years)', type: 'number' },
        { key: 'cvLink', label: 'CV Link', type: 'url', showInTable: true },
        { key: 'message', label: 'Message', type: 'textarea' },
        { key: 'status', label: 'Status', type: 'select', options: [
          { value: 'pending', label: 'Pending' },
          { value: 'reviewed', label: 'Reviewed' },
          { value: 'shortlisted', label: 'Shortlisted' },
          { value: 'rejected', label: 'Rejected' },
        ], showInTable: true },
      ]}
    />
  );
}
