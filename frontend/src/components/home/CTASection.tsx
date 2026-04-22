'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GraduationCap, MapPin, MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import SectionDivider from '@/components/ui/SectionDivider';

const ctaItems = [
  { titleKey: 'ctaApplyTitle', descKey: 'ctaApplyDesc', icon: GraduationCap, href: '/admissions' },
  { titleKey: 'ctaTourTitle', descKey: 'ctaTourDesc', icon: MapPin, href: '/contact' },
  { titleKey: 'ctaContactTitle', descKey: 'ctaContactDesc', icon: MessageCircle, href: '/contact' },
];

interface CTASectionProps {
  locale: string;
}

export default function CTASection({ locale }: CTASectionProps) {
  const t = useTranslations('home');
  const isRTL = locale === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-accent via-accent-dark to-primary py-16">
        {/* Decorative shapes */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <motion.div
          className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl font-bold text-white md:text-3xl">{t('ctaTitle')}</h2>
            <p className="mt-3 text-white/70">{t('ctaSubtitle')}</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {ctaItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.titleKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <Link
                    href={`/${locale}${item.href}`}
                    className="group flex flex-col items-center rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/15"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white">{t(item.titleKey)}</h3>
                    <p className="mt-2 text-sm text-white/70">{t(item.descKey)}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors group-hover:text-white">
                      {locale === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                      <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <SectionDivider variant="wave" fromColor="#003A83" toColor="#003A83" />
    </>
  );
}
