import { NextIntlClientProvider, useMessages } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Alexandria } from 'next/font/google';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { Toaster } from 'react-hot-toast';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  variable: '--font-alexandria',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) notFound();
  unstable_setRequestLocale(locale);

  const messages = useMessages();
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className={alexandria.variable}>
      <body className="min-h-screen bg-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LayoutWrapper locale={locale}>
            {children}
          </LayoutWrapper>
          <Toaster
            position={isRTL ? 'top-left' : 'top-right'}
            toastOptions={{
              duration: 4000,
              style: { borderRadius: '12px', padding: '16px', fontSize: '14px' },
              success: { style: { background: '#007F44', color: '#fff' } },
              error: { style: { background: '#FF2B01', color: '#fff' } },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
