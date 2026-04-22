'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminComplaints() {
  return (
    <AdminCrud
      resource="complaints"
      title="Complaint Tickets"
      canCreate={false}
      fields={[
        { key: 'ticketNumber', label: 'Ticket #', showInTable: true },
        { key: 'name', label: 'Name', showInTable: true },
        { key: 'email', label: 'Email' },
        { key: 'category', label: 'Category', showInTable: true },
        { key: 'priority', label: 'Priority', type: 'select', options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
          { value: 'urgent', label: 'Urgent' },
        ], showInTable: true },
        { key: 'details', label: 'Details', type: 'textarea' },
        { key: 'attachmentLink', label: 'Attachment Link', type: 'url' },
        { key: 'status', label: 'Status', type: 'select', options: [
          { value: 'open', label: 'Open' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'resolved', label: 'Resolved' },
          { value: 'closed', label: 'Closed' },
        ], showInTable: true },
        { key: 'adminNotes', label: 'Admin Notes', type: 'textarea' },
      ]}
    />
  );
}
