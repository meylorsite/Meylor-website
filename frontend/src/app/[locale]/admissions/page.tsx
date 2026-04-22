import { unstable_setRequestLocale } from 'next-intl/server';
import { publicApi } from '@/lib/api';
import AdmissionsPageClient from './_components/AdmissionsPageClient';

export default async function AdmissionsPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const [pricing, faqs] = await Promise.all([
    publicApi.getPricing().catch(() => ({ data: [] })),
    publicApi.getFAQs('admissions').catch(() => ({ data: [] })),
  ]);
  return <AdmissionsPageClient pricing={pricing.data || []} faqs={faqs.data || []} locale={locale} />;
}
