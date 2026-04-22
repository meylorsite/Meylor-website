'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { publicApi } from '@/lib/api';
import { getLocalizedField, formatDate } from '@/lib/utils';
import PageHero from '@/components/ui/PageHero';
import { Calendar, MapPin, ArrowLeft, ArrowRight, X, Play, Images, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export default function GalleryActivityPage() {
  const { locale, slug } = useParams() as { locale: string; slug: string };
  const t = useTranslations('gallery');
  const tc = useTranslations('common');
  const [activity, setActivity] = useState<any>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const isRTL = locale === 'ar';
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    publicApi.getGalleryActivity(slug).then((res) => setActivity(res.data)).catch(() => {});
  }, [slug]);

  const media = activity?.media || [];

  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    if (lightbox === null) return;
    if (direction === 'next') {
      setLightbox((lightbox + 1) % media.length);
    } else {
      setLightbox((lightbox - 1 + media.length) % media.length);
    }
  }, [lightbox, media.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateLightbox(isRTL ? 'prev' : 'next');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateLightbox(isRTL ? 'next' : 'prev');
      } else if (e.key === 'Escape') {
        setLightbox(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox, navigateLightbox, isRTL]);

  if (!activity) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <PageHero
        title={getLocalizedField(activity, 'title', locale)}
        subtitle={getLocalizedField(activity, 'description', locale)}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60"
        >
          <Link
            href={`/${locale}/gallery`}
            className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 transition-colors hover:border-white/40 hover:text-white"
          >
            <BackArrow className="h-3.5 w-3.5" />
            {tc('back')}
          </Link>
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(activity.date, locale)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {getLocalizedField(activity, 'location', locale)}
          </span>
          <span className="flex items-center gap-2">
            <Images className="h-4 w-4" />
            {media.length} {isRTL ? 'صورة' : 'Photos'}
          </span>
          {activity.isInsideSchool && (
            <span className="rounded-full bg-success/20 px-3 py-1 text-xs text-success">
              {tc('insideSchool')}
            </span>
          )}
        </motion.div>
      </PageHero>

      <section className="section-padding">
        <div className="container-custom">
          {media.length === 0 ? (
            <p className="text-center text-gray-400">{tc('noData')}</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {media.map((item: any, i: number) => (
                <motion.div
                  key={item._id || i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl"
                  onClick={() => item.type === 'image' && setLightbox(i)}
                >
                  {item.type === 'video' ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-48 items-center justify-center rounded-xl bg-gray-900"
                    >
                      <Play className="h-12 w-12 text-white" />
                    </a>
                  ) : (
                    <div className="relative h-48">
                      <Image
                        src={item.url}
                        alt={getLocalizedField(item, 'caption', locale) || `Photo ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  const res = await fetch(media[lightbox].url);
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `meylor-photo-${lightbox + 1}.jpg`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch { window.open(media[lightbox].url, '_blank'); }
              }}
              className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              title={isRTL ? 'تحميل' : 'Download'}
            >
              <Download className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              title={isRTL ? 'إغلاق' : 'Close'}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Image counter */}
          <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
            {lightbox + 1} / {media.length}
          </div>

          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={media[lightbox].url}
              alt=""
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Navigation hint */}
          <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/50 backdrop-blur-sm">
            {isRTL ? 'استخدم أسهم لوحة المفاتيح للتنقل' : 'Use arrow keys to navigate'}
          </div>

          {media.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
                className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
                className="absolute right-14 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
