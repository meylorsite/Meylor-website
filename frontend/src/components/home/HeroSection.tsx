'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getLocalizedField } from '@/lib/utils';
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import TextReveal from '@/components/ui/TextReveal';
import SectionDivider from '@/components/ui/SectionDivider';

interface HeroSectionProps {
  section: any;
  locale: string;
}

export default function HeroSection({ section, locale }: HeroSectionProps) {
  const t = useTranslations('home');
  const title = getLocalizedField(section, 'title', locale) || (locale === 'ar' ? 'حيث يلتقي التميّز بالتعليم' : 'Where Excellence Meets Education');
  const subtitle = getLocalizedField(section, 'subtitle', locale) || (locale === 'ar' ? 'نُمكّن الطلاب من الروضة حتى الصف الثاني عشر بمناهج عالمية متقدمة' : 'Empowering students from KG to Grade 12 with world-class curriculum');
  const ctaText = getLocalizedField(section, 'ctaText', locale) || (locale === 'ar' ? 'سجّل الآن' : 'Apply Now');
  const ctaLink = section?.ctaLink || '/admissions';
  const imageUrl = section?.imageUrl;
  const isRTL = locale === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-gray-900">
        {imageUrl && (
          <div className="absolute inset-0">
            <Image src={imageUrl} alt="MEYLOR" fill className="animate-ken-burns object-cover" priority sizes="100vw" />
          </div>
        )}
        {/* Dark overlay — transparent, no heavy blue */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <motion.div
          className="absolute -right-20 top-1/4 hidden h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl md:block"
          animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -left-20 bottom-1/4 hidden h-[300px] w-[300px] rounded-full bg-amber/5 blur-3xl md:block"
          animate={{ x: [0, -25, 20, 0], y: [0, 15, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />

        <div className="container-custom relative z-10 flex min-h-screen items-center pb-14 pt-20">
          <div className="grid w-full gap-12 lg:grid-cols-12 lg:items-center">
            <div className={`lg:col-span-7 ${isRTL ? 'lg:order-2' : ''}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse" />
                <span className="text-xs font-medium text-white/90">{t('enrollment')}</span>
              </motion.div>

              <TextReveal as="h1" className="text-3xl font-bold leading-[1.1] text-white md:text-4xl lg:text-5xl xl:text-6xl" delay={0.5} staggerDelay={0.06}>
                {title}
              </TextReveal>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
              >
                {subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="mt-8 flex flex-col sm:flex-row gap-3"
              >
                <Link
                  href={`/${locale}${ctaLink}`}
                  className="group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/20"
                >
                  {ctaText}
                  <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>
                <Link
                  href={`/${locale}/about`}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/25 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10"
                >
                  {t('bookTour')}
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className={`hidden lg:block lg:col-span-5 ${isRTL ? 'lg:order-1' : ''}`}
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-4 right-4 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl"
                >
                  <div className="text-2xl font-bold text-amber">98%</div>
                  <div className="mt-1 text-sm text-white/60">{locale === 'ar' ? 'نسبة التخرج' : 'Graduation Rate'}</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-16 left-0 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl"
                >
                  <div className="text-2xl font-bold text-accent-light">1200+</div>
                  <div className="mt-1 text-sm text-white/60">{locale === 'ar' ? 'طالب وطالبة' : 'Students'}</div>
                </motion.div>

                <div className="flex h-80 items-center justify-center">
                  <div className="relative h-64 w-64">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/15" style={{ animation: 'spin 25s linear infinite' }} />
                    <div className="absolute inset-6 rounded-full border border-white/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image src="/images/logo.png" alt="MEYLOR" width={120} height={34} className="h-8 w-auto brightness-0 invert opacity-60" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium tracking-wider text-white/40">{t('scrollDown')}</span>
            <ChevronDown className="h-5 w-5 text-white/40" />
          </motion.div>
        </motion.div>
      </section>
      <SectionDivider variant="wave" fromColor="#003A83" toColor="#ffffff" />
    </>
  );
}
