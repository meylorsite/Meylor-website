'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getLocalizedField } from '@/lib/utils';
import { GraduationCap, BookOpen, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import TextReveal from '@/components/ui/TextReveal';
import SectionDivider from '@/components/ui/SectionDivider';

const pillars = [
  { icon: GraduationCap, titleKey: 'whyPillar1Title', descKey: 'whyPillar1Desc' },
  { icon: BookOpen, titleKey: 'whyPillar2Title', descKey: 'whyPillar2Desc' },
  { icon: ShieldCheck, titleKey: 'whyPillar3Title', descKey: 'whyPillar3Desc' },
];

interface WhyMeylorSectionProps {
  section: any;
  locale: string;
}

export default function WhyMeylorSection({ section, locale }: WhyMeylorSectionProps) {
  const t = useTranslations('home');
  if (!section) return null;

  const title = getLocalizedField(section, 'title', locale);
  const content = getLocalizedField(section, 'content', locale);
  const imageUrl = section?.imageUrl;
  const isRTL = locale === 'ar';

  return (
    <>
      <section className="section-light section-padding overflow-hidden">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Text column */}
            <div className={`lg:col-span-7 ${isRTL ? 'lg:order-2' : 'lg:order-1'}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-4 flex items-center gap-3"
              >
                <span className="h-px w-10 bg-accent" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t('whyLabel')}</span>
              </motion.div>

              <TextReveal as="h2" className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl lg:text-[2.25rem]" delay={0.15}>
                {title}
              </TextReveal>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="mt-5 text-base leading-relaxed text-gray-600"
              >
                {content}
              </motion.p>

              {/* Feature pillars */}
              <div className="mt-6 space-y-4">
                {pillars.map((pillar, i) => {
                  const Icon = pillar.icon;
                  return (
                    <motion.div
                      key={pillar.titleKey}
                      initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                      className="flex items-start gap-3"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{t(pillar.titleKey)}</h4>
                        <p className="mt-1 text-sm text-gray-500">{t(pillar.descKey)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-8"
              >
                <Link
                  href={`/${locale}/about`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
                >
                  {locale === 'ar' ? 'اعرف المزيد عنا' : 'Learn More About Us'}
                  {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Link>
              </motion.div>
            </div>

            {/* Image column */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={`lg:col-span-5 ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}
            >
              <div className="relative rounded-3xl bg-accent/5 p-4">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={title}
                    width={600}
                    height={500}
                    className="h-[280px] md:h-[400px] w-full rounded-2xl object-cover shadow-xl"
                  />
                ) : (
                  <div className="flex h-[280px] md:h-[400px] items-center justify-center rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5">
                    <span className="text-7xl font-bold text-primary/10">M</span>
                  </div>
                )}

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-2xl bg-primary px-5 py-3 text-center shadow-xl"
                >
                  <div className="text-xl font-bold text-white">10+</div>
                  <div className="text-xs text-white/70">{locale === 'ar' ? 'سنوات من التميز' : 'Years of Excellence'}</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <SectionDivider variant="curve" fromColor="#ffffff" toColor="#f9fafb" />
    </>
  );
}
