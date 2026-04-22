'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getLocalizedField, getLocalizedArray } from '@/lib/utils';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import { CheckCircle, Star, ChevronDown, ChevronUp, FileText, UserCheck, ClipboardList, CreditCard, GraduationCap, Send, Phone, Mail, Rocket } from 'lucide-react';
import { publicApi } from '@/lib/api';
import toast from 'react-hot-toast';
import AdmissionWizard from './AdmissionWizard';

const steps = [
  { icon: FileText, keyEn: 'Submit Online Inquiry', keyAr: 'تقديم استفسار إلكتروني' },
  { icon: ClipboardList, keyEn: 'Complete Application Form', keyAr: 'إكمال نموذج التقديم' },
  { icon: UserCheck, keyEn: 'Attend Assessment & Interview', keyAr: 'حضور التقييم والمقابلة' },
  { icon: CreditCard, keyEn: 'Receive Acceptance & Pay Fees', keyAr: 'استلام القبول ودفع الرسوم' },
  { icon: GraduationCap, keyEn: 'Welcome to MEYLOR!', keyAr: 'أهلاً بكم في ميلور!' },
];

const faqs = [
  { qEn: 'What age groups does MEYLOR serve?', qAr: 'ما الفئات العمرية التي تخدمها ميلور؟', aEn: 'MEYLOR International School serves students from KG1 (age 3+) through Grade 12 (age 18). Our programs cover Kindergarten, Primary, Middle, and High School.', aAr: 'تخدم مدرسة ميلور العالمية الطلاب من الروضة الأولى (عمر ٣+) حتى الصف الثاني عشر (عمر ١٨). تشمل برامجنا الروضة والابتدائية والمتوسطة والثانوية.' },
  { qEn: 'What curriculum does MEYLOR follow?', qAr: 'ما المنهج الذي تتبعه ميلور؟', aEn: 'We follow a bilingual curriculum combining the Saudi national curriculum with international best practices, incorporating STEM, arts, and character education.', aAr: 'نتبع منهجاً ثنائي اللغة يجمع بين المنهج الوطني السعودي وأفضل الممارسات الدولية، مع دمج علوم STEM والفنون وتربية الشخصية.' },
  { qEn: 'What are the school hours?', qAr: 'ما أوقات الدوام المدرسي؟', aEn: 'School hours are from 7:00 AM to 2:30 PM, Sunday to Thursday. Extended care and after-school activities are available until 4:00 PM.', aAr: 'أوقات الدوام من ٧:٠٠ صباحاً حتى ٢:٣٠ مساءً، من الأحد إلى الخميس. تتوفر الرعاية الممتدة والأنشطة بعد المدرسة حتى ٤:٠٠ مساءً.' },
  { qEn: 'Is transportation provided?', qAr: 'هل تتوفر خدمة النقل؟', aEn: 'Yes, we offer safe and supervised school bus transportation covering major areas in Jeddah. Routes and schedules are arranged based on demand.', aAr: 'نعم، نوفر خدمة نقل مدرسي آمنة ومُراقَبة تغطي المناطق الرئيسية في جدة. يتم ترتيب المسارات والجداول حسب الطلب.' },
  { qEn: 'Can I visit the school before applying?', qAr: 'هل يمكنني زيارة المدرسة قبل التقديم؟', aEn: 'Absolutely! We welcome campus tours. You can schedule a visit through our contact page or by calling our admissions office.', aAr: 'بالتأكيد! نرحب بالجولات في الحرم المدرسي. يمكنك جدولة زيارة من خلال صفحة التواصل أو الاتصال بمكتب القبول.' },
  { qEn: 'What documents are required for enrollment?', qAr: 'ما المستندات المطلوبة للتسجيل؟', aEn: 'Required documents include: birth certificate, previous school records, immunization records, passport/ID copies, and recent photos. Detailed requirements are provided upon inquiry.', aAr: 'المستندات المطلوبة تشمل: شهادة الميلاد، السجلات المدرسية السابقة، سجل التطعيمات، نسخ الهوية/الجواز، وصور حديثة. يتم تقديم المتطلبات التفصيلية عند الاستفسار.' },
];

export default function AdmissionsPageClient({ pricing, faqs: dynamicFaqs = [], locale }: { pricing: any[]; faqs?: any[]; locale: string }) {
  const t = useTranslations('admissions');
  const tc = useTranslations('common');
  const isRTL = locale === 'ar';
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', studentName: '', gradeApplying: '', message: '' });
  const [loading, setLoading] = useState(false);

  const scrollToWizard = () => {
    setShowWizard(true);
    setTimeout(() => {
      document.getElementById('admission-wizard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await publicApi.submitContact({ ...form, subject: `Admissions Inquiry - Grade ${form.gradeApplying}` });
      toast.success(isRTL ? 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً.' : 'Inquiry submitted successfully! We will contact you soon.');
      setForm({ name: '', email: '', phone: '', studentName: '', gradeApplying: '', message: '' });
    } catch (err: any) {
      toast.error(err.message || tc('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      {/* Admission Steps */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading title={t('stepsTitle')} />
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-4 sm:grid-cols-5">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative text-center"
                >
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <div className="text-xs font-bold text-primary">
                    {isRTL ? `الخطوة ${i + 1}` : `Step ${i + 1}`}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{isRTL ? step.keyAr : step.keyEn}</p>
                  {i < steps.length - 1 && (
                    <div className="absolute left-full top-8 hidden w-full -translate-x-1/2 border-t-2 border-dashed border-primary/20 sm:block" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="bg-gray-50 section-padding">
        <div className="container-custom">
          <SectionHeading title={t('pricingTitle')} subtitle={t('pricingSubtitle')} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pricing.map((pkg: any, i: number) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-xl ${
                  pkg.isPopular ? 'ring-2 ring-accent scale-[1.02]' : ''
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-xl bg-accent px-3 py-1.5 text-xs font-bold text-white">
                    <Star className="h-3 w-3" /> {t('popular')}
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900">
                  {getLocalizedField(pkg, 'title', locale)}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {getLocalizedField(pkg, 'description', locale)}
                </p>
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <span className="text-2xl font-bold text-primary">{pkg.price}</span>
                  <span className="text-sm text-gray-400"> {pkg.currency}/{isRTL ? 'سنة' : 'year'}</span>
                </div>
                <div className="mt-5">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {t('features')}
                  </h4>
                  <ul className="space-y-2">
                    {getLocalizedArray(pkg, 'features', locale).map((f: string, j: number) => {
                      const isHighlighted = pkg.highlightedFeatures?.includes(j);
                      return (
                        <li key={j} className={`flex items-start gap-2 text-sm ${isHighlighted ? 'font-semibold text-primary' : 'text-gray-600'}`}>
                          <CheckCircle className={`mt-0.5 h-4 w-4 shrink-0 ${isHighlighted ? 'text-accent' : 'text-success'}`} />
                          {f}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <Link
                  href={`/${locale}/contact`}
                  className={`mt-6 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                    pkg.isPopular
                      ? 'bg-accent text-white hover:bg-accent/90'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {isRTL ? 'تواصل معنا' : 'Contact Us'}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Start Application CTA */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-dark">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              {isRTL ? 'مستعد للتقديم؟' : 'Ready to Apply?'}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              {isRTL
                ? 'ابدأ رحلة طفلك التعليمية في ميلور الآن. أكمل طلب التسجيل في بضع خطوات بسيطة.'
                : 'Start your child\'s educational journey at MEYLOR today. Complete the application in a few simple steps.'}
            </p>
            <button
              type="button"
              onClick={scrollToWizard}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:bg-accent/90 hover:scale-[1.02]"
            >
              <Rocket className="h-5 w-5" />
              {isRTL ? 'ابدأ التقديم الآن' : 'Start Application'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Admission Wizard */}
      <section id="admission-wizard" className="section-padding">
        <div className="container-custom">
          {!showWizard ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center"
            >
              <Rocket className="mx-auto mb-4 h-12 w-12 text-accent/40" />
              <h3 className="text-xl font-bold text-gray-900">
                {isRTL ? 'نموذج التقديم' : 'Application Form'}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {isRTL ? 'اضغط على الزر أدناه لبدء تعبئة طلب التسجيل' : 'Click the button below to start filling out the application form'}
              </p>
              <button
                type="button"
                onClick={() => setShowWizard(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
              >
                <Rocket className="h-4 w-4" />
                {isRTL ? 'ابدأ التقديم' : 'Start Application'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-4xl"
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  {isRTL ? 'نموذج التقديم' : 'Application Form'}
                </h2>
                <p className="mt-2 text-gray-500">
                  {isRTL ? 'أكمل الخطوات التالية لتقديم طلب التسجيل' : 'Complete the following steps to submit your application'}
                </p>
              </div>
              <AdmissionWizard pricing={pricing} locale={locale} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Admissions Inquiry Form */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {isRTL ? 'استفسار عن القبول' : 'Admissions Inquiry'}
              </h2>
              <p className="mt-2 text-gray-500">
                {isRTL ? 'أرسل لنا استفسارك وسنتواصل معك قريباً' : 'Send us your inquiry and we\'ll get back to you soon'}
              </p>
            </motion.div>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {isRTL ? 'اسم ولي الأمر' : 'Parent Name'} *
                  </label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {isRTL ? 'اسم الطالب' : 'Student Name'} *
                  </label>
                  <input type="text" required value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {tc('email')} *
                  </label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" dir="ltr" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {tc('phone')} *
                  </label>
                  <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" dir="ltr" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {isRTL ? 'الصف المراد التقديم له' : 'Grade Applying For'} *
                </label>
                <select required value={form.gradeApplying} onChange={(e) => setForm({ ...form, gradeApplying: e.target.value })} className="input-field">
                  <option value="">{isRTL ? 'اختر الصف' : 'Select Grade'}</option>
                  <option value="KG1">KG1</option>
                  <option value="KG2">KG2</option>
                  <option value="KG3">KG3</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={`Grade ${i + 1}`}>
                      {isRTL ? `الصف ${i + 1}` : `Grade ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {tc('message')}
                </label>
                <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
                <Send className="h-4 w-4" />
                {loading ? tc('loading') : (isRTL ? 'أرسل الاستفسار' : 'Submit Inquiry')}
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h2>
            <p className="mt-2 text-gray-500">
              {isRTL ? 'إجابات على أكثر الأسئلة شيوعاً حول القبول والتسجيل' : 'Answers to the most common questions about admissions and enrollment'}
            </p>
          </motion.div>
          <div className="mx-auto max-w-3xl space-y-3">
            {(dynamicFaqs.length > 0 ? dynamicFaqs : faqs).map((faq: any, i: number) => {
              const question = dynamicFaqs.length > 0
                ? (isRTL ? faq.questionAr : faq.questionEn)
                : (isRTL ? faq.qAr : faq.qEn);
              const answer = dynamicFaqs.length > 0
                ? (isRTL ? faq.answerAr : faq.answerEn)
                : (isRTL ? faq.aAr : faq.aEn);
              return (
                <motion.div
                  key={faq._id || i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="overflow-hidden rounded-xl bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-gray-900">{question}</span>
                    {openFaq === i ? <ChevronUp className="h-5 w-5 shrink-0 text-primary" /> : <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
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
      </section>

      {/* Contact CTA */}
      <section className="bg-primary section-padding">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              {isRTL ? 'هل لديك أسئلة أخرى؟' : 'Have More Questions?'}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              {isRTL ? 'فريق القبول لدينا جاهز لمساعدتك. تواصل معنا اليوم!' : 'Our admissions team is ready to help you. Get in touch today!'}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href={`/${locale}/contact`} className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-accent/90">
                <Mail className="h-4 w-4" />
                {isRTL ? 'تواصل معنا' : 'Contact Us'}
              </Link>
              <a href="tel:+966120000000" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10">
                <Phone className="h-4 w-4" />
                +966 12 000 0000
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
