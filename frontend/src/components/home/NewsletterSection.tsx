'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { publicApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

interface NewsletterSectionProps {
  locale: string;
}

export default function NewsletterSection({ locale }: NewsletterSectionProps) {
  const t = useTranslations('home');
  const tc = useTranslations('common');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await publicApi.subscribeNewsletter(email);
      toast.success(tc('subscribed'));
      setEmail('');
    } catch (err: any) {
      toast.error(err.message || tc('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary py-16">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <motion.div
        className="absolute -left-32 top-1/3 h-[350px] w-[350px] rounded-full bg-accent/10 blur-3xl"
        animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">{t('newsletterTitle')}</h2>
          <p className="mt-3 text-base text-white/60">{t('newsletterSubtitle')}</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletterPlaceholder')}
              required
              className="flex-1 rounded-xl border-0 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent"
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/20 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">{tc('subscribe')}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
