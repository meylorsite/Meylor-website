'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/auth-store';
import {
  LayoutDashboard, Settings, FileText, GraduationCap, Building2,
  MessageSquare, Image as ImageIcon, Route, DollarSign, Briefcase, Mail,
  AlertTriangle, Users, Newspaper, BarChart3, LogOut, Menu, X, ChevronDown, User,
  ClipboardList, BookOpen, Home, HelpCircle
} from 'lucide-react';

const adminLinks = [
  { key: 'Dashboard', icon: LayoutDashboard, href: '' },
  { key: 'Profile', icon: User, href: '/profile' },
  { key: 'Settings', icon: Settings, href: '/settings' },
  { key: 'Sections', icon: FileText, href: '/sections' },
  { key: 'Programs', icon: GraduationCap, href: '/programs' },
  { key: 'Facilities', icon: Building2, href: '/facilities' },
  { key: 'Testimonials', icon: MessageSquare, href: '/testimonials' },
  { key: 'News', icon: Newspaper, href: '/news' },
  { key: 'Gallery', icon: ImageIcon, href: '/gallery' },
  { key: 'Journey', icon: Route, href: '/journey' },
  { key: 'Pricing', icon: DollarSign, href: '/pricing' },
  { key: 'Team', icon: Users, href: '/team' },
  { key: 'Stats', icon: BarChart3, href: '/stats' },
  { key: 'Jobs', icon: Briefcase, href: '/jobs' },
  { key: 'Applications', icon: Briefcase, href: '/applications' },
  { key: 'Admissions', icon: ClipboardList, href: '/admissions' },
  { key: 'Contacts', icon: Mail, href: '/contacts' },
  { key: 'Complaints', icon: AlertTriangle, href: '/complaints' },
  { key: 'Newsletter', icon: Newspaper, href: '/newsletter' },
  { key: 'FAQs', icon: HelpCircle, href: '/faqs' },
  { key: 'Users', icon: Users, href: '/users' },
];

const parentLinks = [
  { key: 'My Portal', icon: Home, href: '/portal' },
  { key: 'Profile', icon: User, href: '/profile' },
  { key: 'My Applications', icon: ClipboardList, href: '/my-applications' },
  { key: 'Programs', icon: BookOpen, href: '/portal/programs' },
];

const studentLinks = [
  { key: 'My Portal', icon: Home, href: '/portal' },
  { key: 'Profile', icon: User, href: '/profile' },
  { key: 'My Grades', icon: BookOpen, href: '/portal/grades' },
];

const NAV_LABELS_AR: Record<string, string> = {
  'Dashboard': 'لوحة التحكم',
  'Profile': 'الملف الشخصي',
  'Settings': 'الإعدادات',
  'Sections': 'الأقسام',
  'Programs': 'البرامج',
  'Facilities': 'المرافق',
  'Testimonials': 'المراجعات',
  'News': 'الأخبار',
  'Gallery': 'المعرض',
  'Journey': 'رحلتنا',
  'Pricing': 'الأسعار',
  'Team': 'الفريق',
  'Stats': 'الإحصائيات',
  'Jobs': 'الوظائف',
  'Applications': 'طلبات التوظيف',
  'Admissions': 'طلبات القبول',
  'Contacts': 'الرسائل',
  'Complaints': 'الشكاوى',
  'Newsletter': 'النشرة البريدية',
  'FAQs': 'الأسئلة الشائعة',
  'Users': 'المستخدمون',
  'My Portal': 'بوابتي',
  'My Applications': 'طلباتي',
  'My Grades': 'درجاتي',
};

export default function AdminLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
  const { user, isLoading, initAuth, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname.includes('/login');
  const isAr = locale === 'ar';

  useEffect(() => {
    if (!isLoginPage) {
      initAuth();
    } else {
      useAuthStore.setState({ isLoading: false });
    }
  }, [initAuth, isLoginPage]);

  useEffect(() => {
    if (!isLoading && !user && !isLoginPage) {
      router.push(`/${locale}/admin/login`);
    }
  }, [isLoading, user, router, locale, isLoginPage]);

  // Redirect parent/student away from admin-only pages to portal
  useEffect(() => {
    if (!isLoading && user && (user.role === 'PARENT' || user.role === 'STUDENT')) {
      const adminRoot = `/${locale}/admin`;
      const allowedPaths = ['/portal', '/profile', '/my-applications'];
      const relative = pathname.replace(adminRoot, '') || '/';
      const isAllowed = relative === '/' || relative === '' ||
        allowedPaths.some((p) => relative === p || relative.startsWith(`${p}/`));
      if (!isAllowed) {
        router.replace(`${adminRoot}/portal`);
      } else if (relative === '/' || relative === '') {
        router.replace(`${adminRoot}/portal`);
      }
    }
  }, [isLoading, user, pathname, router, locale]);

  if (isLoginPage) return <>{children}</>;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const isParentOrStudent = user.role === 'PARENT' || user.role === 'STUDENT';
  const sidebarLinks = isParentOrStudent
    ? (user.role === 'PARENT' ? parentLinks : studentLinks)
    : adminLinks;

  const handleLogout = async () => {
    await logout();
    router.push(`/${locale}/admin/login`);
  };

  const isActive = (href: string) => {
    const full = `/${locale}/admin${href}`;
    if (href === '' || href === '/portal') {
      return pathname === `/${locale}/admin` || pathname === `/${locale}/admin/` || pathname === `/${locale}/admin/portal`;
    }
    return pathname.startsWith(full);
  };

  const navLabel = (key: string) => (isAr ? NAV_LABELS_AR[key] || key : key);

  const roleLabel = (role: string) => {
    const labels: Record<string, string> = {
      SUPER_ADMIN: isAr ? 'مدير عام' : 'Super Admin',
      ADMIN: isAr ? 'مدير' : 'Admin',
      EDITOR: isAr ? 'محرر' : 'Editor',
      PARENT: isAr ? 'ولي أمر' : 'Parent',
      STUDENT: isAr ? 'طالب' : 'Student',
    };
    return labels[role] || role;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-primary text-white transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href={`/${locale}${isParentOrStudent ? '/admin/portal' : '/admin'}`} className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="MEYLOR" width={120} height={34} className="h-8 w-auto brightness-0 invert" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info in sidebar */}
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              {(user.nameEn || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{isAr ? user.nameAr : user.nameEn}</p>
              <p className="text-xs text-white/50">{roleLabel(user.role)}</p>
            </div>
          </div>
        </div>

        <nav className="h-[calc(100vh-12rem)] overflow-y-auto p-3">
          {sidebarLinks.map((link) => (
            <Link
              key={link.key}
              href={`/${locale}/admin${link.href}`}
              onClick={() => setSidebarOpen(false)}
              className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive(link.href) ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {navLabel(link.key)}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" /> {isAr ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{isAr ? user.nameAr : user.nameEn}</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{roleLabel(user.role)}</span>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
