'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { getLocalizedField, formatDate } from '@/lib/utils';
import { Calendar, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';

interface NewsPreviewProps {
  news: any[];
  locale: string;
}

export default function NewsPreview({ news, locale }: NewsPreviewProps) {
  const t = useTranslations('home');
  const isRTL = locale === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  if (!news.length) return null;

  return (
    <section className="section-light section-padding">
      <div className="container-custom">
        <SectionHeading title={t('newsTitle')} subtitle={t('newsSubtitle')} label={t('newsLabel')} />

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          navigation={{ nextEl: '.news-next', prevEl: '.news-prev' }}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            0: { slidesPerView: 1.15, spaceBetween: 16 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="swiper-light"
        >
          {news.map((post: any) => (
            <SwiperSlide key={post._id}>
              <Link
                href={`/${locale}/news/${post.slug}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-48 overflow-hidden">
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt={getLocalizedField(post, 'title', locale)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {getLocalizedField(post, 'category', locale)}
                  </span>
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.publishedAt, locale)}
                  </div>
                  <h3 className="line-clamp-2 font-bold text-gray-900 transition-colors group-hover:text-primary">
                    {getLocalizedField(post, 'title', locale)}
                  </h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-3">
            <button type="button" title="Previous" className="swiper-nav-btn-light news-prev"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" title="Next" className="swiper-nav-btn-light news-next"><ChevronRight className="h-5 w-5" /></button>
          </div>
          <Link href={`/${locale}/news`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent">
            {locale === 'ar' ? 'كل الأخبار' : 'All News'} <Arrow className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
