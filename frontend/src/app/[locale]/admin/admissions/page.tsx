'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminAdmissions() {
  return (
    <AdminCrud
      resource="admissions"
      title="Admission Applications"
      canCreate={false}
      fields={[
        { key: 'studentNameEn', label: 'Student Name (EN)', showInTable: true },
        { key: 'studentNameAr', label: 'Student Name (AR)' },
        { key: 'parentName', label: 'Parent Name', showInTable: true },
        { key: 'parentEmail', label: 'Parent Email', showInTable: true },
        { key: 'parentPhone', label: 'Parent Phone' },
        { key: 'relationship', label: 'Relationship' },
        { key: 'nationality', label: 'Nationality' },
        { key: 'nationalId', label: 'National ID' },
        { key: 'currentGrade', label: 'Grade', showInTable: true },
        { key: 'packageName', label: 'Package', showInTable: true },
        { key: 'previousSchool', label: 'Previous School' },
        { key: 'medicalConditions', label: 'Medical Conditions', type: 'textarea' },
        { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
        { key: 'gender', label: 'Gender' },
        { key: 'status', label: 'Status', type: 'select', showInTable: true, options: [
          { value: 'pending', label: 'Pending' },
          { value: 'reviewed', label: 'Reviewed' },
          { value: 'accepted', label: 'Accepted' },
          { value: 'rejected', label: 'Rejected' },
        ]},
        { key: 'adminNotes', label: 'Admin Notes', type: 'textarea' },
      ]}
    />
  );
}
