'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getLocalizedField } from '@/lib/utils';
import { GraduationCap, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import SectionDivider from '@/components/ui/SectionDivider';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

interface ProgramsPreviewProps {
  programs: any[];
  locale: string;
}

export default function ProgramsPreview({ programs, locale }: ProgramsPreviewProps) {
  const t = useTranslations('home');
  const isRTL = locale === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  if (!programs.length) return null;

  return (
    <>
      <section className="section-dark section-padding relative overflow-hidden">
        <motion.div
          className="absolute -right-32 top-10 h-[350px] w-[350px] rounded-full bg-accent/15 blur-3xl"
          animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -left-20 bottom-10 h-[280px] w-[280px] rounded-full bg-amber/10 blur-3xl"
          animate={{ x: [0, -15, 10, 0], y: [0, 10, -15, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="container-custom relative z-10">
          <SectionHeading title={t('programsTitle')} subtitle={t('programsSubtitle')} label={t('programsLabel')} light />

          <Swiper
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            effect="coverflow"
            grabCursor
            centeredSlides
            coverflowEffect={{ rotate: 0, stretch: 0, depth: 200, modifier: 1, slideShadows: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={{ nextEl: '.programs-next', prevEl: '.programs-prev' }}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              0: { slidesPerView: 1.15, spaceBetween: 16 },
              640: { slidesPerView: 1.5, spaceBetween: 20 },
              1024: { slidesPerView: 2.5, spaceBetween: 30 },
              1280: { slidesPerView: 3, spaceBetween: 40 },
            }}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="!pb-16"
          >
            {programs.map((program: any) => (
              <SwiperSlide key={program._id}>
                <Link
                  href={`/${locale}/programs#${program.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm transition-all duration-500 hover:bg-white/15 hover:border-white/20"
                >
                  {program.imageUrl ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={program.imageUrl}
                        alt={getLocalizedField(program, 'title', locale)}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
                      {program.gradeRange && (
                        <span className="absolute right-3 top-3 rounded-full bg-amber/90 px-3 py-1 text-xs font-bold text-primary-dark">
                          {program.gradeRange}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-primary-dark/50">
                      <GraduationCap className="h-12 w-12 text-white/30" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white">{getLocalizedField(program, 'title', locale)}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/60">
                      {getLocalizedField(program, 'description', locale)}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors group-hover:text-accent-light">
                      {locale === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                      <Arrow className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-4 flex items-center justify-center gap-4">
            <button type="button" title="Previous" className="swiper-nav-btn programs-prev"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" title="Next" className="swiper-nav-btn programs-next"><ChevronRight className="h-5 w-5" /></button>
          </div>

          <div className="mt-8 text-center">
            <Link href={`/${locale}/programs`} className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-light">
              {t('viewPrograms')} <Arrow className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <SectionDivider variant="wave" fromColor="#003A83" toColor="#f9fafb" />
    </>
  );
}
