import { unstable_setRequestLocale } from 'next-intl/server';
import { publicApi } from '@/lib/api';
import JourneyPageClient from './_components/JourneyPageClient';

export default async function JourneyPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const journey = await publicApi.getJourney().catch(() => ({ data: [] }));
  return <JourneyPageClient items={journey.data || []} locale={locale} />;
}
