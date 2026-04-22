'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { publicApi } from '@/lib/api';
import PageHero from '@/components/ui/PageHero';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Shield, FileText, ChevronDown } from 'lucide-react';

export default function ContactPage() {
  const { locale } = useParams() as { locale: string };
  const t = useTranslations('contact');
  const tc = useTranslations('common');
  const isRTL = locale === 'ar';
  const [activeTab, setActiveTab] = useState<'contact' | 'complaint'>('contact');
  const [loading, setLoading] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [complaintForm, setComplaintForm] = useState({ category: '', priority: 'medium', name: '', email: '', phone: '', details: '', attachmentLink: '' });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await publicApi.submitContact(contactForm);
      toast.success(isRTL ? 'تم إرسال رسالتك بنجاح' : 'Message sent successfully');
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      toast.error(err.message || tc('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await publicApi.submitComplaint(complaintForm);
      setTicketNumber(res.data.ticketNumber);
      toast.success(isRTL ? 'تم تقديم الشكوى بنجاح' : 'Complaint submitted successfully');
      setComplaintForm({ category: '', priority: 'medium', name: '', email: '', phone: '', details: '', attachmentLink: '' });
    } catch (err: any) {
      toast.error(err.message || tc('error'));
    } finally {
      setLoading(false);
    }
  };

  const categories = isRTL
    ? ['أكاديمي', 'إداري', 'مرافق', 'نقل', 'أخرى']
    : ['Academic', 'Administrative', 'Facilities', 'Transportation', 'Other'];

  const priorityConfig: Record<string, { color: string; label: string }> = {
    low: { color: 'bg-gray-100 text-gray-600 border-gray-200', label: isRTL ? 'منخفض' : 'Low' },
    medium: { color: 'bg-amber/10 text-amber border-amber/20', label: isRTL ? 'متوسط' : 'Medium' },
    high: { color: 'bg-orange-50 text-orange-600 border-orange-200', label: isRTL ? 'مرتفع' : 'High' },
    urgent: { color: 'bg-danger/10 text-danger border-danger/20', label: isRTL ? 'عاجل' : 'Urgent' },
  };

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60"
        >
          <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> +966 12 000 0000</span>
          <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@meylor.sa</span>
          <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {isRTL ? 'الأحد - الخميس: 7ص - 3م' : 'Sun - Thu: 7AM - 3PM'}</span>
        </motion.div>
      </PageHero>

      {/* Contact Info Cards */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-12 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Phone, titleEn: 'Call Us', titleAr: 'اتصل بنا', descEn: '+966 12 000 0000', descAr: '+966 12 000 0000', color: 'bg-primary/10 text-primary' },
              { icon: Mail, titleEn: 'Email Us', titleAr: 'راسلنا', descEn: 'info@meylor.sa', descAr: 'info@meylor.sa', color: 'bg-accent/10 text-accent' },
              { icon: MapPin, titleEn: 'Visit Us', titleAr: 'زُرنا', descEn: 'Al-Naeem, Jeddah, KSA', descAr: 'حي النعيم، جدة، السعودية', color: 'bg-success/10 text-success' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
              >
                <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900">{isRTL ? item.titleAr : item.titleEn}</h3>
                <p className="mt-1 text-sm text-gray-500">{isRTL ? item.descAr : item.descEn}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            {/* Map & Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="rounded-2xl bg-primary p-6 text-white">
                <h3 className="mb-4 text-lg font-bold">
                  {isRTL ? 'ساعات العمل' : 'Working Hours'}
                </h3>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-center justify-between">
                    <span>{isRTL ? 'الأحد - الخميس' : 'Sunday - Thursday'}</span>
                    <span className="font-medium text-white">7:00 - 15:00</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{isRTL ? 'الجمعة - السبت' : 'Friday - Saturday'}</span>
                    <span className="font-medium text-white/50">{isRTL ? 'مغلق' : 'Closed'}</span>
                  </li>
                </ul>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <h4 className="mb-2 text-sm font-semibold">{isRTL ? 'للحالات الطارئة' : 'Emergency'}</h4>
                  <a href="tel:+966120000000" className="text-lg font-bold text-accent">+966 12 000 0000</a>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.178!2d39.1884!3d21.5433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDMyJzM2LjAiTiAzOcKwMTEnMTguMCJF!5e0!3m2!1sen!2ssa!4v1600000000000"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Location"
                />
              </div>
            </motion.div>

            {/* Forms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              {/* Tab Toggle */}
              <div className="mb-8 flex gap-2 rounded-2xl bg-gray-50 p-1.5">
                <button
                  type="button"
                  onClick={() => { setActiveTab('contact'); setTicketNumber(''); }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition-all ${activeTab === 'contact' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <MessageSquare className="h-4 w-4" /> {t('generalInquiry')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('complaint')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition-all ${activeTab === 'complaint' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Shield className="h-4 w-4" /> {t('complaint')}
                </button>
              </div>

              {activeTab === 'contact' ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleContactSubmit}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">{tc('name')} *</label>
                      <input type="text" required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="input-field" placeholder={isRTL ? 'الاسم الكامل' : 'Full Name'} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">{tc('email')} *</label>
                      <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="input-field" dir="ltr" placeholder="email@example.com" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">{tc('phone')}</label>
                      <input type="tel" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="input-field" dir="ltr" placeholder="+966 5XX XXX XXXX" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">{tc('subject')}</label>
                      <input type="text" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} className="input-field" placeholder={isRTL ? 'موضوع الرسالة' : 'Message subject'} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">{tc('message')} *</label>
                    <textarea required rows={5} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="input-field" placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Write your message here...'} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary gap-2">
                    <Send className="h-4 w-4" />
                    {loading ? tc('loading') : tc('send')}
                  </button>
                </motion.form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Complaint Info Banner */}
                  <div className="mb-6 rounded-2xl border border-primary/10 bg-primary/5 p-5">
                    <div className="flex items-start gap-3">
                      <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{isRTL ? 'سياسة التعامل مع الشكاوى' : 'Complaint Handling Policy'}</h4>
                        <p className="mt-1 text-xs text-gray-500">
                          {isRTL
                            ? 'نلتزم بالرد على جميع الشكاوى خلال 48 ساعة عمل. ستحصل على رقم تذكرة لمتابعة حالة شكواك.'
                            : 'We are committed to responding to all complaints within 48 business hours. You will receive a ticket number to track your complaint status.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Number Success */}
                  {ticketNumber && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-6 rounded-2xl border border-success/20 bg-success/5 p-6 text-center"
                    >
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                        <FileText className="h-6 w-6 text-success" />
                      </div>
                      <p className="text-sm text-gray-600">{t('ticketGenerated')}</p>
                      <p className="mt-2 text-2xl font-bold text-success">{ticketNumber}</p>
                      <p className="mt-2 text-xs text-gray-400">{isRTL ? 'احتفظ بهذا الرقم لمتابعة حالة شكواك' : 'Keep this number to track your complaint status'}</p>
                    </motion.div>
                  )}

                  <form onSubmit={handleComplaintSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">{tc('name')} *</label>
                        <input type="text" required value={complaintForm.name} onChange={(e) => setComplaintForm({ ...complaintForm, name: e.target.value })} className="input-field" placeholder={isRTL ? 'الاسم الكامل' : 'Full Name'} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">{tc('email')} *</label>
                        <input type="email" required value={complaintForm.email} onChange={(e) => setComplaintForm({ ...complaintForm, email: e.target.value })} className="input-field" dir="ltr" placeholder="email@example.com" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">{tc('phone')}</label>
                        <input type="tel" value={complaintForm.phone} onChange={(e) => setComplaintForm({ ...complaintForm, phone: e.target.value })} className="input-field" dir="ltr" placeholder="+966 5XX XXX XXXX" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('complaintCategory')} *</label>
                        <div className="relative">
                          <select
                            required
                            value={complaintForm.category}
                            onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                            className="input-field appearance-none"
                            title={isRTL ? 'فئة الشكوى' : 'Complaint Category'}
                          >
                            <option value="">{isRTL ? 'اختر الفئة' : 'Select Category'}</option>
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Priority Selector */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">{isRTL ? 'مستوى الأولوية' : 'Priority Level'}</label>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(priorityConfig).map(([key, cfg]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setComplaintForm({ ...complaintForm, priority: key })}
                            className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                              complaintForm.priority === key
                                ? `${cfg.color} ring-2 ring-offset-1 ring-current`
                                : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                            }`}
                          >
                            {cfg.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('complaintDetails')} *</label>
                      <textarea required rows={5} value={complaintForm.details} onChange={(e) => setComplaintForm({ ...complaintForm, details: e.target.value })} className="input-field" placeholder={isRTL ? 'اشرح تفاصيل الشكوى بدقة...' : 'Describe your complaint in detail...'} />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        <FileText className="mr-1 inline h-3.5 w-3.5" />
                        {t('attachmentLink')}
                      </label>
                      <input type="url" value={complaintForm.attachmentLink} onChange={(e) => setComplaintForm({ ...complaintForm, attachmentLink: e.target.value })} className="input-field" dir="ltr" placeholder="https://drive.google.com/..." />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
                      <Send className="h-4 w-4" />
                      {loading ? tc('loading') : tc('submit')}
                    </button>
                  </form>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
