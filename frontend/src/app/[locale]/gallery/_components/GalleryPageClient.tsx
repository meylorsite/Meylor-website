'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getLocalizedField, formatDate } from '@/lib/utils';
import PageHero from '@/components/ui/PageHero';
import { Calendar, MapPin, ImageIcon, Camera, Heart, Users, Sparkles } from 'lucide-react';

export default function GalleryPageClient({ activities, locale }: { activities: any[]; locale: string }) {
  const t = useTranslations('gallery');
  const isRTL = locale === 'ar';

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-6 text-sm text-white/60"
        >
          <span className="flex items-center gap-2"><Camera className="h-4 w-4" /> {activities.length} {isRTL ? 'نشاط' : 'Activities'}</span>
          <span className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> 50+ {isRTL ? 'صورة' : 'Photos'}</span>
        </motion.div>
      </PageHero>

      <section className="section-padding">
        <div className="container-custom">
          {activities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-md py-20 text-center"
            >
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/5">
                <ImageIcon className="h-12 w-12 text-primary/30" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t('emptyTitle')}</h2>
              <p className="mt-3 text-gray-500">{t('emptySubtitle')}</p>
            </motion.div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity: any, i: number) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/${locale}/gallery/${activity.slug}`}
                    className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg"
                  >
                    <div className="relative h-56 overflow-hidden">
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
                          {isRTL ? 'داخل المدرسة' : 'Inside MEYLOR'}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary">
                        {getLocalizedField(activity, 'title', locale)}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {getLocalizedField(activity, 'description', locale)}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
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
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Extra Content - Life at MEYLOR */}
      <section className="bg-gray-50 section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'لحظات من الحياة المدرسية' : 'Moments from School Life'}
            </h2>
            <p className="mt-3 text-gray-500">
              {isRTL
                ? 'نحتفظ بكل لحظة خاصة ونوثّق رحلة طلابنا التعليمية والاجتماعية'
                : 'We capture every special moment and document our students\' educational and social journey'}
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Camera, titleEn: 'Events & Celebrations', titleAr: 'فعاليات واحتفالات', descEn: 'Capturing memorable moments from school events and celebrations throughout the year.', descAr: 'توثيق اللحظات المميزة من فعاليات واحتفالات المدرسة طوال العام.' },
              { icon: Users, titleEn: 'Student Activities', titleAr: 'أنشطة الطلاب', descEn: 'Clubs, sports, competitions, and creative activities that shape our students.', descAr: 'الأندية والرياضة والمسابقات والأنشطة الإبداعية التي تشكل طلابنا.' },
              { icon: Heart, titleEn: 'Community Service', titleAr: 'خدمة المجتمع', descEn: 'Our students giving back to the community through volunteering and initiatives.', descAr: 'طلابنا يقدمون للمجتمع من خلال التطوع والمبادرات.' },
              { icon: Sparkles, titleEn: 'Field Trips', titleAr: 'الرحلات الميدانية', descEn: 'Educational and recreational trips that broaden horizons and inspire learning.', descAr: 'رحلات تعليمية وترفيهية توسّع الآفاق وتلهم التعلم.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900">{isRTL ? item.titleAr : item.titleEn}</h3>
                <p className="mt-2 text-sm text-gray-500">{isRTL ? item.descAr : item.descEn}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 rounded-2xl bg-primary p-8 text-center text-white md:p-12"
          >
            <h3 className="text-2xl font-bold">
              {isRTL ? 'هل تريد أن يكون طفلك جزءاً من هذه التجربة؟' : 'Want Your Child to Be Part of This Experience?'}
            </h3>
            <p className="mt-3 text-white/70">
              {isRTL
                ? 'انضم إلى عائلة ميلور واكتشف عالمًا من الإمكانيات لطفلك'
                : 'Join the MEYLOR family and discover a world of possibilities for your child'}
            </p>
            <Link
              href={`/${locale}/admissions`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-semibold text-white transition-all hover:bg-accent-dark hover:shadow-xl"
            >
              {isRTL ? 'سجّل الآن' : 'Apply Now'}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
