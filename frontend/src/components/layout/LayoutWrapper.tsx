'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function LayoutWrapper({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith(`/${locale}/admin`);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="overflow-x-hidden">
      <Header locale={locale} />
      <main className="min-h-screen">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
