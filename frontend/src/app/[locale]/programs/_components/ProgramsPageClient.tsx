'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getLocalizedField, getLocalizedArray } from '@/lib/utils';
import PageHero from '@/components/ui/PageHero';
import {
  CheckCircle,
  ChevronDown,
  Clock,
  Users,
  BookOpen,
  Calendar,
  Star,
  Sparkles,
} from 'lucide-react';

const programImages: Record<string, string> = {
  kindergarten: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=700&q=80',
  'primary-school': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=700&q=80',
  'middle-school': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&q=80',
  'high-school': 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=700&q=80',
};

export default function ProgramsPageClient({ programs, locale }: { programs: any[]; locale: string }) {
  const t = useTranslations('programs');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const isRTL = locale === 'ar';

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <section className="section-padding">
        <div className="container-custom space-y-10">
          {programs.map((program: any, i: number) => {
            const imageUrl =
              program.imageUrl ||
              programImages[program.slug] ||
              'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80';
            const isExpanded = expandedId === program._id;
            const title = getLocalizedField(program, 'title', locale);
            const description = getLocalizedField(program, 'description', locale);
            const highlights = getLocalizedArray(program, 'highlights', locale);
            const curriculum = getLocalizedField(program, 'curriculum', locale);
            const schedule = getLocalizedField(program, 'schedule', locale);
            const extracurriculars = getLocalizedArray(program, 'extracurriculars', locale);

            return (
              <motion.div
                key={program._id}
                id={program.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Clickable Card Header */}
                <button
                  type="button"
                  onClick={() => toggle(program._id)}
                  className="flex w-full flex-col items-stretch text-start lg:flex-row lg:items-center"
                >
                  {/* Image */}
                  <div className="relative h-56 w-full shrink-0 lg:h-64 lg:w-80 xl:w-96">
                    <Image
                      src={imageUrl}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent lg:bg-gradient-to-r lg:[dir=rtl]:bg-gradient-to-l" />
                    <div className="absolute bottom-3 start-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm">
                      {program.gradeRange}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="flex flex-1 items-center justify-between gap-4 p-5 lg:p-6">
                    <div className="min-w-0 flex-1">
                      <span className="mb-2 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                        {program.gradeRange}
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        {title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500 md:text-base">
                        {description}
                      </p>

                      {/* Quick meta pills */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {program.ageRange && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                            <Calendar className="h-3.5 w-3.5 text-accent" />
                            {program.ageRange}
                          </span>
                        )}
                        {program.classSize && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                            <Users className="h-3.5 w-3.5 text-accent" />
                            {program.classSize}
                          </span>
                        )}
                        {schedule && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                            <Clock className="h-3.5 w-3.5 text-accent" />
                            {schedule}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand indicator */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50"
                    >
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </motion.div>
                  </div>
                </button>

                {/* Expandable Details */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-100 px-5 pb-6 pt-5 lg:px-8">
                        {/* Full description */}
                        <p className="leading-relaxed text-gray-600">
                          {description}
                        </p>

                        <div className="mt-6 grid gap-6 md:grid-cols-2">
                          {/* Curriculum */}
                          {curriculum && (
                            <DetailBlock
                              icon={<BookOpen className="h-5 w-5 text-primary" />}
                              label={isRTL ? 'المنهج الدراسي' : 'Curriculum'}
                            >
                              <p className="text-sm leading-relaxed text-gray-600">
                                {curriculum}
                              </p>
                            </DetailBlock>
                          )}

                          {/* Highlights */}
                          {highlights.length > 0 && (
                            <DetailBlock
                              icon={<Star className="h-5 w-5 text-amber-500" />}
                              label={isRTL ? 'المميزات' : 'Highlights'}
                            >
                              <ul className="space-y-1.5">
                                {highlights.map((h: string, j: number) => (
                                  <li
                                    key={j}
                                    className="flex items-start gap-2 text-sm text-gray-600"
                                  >
                                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                                    {h}
                                  </li>
                                ))}
                              </ul>
                            </DetailBlock>
                          )}

                          {/* Schedule */}
                          {schedule && (
                            <DetailBlock
                              icon={<Clock className="h-5 w-5 text-accent" />}
                              label={isRTL ? 'الجدول الزمني' : 'Schedule'}
                            >
                              <p className="text-sm text-gray-600">{schedule}</p>
                            </DetailBlock>
                          )}

                          {/* Class Size & Age Range */}
                          {(program.ageRange || program.classSize) && (
                            <DetailBlock
                              icon={<Users className="h-5 w-5 text-primary" />}
                              label={isRTL ? 'تفاصيل الفصل' : 'Class Details'}
                            >
                              <div className="space-y-2 text-sm text-gray-600">
                                {program.ageRange && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                                    <span>
                                      <span className="font-medium text-gray-700">
                                        {isRTL ? 'الفئة العمرية: ' : 'Age Range: '}
                                      </span>
                                      {program.ageRange}
                                    </span>
                                  </div>
                                )}
                                {program.classSize && (
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 shrink-0 text-gray-400" />
                                    <span>
                                      <span className="font-medium text-gray-700">
                                        {isRTL ? 'حجم الفصل: ' : 'Class Size: '}
                                      </span>
                                      {program.classSize}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </DetailBlock>
                          )}

                          {/* Extracurriculars */}
                          {extracurriculars.length > 0 && (
                            <DetailBlock
                              icon={<Sparkles className="h-5 w-5 text-amber-500" />}
                              label={isRTL ? 'الأنشطة اللاصفية' : 'Extracurriculars'}
                            >
                              <div className="flex flex-wrap gap-2">
                                {extracurriculars.map((item: string, j: number) => (
                                  <span
                                    key={j}
                                    className="rounded-full bg-accent/5 px-3 py-1 text-xs font-medium text-accent"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </DetailBlock>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Detail block sub-component                                         */
/* ------------------------------------------------------------------ */

function DetailBlock({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-gray-50/70 p-4">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
          {label}
        </h4>
      </div>
      {children}
    </div>
  );
}
