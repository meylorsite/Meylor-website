'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronDown, Search } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import { getLocalizedField } from '@/lib/utils';

interface FAQPageClientProps {
  faqs: any[];
  locale: string;
}

export default function FAQPageClient({ faqs, locale }: FAQPageClientProps) {
  const t = useTranslations();
  const isRTL = locale === 'ar';
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState<string | null>(null);

  const title = (() => {
    try {
      return t('faq.title');
    } catch {
      return isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions';
    }
  })();

  const subtitle = (() => {
    try {
      return t('faq.subtitle');
    } catch {
      return isRTL
        ? 'إجابات على أكثر الأسئلة شيوعاً'
        : 'Find answers to the most common questions about MEYLOR';
    }
  })();

  const searchPlaceholder = (() => {
    try {
      return t('faq.searchPlaceholder');
    } catch {
      return isRTL ? 'ابحث في الأسئلة...' : 'Search questions...';
    }
  })();

  const noResultsLabel = (() => {
    try {
      return t('faq.noResults');
    } catch {
      return isRTL ? 'لم يتم العثور على أسئلة' : 'No questions found';
    }
  })();

  const generalLabel = (() => {
    try {
      return t('faq.general');
    } catch {
      return isRTL ? 'عام' : 'General';
    }
  })();

  const categoryLabel = (slug: string): string => {
    if (!slug) return generalLabel;
    const key = slug.toLowerCase();
    const map: Record<string, { en: string; ar: string }> = {
      admissions: { en: 'Admissions', ar: 'القبول والتسجيل' },
      academics: { en: 'Academics', ar: 'الأكاديميات' },
      fees: { en: 'Fees & Payment', ar: 'الرسوم والدفع' },
      pricing: { en: 'Pricing', ar: 'الأسعار' },
      transportation: { en: 'Transportation', ar: 'المواصلات' },
      curriculum: { en: 'Curriculum', ar: 'المناهج' },
      facilities: { en: 'Facilities', ar: 'المرافق' },
      careers: { en: 'Careers', ar: 'الوظائف' },
      general: { en: 'General', ar: 'عام' },
    };
    if (map[key]) return isRTL ? map[key].ar : map[key].en;
    // Fallback: title-case the slug
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return faqs;
    const q = query.trim().toLowerCase();
    return faqs.filter((f: any) => {
      const fields = [f?.questionEn, f?.questionAr, f?.answerEn, f?.answerAr]
        .filter(Boolean)
        .map((v: string) => String(v).toLowerCase());
      return fields.some((v) => v.includes(q));
    });
  }, [faqs, query]);

  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filtered.forEach((faq: any) => {
      const category = (faq?.category && String(faq.category).trim().toLowerCase()) || 'general';
      if (!groups[category]) groups[category] = [];
      groups[category].push(faq);
    });
    return groups;
  }, [filtered]);

  const categoryKeys = Object.keys(grouped);
  const hasFaqs = faqs.length > 0;
  const hasResults = filtered.length > 0;

  return (
    <>
      <PageHero title={title} subtitle={subtitle} />

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {hasFaqs && (
            <div className="mx-auto mb-10 max-w-2xl">
              <div className="relative">
                <Search
                  className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 ${
                    isRTL ? 'right-4' : 'left-4'
                  }`}
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={`w-full rounded-xl border border-gray-200 bg-white py-3 text-sm text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-primary ${
                    isRTL ? 'pe-10 ps-4 text-right' : 'ps-10 pe-4 text-left'
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
          )}

          {!hasFaqs ? (
            <div className="mx-auto max-w-xl rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-base text-gray-500">
                {isRTL ? 'لا توجد أسئلة حتى الآن' : 'No questions yet'}
              </p>
            </div>
          ) : !hasResults ? (
            <div className="mx-auto max-w-xl rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-base text-gray-500">{noResultsLabel}</p>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-10">
              {categoryKeys.map((category) => (
                <div key={category}>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
                  >
                    {categoryLabel(category)}
                  </motion.h2>

                  <div className="space-y-3">
                    {grouped[category].map((faq: any, i: number) => {
                      const key = `${category}-${faq._id || i}`;
                      const question = getLocalizedField(faq, 'question', locale);
                      const answer = getLocalizedField(faq, 'answer', locale);
                      const isOpen = openKey === key;
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                          className="overflow-hidden rounded-xl bg-white shadow-sm"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenKey(isOpen ? null : key)}
                            className={`flex w-full items-center justify-between gap-4 p-5 ${
                              isRTL ? 'text-right' : 'text-left'
                            }`}
                          >
                            <span className="font-semibold text-gray-900">{question}</span>
                            <ChevronDown
                              className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                                isOpen ? 'rotate-180 text-primary' : ''
                              }`}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-gray-100 px-5 pb-5">
                                  <p className="pt-3 leading-relaxed text-gray-600">{answer}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
