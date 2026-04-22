'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getLocalizedField } from '@/lib/utils';
import CountUp from 'react-countup';
import { Users, GraduationCap, BookOpen, Award, ArrowRight, ArrowLeft } from 'lucide-react';

const statIcons = [Users, GraduationCap, BookOpen, Award];

interface StatsSectionProps {
  stats: any[];
  locale: string;
}

export default function StatsSection({ stats, locale }: StatsSectionProps) {
  const t = useTranslations('home');
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  if (!stats.length) return null;

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-gray-50 to-white py-14">
      <motion.div style={{ y }} className="container-custom">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.25em] text-gray-400"
        >
          {t('statsTitle')}
        </motion.p>

        <div className="flex flex-wrap items-center justify-center">
          {stats.map((stat: any, i: number) => {
            const Icon = statIcons[i % statIcons.length];
            return (
              <motion.div
                key={stat._id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15, type: 'spring', stiffness: 150, damping: 15 }}
                className="flex flex-col items-center px-6 py-5 text-center md:px-8"
              >
                <motion.div
                  whileInView={{ scale: [0, 1.15, 1] }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.2, type: 'spring', stiffness: 200, damping: 10 }}
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10"
                >
                  <Icon className="h-5 w-5 text-accent" />
                </motion.div>
                <div className="text-4xl font-bold md:text-5xl">
                  <span className="gradient-text">
                    <CountUp end={stat.value} duration={2.5} enableScrollSpy scrollSpyOnce suffix={stat.suffix || ''} />
                  </span>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-500">
                  {getLocalizedField(stat, 'label', locale)}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Vertical dividers between stats (desktop only) */}
        <div className="mx-auto hidden max-w-4xl items-center justify-around md:flex" aria-hidden>
          {stats.slice(0, -1).map((_: any, i: number) => (
            <div key={i} className="h-16 w-px bg-gray-200" />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/about`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
          >
            {locale === 'ar' ? 'اعرف المزيد' : 'Learn More'}
            {locale === 'ar' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
