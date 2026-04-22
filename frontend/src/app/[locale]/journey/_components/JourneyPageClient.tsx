'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getLocalizedField } from '@/lib/utils';
import PageHero from '@/components/ui/PageHero';

export default function JourneyPageClient({ items, locale }: { items: any[]; locale: string }) {
  const t = useTranslations('journey');
  const isRTL = locale === 'ar';

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <section className="section-padding">
        <div className="container-custom">
          <div className="relative">
            {/* Timeline line */}
            <div className={`absolute top-0 bottom-0 ${isRTL ? 'right-1/2' : 'left-1/2'} hidden w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary via-accent to-primary md:block`} />

            <div className="space-y-16">
              {items.map((item: any, i: number) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute top-6 ${isRTL ? 'right-1/2' : 'left-1/2'} hidden h-5 w-5 -translate-x-1/2 rounded-full border-4 border-accent bg-white shadow-lg md:block`} />

                    <div className={`grid md:grid-cols-2 gap-8 ${isLeft ? '' : 'md:direction-rtl'}`}>
                      <div className={`${isLeft ? (isRTL ? 'md:order-2 md:text-left' : 'md:order-1 md:text-right') : (isRTL ? 'md:order-1 md:text-right' : 'md:order-2 md:text-left')} px-4 md:px-8`}>
                        <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                          {item.date}
                        </span>
                        <h3 className="mt-3 text-2xl font-bold text-gray-900">
                          {getLocalizedField(item, 'title', locale)}
                        </h3>
                        <p className="mt-2 leading-relaxed text-gray-600">
                          {getLocalizedField(item, 'description', locale)}
                        </p>
                      </div>

                      <div className={`${isLeft ? (isRTL ? 'md:order-1' : 'md:order-2') : (isRTL ? 'md:order-2' : 'md:order-1')} px-4 md:px-8`}>
                        <div className="grid grid-cols-2 gap-3">
                          {item.beforeImageUrl && (
                            <div className="relative">
                              <Image
                                src={item.beforeImageUrl}
                                alt={t('before')}
                                width={300}
                                height={200}
                                className="h-40 w-full rounded-xl object-cover shadow-md"
                              />
                              <span className="absolute bottom-2 left-2 rounded-md bg-danger/90 px-2 py-0.5 text-xs font-medium text-white">
                                {t('before')}
                              </span>
                            </div>
                          )}
                          {item.afterImageUrl && (
                            <div className="relative">
                              <Image
                                src={item.afterImageUrl}
                                alt={t('after')}
                                width={300}
                                height={200}
                                className="h-40 w-full rounded-xl object-cover shadow-md"
                              />
                              <span className="absolute bottom-2 left-2 rounded-md bg-success/90 px-2 py-0.5 text-xs font-medium text-white">
                                {t('after')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
