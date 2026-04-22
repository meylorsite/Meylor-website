'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { getLocalizedField, getLocalizedArray } from '@/lib/utils';
import { publicApi } from '@/lib/api';
import PageHero from '@/components/ui/PageHero';
import toast from 'react-hot-toast';
import { Briefcase, MapPin, Building2, CheckCircle, ChevronDown, ChevronUp, Clock, Send, Upload, Users, Award, DollarSign, GraduationCap, Star } from 'lucide-react';

export default function CareersPageClient({ jobs, locale }: { jobs: any[]; locale: string }) {
  const t = useTranslations('careers');
  const tc = useTranslations('common');
  const isRTL = locale === 'ar';
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', experienceLevel: '', message: '', cvLink: '' });
  const [loading, setLoading] = useState(false);

  const experienceLevels = isRTL
    ? ['حديث التخرج (0-1 سنة)', '1-3 سنوات', '3-5 سنوات', '5-10 سنوات', '+10 سنوات']
    : ['Fresh Graduate (0-1 years)', '1-3 years', '3-5 years', '5-10 years', '10+ years'];

  const handleApply = async (e: React.FormEvent, jobId: string) => {
    e.preventDefault();
    setLoading(true);
    try {
      const expMap: Record<string, number> = { '0': 0, '1': 2, '2': 4, '3': 7, '4': 12 };
      const idx = experienceLevels.indexOf(form.experienceLevel);
      await publicApi.submitApplication({ name: form.name, email: form.email, phone: form.phone, yearsOfExperience: parseInt(expMap[String(idx)] as any) || 0, message: form.message, cvLink: form.cvLink, jobPost: jobId });
      toast.success(isRTL ? 'تم إرسال طلبك بنجاح! سنراجعه قريباً.' : 'Application submitted successfully! We\'ll review it soon.');
      setApplyingTo(null);
      setForm({ name: '', email: '', phone: '', experienceLevel: '', message: '', cvLink: '' });
    } catch (err: any) {
      toast.error(err.message || tc('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-6 text-sm text-white/60"
        >
          <span className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> {jobs.length} {isRTL ? 'وظيفة متاحة' : 'Open Positions'}</span>
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {isRTL ? 'جدة، السعودية' : 'Jeddah, Saudi Arabia'}</span>
        </motion.div>
      </PageHero>

      {/* Why Work With Us */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'لماذا تنضم إلينا؟' : 'Why Join MEYLOR?'}
            </h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, titleEn: 'Supportive Team', titleAr: 'فريق داعم', descEn: 'Collaborative environment with professional development.', descAr: 'بيئة تعاونية مع تطوير مهني مستمر.' },
              { icon: Building2, titleEn: 'Modern Campus', titleAr: 'حرم حديث', descEn: 'State-of-the-art facilities and resources.', descAr: 'مرافق وموارد على أحدث طراز.' },
              { icon: Clock, titleEn: 'Work-Life Balance', titleAr: 'توازن العمل', descEn: 'Competitive benefits and flexible scheduling.', descAr: 'مزايا تنافسية وجدول مرن.' },
              { icon: Briefcase, titleEn: 'Career Growth', titleAr: 'نمو مهني', descEn: 'Clear paths for advancement and leadership.', descAr: 'مسارات واضحة للتقدم والقيادة.' },
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
                <p className="mt-1 text-sm text-gray-500">{isRTL ? item.descAr : item.descEn}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="bg-gray-50 section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'الوظائف المتاحة' : 'Open Positions'}
            </h2>
          </motion.div>

          {jobs.length === 0 ? (
            <div className="mx-auto max-w-md py-16 text-center">
              <Briefcase className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900">{t('noJobs')}</h3>
              <p className="mt-2 text-gray-500">{t('noJobsSubtitle')}</p>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl space-y-4">
              {jobs.map((job: any, idx: number) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Job Header */}
                  <button
                    type="button"
                    onClick={() => setExpandedJob(expandedJob === job._id ? null : job._id)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 sm:flex">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {getLocalizedField(job, 'title', locale)}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5">
                            <Building2 className="h-3 w-3" />
                            {getLocalizedField(job, 'department', locale)}
                          </span>
                          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5">
                            <Clock className="h-3 w-3" />
                            {getLocalizedField(job, 'type', locale)}
                          </span>
                          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5">
                            <MapPin className="h-3 w-3" />
                            {getLocalizedField(job, 'location', locale)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {expandedJob === job._id ? <ChevronUp className="h-5 w-5 text-primary" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedJob === job._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-100 p-6">
                          {/* Quick Info Bar */}
                          {(job.salaryRange || job.experienceRequired) && (
                            <div className="mb-6 flex flex-wrap gap-3">
                              {job.salaryRange && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
                                  <DollarSign className="h-3.5 w-3.5" />
                                  {job.salaryRange}
                                </span>
                              )}
                              {job.experienceRequired && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                                  <Briefcase className="h-3.5 w-3.5" />
                                  {job.experienceRequired}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Description */}
                          <div className="mb-6">
                            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                              <Building2 className="h-4 w-4" />
                              {isRTL ? 'الوصف' : 'Description'}
                            </h4>
                            <p className="leading-relaxed text-gray-600">{getLocalizedField(job, 'description', locale)}</p>
                          </div>

                          <div className="grid gap-6 lg:grid-cols-2">
                            {/* Requirements */}
                            {getLocalizedArray(job, 'requirements', locale).length > 0 && (
                              <div>
                                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                                  <CheckCircle className="h-4 w-4" />
                                  {t('requirements')}
                                </h4>
                                <ul className="space-y-2">
                                  {getLocalizedArray(job, 'requirements', locale).map((r: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                                      {r}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Qualifications */}
                            {getLocalizedArray(job, 'qualifications', locale).length > 0 && (
                              <div>
                                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                                  <GraduationCap className="h-4 w-4" />
                                  {isRTL ? 'المؤهلات' : 'Qualifications'}
                                </h4>
                                <ul className="space-y-2">
                                  {getLocalizedArray(job, 'qualifications', locale).map((q: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                      <Award className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                      {q}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Benefits */}
                          {getLocalizedArray(job, 'benefits', locale).length > 0 && (
                            <div className="mt-6">
                              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                                <Star className="h-4 w-4" />
                                {isRTL ? 'المزايا' : 'Benefits'}
                              </h4>
                              <div className="grid gap-2 sm:grid-cols-2">
                                {getLocalizedArray(job, 'benefits', locale).map((b: string, i: number) => (
                                  <div key={i} className="flex items-start gap-2 rounded-lg bg-amber-50/60 px-3 py-2 text-sm text-gray-700">
                                    <Star className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                                    {b}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Apply Now Button */}
                          <div className="mt-6 border-t border-gray-100 pt-6">
                            <button
                              type="button"
                              onClick={() => setApplyingTo(applyingTo === job._id ? null : job._id)}
                              className="btn-primary gap-2"
                            >
                              <Send className="h-4 w-4" />
                              {t('applyForPosition')}
                            </button>
                          </div>

                          {/* Application Form */}
                          <AnimatePresence>
                            {applyingTo === job._id && (
                              <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                                onSubmit={(e) => handleApply(e, job._id)}
                              >
                                <div className="mt-6 space-y-4 rounded-xl bg-gray-50 p-6">
                                  <h4 className="text-lg font-bold text-gray-900">{t('applicationForm')}</h4>
                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                      <label htmlFor={`name-${job._id}`} className="mb-1 block text-sm font-medium text-gray-700">{tc('name')} *</label>
                                      <input id={`name-${job._id}`} type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                                    </div>
                                    <div>
                                      <label htmlFor={`email-${job._id}`} className="mb-1 block text-sm font-medium text-gray-700">{tc('email')} *</label>
                                      <input id={`email-${job._id}`} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" dir="ltr" />
                                    </div>
                                    <div>
                                      <label htmlFor={`phone-${job._id}`} className="mb-1 block text-sm font-medium text-gray-700">{tc('phone')} *</label>
                                      <input id={`phone-${job._id}`} type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" dir="ltr" />
                                    </div>
                                    <div>
                                      <label htmlFor={`experience-${job._id}`} className="mb-1 block text-sm font-medium text-gray-700">{isRTL ? 'مستوى الخبرة' : 'Experience Level'} *</label>
                                      <select id={`experience-${job._id}`} required value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })} className="input-field">
                                        <option value="">{isRTL ? 'اختر المستوى' : 'Select Level'}</option>
                                        {experienceLevels.map((level) => (
                                          <option key={level} value={level}>{level}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                      <Upload className={`${isRTL ? 'ml-1' : 'mr-1'} inline h-3.5 w-3.5`} />
                                      {isRTL ? 'رابط السيرة الذاتية (Google Drive, Dropbox, etc.)' : 'CV Link (Google Drive, Dropbox, etc.)'} *
                                    </label>
                                    <input type="url" required value={form.cvLink} onChange={(e) => setForm({ ...form, cvLink: e.target.value })} className="input-field" dir="ltr" placeholder="https://drive.google.com/..." />
                                  </div>
                                  <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">{isRTL ? 'رسالة إضافية' : 'Cover Letter / Additional Notes'}</label>
                                    <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field" placeholder={isRTL ? 'أخبرنا لماذا أنت مناسب لهذا المنصب...' : 'Tell us why you\'re a great fit for this role...'} />
                                  </div>
                                  <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
                                    <Send className="h-4 w-4" />
                                    {loading ? tc('loading') : (isRTL ? 'أرسل الطلب' : 'Submit Application')}
                                  </button>
                                </div>
                              </motion.form>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
