'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getLocalizedField } from '@/lib/utils';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import TextReveal from '@/components/ui/TextReveal';
import SectionDivider from '@/components/ui/SectionDivider';

interface AboutPreviewProps {
  section: any;
  locale: string;
}

export default function AboutPreview({ section, locale }: AboutPreviewProps) {
  const t = useTranslations('home');
  if (!section) return null;

  const title = getLocalizedField(section, 'title', locale);
  const content = getLocalizedField(section, 'content', locale);
  const imageUrl = section?.imageUrl;
  const isRTL = locale === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <>
      <section className="section-light section-padding overflow-hidden">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Image column */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 60 : -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={`relative lg:col-span-5 ${isRTL ? 'lg:order-2' : ''}`}
            >
              {/* Dashed border frame offset */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute -left-4 -top-4 h-full w-full rounded-3xl border-2 border-dashed border-accent/20"
              />

              {imageUrl ? (
                <div className="relative pb-4">
                  <div className="overflow-hidden rounded-3xl shadow-2xl">
                    <Image src={imageUrl} alt={title} width={600} height={450} className="h-[280px] md:h-[380px] w-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 right-4 rounded-xl bg-accent p-3 shadow-lg ring-4 ring-white">
                    <div className="text-xl font-bold text-white">10+</div>
                    <div className="text-xs text-white/80">{locale === 'ar' ? 'سنوات خبرة' : 'Years'}</div>
                  </div>
                </div>
              ) : (
                <div className="flex h-[280px] md:h-[380px] items-center justify-center rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5">
                  <span className="text-7xl font-bold text-primary/10">M</span>
                </div>
              )}
            </motion.div>

            {/* Text column */}
            <div className={`lg:col-span-7 ${isRTL ? 'lg:order-1' : ''}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-4 flex items-center gap-3"
              >
                <span className="h-px w-10 bg-accent" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t('aboutLabel')}</span>
              </motion.div>

              <TextReveal as="h2" className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl lg:text-[2.25rem]" delay={0.2}>
                {title}
              </TextReveal>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-5 text-base leading-relaxed text-gray-600"
              >
                {content}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link
                  href={`/${locale}/about`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-primary"
                >
                  {locale === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                  <Arrow className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <SectionDivider variant="angle" fromColor="#ffffff" toColor="#003A83" />
    </>
  );
}
