import { unstable_setRequestLocale } from 'next-intl/server';
import { publicApi } from '@/lib/api';
import AboutPageClient from './_components/AboutPageClient';

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const [sections, boardRes, leadershipRes] = await Promise.all([
    publicApi.getSections('about').catch(() => ({ data: [] })),
    publicApi.getTeam('board').catch(() => ({ data: [] })),
    publicApi.getTeam('leadership').catch(() => ({ data: [] })),
  ]);
  return (
    <AboutPageClient
      sections={sections.data || []}
      boardMembers={boardRes.data || []}
      teamMembers={leadershipRes.data || []}
      locale={locale}
    />
  );
}
