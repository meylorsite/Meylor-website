'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { adminApi } from '@/lib/api';
import { getLocalizedField } from '@/lib/utils';
import {
  Mail, AlertTriangle, Briefcase, Newspaper, Users, BarChart3,
  TrendingUp, Eye, ArrowRight, Clock, CheckCircle2,
  GraduationCap, MessageSquare, Building2, Image as ImageIcon,
  Route, DollarSign, HelpCircle, Star, UserCheck, UserPlus,
  Activity, Globe, Shield, FileText, CalendarDays
} from 'lucide-react';

export default function AdminDashboard() {
  const { locale } = useParams() as { locale: string };
  const { accessToken, user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const isAr = locale === 'ar';

  useEffect(() => {
    if (accessToken) {
      adminApi.getDashboard(accessToken).then((res) => setStats(res.data)).catch(() => {});
    }
  }, [accessToken]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return isAr ? 'صباح الخير' : 'Good Morning';
    if (h < 18) return isAr ? 'مساء الخير' : 'Good Afternoon';
    return isAr ? 'مساء الخير' : 'Good Evening';
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      open: { ar: 'مفتوحة', en: 'open' },
      pending: { ar: 'قيد المراجعة', en: 'pending' },
      in_progress: { ar: 'قيد التنفيذ', en: 'in progress' },
      reviewed: { ar: 'تمت المراجعة', en: 'reviewed' },
      resolved: { ar: 'تم الحل', en: 'resolved' },
      shortlisted: { ar: 'القائمة المختصرة', en: 'shortlisted' },
      closed: { ar: 'مغلقة', en: 'closed' },
      rejected: { ar: 'مرفوضة', en: 'rejected' },
      accepted: { ar: 'مقبولة', en: 'accepted' },
    };
    const entry = labels[status];
    if (!entry) return status;
    return isAr ? entry.ar : entry.en;
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'open': case 'pending': return 'bg-amber/10 text-amber';
      case 'in_progress': case 'reviewed': return 'bg-accent/10 text-accent';
      case 'resolved': case 'shortlisted': return 'bg-success/10 text-success';
      case 'closed': case 'rejected': return 'bg-danger/10 text-danger';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const formatDate = (d: string) => {
    if (!d) return '';
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return isAr ? 'الآن' : 'Just now';
    if (mins < 60) return isAr ? `منذ ${mins} د` : `${mins}m ago`;
    if (hrs < 24) return isAr ? `منذ ${hrs} س` : `${hrs}h ago`;
    if (days < 7) return isAr ? `منذ ${days} ي` : `${days}d ago`;
    return date.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' });
  };

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-28 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const mainStats = [
    { label: isAr ? 'الرسائل' : 'Messages', value: stats.totalContacts, sub: `${stats.unreadContacts} ${isAr ? 'غير مقروءة' : 'unread'}`, icon: Mail, color: 'bg-accent', href: '/contacts' },
    { label: isAr ? 'الشكاوى' : 'Complaints', value: stats.totalComplaints, sub: `${stats.openComplaints} ${isAr ? 'مفتوحة' : 'open'}`, icon: AlertTriangle, color: 'bg-amber', href: '/complaints' },
    { label: isAr ? 'طلبات التوظيف' : 'Applications', value: stats.totalApplications, sub: `${stats.pendingApplications || 0} ${isAr ? 'قيد المراجعة' : 'pending'}`, icon: Briefcase, color: 'bg-success', href: '/applications' },
    { label: isAr ? 'المشتركين' : 'Subscribers', value: stats.totalSubscribers, sub: isAr ? 'النشرة البريدية' : 'Newsletter', icon: Newspaper, color: 'bg-primary', href: '/newsletter' },
  ];

  const contentStats = [
    { label: isAr ? 'البرامج' : 'Programs', value: stats.totalPrograms, icon: GraduationCap, color: 'text-primary', bg: 'bg-primary/10', href: '/programs' },
    { label: isAr ? 'الأخبار' : 'News', value: stats.totalNews, icon: FileText, color: 'text-accent', bg: 'bg-accent/10', href: '/news' },
    { label: isAr ? 'المعرض' : 'Gallery', value: stats.totalGallery, icon: ImageIcon, color: 'text-success', bg: 'bg-success/10', href: '/gallery' },
    { label: isAr ? 'المرافق' : 'Facilities', value: stats.totalFacilities, icon: Building2, color: 'text-amber', bg: 'bg-amber/10', href: '/facilities' },
    { label: isAr ? 'الشهادات' : 'Testimonials', value: stats.totalTestimonials, icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/10', href: '/testimonials' },
    { label: isAr ? 'الفريق' : 'Team', value: stats.totalTeam, icon: Users, color: 'text-accent', bg: 'bg-accent/10', href: '/team' },
    { label: isAr ? 'الوظائف' : 'Open Jobs', value: stats.totalJobs, icon: Briefcase, color: 'text-success', bg: 'bg-success/10', href: '/jobs' },
    { label: isAr ? 'المستخدمين' : 'Users', value: stats.totalUsers, icon: Shield, color: 'text-amber', bg: 'bg-amber/10', href: '/users' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-dark to-primary p-6 text-white">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/5" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-white/60">{new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <h1 className="mt-1 text-xl font-bold">{greeting()}, {(isAr ? user?.nameAr : user?.nameEn)?.split(' ')[0] || (isAr ? 'المدير' : 'Admin')}</h1>
            <p className="mt-1 text-sm text-white/70">
              {isAr ? 'إليك نظرة عامة على ما يحدث في ميلور' : "Here's an overview of what's happening at MEYLOR"}
            </p>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold">{stats.totalStudents || 0}</div>
              <div className="text-[10px] text-white/60">{isAr ? 'طالب' : 'Students'}</div>
            </div>
            <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold">{stats.totalParents || 0}</div>
              <div className="text-[10px] text-white/60">{isAr ? 'ولي أمر' : 'Parents'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((card, i) => (
          <Link
            key={i}
            href={`/${locale}/admin${card.href}`}
            className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.color} text-white`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <div className="text-sm font-medium text-gray-600">{card.label}</div>
              <div className="text-xs text-gray-400">{card.sub}</div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        ))}
      </div>

      {/* Content Overview */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
          {isAr ? 'نظرة عامة على المحتوى' : 'Content Overview'}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {contentStats.map((item, i) => (
            <Link
              key={i}
              href={`/${locale}/admin${item.href}`}
              className="group flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bg} transition-transform group-hover:scale-110`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <span className="text-xl font-bold text-gray-900">{item.value}</span>
              <span className="text-[10px] font-medium text-gray-500">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity - 3 columns */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Messages */}
        <div className="rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Mail className="h-4 w-4 text-accent" />
              {isAr ? 'آخر الرسائل' : 'Recent Messages'}
            </h3>
            <Link href={`/${locale}/admin/contacts`} className="text-xs font-medium text-accent hover:underline">
              {isAr ? 'الكل' : 'All'} →
            </Link>
          </div>
          <div className="p-3">
            {(stats.recentContacts || []).length === 0 ? (
              <p className="py-6 text-center text-xs text-gray-400">{isAr ? 'لا توجد رسائل بعد' : 'No messages yet'}</p>
            ) : (
              <div className="space-y-1">
                {(stats.recentContacts || []).map((c: any, i: number) => (
                  <div key={c._id || i} className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-gray-50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                      {c.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-gray-900">{c.name}</p>
                        <span className="shrink-0 text-[10px] text-gray-400">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="truncate text-xs text-gray-400">{c.subject || c.message?.slice(0, 60)}</p>
                    </div>
                    {!c.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <AlertTriangle className="h-4 w-4 text-amber" />
              {isAr ? 'آخر الشكاوى' : 'Recent Complaints'}
            </h3>
            <Link href={`/${locale}/admin/complaints`} className="text-xs font-medium text-accent hover:underline">
              {isAr ? 'الكل' : 'All'} →
            </Link>
          </div>
          <div className="p-3">
            {(stats.recentComplaints || []).length === 0 ? (
              <p className="py-6 text-center text-xs text-gray-400">{isAr ? 'لا توجد شكاوى' : 'No complaints yet'}</p>
            ) : (
              <div className="space-y-1">
                {(stats.recentComplaints || []).map((c: any, i: number) => (
                  <div key={c._id || i} className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-gray-50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber/10 text-[10px] font-bold text-amber">
                      #{c.ticketNumber?.slice(-3) || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-gray-900">{c.name}</p>
                        <span className="shrink-0 text-[10px] text-gray-400">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="truncate text-xs text-gray-400">{c.category} · {c.priority}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColor(c.status)}`}>
                      {statusLabel(c.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Briefcase className="h-4 w-4 text-success" />
              {isAr ? 'آخر طلبات التوظيف' : 'Recent Applications'}
            </h3>
            <Link href={`/${locale}/admin/applications`} className="text-xs font-medium text-accent hover:underline">
              {isAr ? 'الكل' : 'All'} →
            </Link>
          </div>
          <div className="p-3">
            {(stats.recentApplications || []).length === 0 ? (
              <p className="py-6 text-center text-xs text-gray-400">{isAr ? 'لا توجد طلبات' : 'No applications yet'}</p>
            ) : (
              <div className="space-y-1">
                {(stats.recentApplications || []).map((a: any, i: number) => (
                  <div key={a._id || i} className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-gray-50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/10 text-xs font-bold text-success">
                      {a.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-gray-900">{a.name}</p>
                        <span className="shrink-0 text-[10px] text-gray-400">{formatDate(a.createdAt)}</span>
                      </div>
                      <p className="truncate text-xs text-gray-400">
                        {a.jobPost ? getLocalizedField(a.jobPost, 'title', locale) : a.email}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColor(a.status)}`}>
                      {statusLabel(a.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent News */}
      {(stats.recentNews || []).length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              {isAr ? 'آخر الأخبار المنشورة' : 'Latest Published News'}
            </h2>
            <Link href={`/${locale}/admin/news`} className="text-xs font-medium text-accent hover:underline">
              {isAr ? 'إدارة الأخبار' : 'Manage News'} →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(stats.recentNews || []).map((news: any, i: number) => (
              <div key={news._id || i} className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
                {news.imageUrl && (
                  <div className="h-28 overflow-hidden bg-gray-100">
                    <img src={news.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-3">
                  <p className="line-clamp-2 text-xs font-semibold text-gray-900">
                    {getLocalizedField(news, 'title', locale)}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(news.publishedAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-5">
        <h2 className="mb-4 text-sm font-semibold text-gray-600">
          {isAr ? 'إجراءات سريعة' : 'Quick Actions'}
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: isAr ? 'إضافة خبر' : 'Add News', href: '/news', icon: FileText },
            { label: isAr ? 'إضافة برنامج' : 'Add Program', href: '/programs', icon: GraduationCap },
            { label: isAr ? 'إضافة نشاط' : 'Add Gallery', href: '/gallery', icon: ImageIcon },
            { label: isAr ? 'إضافة عضو فريق' : 'Add Team Member', href: '/team', icon: Users },
            { label: isAr ? 'إضافة وظيفة' : 'Add Job', href: '/jobs', icon: Briefcase },
            { label: isAr ? 'إضافة شهادة' : 'Add Testimonial', href: '/testimonials', icon: Star },
            { label: isAr ? 'إعدادات الموقع' : 'Site Settings', href: '/settings', icon: Globe },
          ].map((action, i) => (
            <Link
              key={i}
              href={`/${locale}/admin${action.href}`}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-all hover:border-primary/30 hover:text-primary hover:shadow-sm"
            >
              <action.icon className="h-3.5 w-3.5" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <div>
            <p className="text-xs font-medium text-gray-900">{isAr ? 'حالة الموقع' : 'Site Status'}</p>
            <p className="text-[10px] text-success">{isAr ? 'يعمل بنجاح' : 'Running'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
          <Activity className="h-5 w-5 text-accent" />
          <div>
            <p className="text-xs font-medium text-gray-900">{isAr ? 'الدور' : 'Your Role'}</p>
            <p className="text-[10px] text-accent">{user?.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs font-medium text-gray-900">{isAr ? 'إجمالي المستخدمين' : 'Total Users'}</p>
            <p className="text-[10px] text-primary">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
          <Clock className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-xs font-medium text-gray-900">{isAr ? 'آخر دخول' : 'Last Login'}</p>
            <p className="text-[10px] text-gray-400">{isAr ? 'الآن' : 'Now'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
