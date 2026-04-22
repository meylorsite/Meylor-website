'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { publicApi } from '@/lib/api';
import { getLocalizedField } from '@/lib/utils';
import {
  User, ClipboardList, BookOpen, GraduationCap, CalendarDays,
  Phone, Mail, MapPin, ArrowRight, ArrowLeft, Bell, FileText,
  Users, Heart, Star, CheckCircle2
} from 'lucide-react';

export default function PortalPage() {
  const { locale } = useParams() as { locale: string };
  const { user } = useAuthStore();
  const [programs, setPrograms] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const isAr = locale === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  useEffect(() => {
    publicApi.getPrograms().then((res) => setPrograms(res.data || [])).catch(() => {});
    publicApi.getNews(1, 4).then((res) => setNews(res.data?.posts || res.data || [])).catch(() => {});
  }, []);

  const isParent = user?.role === 'PARENT';
  const children = (user as any)?.children || [];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent to-accent-dark p-6 text-white">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -right-2 bottom-0 h-20 w-20 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-sm text-white/70">
            {isAr ? (isParent ? 'بوابة ولي الأمر' : 'بوابة الطالب') : (isParent ? 'Parent Portal' : 'Student Portal')}
          </p>
          <h1 className="mt-1 text-xl font-bold">
            {isAr ? `مرحباً، ${user?.nameAr?.split(' ')[0]}` : `Welcome, ${user?.nameEn?.split(' ')[0]}`}
          </h1>
          <p className="mt-1 text-sm text-white/70">
            {isAr ? 'إليك آخر المستجدات في مدرسة ميلور' : "Here's what's new at MEYLOR School"}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link
          href={`/${locale}/admin/profile`}
          className="group flex flex-col items-center gap-2 rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
            <User className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xs font-medium text-gray-600">{isAr ? 'الملف الشخصي' : 'My Profile'}</span>
        </Link>
        {isParent && (
          <Link
            href={`/${locale}/admissions`}
            className="group flex flex-col items-center gap-2 rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 transition-transform group-hover:scale-110">
              <ClipboardList className="h-5 w-5 text-accent" />
            </div>
            <span className="text-xs font-medium text-gray-600">{isAr ? 'تقديم طلب' : 'Apply Now'}</span>
          </Link>
        )}
        <Link
          href={`/${locale}/programs`}
          className="group flex flex-col items-center gap-2 rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 transition-transform group-hover:scale-110">
            <BookOpen className="h-5 w-5 text-success" />
          </div>
          <span className="text-xs font-medium text-gray-600">{isAr ? 'البرامج' : 'Programs'}</span>
        </Link>
        <Link
          href={`/${locale}/contact`}
          className="group flex flex-col items-center gap-2 rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/10 transition-transform group-hover:scale-110">
            <Phone className="h-5 w-5 text-amber" />
          </div>
          <span className="text-xs font-medium text-gray-600">{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
        </Link>
      </div>

      {/* Children (Parent only) */}
      {isParent && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Users className="h-4 w-4 text-primary" />
              {isAr ? 'أبنائي' : 'My Children'}
            </h2>
            <Link href={`/${locale}/admin/profile`} className="text-xs font-medium text-accent hover:underline">
              {isAr ? 'تعديل' : 'Edit'} →
            </Link>
          </div>
          {children.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
              <Users className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-400">
                {isAr ? 'لم تقم بإضافة أبنائك بعد' : "You haven't added your children yet"}
              </p>
              <Link href={`/${locale}/admin/profile`} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
                {isAr ? 'أضف الآن' : 'Add Now'} →
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {children.map((child: any, i: number) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                    {(child.nameEn || child.nameAr || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{isAr ? child.nameAr : child.nameEn}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {child.grade && <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{child.grade}</span>}
                      {child.gender && <span>{isAr ? (child.gender === 'male' ? 'ذكر' : 'أنثى') : child.gender}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Available Programs */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            {isAr ? 'البرامج المتاحة' : 'Available Programs'}
          </h2>
          <Link href={`/${locale}/programs`} className="text-xs font-medium text-accent hover:underline">
            {isAr ? 'عرض الكل' : 'View All'} →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {programs.slice(0, 4).map((program: any) => (
            <Link
              key={program._id}
              href={`/${locale}/programs#${program.slug}`}
              className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
            >
              {program.imageUrl && (
                <div className="h-28 overflow-hidden">
                  <img src={program.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
              )}
              <div className="p-3">
                <h3 className="text-sm font-bold text-gray-900">{getLocalizedField(program, 'title', locale)}</h3>
                <p className="mt-1 text-xs text-gray-400">{program.gradeRange}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest News */}
      {news.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              {isAr ? 'آخر الأخبار' : 'Latest News'}
            </h2>
            <Link href={`/${locale}/news`} className="text-xs font-medium text-accent hover:underline">
              {isAr ? 'الكل' : 'All'} →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {news.map((post: any) => (
              <Link
                key={post._id}
                href={`/${locale}/news/${post.slug}`}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
              >
                {post.imageUrl && (
                  <div className="h-24 overflow-hidden">
                    <img src={post.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-3">
                  <p className="line-clamp-2 text-xs font-semibold text-gray-900">{getLocalizedField(post, 'title', locale)}</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(post.publishedAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* School Contact */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <h3 className="mb-3 text-sm font-bold text-gray-900">{isAr ? 'تواصل مع المدرسة' : 'Contact School'}</h3>
        <div className="grid gap-3 text-xs text-gray-500 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            +966 12 000 0000
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-accent" />
            info@meylor.sa
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-success" />
            {isAr ? 'حي النعيم، جدة' : 'Al-Naeem, Jeddah'}
          </div>
        </div>
      </div>
    </div>
  );
}
