import { unstable_setRequestLocale } from 'next-intl/server';
import { publicApi } from '@/lib/api';
import FAQPageClient from './_components/FAQPageClient';

export default async function FAQPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const faqsRes = await publicApi.getFAQs().catch(() => ({ data: [] }));
  return <FAQPageClient faqs={faqsRes.data || []} locale={locale} />;
}
