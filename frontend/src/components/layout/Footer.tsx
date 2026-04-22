'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin } from 'lucide-react';

const quickLinks = [
  { key: 'about', href: '/about' },
  { key: 'programs', href: '/programs' },
  { key: 'admissions', href: '/admissions' },
  { key: 'gallery', href: '/gallery' },
  { key: 'careers', href: '/careers' },
  { key: 'contact', href: '/contact' },
  { key: 'faq', href: '/faq' },
];

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      {/* Wave separator */}
      <div className="relative -mt-1">
        <svg viewBox="0 0 1440 80" className="w-full text-white" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,40 1440,40 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="container-custom py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo.png"
                alt="MEYLOR International School"
                width={160}
                height={45}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              {locale === 'ar'
                ? 'مدرسة ميلور العالمية - التميّز في التعليم من الروضة حتى الصف الثاني عشر في جدة.'
                : 'MEYLOR International School - Excellence in education from KG to Grade 12 in Jeddah.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">
              {t('footer.contactInfo')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {locale === 'ar'
                  ? 'حي النعيم، جدة، المملكة العربية السعودية'
                  : 'Al-Naeem District, Jeddah, Saudi Arabia'}
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="h-4 w-4 shrink-0" />
                +966 12 000 0000
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="h-4 w-4 shrink-0" />
                info@meylor.sa
              </li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">
              {t('footer.address')}
            </h3>
            <div className="overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.178!2d39.1884!3d21.5433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDMyJzM2LjAiTiAzOcKwMTEnMTguMCJF!5e0!3m2!1sen!2ssa!4v1600000000000"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MEYLOR School Location"
              />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-5 text-sm text-white/50">
          <span>&copy; {year} MEYLOR International School. {t('common.allRightsReserved')}</span>
          <Link
            href={`/${locale}/admin`}
            className="text-xs text-white/30 transition-colors hover:text-white/60"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
