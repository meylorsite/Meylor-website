import { unstable_setRequestLocale } from 'next-intl/server';
import { publicApi } from '@/lib/api';
import GalleryPageClient from './_components/GalleryPageClient';

export default async function GalleryPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const gallery = await publicApi.getGallery().catch(() => ({ data: [] }));
  return <GalleryPageClient activities={gallery.data || []} locale={locale} />;
}
