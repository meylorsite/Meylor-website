import { unstable_setRequestLocale } from 'next-intl/server';
import { publicApi } from '@/lib/api';
import ProgramsPageClient from './_components/ProgramsPageClient';

export default async function ProgramsPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const programs = await publicApi.getPrograms().catch(() => ({ data: [] }));
  return <ProgramsPageClient programs={programs.data || []} locale={locale} />;
}
