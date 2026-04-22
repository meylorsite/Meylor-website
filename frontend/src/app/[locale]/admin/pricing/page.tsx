'use client';
import AdminCrud from '@/components/admin/AdminCrud';

export default function AdminPricing() {
  return (
    <AdminCrud
      resource="pricing"
      title="Pricing Packages"
      fields={[
        { key: 'title', label: 'Title', bilingual: true, required: true, showInTable: true },
        { key: 'description', label: 'Description', bilingual: true, type: 'textarea' },
        { key: 'price', label: 'Price', required: true, showInTable: true },
        { key: 'currency', label: 'Currency', defaultValue: 'SAR', showInTable: true },
        { key: 'period', label: 'Period', defaultValue: 'year' },
        { key: 'features', label: 'Features', bilingual: true, type: 'array' },
        { key: 'includes', label: 'What is Included', bilingual: true, type: 'array' },
        { key: 'notIncluded', label: 'Not Included', bilingual: true, type: 'array' },
        { key: 'registrationFee', label: 'Registration Fee' },
        { key: 'installmentPlan', label: 'Installment Plan' },
        { key: 'isPopular', label: 'Popular Badge', type: 'boolean', showInTable: true },
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'isVisible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
      ]}
    />
  );
}
