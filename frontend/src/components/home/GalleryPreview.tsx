'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { getLocalizedField, formatDate } from '@/lib/utils';
import { MapPin, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import SectionDivider from '@/components/ui/SectionDivider';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

interface GalleryPreviewProps {
  gallery: any[];
  locale: string;
}

export default function GalleryPreview({ gallery, locale }: GalleryPreviewProps) {
  const t = useTranslations('home');
  const isRTL = locale === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  if (!gallery.length) return null;

  return (
    <>
      <section className="section-gray section-padding">
        <div className="container-custom">
          <SectionHeading title={t('galleryTitle')} subtitle={t('gallerySubtitle')} label={t('galleryLabel')} />

          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              0: { slidesPerView: 1.15, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="swiper-light"
          >
            {gallery.slice(0, 8).map((activity: any) => (
              <SwiperSlide key={activity._id}>
                <Link
                  href={`/${locale}/gallery/${activity.slug}`}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-48 overflow-hidden">
                    {activity.coverImageUrl && (
                      <Image
                        src={activity.coverImageUrl}
                        alt={getLocalizedField(activity, 'title', locale)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    {activity.isInsideSchool && (
                      <span className="absolute left-3 top-3 rounded-full bg-success/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {locale === 'ar' ? 'داخل المدرسة' : 'Inside MEYLOR'}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 transition-colors group-hover:text-primary">
                      {getLocalizedField(activity, 'title', locale)}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(activity.date, locale)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {getLocalizedField(activity, 'location', locale)}
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-8 text-center">
            <Link href={`/${locale}/gallery`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent">
              {t('viewGallery')} <Arrow className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <SectionDivider variant="curve" fromColor="#f9fafb" toColor="#0087B8" />
    </>
  );
}
