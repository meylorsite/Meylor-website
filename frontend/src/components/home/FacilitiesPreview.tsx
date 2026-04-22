'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getLocalizedField } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import SectionDivider from '@/components/ui/SectionDivider';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface FacilitiesPreviewProps {
  facilities: any[];
  locale: string;
}

export default function FacilitiesPreview({ facilities, locale }: FacilitiesPreviewProps) {
  const t = useTranslations('home');
  const isRTL = locale === 'ar';

  if (!facilities.length) return null;

  return (
    <>
      <section className="section-gray section-padding">
        <div className="container-custom">
          <SectionHeading title={t('facilitiesTitle')} subtitle={t('facilitiesSubtitle')} label={t('facilitiesLabel')} />
        </div>

        <div className="container-custom relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            navigation={{ nextEl: '.facilities-next', prevEl: '.facilities-prev' }}
            pagination={{ type: 'progressbar' }}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              0: { slidesPerView: 1.1, spaceBetween: 16 },
              640: { slidesPerView: 1.5, spaceBetween: 20 },
              1024: { slidesPerView: 2.2, spaceBetween: 24 },
              1280: { slidesPerView: 2.5, spaceBetween: 30 },
            }}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="swiper-light !pb-10"
          >
            {facilities.map((facility: any) => (
              <SwiperSlide key={facility._id}>
                <Link href={`/${locale}/gallery`} className="group relative block h-[340px] overflow-hidden rounded-3xl">
                  {facility.imageUrl ? (
                    <Image
                      src={facility.imageUrl}
                      alt={getLocalizedField(facility, 'title', locale)}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary/5">
                      <span className="text-5xl text-primary/10">M</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <h3 className="text-xl font-bold text-white">{getLocalizedField(facility, 'title', locale)}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {getLocalizedField(facility, 'description', locale)}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button type="button" title="Previous" className="swiper-nav-btn-light facilities-prev"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" title="Next" className="swiper-nav-btn-light facilities-next"><ChevronRight className="h-5 w-5" /></button>
          </div>

          <div className="mt-6 text-center">
            <Link
              href={`/${locale}/gallery`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
            >
              {locale === 'ar' ? 'عرض المزيد' : 'View More'}
              {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Link>
          </div>
        </div>
      </section>
      <SectionDivider variant="wave" fromColor="#f9fafb" toColor="#003A83" />
    </>
  );
}
