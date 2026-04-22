'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Globe, LogIn, LayoutDashboard, LogOut, ChevronDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth-store';

const navLinks = [
  { key: 'home', href: '' },
  { key: 'about', href: '/about' },
  { key: 'programs', href: '/programs' },
  { key: 'admissions', href: '/admissions' },
  { key: 'gallery', href: '/gallery' },
  { key: 'journey', href: '/journey' },
  { key: 'careers', href: '/careers' },
  { key: 'contact', href: '/contact' },
  { key: 'faq', href: '/faq' },
];

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, initAuth, logout } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push(`/${locale}`);
  };

  const switchLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const isActive = (href: string) => {
    const fullHref = `/${locale}${href}`;
    if (href === '') return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(fullHref);
  };

  const displayName = user
    ? locale === 'ar'
      ? user.nameAr?.split(' ')[0]
      : user.nameEn?.split(' ')[0]
    : '';

  return (
    <header className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="container-custom">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="MEYLOR"
              width={160}
              height={44}
              className="h-9 w-auto md:h-11"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                className={cn(
                  'relative px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors',
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                {t(link.key)}
                {isActive(link.href) && (
                  <span className="absolute inset-x-4 -bottom-[25px] h-[2px] rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Locale */}
            <button
              type="button"
              onClick={switchLocale}
              className="inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              title={locale === 'ar' ? 'English' : 'العربية'}
            >
              {locale === 'ar' ? 'English' : 'العربية'}
            </button>

            {/* Divider */}
            <div className="hidden h-5 w-px bg-gray-200 sm:block" />

            {/* Auth */}
            {!isLoading && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full bg-primary/5 py-1.5 pe-3 ps-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[100px] truncate sm:inline">{displayName}</span>
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', userMenuOpen && 'rotate-180')} />
                </button>
                {userMenuOpen && (
                  <div className="absolute end-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {locale === 'ar' ? user.nameAr : user.nameEn}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">{user.email}</p>
                    </div>
                    <Link
                      href={`/${locale}/admin/profile`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                    >
                      <User className="h-4 w-4" />
                      {locale === 'ar' ? 'الملف الشخصي' : 'Profile'}
                    </Link>
                    <Link
                      href={`/${locale}/admin${user.role === 'PARENT' || user.role === 'STUDENT' ? '/portal' : ''}`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {user.role === 'PARENT' || user.role === 'STUDENT'
                        ? (locale === 'ar' ? 'البوابة' : 'My Portal')
                        : (locale === 'ar' ? 'لوحة التحكم' : 'Dashboard')}
                    </Link>
                    <div className="border-t border-gray-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        {locale === 'ar' ? 'خروج' : 'Logout'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={`/${locale}/admin/login`}
                className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">{locale === 'ar' ? 'دخول' : 'Login'}</span>
              </Link>
            )}

            {/* CTA */}
            <Link
              href={`/${locale}/admissions`}
              className="btn-primary hidden whitespace-nowrap text-sm md:inline-flex"
            >
              {locale === 'ar' ? 'سجّل' : 'Apply'}
            </Link>

            {/* Mobile Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <nav className="container-custom py-3">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors',
                  isActive(link.href)
                    ? 'bg-primary/5 text-primary'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {t(link.key)}
              </Link>
            ))}

            <div className="mx-4 my-2 border-t border-gray-100" />

            {!isLoading && user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {locale === 'ar' ? user.nameAr : user.nameEn}
                    </p>
                    <p className="text-xs text-gray-400">{user.role}</p>
                  </div>
                </div>
                <Link
                  href={`/${locale}/admin/profile`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <User className="h-4 w-4" />
                  {locale === 'ar' ? 'الملف الشخصي' : 'Profile'}
                </Link>
                <Link
                  href={`/${locale}/admin${user.role === 'PARENT' || user.role === 'STUDENT' ? '/portal' : ''}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {user.role === 'PARENT' || user.role === 'STUDENT'
                    ? (locale === 'ar' ? 'البوابة' : 'My Portal')
                    : (locale === 'ar' ? 'لوحة التحكم' : 'Dashboard')}
                </Link>
                <button
                  type="button"
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  {locale === 'ar' ? 'خروج' : 'Logout'}
                </button>
              </>
            ) : (
              <Link
                href={`/${locale}/admin/login`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <LogIn className="h-4 w-4" />
                {locale === 'ar' ? 'دخول' : 'Login'}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
