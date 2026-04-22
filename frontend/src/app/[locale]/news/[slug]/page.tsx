'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { publicApi } from '@/lib/api';
import { getLocalizedField, formatDate } from '@/lib/utils';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';

export default function NewsDetailPage() {
  const { locale, slug } = useParams() as { locale: string; slug: string };
  const [post, setPost] = useState<any>(null);
  const isRTL = locale === 'ar';
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    publicApi.getNewsPost(slug).then((res) => setPost(res.data)).catch(() => {});
  }, [slug]);

  if (!post) {
    return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <article className="section-padding">
      <div className="container-custom mx-auto max-w-3xl">
        <Link href={`/${locale}/news`} className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary">
          <BackArrow className="h-4 w-4" />
          {locale === 'ar' ? 'العودة للأخبار' : 'Back to News'}
        </Link>

        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {getLocalizedField(post, 'category', locale)}
        </span>

        <h1 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
          {getLocalizedField(post, 'title', locale)}
        </h1>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="h-4 w-4" />
          {formatDate(post.publishedAt, locale)}
        </div>

        {post.imageUrl && (
          <div className="relative mt-8 h-64 overflow-hidden rounded-2xl md:h-96">
            <Image src={post.imageUrl} alt="" fill className="object-cover" sizes="100vw" />
          </div>
        )}

        <div className="prose prose-lg mt-8 max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {getLocalizedField(post, 'content', locale)}
        </div>
      </div>
    </article>
  );
}
