'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { publicApi } from '@/lib/api';
import { getLocalizedField, formatDate } from '@/lib/utils';
import PageHero from '@/components/ui/PageHero';
import { Calendar, Newspaper } from 'lucide-react';

export default function NewsPage() {
  const { locale } = useParams() as { locale: string };
  const t = useTranslations('nav');
  const isRTL = locale === 'ar';
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getNews(1, 50).then((res) => { setNews(res.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        title={t('news')}
        subtitle={isRTL ? 'آخر الأخبار والمستجدات من مدرسة ميلور' : 'Latest news and updates from MEYLOR School'}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-6 text-sm text-white/60"
        >
          <span className="flex items-center gap-2"><Newspaper className="h-4 w-4" /> {news.length} {isRTL ? 'خبر' : 'Articles'}</span>
        </motion.div>
      </PageHero>

      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-72 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((post: any, i: number) => (
                <motion.div key={post._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/${locale}/news/${post.slug}`} className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg">
                    {post.imageUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <Image src={post.imageUrl} alt={getLocalizedField(post, 'title', locale)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" />
                        <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs text-white">{getLocalizedField(post, 'category', locale)}</span>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="mb-2 flex items-center gap-1 text-xs text-gray-400"><Calendar className="h-3 w-3" />{formatDate(post.publishedAt, locale)}</div>
                      <h3 className="font-bold text-gray-900 group-hover:text-primary">{getLocalizedField(post, 'title', locale)}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">{getLocalizedField(post, 'excerpt', locale)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
