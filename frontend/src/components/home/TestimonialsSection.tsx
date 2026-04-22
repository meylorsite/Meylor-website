'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getLocalizedField } from '@/lib/utils';
import { Star, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import SectionDivider from '@/components/ui/SectionDivider';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

interface TestimonialsSectionProps {
  testimonials: any[];
  locale: string;
}

export default function TestimonialsSection({ testimonials, locale }: TestimonialsSectionProps) {
  const t = useTranslations('home');
  const isRTL = locale === 'ar';

  if (!testimonials.length) return null;

  return (
    <>
      <section className="section-dark section-padding relative overflow-hidden">
        {/* Decorative giant quote mark */}
        <div className="pointer-events-none absolute left-10 top-20 select-none text-[200px] font-serif leading-none text-white/[0.03]">
          &ldquo;
        </div>
        <motion.div
          className="absolute -right-20 top-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container-custom relative z-10">
          <SectionHeading title={t('testimonialsTitle')} subtitle={t('testimonialsSubtitle')} label={t('testimonialsLabel')} light />

          <Swiper
            modules={[EffectFade, Pagination, Navigation, Autoplay]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={{ nextEl: '.testimonials-next', prevEl: '.testimonials-prev' }}
            autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="!pb-16"
          >
            {testimonials.slice(0, 8).map((testimonial: any) => (
              <SwiperSlide key={testimonial._id}>
                <div className="mx-auto max-w-3xl text-center">
                  {/* Stars */}
                  <div className="mb-4 flex justify-center gap-1.5">
                    {Array.from({ length: testimonial.rating || 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber text-amber" />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-base font-light italic leading-relaxed text-white/90 md:text-xl">
                    &ldquo;{getLocalizedField(testimonial, 'content', locale)}&rdquo;
                  </p>

                  {/* Divider */}
                  <div className="mx-auto my-4 h-px w-10 bg-accent/50" />

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/20 text-base font-bold text-accent ring-2 ring-accent/30">
                      {getLocalizedField(testimonial, 'name', locale).charAt(0)}
                    </div>
                    <div className="text-start">
                      <div className="text-base font-semibold text-white">
                        {getLocalizedField(testimonial, 'name', locale)}
                      </div>
                      <div className="text-sm text-white/50">
                        {getLocalizedField(testimonial, 'role', locale)}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-2 flex items-center justify-center gap-4">
            <button type="button" title="Previous" className="swiper-nav-btn testimonials-prev"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" title="Next" className="swiper-nav-btn testimonials-next"><ChevronRight className="h-5 w-5" /></button>
          </div>

          <div className="mt-6 text-center">
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
            >
              {locale === 'ar' ? 'اقرأ المزيد من الشهادات' : 'Read More Testimonials'}
              {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Link>
          </div>
        </div>
      </section>
      <SectionDivider variant="angle" fromColor="#003A83" toColor="#ffffff" />
    </>
  );
}
