import { unstable_setRequestLocale } from 'next-intl/server';
import { publicApi } from '@/lib/api';
import CareersPageClient from './_components/CareersPageClient';

export default async function CareersPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const jobs = await publicApi.getJobs().catch(() => ({ data: [] }));
  return <CareersPageClient jobs={jobs.data || []} locale={locale} />;
}
